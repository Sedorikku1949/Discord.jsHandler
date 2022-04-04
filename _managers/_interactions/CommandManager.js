const { Message, CommandInteraction, Guild } = require('discord.js');
const Command = require("../structures/Command");
const { readFileSync } = require("fs");
const BaseManager = require("./BaseManager");

class CommandManager extends BaseManager {
	constructor(client, database) {
		super(client, database);
		this.client = client;
		this.database = database;
		this.commands = this.database.interactions.cmd;

		this.database.intervals.add(() => {
			[...database.cooldowns.commands].forEach(([id, timestamp]) => {
				if (timestamp - Date.now() < 0) database.cooldowns.commands.delete(id);
			})
		}, 60000)
	}

	cooldown(interaction, authorId, timeout, deffered){
		if (interaction instanceof Message) interaction.reply({ content: `> ⌚ **Vous devez encore attendre** \`${(Math.abs(timeout)/1000).toFixed(2)}\` **secondes.**` }).catch(() => false);
		else if (deffered) interaction.editReply({ ephemeral: true, content: `> ⌚ **Vous devez encore attendre** \`${(Math.abs(timeout)/1000).toFixed(2)}\` **secondes.**` }).catch(() => false);
		else interaction.reply({ ephemeral: true, content: `> ⌚ **Vous devez encore attendre** \`${(Math.abs(timeout)/1000).toFixed(2)}\` **secondes.**` }).catch(() => false);
	}

	async execute(interaction, details){
		if (![Message, CommandInteraction].some((e) => interaction instanceof  e)) return void 1;
		const { name, authorId } = details;

		// find command
		let cmd = this.commands.get(name);
		if (!cmd) cmd = [...this.commands].find(([_, c]) => c.config["name"] === name || (c.config["aliases"] && c.config["aliases"].includes(name)));
		if (cmd?.constructor?.name === "Array") cmd = cmd[1];

		if (!cmd || !cmd.path) {
			if (interaction instanceof Message) return void 0;
			else if (typeof interaction.reply == "function") return interaction.reply("> **Désolé mais cette commande est introuvable.**")
		} else {
			if (!this.checkSystemVar(cmd.config, interaction)) return;
			if (!(await this.checkPermission(cmd.config.system.permissions, interaction.member))) return interaction.reply({ ephemeral: true, content: "> ❌ **Vous n'avez pas le droit d'accéder à cette commande.**" }).catch(() => false);
			if (cmd.config.system.defer) {
				if (interaction instanceof Message) await interaction.channel.sendTyping();
				else await interaction.deferReply({ ephemeral: (cmd.config.system.ephemeral > 0) });
			}
			// command found
			let cmdExecutable = require(`../../${cmd.path}`);
			delete require.cache[require.resolve(`../../${cmd.path}`)]
			if (!cmdExecutable) return interaction.reply({ content: "> **Désolé mais cette commande est introuvable.**", ephemeral: true });

			// cooldown check
			if (database.cooldowns.commands.get(authorId) && (database.cooldowns.commands.get(authorId) - Date.now() > 0)) return this.cooldown(interaction, authorId, database.cooldowns.commands.get(authorId) - Date.now(), cmd.config.system.defer);
			database.cooldowns.commands.set(authorId, Date.now() + (cmd.config.system.cooldown || 500));

			// try catch
			try {
				cmdExecutable = new Command(cmdExecutable);
				database.interactions.cmd.set(cmd.config.name, { ...cmdExecutable, path: cmd.path });
				const res = await cmdExecutable.exec(this.parseArguments(interaction, cmd));
				if (!res || !["Object", "String"].some((t) => res.constructor.name === t)) return void 0;
				if (interaction instanceof Message) interaction.reply(res).catch((err) => this.commandError(interaction, err, cmd));
				else {
					if (cmd.config.system.defer) return interaction.editReply(res).catch((err) => this.commandError(interaction, err, cmd));
					else return interaction.reply(res).catch((err) => this.commandError(interaction, err, cmd));
				}
			} catch(err) {
				this.commandError(interaction, err, cmd);
			}
		}
	}

