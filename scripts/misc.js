function ID(n) {
return document.getElementById(n)
}

function shadeColor(color, percent) {

	let rgb = [0, 0, 0]
	
	for (j = 0; j < 3; j++) {
		rgb[j] = (parseInt(color.substring(j*2 + 1, j*2 + 3),16))
		rgb[j] = Math.round((rgb[j] * (100+percent))/100)
		rgb[j] = Math.max(Math.min(rgb[j], 255), 0)
		rgb[j] = (rgb[j].toString(16).length==1) ? "0" + rgb[j].toString(16) : rgb[j].toString(16)
	}

    return "#"+rgb[0]+rgb[1]+rgb[2];
}