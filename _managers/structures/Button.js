const BaseInteraction = require("./BaseInteraction");

class Button extends BaseInteraction {
	constructor(cmd) {
		super();
		Object.entries(cmd).forEach(([k, v]) => {
			this[k] = v
		});
		this.lang = `buttons['${this.config.name}']`;
		this.config.lang = this.lang;
		if (this.exec) this.exec.bind(this);
	}
}

module.exports = Button;