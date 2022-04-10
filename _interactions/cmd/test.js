module.exports.exec = async function({ guild }){
	return this.translate(guild.getLang(), "/assets.text", "hello world!")
}

module.exports.config = {
	name: "test",
	aliases: ["t"],
	category: "dev",
	options: [],
	system: {
		cooldown: 5000,
		permissions: ["dev"],
		deleteInvoke: false,
		ephemeral: false,
		response: 1,
		defer: true,
		slash: true,
		classic: true,
		user: false
	},
	lang: null,
	path: __filename
}