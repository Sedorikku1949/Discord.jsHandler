const { generateSpecificCommandPage } = require("../../../functions/Help");
const Command = require("../../../_managers/structures/Command");

module.exports.exec = async function({ args, author, guild, options }){
	if (args["id"] !== author.id) return false;
	const cmd = database.interactions.cmd.get(options[0]);
	if (!cmd || !(cmd instanceof Command)) return this.translate(guild.getLang(), "commands['help'].misc.commandNotFound");
	else return generateSpecificCommandPage(cmd.config.name, this, author, guild);
}

module.exports.config = {
	id: "HELP_GET_CMD",
	name: "HELP_GET_CMD",
	defer: false,
	permissions: [],
	path: __dirname,
	lang: null
}