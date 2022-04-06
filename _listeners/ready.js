module.exports = async function(client){
	console.log(client.utils.colorized(`[$bClient$0] $m${client.user.tag}$0 is ready for work`));
	if (client.InAppEval) client.InAppEval(client);

	// emojis parser
	if (client.database.config && client.database.config?.guildEmojisId) {
		const guild = await client.guilds.fetch(client.database.config?.guildEmojisId).catch(() => undefined);
		if (guild) {
			guild.emojis.fetch()
					.catch((err) => console.log(err))
					.then((emojisArray) => {
						emojisArray.forEach((emj) => client.database.emojis[emj.name] = { id: emj.id, msg: emj.toString(), name: emj.name })
					});
		}
	}
}