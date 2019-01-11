"use strict";

const Gallant_12x22 = require("./gallant12x22.js");
const encoding      = require("./encoding.js");
module.exports      = {buildFontMap, render};

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

function render(char, font, options = {}){
	const {
		fgChar    = "█",
		bgChar    = " ",
		eolChar   = "\n",
		underline = false,
		
		// These shouldn't be changed for this font
		bytesWide   = 2,   //(f->vf_width + 7) / 8;
		glyphWidth  = 12,  // f->vf_width
		glyphHeight = 22,  // f->vf_height
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
