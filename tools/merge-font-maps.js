#!/usr/bin/env node
"use strict";

const path = require("path");
const argv = process.argv.slice(2);

if(argv.length < 2){
	process.stdout.write(`Usage: ${process.argv[1]} target ...additions\n`);
	process.exit(2);
}

const targetPath = path.resolve(argv.shift());
const targetData = require(targetPath);

// Loop through each file and merge its contents into the target
for(const file of argv){
	const data    = require(path.resolve(file));
	data.encoding = data.encoding.filter(c => targetData.encoding.includes(c));
	Object.assign(targetData, data);
}

// Update the target file in-place
const {writeFileSync} = require("fs");
writeFileSync(targetPath, JSON.stringify(targetData, null, "\t") + "\n");
