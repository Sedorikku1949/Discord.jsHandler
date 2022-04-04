class Button {
	constructor(cmd) {
		Object.entries(cmd).forEach(([k, v]) => {
			this[k] = v
		});
		this.lang = `command['${this.config.name}']`;
		this.config.lang = this.lang;
		if (this.exec) this.exec.bind(this);
	}

	translate(path, ...values){}
}

module.exports = Button;