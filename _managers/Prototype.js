/**
 * Prototype file.
 */


const Discord = require("discord.js");


// role prototypes
Discord.Role.prototype.isStaff = function isStaff(){ return this.permissions.has("MANAGE_MESSAGES") };

// Guild prototypes
Discord.Guild.prototype.getData = function getPrefix(){ return database.guilds.get(this.id) };
Discord.Guild.prototype.getPrefix = function getPrefix(){ return (this.getData() ? (this.getData().prefix || client.prefix) : client.prefix) };
Discord.Guild.prototype.getLang = function getLang(){ return (this.getData() ? (this.getData().lang || "fr") : "fr") };

// slash commands
Discord.Guild.prototype.registerSlash = async function registerSlash(){
	return new Promise(async(resolve, reject) => {
		const commands = [...database.interactions.cmd].map(([_, v]) => v);
		await this.commands.fetch();
		let problem = false;
		const that = this;
		// delete commands that are not found
		await Promise.all(this.commands.cache.filter(({ name }) => !commands.find(({ config }) => config.name === name)).map(async(command) => {
					if (problem) return;
					await this.commands.delete(command.id, that.id).catch((err) => { problem = err; }).then(() => console.log(`${command.name} ${command.id} deleted`));
				})
		);
		// edit/create commands
		await Promise.all(
				commands.filter(({ config }) => config.system.slash === true).map(async({ config }) => {
					if (problem) return;
					const data = { name: config.name,  description: "A beautiful description",  options: config.options, type: 1, defaultPermission: true };
					if (!this.commands.cache.find(({ name }) => name === config.name)) {
						// don't exist
						await this.commands.create(data, that.id).catch((err) => { problem = err; }).then((c) => c.updatePermissions(that.id));
					} else if (!this.commands.cache.find(({ name }) => name === config.name).equals(data)) {
						// exist but different
						const commandId = this.commands.cache.find(({ name }) => name === config.name)?.id;
						console.log(commandId)
						if (!commandId) return;
						await this.commands.edit(commandId, data, that.id).catch((err) => { problem = err; }).then((c) => c.updatePermissions(that.id));
					}
				})
		);
		if (problem) reject(problem);
		else resolve(commands);
	})
}

function parsePermissions(perms, guild){
	if (!Array.isArray(perms)) throw new Error("invalid permissions was provided, cannot parse for slash command permission update");
	let permsList = [];
	perms.forEach((p) => {
		if ((/^r:[0-9]{17,}$/).test(p)) permsList.push({ id: p.replace(/^.+r:([0-9]{17,})$/, "$1"), type: 1, permission: true })
		else if ((/^u:[0-9]{17,}$/).test(p)) permsList.push({ id: p.replace(/^.+u:([0-9]{17,})$/, "$1"), type: 2, permission: true })
		else if (p === "dev") require("../config.json").evalAccess.map((id) => permsList.push({ id, type: 2, permission: true }))
		else if (p === "staff") guild.roles.cache.filter((r) => r.isStaff()).map(({ id }) => permsList.push({ id, type: 1, permission: true }))
	});
	return permsList;
}

// update slash commands permissions
// TODO permissions doesn't work :(
Discord.ApplicationCommand.prototype.updatePermissions = async function updatePermissions(guildId){
	if (!guildId) throw new Error("Guild Id is required");
	const guild = await client.guilds.fetch(guildId).catch(() => false);
	if (!guild || !(guild instanceof Discord.Guild)) return false;
	const that = this;
	const cmd = database.interactions.cmd.get(this.name);
	await guild.roles.fetch()
	if (!cmd) throw new Error("No command was found in the database");
	return new Promise((resolve, reject) => {
		client.application.commands.permissions.set({ guild: guild.id, command: this.id, permissions: parsePermissions(cmd.config.system.permissions, guild) })
				.catch((err) => reject(err))
				.then((res) => resolve([res, true]))
	})
}

// GuildMember prototypes
// TODO update isStaff to check database and owner or not
Discord.GuildMember.prototype.isStaff = function isStaff(){ return this.permissions.has("MANAGE_MESSAGES") };