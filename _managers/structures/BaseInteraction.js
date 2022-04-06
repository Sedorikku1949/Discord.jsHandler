class BaseInteraction {
	constructor(){
		this.__translateArgs = [
			{
				regex: /<emj:([\w]+)>/g,
				exec: (str, rgx, index) => {
					const name = str.replace(rgx, "$1");
					if (database["emojis"][name]) return database["emojis"][name]?.msg;
					else return str;
				}
			}
		]
	}

	/**
	 *
	 * @param lang
	 * @param path -> if path start with "/", the path is from the command.
	 * @param args -> args to provide to the text
	 * @returns {string}
	 */
	translate(lang, path, ...args) {
		return this.__translate(lang, ((/^\/.+/).test(path) ? this.lang + (path.startsWith("/[") ? path.replace(/^\/(.+)/, "$1") : path.replace(/^\/(.+)/, ".$1")) : path), args);
	}

	/**
	 *
	 * @param langName
	 * @param path
	 * @param args
	 * @returns {string|{name}|*}
	 * @private
	 */
	__translate(langName, path, args){
		if (!path || path.constructor.name !== "String") return "ERROR_PATH_NOT_A_STRING";
		const lang = database.langs.get(langName);
		if (!lang) return "ERROR_LANG_NOT_FOUND";
		const data = lang.getValue(path);
		if (!data || !["String", "Object", "Array"].some((e) => data.constructor.name !== e)) return "ERROR_DATA_NOT_FOUND";
		else return this.__translateReplace(data, this.__translateArgs, args);
	}

	/**
	 *
	 * @param data
	 * @param translateArgs
	 * @param args
	 * @returns {string|{name}|*}
	 * @private
	 */
	__translateReplace(data, translateArgs, args){
		if (!data?.constructor?.name) return "ERROR_DATA_NOT_ACCEPTABLE"
		const type = data.constructor.name.trim().toLowerCase();
		switch(type){
			case "string": {
				data = data.replace(/\$[1-9](?:[0-9]+)?/, (w, index) => {
					const i = Number(w.replace(/[^0-9]/g, "")) - 1;
					if (!args[i]) return w;
					else return args[i]
				});
				translateArgs.forEach(({ regex, exec }) => {
					if (regex.test(data)) data = data.replace(regex, (str, index) => exec(str, regex, index));
				})
				break;
			}
			case "array": {
				data = data.map((e) => this.__translateReplace(e, translateArgs, args));
				break;
			}
			case "object": {
				Object.entries(data).forEach(([k,v]) => {
					data[k] = this.__translateReplace(v, translateArgs, args);
				})
				break;
			}
		}
		return data
	}
}

module.exports = BaseInteraction;