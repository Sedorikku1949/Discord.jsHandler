module.exports.exec = async function({ args, author, message }){
	if (args["id"]){
		if (args["id"] !== author.id) return ({ content: "> ❌ **Vous n'avez pas la permission de supprimer ce messages.**", ephemeral: true });
		else return message.delete().catch(() => false);
	}
	else message.delete().catch(() => false);
}

module.exports.config = {
	id: "DELETE_MSG",
	name: "DELETE_MSG",
	defer: false,
	permissions: [],
	path: __dirname,
	lang: null
}