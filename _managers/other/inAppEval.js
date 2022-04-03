function exitListener(){
	process.stdin.removeAllListeners('data');
	process.stdin.pause();
	console.log(client.utils.colorized(`[$b eval $0]: exit successfully.$0`))
}

module.exports = function(){
	process.stdin.resume()
	process.stdout.write(">>> ")
	process.stdin.on("data", async function(data) {
		process.stdin.pause();
		data = data.toString().trim();
		if (data === ".clear") { console.clear(); }
		else if (data === ".exit") return exitListener()
		else if (data === ".help") {
			console.log(client.utils.colorized("  << $bInAppEval Help$0 >>  \n\n$y.clear$0 -> Clear the console\n$y.help$0 -> see the help\n$r.exit$0 -> exit the eval\n\n  Enjoy ! ;)"));
		}
		else try {
				let evaled = eval(data);
				console.log(client.utils.colorized(`[$b eval $0]: ${require("util").inspect(evaled, { colors: true, depth: 0 })}`))
			} catch(err) {
				console.error(client.utils.colorized(`[$b eval $0]: $r<ERROR> ${err}$0`))
			}
		process.stdout.write(">>> ");
		process.stdin.resume();
	})
}