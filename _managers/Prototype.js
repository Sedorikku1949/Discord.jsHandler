/**
 * Prototype file.
 */


const Discord = require("discord.js");

Discord.Guild.prototype.getData = function getPrefix(){ return database.guilds.get(this.id) };
Discord.Guild.prototype.getPrefix = function getPrefix(){ return (this.getData() ? (this.getData().prefix || client.prefix) : client.prefix) }