const { readdirSync, existsSync } = require("fs");

/**
 * Return all files in a directory
 *
 * @param dir {String}
 * @param options {Object}
 * @param options["extension"] {String} -> Default: js
 * @returns {*[String]}
 */
function queryFiles(dir, options = {}){
	if (dir.constructor.name !== "String" || !existsSync(dir)) throw new Error("Invalid directory was provided.");
	if (options.constructor.name !== "Object") options = {};
	let filesDir = [];
	readdirSync(dir).forEach((subdir) => {
		if (!(/\./).test(subdir)) return queryFiles(dir+"/"+subdir, options).map((d) => filesDir.push(d))
		else if ((new RegExp(`.+\\.${options["extension"] || "js"}`)).test(subdir)) filesDir.push(dir+"/"+subdir)
	});
	return filesDir;
}


// export all functions
module.exports = { queryFiles }