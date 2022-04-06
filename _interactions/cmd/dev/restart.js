module.exports.exec = async function({ author, channel, guild, interaction }){
	if (author.id !== database.config.ownerId) return null;
	console.log(client.utils.colorized("\n$rRestarting !$0"))
	await interaction.reply(this.translate(guild.getLang(), "/assets", author.id));
	await client.restart(() => client.channels.fetch(channel.id).then((chl) => chl.send(`> **Redémarrage réussi !**`)).catch(() => false))
}

module.exports.config = {
	name: "restart",
	aliases: [],
	category: "dev",
	options: [],
	system: {
		cooldown: 5000,
		permissions: [`owner`],
		deleteInvoke: false,
		defer: false,
		ephemeral: 1,
		slash: true,
		classic: true,
		user: false
	},
	lang: null,
	path: __filename
}