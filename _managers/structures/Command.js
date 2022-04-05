const BaseInteraction = require("./BaseInteraction");

class Command extends BaseInteraction {
	constructor(cmd) {
		super();
		Object.entries(cmd).forEach(([k, v]) => {
			this[k] = v
		});
		this.lang = `command['${this.config.name}']`;
		this.config.lang = this.lang;
		if (this.exec) this.exec.bind(this);
	}
}

module.exports = Command;