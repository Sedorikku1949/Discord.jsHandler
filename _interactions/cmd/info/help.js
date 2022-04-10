const { generateSommaire, generateSpecificCommandPage } = require("../../../functions/Help")

module.exports.exec = async function({ guild, options, author }){
	if (options["command"]) return generateSpecificCommandPage(options["command"])
	else return generateSommaire(this.translate("fr", "misc.categories"), this, guild, author)
}

module.exports.config = {
	name: "help",
	aliases: ["h"],
	category: "info",
	options: [
		{ name: "command", required: false, description: "The command to get help for.", type: 3 }
	],
	system: {
		cooldown: 5000,
		permissions: ["dev"],
		deleteInvoke: false,
		ephemeral: 1,
		response: 1,
		defer: false,
		slash: true,
		classic: true,
		user: false
	},
	lang: null,
	path: __filename
}