const { Message } = require('discord.js');

function dm(message){
	console.log(`DM reçu de ${message.author.tag} : ${message.content}`)
}

function parseMessage(content, prefix){
	return ({
		prefix: content.slice(0, prefix.length),
		command: content.slice(prefix.length).trim().split(/\s+/)[0].toLowerCase(),
		args: [...content.slice(prefix.length).trim().split(/\s+/)],
	})
}

module.exports = async function messageCreate(message){
	if (!(message instanceof Message)) return;
	if (message.author.bot) return;
	if (message.channel.type === 'DM') return dm(message);
	if (!message.guild?.available || !["GUILD_TEXT", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"].includes(message.channel.type)) return;

	if (message.content.length < 1) return;
	const { prefix, command, args } = parseMessage(message.content, message.guild.getPrefix());
	if (prefix !== message.guild.getPrefix()) return;
	await database.managers.commands.execute(message, ({ name: command, authorId: message.author.id }))
}