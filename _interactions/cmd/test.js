module.exports.exec = async function({ channel }){
	return "hello world !";
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
		defer: true,
		slash: true,
		classic: true,
		user: false
	},
	lang: null,
	path: __filename
}