function drawMenu() {
cv.rect(colors[0], res[0]/1.9 + 2, 102, 1000, res[1]-204)
cv.rect(shadeColor(colors[0], -62.35), res[0]/1.9 + 5, 105, 1000, res[1]-210)

cv.rect(colors[0], res[0]/1.9 + 10, 110, 125, 60)
cv.rect((selected[2] == 0) ? colors[0] : shadeColor(colors[0], -62.35), res[0]/1.9 + 12, 112, 121, 56)
cv.text("songs", (selected[2] == 0) ? shadeColor(colors[0], -62.35) : colors[0], res[0]/1.9 + 70, 148, "monospace", "30", "center")

cv.rect(colors[1], res[0]/1.9 + 140, 110, 180, 60)
cv.rect((selected[2] == 1) ? colors[1] : shadeColor(colors[1], -62.35), res[0]/1.9 + 142, 112, 176, 56)
cv.text("settings", (selected[2] == 1) ? shadeColor(colors[1], -62.35) : colors[1], res[0]/1.9 + 228, 148, "monospace", "30", "center")

if (selected[2] == 0) {
//load songs
for (let i = 0; i < songdata.length; i++) {
cv.rect(colors[0], res[0]/1.9 + 10, 180+(i*45), (16*songdata[i][0].length)+14, 40)
cv.rect((selected[0] == i) ? colors[0] : shadeColor(colors[0], -62.35), res[0]/1.9 + 12, 182+(i*45), (16*songdata[i][0].length)+10, 36)
cv.text(songdata[i][0], (selected[0] == i) ? shadeColor(colors[0], -62.35) : colors[0], res[0]/1.9 + 17, 208+(i*45), "monospace", "24", "left")
}
} else {
//load settings
cv.text("keybinds", colors[0], res[0]/1.9 + 75, 210, "monospace", "30", "center")
}

//song sidebar
cv.rect(colors[0], -2, 102, res[0]/2.22, res[1]-204)
cv.rect(shadeColor(colors[0], -62.35), -5, 105, res[0]/2.22, res[1]-210)
cv.text(songdata[selected[0]][0], colors[0], 5, 148, "monospace", "40", "left")
cv.text(songdata[selected[0]][1], colors[0], 5, 180, "monospace", "25", "left")

//load song data in it
for (let i = 0; i < songdata[selected[0]][3].length; i++) {
cv.rect(difficultycolors[songdata[selected[0]][3][i] == 0 ? i+6 : i], 5 + (i*113), res[1]*0.7133507853403142, res[0]/14, res[1]/7)
cv.rect((selected[3] != i+1) ? "#000" : difficultycolors[songdata[selected[0]][3][i] == 0 ? i+6 : i], 7.5 + (i*113), res[1]*0.7133507853403142+3, res[0]/14 - 5, res[1]/7 - 5)
cv.text(difficultynames[i], (selected[3] == i+1) ? "#000" : difficultycolors[songdata[selected[0]][3][i] == 0 ? i+6 : i], 60 + (i*113), res[1]*0.7133507853403142+45, "monospace", ((i == 0 || i == 5) ? 20 : 23)*(res[0]/1536), "center")
cv.text(songdata[selected[0]][3][i], (selected[3] == i+1) ? "#000" : difficultycolors[songdata[selected[0]][3][i] == 0 ? i+6 : i], 60 + (i*113), res[1]*0.7133507853403142+80, "monospace", 25*(res[0]/1536), "center")
}
}

//set up controls

function menuSelect(n=0) {
	if (mode == 1) {
		switch (n) {
			case 0:
			if (selected[3] == 0) selected[selected[2]] = Math.min(selected[selected[2]] + 1, [songdata.length-1, 0][selected[2]])
			break;
			case 1:
			if (selected[3] == 0) selected[selected[2]] = Math.max(selected[selected[2]] - 1, 0)
			break;
			case 2:
			if (selected[3] == 0) selected[2] = Math.max(selected[2] - 1, 0)
			else selected[3] = Math.max(selected[3] - 1, 1)
			break;
			case 3:
			if (selected[3] == 0) selected[2] = Math.min(selected[2] + 1, 1)
			else selected[3] = Math.min(selected[3] + 1, 6)
			break;
		}
	if (selected[2] == 0 && n < 2 && selected[3] == 0) {
		soundManager.stopAll()
		let a = songaudios[selected[0]]
		a.play()
		a.position = songdata[selected[0]][4]
		a.volume = (songdata[selected[0]][5]/100)
	}
	sfx[0].play();
	}
}

function menuConfirm(enter=true) {
switch (mode) {
	case 0:
	if (enter) mode = 1;
	sfx[1].play();
	a = songaudios[0]
	a.play()
	a.position = 7292;
	break;
	case 1:
	let sfxplay = 1
	if (selected[3] != 0 && enter) {
		if (songdata[selected[0]][3][selected[3]-1] != 0) {
		canSelect = false;
		fadetomode(2);
		}
		else sfxplay = 0
	}
	if (selected[2] == 0 && selected[3] == 0 && enter) { //enter on song select
		selected[3] = 1;
	}
	if (selected[3] != 0 && !enter) selected[3] = 0;
	sfx[sfxplay].play();
	break;
}
}

//menu controls
Mousetrap.bind("up", ()=>{if(canSelect)menuSelect(1)}, 'keydown');
Mousetrap.bind("down", ()=>{if(canSelect)menuSelect(0)}, 'keydown');

Mousetrap.bind("left", ()=>{if(canSelect)menuSelect(2)}, 'keydown');
Mousetrap.bind("right", ()=>{if(canSelect)menuSelect(3)}, 'keydown');

Mousetrap.bind("enter", ()=>{if(canSelect)menuConfirm(true)}, 'keydown');
Mousetrap.bind("esc", ()=>{if(canSelect)menuConfirm(false)}, 'keydown');