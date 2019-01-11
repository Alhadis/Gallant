#!/usr/bin/env node
"use strict";

module.exports = render;

// Execute if loaded directly
if(require.main === module){
	const getOpts = require("get-options");
	const {resolve, join} = require("path");
	const {options, argv} = getOpts(process.argv.slice(2), {
		"-a, --all":          "",
		"-f, --fg-char":      "[char=\\S]",
		"-b, --bg-char":      "[char=\\S]",
		"-e, --eol-char":     "[char=\\S]",
		"-W, --bytes-wide":   "[count=\\d+]",
		"-w, --glyph-width":  "[pixels=\\d+]",
		"-h, --glyph-height": "[pixels=\\d+]",
		"-u, --underline":    "",
	});
	if(argv.length < 2 && !options.all || argv.some(s => "-" === s[0])){
		process.stderr.write(`Usage: ${process.argv[1]} [options] font ...text\n`);
		process.exit(1);
	}
	const font = require(-1 === argv[0].indexOf("/")
		? join(__dirname, "..", "fonts", argv.shift().toLowerCase())
		: resolve(argv.shift()));
	options.bgChar = process.stdout.isTTY ? `\x1B[44m${options.bgChar || " "}\x1B[0m` : "";
	for(const char of (options.all ? font.encoding : argv).join(""))
		process.stdout.write(render(char, font, options) + "\n");
	if(process.stdout.isTTY)
		process.stdout.write("\n");
}

function render(char, font, options = {}){
	const {
		fgChar    = "█",
		bgChar    = " ",
		eolChar   = "\n",
		underline = false,
		
		// These shouldn't be changed for this font
		bytesWide   = 2,
		glyphWidth  = 12,
		glyphHeight = 22,
	} = options;
	
	let output  = "";
	const glyph = font[char];
	const ul = font[String.fromCharCode(0x0332)];
	
	let pixel = 0;
	for(let row = 0; row < glyphHeight; ++row){
		let bitsLeft = glyphWidth;
		
		for(let byte = 0; byte < bytesWide; ++byte){
			let data = glyph[pixel];
			if(underline)
				data |= ul[pixel];
			++pixel;
			
			let mask    = 0x80;
			const nbits = Math.min(8, bitsLeft);
			bitsLeft   -= nbits;
			
			for(let i = 0; i < nbits; ++i){
				output += data & mask ? fgChar : bgChar;
				mask >>= 1;
			}
		}
		output += eolChar;
	}
	return output;
}
