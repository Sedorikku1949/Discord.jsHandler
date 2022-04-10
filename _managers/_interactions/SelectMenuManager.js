const BaseManager = require("./BaseManager");
const { SelectMenuInteraction, Guild} = require("discord.js");
const { parse } = require("querystring");
const SelectMenu = require("../structures/SelectMenuInteraction");

class SelectMenuManager extends BaseManager {
	constructor(client, database) {
		super(client, database);
		this.select_menu = [...database.interactions.select_menu].map(([_,v]) => v);
		this.database = database;
		this.client = client;
		this.regex = /^(\w+)(?:&\w+=([^&\s]*))*$/;
	}
	
	async execute(interaction){
		if (!(interaction instanceof SelectMenuInteraction)) return void 1;
		
		if (!interaction.customId.match(this.regex)) return void 1;
		const name = interaction.customId.replace(this.regex, "$1");
		
		const itv = this.select_menu.find((e) => e.config.id.replace(this.regex, "$1") === name);
		if (!itv) return interaction.reply({ content: "> ❌ **Je n'ai pas trouvé d'interactions associée à ce select menu, il semblerait que le select menu ne soit plus valide.**", ephemeral: true });
		
		try {
			let executable = require(`../../${itv.path}`);
			executable = new SelectMenu({...executable, path: itv.path, __resolvedPath: itv.__resolvedPath });
			delete require.cache[itv.__resolvedPath];
			database.interactions.select_menu.set(executable.config.id, executable);
			if (JSON.stringify(itv) !== JSON.stringify(executable)) this.select_menu = [...database.interactions.select_menu].map(([_,v]) => v);
			if (executable.config.defer) await interaction.deferReply();
			const res = await executable.exec(await this.parseOptions(interaction, name));
			if (!["String", "Object"].some((t) => res?.constructor?.name === t)) return void 0;
			else {
				if (executable.config.defer) await interaction.editReply(res);
				else interaction.reply(res);
			}
		}
		catch(err) {
			this.error(interaction, err)
		}
	}
	
	error(interaction, err){
		console.log(err);
		interaction.reply({ content: `> :x: **Une erreur est survenue.**\n\`\`\`js\n${(String(err).split("\n")[0] ?? "\u200b") || "Error"}\`\`\``, ephemeral: true }).catch(() => false);
	}
	
	async parseOptions(interaction, name){
		return new Promise(async(resolve, _) => {
			resolve({
				args: this.parseArgs(interaction.customId, name),
				author: interaction.user,
				guild: interaction.guild,
				member: (interaction.guild ? await interaction.guild.members.fetch(interaction.user.id) : null),
				permissions: interaction.memberPermissions || null,
				message: interaction.message,
				options: interaction.values,
				interaction, name
			})
		})
	}
	
	parseArgs(customId, name){
		const str = customId.replace(new RegExp(name, "g"), "");
		const obj = (str && str.length > 0) ? parse(str.replace(/^&(.+)/, "$1")) : {};
		return Object.entries(obj).reduce((a, [k, v]) => {
			if (v === "") return a;
			a[k] = v;
			return a;
		}, {});
	}
}

module.exports = SelectMenuManager;