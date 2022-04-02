module.exports.exec = async function({}){
	return "hello"
}

module.exports.config = {
	name: "test",
	aliases: ["t"],
	category: "dev",
	options: [
		{ name: "code", description: "Le code à executer.", type: 3, required: true, text: "Un code a executer est requis." }
	],
	system: {
		permissions: ["staff", "dev", "u:790236382270324767", "r:869550620678434816"],
		deleteInvoke: false,
		slash: false,
		classic: true,
		user: false
	},
	lang: null,
	path: __filename
}