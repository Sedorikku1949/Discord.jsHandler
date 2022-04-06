const { Client } = require("discord.js");
const { token, prefix } = require("../config.json");
const Database = require("./Database");
const Command = require("./structures/Command");
const Button = require("./structures/Button");
const Language = require("./structures/Language")
const { readdirSync } = require("fs");

class BotHandler extends Client {
	constructor(options) {
		super(options);
		console.log("\x1b[32mClient initialisation...\x1b[0m")
		// initiate first variables
		this.prefix = prefix;
		this.utils = require("./Utils");
		this.database = new Database(this);
		require("./Prototype");

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
		this.loadInteractions();
		this.loadLanguages();

		global["database"] = this.database;
		global["client"] = this;

		database.managers.buttons.buttons = [...database.interactions.buttons].map(([_,v]) => v);
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

	loadInteractions(){
		let i = 0;
		const folders = [...readdirSync("_interactions").filter((d) => !d.match(/\./))];
		[...folders.map((d) => `_interactions/${d}`)].forEach((d) => {
			this.utils.queryFiles(d, { extension: "js" }).forEach((dir) => {
				let data = require(`../${dir}`);
				delete require.cache[require.resolve(`../${dir}`)]
				switch(d.replace(/_interactions\//g, "")){
					case "cmd": {
						data = new Command({...data, path: dir, __resolvedPath: require.resolve(`../${dir}`)});
						break;
					}
					case "buttons": {
						data = new Button({...data, path: dir, __resolvedPath: require.resolve(`../${dir}`)});
						break;
					}
				}
				if (!data || !data.config) return console.log(this.utils.colorized(`[$rClient$0] $rThe file ${dir} was ignored because he doesn't have required data.$0`));
				if (!this.database.interactions[d.replace(/_interactions\//g, "")]) this.database.interactions[d.replace(/_interactions\//g, "")] = new Map();
				this.database.interactions[d.replace(/_interactions\//g, "")].set(data.config.name, data);
				i++;
			})
		});
		console.log(this.utils.colorized(`[$bClient$0] $c${i}$0 interactions has been loaded in the folders $2["${folders.map((f) => f.replace(/"/g, "\\")).join('", "')}"]$0`));
		return true;
	}

	loadInAppEval(){
		console.log(this.utils.colorized("[$bClient$0] starting in app eval..."))
		this.InAppEval = require("./other/inAppEval");
	}

	loadLanguages(){
		let i = 0;
		this.utils.queryFiles("_storage/_langs").forEach((dir) => {
			const lang = require(`../${dir}`);
			if (!lang || lang.constructor.name !== "Object") return console.log(this.utils.colorized(`[$rClient$0] $rThe file ${dir} was ignored because he is not an Object.$0`));
			this.database.langs.set(dir.replace(/_storage\/_langs\/|\.json/g, ""), new Language(dir, this));
			i++
		});
		console.log(this.utils.colorized(`[$bClient$0] $c${i}$0 languages files has been loaded in the folder $2"_storage/_langs"$0`))
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
			this.loadInteractions();
			this.loadLanguages();
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