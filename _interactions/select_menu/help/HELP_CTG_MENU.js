const { generateMessage, generateSommaire} = require("../../../functions/Help")

module.exports.exec = async function({ args, author, guild, interaction, options }){
	if (args["id"] !== author.id) return false;
	const categories = this.translate("fr", "misc.categories");
	const index = categories.findIndex(({ code }) => code === options[0]);
	if (isNaN(index) || index < 0) return this.translate(guild.getLang(), "commands['help'].misc.categoryNotFound");
	if (index === 0) interaction.update(generateSommaire(categories, this, guild, author));
	else interaction.update(generateMessage([...database.interactions.cmd].map(([_,v]) => v), categories , index, guild, author, this));
}

module.exports.config = {
	id: "HELP_CTG_MENU",
	name: "HELP_CTG_MENU",
	defer: false,
	permissions: [],
	path: __dirname,
	lang: null
}