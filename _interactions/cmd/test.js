module.exports.exec = async function({ channel }){
	return new Promise((resolve, _) => {
		setTimeout(() => {
			resolve("hello there, i have been edit with no restart ! And again ;)")
		}, 1500)
	})
}

module.exports.config = {
	name: "test",
	aliases: ["t"],
	category: "dev",
	options: [],
	system: {
		permissions: ["staff", "dev", "u:790236382270324767", "r:869550620678434816"],
		deleteInvoke: false,
		defer: true,
		slash: false,
		classic: true,
		user: false
	},
	lang: null,
	path: __filename
}