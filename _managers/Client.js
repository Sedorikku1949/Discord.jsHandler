const { Client } = require("discord.js");
const { token, prefix } = require("../config.json");
const Database = require("./Database");
const { readdirSync } = require("fs");

class BotHandler extends Client {
	constructor(options) {
		super(options);
		console.log("\x1b[32mClient initialisation...\x1b[0m")
		// initiate first variables
		this.prefix = prefix;
		this.utils = require("./Utils");
		this.database = new Database(this);

		// product/dev
		if (process.argv.includes("dev")) {
			// in development
			console.log(this.utils.colorized("[$bClient$0] starting as in development..."))
			this.dev = true;
			this.database.inDev = true;
		}

		// in app eval
		if (options["inAppEval"]) this.loadInAppEval();
		this.database.options = options;

		this.eventsNames = []
		this.loadEvents();
		this.loadCommands();

		global["database"] = this.database;
		global["client"] = this;
	}

	loadEvents(){
		let i = 0;
		this.utils.queryFiles("_listeners", { extension: "js" }).forEach((dir) => {
			try {
				const name = (`/${dir}`).replace(/^(?:\.{0,2}\/[\w_]+)+\/([\w_]+)\.[a-z]+/, "$1");
				this.on(name, require(`../${dir}`)); i++;
				this.eventsNames.push(name);
			} catch(err) {
				console.error(err)
			}
		})
		console.log(this.utils.colorized(`[$bClient$0] $c${i}$0 events has been loaded`));
		return true;
	}

	loadCommands(){
		let i = 0;
		const folders = [...readdirSync("_interactions").filter((d) => !d.match(/\./))];
		[...folders.map((d) => `_interactions/${d}`)].forEach((d) => {
			this.utils.queryFiles(d, { extension: "js" }).forEach((dir) => {
				const data = require(`../${dir}`);
				delete data.exec;
				if (!data || !data.config) return console.log(this.utils.colorized(`[$rClient$0] $rThe file ${dir} was ignored because he doesn't have required data.$0`));
				this.database.interactions.cmd.set(data.config.name, { ...data, path: dir });
				i++;
			})
		});
		console.log(this.utils.colorized(`[$bClient$0] $c${i}$0 interactions has been loaded in the folders $2["${folders.map((f) => f.replace(/"/g, "\\")).join('", "')}"]$0`))
		return true;
	}

	loadInAppEval(){
		console.log(this.utils.colorized("[$bClient$0] starting in app eval..."))
		this.InAppEval = require("./other/inAppEval");
	}

	start(){
		return new Promise((resolve, reject) => {
			this.login(token)
					.then(() => resolve(true))
					.catch((err) => reject(err))
		})
	}

	restart(callback = null){
		return new Promise((resolve, reject) => {
			const now = performance.now()
			// clear in app eval
			process.stdin.removeAllListeners('data');
			process.stdin.pause();
			if (this.database.options.inAppEval) process.stdout.write("\n")

			console.log(this.utils.colorized("[$bClient$0] $y restarting...$0"));
			// clear timeouts and intervals
			this.database.intervals.pause();
			const intervals = this.database.intervals.intervals;
			this.database.timeouts.pause();
			const timeouts = this.database.timeouts.timeouts;
			// destroy client
			if (this.isReady()) this.destroy();
			// reload database
			this.database = new Database(this);
			// reload events && commands
			this.eventsNames.map((n) => { delete this._events[n] });
			this.eventsNames = [];
			this.loadEvents();
			this.loadCommands();
			// start client and do stuff
			this.start().then(() => {
				this.database.intervals.intervals = intervals; this.database.intervals.resume();
				this.database.timeouts.timeouts = timeouts; this.database.timeouts.resume();
				console.log(this.utils.colorized(`[$bClient$0]$g restart successfully in ${(performance.now() - now).toFixed(2)}ms$0`))
				if (callback && ["Function", "AsyncFunction"].some((c) => callback.constructor.name === c)) callback.call(this);
				this._events["ready"](this);
			}).catch((err) => reject(err));
		})
	}
}

module.exports = BotHandler;