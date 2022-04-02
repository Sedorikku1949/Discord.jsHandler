const { Client } = require("discord.js");
const { token, prefix } = require("../_storage/config.json");

class BotHandler extends Client {
	constructor() {
		super();
		this.prefix = prefix;
		this.utils = require("./Utils");
	}

	loadEvents(){}

	start(){
		return new Promise((resolve, reject) => {
			this.login(token)
					.then(() => resolve(true))
					.catch((err) => reject(err))
		})
	}
}

module.exports = BotHandler;