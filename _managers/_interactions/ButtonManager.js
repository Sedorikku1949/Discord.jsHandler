const BaseManager = require("./BaseManager");
const { ButtonInteraction } = require("discord.js");
const { parse } = require("querystring");

class ButtonManager extends BaseManager {
	constructor(client, database) {
		super(client, database);

		this.buttons = database.interactions.buttons;

		this.regex = /^(\w+)(?:&\w+=([^&\s]*))+$/
	}

	async execute(interaction){
		if (!(interaction instanceof ButtonInteraction)) return void 1;

		if (!interaction.customId.match(this.regex)) return void 1;
		const name = interaction.customId.replace(this.regex, "$1");
		console.log(name);

		const itv = this.buttons.find((e) => e.config.name.replace(this.regex, "$1") === name);
		if (!itv) return interaction.reply({ content: "> ❌ **Je n'ai pas trouvé d'interactions associée à ce bouton, il semblerait que le bouton ne soit plus valide.**", ephemeral: true });


		try {
			const executable = false;

			executable.exec(this.parseOptions(interaction, name))
		}
		catch(err) {
			this.error(interaction, err)
		}
	}

	error(interaction, err){
		console.log(err);
		interaction.reply({ content: `> :x: **Une erreur est survenue.**\n\`\`\`js\n${String(err).split("\n")[0] ?? "\u200b" || "Error"}\`\`\``, ephemeral: true }).catch(() => false);
	}

	async parseOptions(interaction, name){
		return new Promise(async(resolve, _) => {
			resolve({
				args: this.parseArgs(interaction.customId, name),
				author: interaction.author,
				guild: interaction.guild,
				member: (interaction.guild ? await interaction.guild.members.fetch(interaction.user.id) : null),
				permissions: interaction.memberPermissions || null,
				interaction, name
			})
		})
	}

	parseArgs(customId, name){
		const str = customId.replace(new RegExp(name, "g"), "");
		console.log(str)
		if (str && str.length > 0) return parse(str.replace(/&(.+)/, "$1"));
		else return {};
	}
}

module.exports = ButtonManager;