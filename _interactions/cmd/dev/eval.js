const { inspect } = require("util");

function secData(str, type){
	if (type === "res") return str.replace(new RegExp(`secData|client|${client.token}|client(?:[s*["'\`]*t[^o]*o[^k]*k[^e]*e[^n]*n(["'\`]*)s*]|.token)`, "gi"), "nop");
	else return str.replace(new RegExp(`secData|${client.token}|client(?:[s*["'\`]*t[^o]*o[^k]*k[^e]*e[^n]*n(["'\`]*)s*]|.token)`, "gi"), "nop");
}

module.exports.exec = async function({ options, args, author, channel, guild, member, permissions, interaction }){
	if (args.length < 1) return;
	if (author.id !== "782164174821523467") return "> nop.";
	else return new Promise(async(resolve, _) => {
		const code = args.join(" ");
		try {
			const res = await eval(secData(code, "exec"));
			resolve(`\`\`\`js\n${secData(inspect(res, { colors: false, depth: 1 }), "res").slice(0,1980)}\`\`\``)
		} catch(err) {
			resolve(`:x: **\`ERROR\`**\`\`\`js\n${secData(String(err).split("\n")[0] ?? "\u200b", "res").slice(0,1980)}\`\`\``)
		}
	})
}

module.exports.config = {
	name: "eval",
	aliases: ["e"],
	category: "dev",
	options: [
		{ name: "code", description: "Le code à executer.", type: 3, required: true, text: "Un code a executer est requis." }
	],
	system: {
		permissions: ["staff", "dev", "u:790236382270324767", "r:869550620678434816"],
		deleteInvoke: false,
		defer: true,
		slash: true,
		classic: true,
		user: false
	},
	lang: null,
	path: __filename
}