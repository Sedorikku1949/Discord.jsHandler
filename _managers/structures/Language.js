const { readFileSync, existsSync } = require("fs");

class Language {
	constructor(dir, client) {
		this.client = client;
		if (!existsSync(dir) || !(/^(?:\.?\.?\/?[\w\-:\^\.]+)*\/([\w\-:\^\.]+\.json)$/).test(dir)) throw new Error("Invalid dir was provided");
		const data = JSON.parse(readFileSync(dir).toString("utf-8"));
		Object.entries(data).forEach(([k,v]) => {
			this[k] = v;
		});
	}

	getValue(path){
		const resolvedPath = this.client.utils.getObjectPath(path);
		let data = this;
		resolvedPath.map((p) => data ? data = data[p] : null);
		return data;
	}
}

module.exports = Language;