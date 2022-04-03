class TimeoutManager {
	constructor(client) {
		this.client = client;
		this.timeouts = new Map();
	}

	add(...args){
		const itv = setTimeout(...args);
		this.timeouts.set(String(this.timeouts.size), {
			args: [...args],
			date: Date.now(),
			itv: itv
		})
		return true;
	}

	remove(index){
		clearTimeout(this.timeouts.get(String(index)).itv);
		this.timeouts.delete(String(index));
		return true;
	}

	pause(){
		this.timeouts.forEach((itv, index) => {
			this.timeouts.set(String(index), { ...this.timeouts.get(String(index)), paused: Date.now() });
			clearTimeout(itv["itv"]);
		});
		return true;
	}

	resume(){
		this.timeouts.forEach((itv, index) => {
			const time = itv.args.find((a) => a.constructor.name === "Number");
			const ellipsedTime = Date.now() - itv.paused;
			// check if interval can be restarted
			if(ellipsedTime >= time){
				setTimeout(itv.args[0], time - ellipsedTime);
			}
		});
		return true;
	}
}

module.exports = TimeoutManager;