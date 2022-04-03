const Enmap = require("enmap");

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
		this.system = new Enmap({ dataDir: "_storage/_database/system", fetchAll: true });
		this.guilds = new Enmap({ dataDir: "_storage/_database/guilds", fetchAll: true });
		this.users = new Enmap({ dataDir: "_storage/_database/users", fetchAll: true });

		// managers
		this.managers = {
			commands: new (require("./_interactions/CommandManager"))(client, this)
		}
	}
}

module.exports = Database;