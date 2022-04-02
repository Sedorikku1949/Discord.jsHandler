class IntervalManager {
	constructor(client) {
		this.client = client;
		this.intervals = new Map();
	}

	add(...args){
		const itv = setInterval(...args);
		this.intervals.set(String(this.intervals.size), {
			args: [...args],
			date: Date.now(),
			itv: itv
		})
		return true;
	}

	remove(index){
		clearInterval(this.intervals.get(String(index)).itv);
		this.intervals.delete(String(index));
		return true;
	}

	pause(){
		this.intervals.forEach((itv, index) => {
			this.intervals.set(String(index), { ...this.intervals.get(String(index)), paused: Date.now() });
			clearInterval(itv["itv"]);
		});
		return true;
	}

	resume(){
		this.intervals.forEach((itv, index) => {
			const time = itv.args.find((a) => !isNaN(a));
			const ellipsedTime = Date.now() - itv.paused;
			// check if interval can be restarted
			if(ellipsedTime >= time){
				setInterval(...itv.args);
			}
		});
		return true;
	}
}

module.exports = IntervalManager;