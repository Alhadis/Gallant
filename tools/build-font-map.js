#!/usr/bin/env node
"use strict";

const {resolve, basename} = require("path");
module.exports = buildFontMap;

// Execute if loaded directly
if(require.main === module){
	const getOpts = require("get-options");
	const {options, argv} = getOpts(process.argv.slice(2), {
		"-e, --extends": "[font=\\S+]",
		"-h, --height":  "[number=\\d+]",
		"-w, --width":   "[width=\\d+]",
	});
	if(argv.length < 2){
		process.stderr.write(`Usage: ${basename(process.argv[1])} [options] glyphs encoding\n`);
		process.exit(2);
	}
	const width    = +options.width  || 12;
	const height   = +options.height || 22;
	const glyphs   = require(resolve(argv[0]));
	const encoding = require(resolve(argv[1]));
	const baseFont = loadBaseFont(options.extends, encoding);
	const fontMap  = {
		...baseFont, width, height, encoding,
		...buildFontMap(glyphs, encoding, height),
	};
	process.stdout.write(JSON.stringify(fontMap, null, "\t") + "\n");
}

function buildFontMap(data, encoding, height = 22){
	const font = {};
	for(let i = 0; i < encoding.length; ++i){
		const char = encoding[i];
		font[char] = [];
		for(let b = 0; b < height * 2; ++b)
			font[char].push(data[(height * 2 * i) + b]);
	}
	const lowLine = String.fromCharCode(0x0332);
	font[lowLine] = font[lowLine] || font["⎽"];
	return font;
}

function loadBaseFont(file, encoding = null){
	if(!file) return {};
	const base = require(resolve(file));
	if(Array.isArray(encoding))
		base.encoding = base.encoding.filter(c => !encoding.includes(c));
	return base;
}
