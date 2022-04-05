const BaseManager = require("./BaseManager");
const { ButtonInteraction } = require("discord.js");
const { parse } = require("querystring");
const Button = require("../structures/Button");

class ButtonManager extends BaseManager {
	constructor(client, database) {
		super(client, database);
		this.regex = /^(\w+)(?:&\w+=([^&\s]*))*$/;
	}

	async execute(interaction){
		if (!(interaction instanceof ButtonInteraction)) return void 1;

		if (!interaction.customId.match(this.regex)) return void 1;
		const name = interaction.customId.replace(this.regex, "$1");

		const itv = this.buttons.find((e) => e.config.id.replace(this.regex, "$1") === name);
		if (!itv) return interaction.reply({ content: "> ❌ **Je n'ai pas trouvé d'interactions associée à ce bouton, il semblerait que le bouton ne soit plus valide.**", ephemeral: true });

		try {
			let executable = require(`../../${itv.path}`);
			executable = new Button({...executable, path: itv.path, __resolvedPath: itv.__resolvedPath });
			delete require.cache[itv.__resolvedPath];
			database.interactions.buttons.set(executable.config.id, executable);
			if (JSON.stringify(itv) !== JSON.stringify(executable)) this.buttons = [...database.interactions.buttons].map(([_,v]) => v);
			if (executable.config.defer) await interaction.deferReply();
			const res = await executable.exec(await this.parseOptions(interaction, name));
			if (!["String", "Object"].some((t) => res.constructor.name === t)) return void 0;
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

module.exports = ButtonManager;