	commandError(interaction, err, cmd){
		console.error(err);
		if (interaction instanceof Message) interaction.reply({ content: `> :x: **Une erreur est survenue.**\n\`\`\`js\n${(String(err).split("\n")[0] ?? "\u200b") || "Error"}\`\`\``, ephemeral: true }).catch(() => false);
		else {
			if (cmd.config.system.defer) interaction.deferReply({ content: `> :x: **Une erreur est survenue.**\n\`\`\`js\n${(String(err).split("\n")[0] ?? "\u200b") || "Error"}\`\`\``, ephemeral: true }).catch(() => false);
			else interaction.reply({ content: `> :x: **Une erreur est survenue.**\n\`\`\`js\n${(String(err).split("\n")[0] ?? "\u200b") || "Error"}\`\`\``, ephemeral: true }).catch(() => false);
		}
	}

	parseArguments(interaction, cmd){
		const args = this.parseArgs(interaction, interaction.guild.getPrefix())
		return {
			author: (interaction instanceof Message) ? interaction.author : interaction.user,
			member: ((interaction.guild instanceof Guild) ? interaction.member : null),
			guild: interaction.guild,
			permissions: (interaction instanceof Message) ? interaction.member.permissions : interaction.memberPermissions,
			args: args,
			options: this.parseOptions(args, cmd.config.options),
			channel: interaction.channel,
			interaction
		};
	}

	checkSystemVar(config, interaction){
		const { classic, slash, user } = config.system
		if (classic && !slash && !user) return (interaction instanceof Message)
		else if (classic && slash && !user) return (interaction instanceof Message) || (interaction instanceof CommandInteraction)
		else return false;
	}

	parseOptions(args, cmdOptions){
		let res = {};
		args.toSource().forEach((e, index) => {
			if ((e.name && cmdOptions[index].name === e.name) || cmdOptions[index]) res[cmdOptions[index].name] = { ...e, name: cmdOptions[index].name };
			else if (e.name && !res[e.name]) res[e.name] = { ...e, name: e.name };
			else res[index] = e;
		});
		return res;
	}

	parseArgs(object, prefix){
		const type = { SUB_COMMAND: 1, SUB_COMMAND_GROUP: 2, STRING: 3, INTEGER: 4, BOOLEAN: 5, USER: 6, CHANNEL: 7, ROLE: 8, MENTIONNABLE: 9, NUMBER: 10 };
		const methods = {
			join: function(j){ return this.map(t=>t.value).join(j[0]) },
			getName: function(n, all = false){ return all ? this.filter(t => t.name ===n ) : this.find( t=> t.name === n ) },
			getType: function(n, all = false){ return all ? this.filter(t => t.type ===n ) : this.find( t=> t.type === n ) },
			toSource: function(){ return this },
			slice: function(nb){ return this.slice(nb) }
		}
		const handler = {
			get: function(target, name){
				if (Object.keys(methods).includes(name)) return (...args)=> { return methods[name].bind(target,args)() };
				if (!isNaN(name)) return target[name]?.value;
				if (name === "length") return target.length;
				if (name === "cmd") return object?.content?.slice(prefix)?.trim()?.split(/\s+/g)?.shift();
			}
		}
		let data
		if(object?.options?.data?.find(t=>t?.type==="SUB_COMMAND")){
			const sub = object.options.data.find((t) => t.type === "SUB_COMMAND")
			data = sub.options ?? []
		} else data = object?.options?.data
		const args = object instanceof Message ? (object.content.slice(prefix).trim().split(/\s+/g).slice(1).map((t) => ({ value:t, name:undefined, type:undefined }) )) : object instanceof CommandInteraction? (data.map(t=>{ t.type = type[t.type] ?? t.type; return t })):undefined

		return args === undefined ? [] : new Proxy(args, handler)
	}
}

module.exports = CommandManager;