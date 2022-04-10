const { inspect } = require("util");

function secData(str, type){
	if (type === "res") return str.replace(new RegExp(`secData|client|${client.token}|client(?:[s*["'\`]*t[^o]*o[^k]*k[^e]*e[^n]*n(["'\`]*)s*]|.token)`, "gi"), "nop");
	else return str.replace(new RegExp(`secData|${client.token}|client(?:[s*["'\`]*t[^o]*o[^k]*k[^e]*e[^n]*n(["'\`]*)s*]|.token)`, "gi"), "nop");
}

const components = (id) => [
	{
		type: 1,
		components: [
			{ label: "", emoji: "🗑️", style: 2, type: 2, custom_id: `DELETE_MSG&id=${id}` }
		]
	}
]

module.exports.exec = async function({ options, args, author, channel, guild, member, permissions, interaction }){
	if (args.length < 1) return;
	else return new Promise(async(resolve, _) => {
		const code = args.join(" ");
		try {
			const res = await eval(secData(code, "exec"));
			resolve({ content: `\`\`\`js\n${secData(inspect(res, { colors: false, depth: 0 }), "res").slice(0,1980)}\`\`\``, ephemeral: true, components: components(author.id) })
		} catch(err) {
			resolve({ content: `:x: **\`ERROR\`**\`\`\`js\n${secData(String(err).split("\n")[0] ?? "\u200b", "res").slice(0, 1980)}\`\`\``, ephemeral: true,  components: components(author.id) })
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
		cooldown: 500,
		permissions: ["dev"/*, "g:831842750538186772r:869550620678434816"*/],
		deleteInvoke: false,
		defer: true,
		ephemeral: 1,
		response: 1,
		slash: true,
		classic: true,
		user: false
	},
	lang: null,
	path: __filename
}