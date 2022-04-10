module.exports.exec = async function({ args, author, guild }){
	if (args["id"] !== author.id) return;
	const ctg = this.translate("fr", "misc.categories");
	const actualCtg = ctg[Number(args["actualIndex"])];
	if (!actualCtg || !actualCtg?.name || !actualCtg?.code) return this.translate(guild.getLang(), "commands['help'].misc.categoryNotFound");
	const msg = this.translate(guild.getLang(), "commands['help'].assets.searchCommand", actualCtg["name"], author.id);
	[...database.interactions.cmd].map(([_,v]) => v)
			.filter(({ config }) => config.category === actualCtg["code"])
			.forEach(({ config }) => msg.components[0].components[0].options.push(this.translate(guild.getLang(), "commands['help'].misc.selectMenuOptions", config.name, config.name)) )
	return msg;
}

module.exports.config = {
	id: "HELP_SEARCH",
	name: "HELP_SEARCH",
	defer: false,
	permissions: [],
	path: __dirname,
	lang: null
}