module.exports = async function(client){
	console.log(client.utils.colorized(`[$bClient$0] $m${client.user.tag}$0 is ready for work`));
	// emojis parser
	if (client.database.config && client.database.config?.guildEmojisId) {
		const guild = await client.guilds.fetch(client.database.config?.guildEmojisId).catch(() => undefined);
		if (guild) {
			guild.emojis.fetch()
					.catch((err) => console.log(err))
					.then(async(emojisArray) => {
						await Promise.all(emojisArray.map((emj) => client.database.emojis[emj.name] = { id: emj.id, msg: emj.toString(), name: emj.name }));
						console.log(client.utils.colorized(`${client.InAppEval?"\n":""}[$bClient$0] ${emojisArray.size} emojis has been loaded at $ydatabase.emojis$0 from $m${guild.name} (${guild.id})$0`))
					});
		}
	}
	
	
	// /!\ last line
	if (client.InAppEval) client.InAppEval(client);
}