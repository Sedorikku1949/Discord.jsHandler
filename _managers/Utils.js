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

/*
$ -color
    n:noir
    r:red
    g:green
    y:yellow
    b:blue
    m:magenta
    c:cyan
    w:white
    0:reset
    1:bold
    2:faint
    3:italic
    4:underline

$$ -background
    n:noir
    r:red
    g:green
    y:yellow
    b:blue
    m:magenta
    c:cyan
    w:white
*/
const colors = {$:{n:30, r:31, g:32, y:33, b:34, m:35, c:36, w:97, 0:0, 1:1, 2:2, 3:3, 4:4}, $$:{n:40, r:41, g:42, y:43, b:44, m:45, c:46, w:107}}

function colorized(str){
	if (str.constructor.name !== "String") throw new Error("Argument must be a string");
	return str.replace(/\${1,2}([a-z0-4])/g, (t)=>{
		const color = t.startsWith("$$") ? colors["$$"][t[t.length-1]] : colors["$"][t[t.length-1]];
		if (color === undefined) return "";
		else return `\x1b[${color}m`;
	})+"\x1b[0m"
}

function decolorize(string){
	if(typeof string !== "string")throw new Error("argument must be a string")
	const reg = /\[[0-9]{1,2}m/g
	return string.replace(reg, "")
}

function getObjectPath(path){
	if (!path || path?.constructor?.name !== "String") return "";
	return path.match(/(?:\[(?:"|'|`))?(\w|\-|\/)+(?:(?:"|'|`)\])?/gm).map(e => e.match(/\[.+\]/g) ? e.slice(2, e.length-2) : e );
}

function cloneObject(obj){
	if (!obj || obj.constructor.name !== "Object") return {};
	let o = {};
	Object.entries(obj).forEach(([k,v]) => {
		o[k] = v;
	})
	return o;
}

function cloneArray(arr){
	if (!arr || arr.constructor.name !== "Array") return [];
	let res = [];
	arr.forEach((v) => res.push(v));
	return res;
}

function cloneString(str){
	if (!str || str.constructor.name !== "String") return "";
	let s = "";
	str.split("").forEach((c) => s += c);
	return s;
}

// export all functions
module.exports = {
	queryFiles,
	colorized,
	decolorize,
	colors,
	getObjectPath,
	cloneObject,
	cloneArray,
	cloneString
}