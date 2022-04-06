const Enmap = require("enmap");
const { readFileSync } = require("fs");

class Database {
	constructor(client) {

		// interactions like command, button and select menu
		this.interactions = {
			buttons: new Map(),
			cmd: new Map(),
			select_menu: new Map()
		};

		this.timeouts = new (require("./other/timeout"))(client);
		this.intervals = new (require("./other/interval"))(client);

		// cooldowns
		this.cooldowns = {
			commands: new Map()
		}

		// database
		this.system = new Enmap({ name: "system", dataDir: "_storage/_database/system" });
		this.guilds = new Enmap({ name: "guilds", dataDir: "_storage/_database/guilds" });
		this.users = new Enmap({ name: "users", dataDir: "_storage/_database/users" });

		// managers
		this.managers = {
			commands: new (require("./_interactions/CommandManager"))(client, this),
			buttons: new (require("./_interactions/ButtonManager"))(client, this),
		}

		// langs
		this.langs = new Map();
		// emojis
		this.emojis = {};
		// config
		const cfg = readFileSync("_storage/configuration.json", "utf-8");
		this.config = JSON.parse(cfg);
	}
}

module.exports = Database;