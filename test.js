#!/usr/bin/env node
"use strict";

const Gallant_12x22 = require("./gallant12x22.js");

function parseFont(data, on = "X", off = " "){
	const chars = [];
	for(let i = 0; i < data.length; i += 44){
		const char = [];
		const c = data.slice(i, i + 44);
		for(let j = 0; j < c.length; j += 2){
			let l = c[j].toString(2);
			let r = c[j+1].toString(2);
			l = "0".repeat(8 - l.length) + l;
			r = "0".repeat(8 - r.length) + r;
			char.push((l + r).split("").map(c => +c ? on : off));
		}
		chars.push(char);
	}
	return chars;
}

let data = parseFont(Gallant_12x22);
data = data.map(char => {
	return char.map(row => row.join("")).join("\n");
}).join("\n\n");
console.log(data);
