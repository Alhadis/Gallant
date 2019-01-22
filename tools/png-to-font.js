"use strict";

function loadImage(path){
	return new Promise((resolve, reject) => {
		const img = document.createElement("img");
		img.onerror = e => reject(e);
		img.onload = () => resolve(img);
		img.src = path;
	});
}

function sliceImage(img, numCols, numRows){
	const width   = Math.floor(img.naturalWidth  / numCols);
	const height  = Math.floor(img.naturalHeight / numRows);
	const scanned = []; // Scanned font-data
	
	const canvas  = document.createElement("canvas");
	canvas.width  = width;
	canvas.height = height;
	const context = canvas.getContext("2d");
	
	for(let row = 0; row < numRows; ++row){
		for(let col = 0; col < numCols; ++col){
			const x = col * width;
			const y = row * height;
			context.drawImage(img, x, y, width, height, 0, 0, width, height);
			
			// Start encoding each row of pixel-data
			for(let i = 0; i < height; ++i){
				const {data} = context.getImageData(0, i, width, 1);
				let digits = "";
				
				for(let j = 0; j < width; ++j){
					const r = data[(j * 4) + 0];
					const g = data[(j * 4) + 1];
					const b = data[(j * 4) + 2];
					const a = data[(j * 4) + 3];
					
					// Expect only opaque, black-and-white pixels
					if(r !== g || r !== b || 0xFF !== a)
						throw new Error(`Bad pixel @ [${i, j}]: ${[r, g, b, a]}`);
					
					// Just use 50% luminosity to decide what's "on" or "off"
					digits += r < 0x80 ? "0" : "1";
				}
				
				const mid   = digits.length / 2;
				const left  = parseInt(digits.slice(0, mid), 2);
				const right = parseInt(digits.slice(mid),    2);
				scanned.push(left, right);
			}
		}
	}
	return scanned;
}

document.title = "Convert PNG to console-font data";
const args = new URL(document.location).searchParams;
const file =  args.get("file") || "fonts/solarize/assets/Solarize.12x29.png";
const cols = +args.get("cols") || 32;
const rows = +args.get("rows") || 16;

loadImage(file).then(img => {
	const fontData = sliceImage(img, cols, rows);
	document.body.appendChild(Object.assign(document.createElement("pre"), {
		textContent: JSON.stringify(fontData, null, "\t"),
	}));
});
