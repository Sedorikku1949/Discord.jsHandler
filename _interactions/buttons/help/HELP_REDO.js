const { generateMessage, generateSommaire} = require("../../../functions/Help")

module.exports.exec = async function({ args, author, guild, interaction }){
	if (args["id"] !== author.id) return;
	const ctg = this.translate("fr", "misc.categories");
	const newIndex = ((ctg.length+(ctg.findIndex((_, index) => index === Number(args["actualIndex"]))+1))%ctg.length)
	if (newIndex === 0) interaction.update(generateSommaire(this.translate("fr", "misc.categories"), this, guild, author));
	else interaction.update(generateMessage([...database.interactions.cmd].map(([_,v]) => v), ctg , newIndex, guild, author, this));
	return true;
}

module.exports.config = {
	id: "HELP_REDO",
	name: "HELP_REDO",
	defer: false,
	permissions: [],
	path: __dirname,
	lang: null
}