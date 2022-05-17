var cDate = new Date();

//console greets you :D
console.log(`hi :D
you seem to have the console open... only use it for testing purposes, please.
have a nice ${(cDate.getHours() >= 6 && cDate.getHours() < 18) ? "day" : "night"} :)`);

//setting the canvas resolution (2)
ID("gameCanvas").width = res[0];
ID("gameCanvas").height = res[1];

//menu stuff
let selected = [0, 0, 0, 0] //songs, settings, tabs, difficulty (0 is not selected song)
let mode = 0
let canSelect = true
/*
0 = title
1 = main menu
*/

//sound stuff
var sfx = ["menu1", "menu2", "fail"]
var songaudios = ["tutorial", "Boo (NES)", "a"]

function sload() {
//sfx
  createjs.Sound.registerSound("audio/sfx/menu1.wav", sfx[0]);
  createjs.Sound.registerSound("audio/sfx/menu2.wav", sfx[1]);
  createjs.Sound.registerSound("audio/sfx/fail.mp3",  sfx[2]);
  
//songs
  for (let i = 0; i < songdata.length; i++) {
	  createjs.Sound.registerSound(`audio/songs/${songdata[i][2]}`, songaudios[i])
	  //console.log(songdata[i][2])
  }
}

//other stuff
let colors = ["#FF0000", "#00A0FF", "#A000FF"]
let darkcolors = ["#600000", "#004A60", "#4A0060"]
let difficultynames = ["Beginner", "Easy", "Medium", "Hard", "Insane", "Nightmare"]
let difficultycolors = ["#0FF", "#4F0", "#FF0", "#F00", "#F0F", "#999", "#088", "#280", "#880", "#800", "#808", "#444"]
let controls = ["a", "s", "d", "j", "k", "l", "c", "n"]
let keyspressed = []

var fps = 60

let fadetomode = async (m) => {
	for (let j = 0; j < 255; j++) {
		await new Promise(r => setTimeout(r, 8));
		ID("blackTop").style.backgroundColor = `#000000${j.toString(16)}`;
	}
	createjs.Sound.stop();
	mode = m;
	for (let j = 255; j > 0; j--) {
		await new Promise(r => setTimeout(r, 8));
		ID("blackTop").style.backgroundColor = `#000000${j.toString(16)}`;
	}
}

//draw on the canvas for the game
function draw() {
cv.clear();


switch (mode) {
	
//title
case 0:
cv.text("renos   ", colors[0], res[0]-5, 50, "monospace", "50", "right");
cv.text("R", [colors[0], colors[1]], res[0]-45, 50, "monospace", "50");
cv.text("press enter ", colors[0], res[0]-5, 110, "monospace", "50", "right");

cv.text("t0.0.1", colors[0], 0, 30, "monospace", "25", "left");
break;

//main menu
case 1:
cv.rect(colors[0], res[0]/1.9 + 2, 102, 1000, res[1]-204)
cv.rect(darkcolors[0], res[0]/1.9 + 5, 105, 1000, res[1]-210)

cv.rect(colors[0], res[0]/1.9 + 10, 110, 125, 60)
cv.rect((selected[2] == 0) ? colors[0] : darkcolors[0], res[0]/1.9 + 12, 112, 121, 56)
cv.text("songs", (selected[2] == 0) ? darkcolors[0] : colors[0], res[0]/1.9 + 70, 148, "monospace", "30", "center")

cv.rect(colors[1], res[0]/1.9 + 140, 110, 180, 60)
cv.rect((selected[2] == 1) ? colors[1] : darkcolors[1], res[0]/1.9 + 142, 112, 176, 56)
cv.text("settings", (selected[2] == 1) ? darkcolors[1] : colors[1], res[0]/1.9 + 228, 148, "monospace", "30", "center")

if (selected[2] == 0) {
//load songs
for (let i = 0; i < songdata.length; i++) {
cv.rect(colors[0], res[0]/1.9 + 10, 180+(i*45), (16*songdata[i][0].length)+14, 40)
cv.rect((selected[0] == i) ? colors[0] : darkcolors[0], res[0]/1.9 + 12, 182+(i*45), (16*songdata[i][0].length)+10, 36)
cv.text(songdata[i][0], (selected[0] == i) ? darkcolors[0] : colors[0], res[0]/1.9 + 17, 208+(i*45), "monospace", "24", "left")
}
} else {
//load settings
cv.text("keybinds", colors[0], res[0]/1.9 + 75, 210, "monospace", "30", "center")
}

//song sidebar
cv.rect(colors[0], -2, 102, res[0]/2.22, res[1]-204)
cv.rect(darkcolors[0], -5, 105, res[0]/2.22, res[1]-210)
cv.text(songdata[selected[0]][0], colors[0], 5, 148, "monospace", "40", "left")
cv.text(songdata[selected[0]][1], colors[0], 5, 180, "monospace", "25", "left")

//load song data in it
for (let i = 0; i < songdata[selected[0]][3].length; i++) {
cv.rect(difficultycolors[songdata[selected[0]][3][i] == 0 ? i+6 : i], 5 + (i*113), 545, res[0]/14, res[1]/7)
cv.rect((selected[3] != i+1) ? "#000" : difficultycolors[songdata[selected[0]][3][i] == 0 ? i+6 : i], 7.5 + (i*113), 548, res[0]/14 - 5, res[1]/7 - 5)
cv.text(difficultynames[i], (selected[3] == i+1) ? "#000" : difficultycolors[songdata[selected[0]][3][i] == 0 ? i+6 : i], 60 + (i*113), 590, "monospace", (i == 0 || i == 5) ? "20" : "23", "center")
cv.text(songdata[selected[0]][3][i], (selected[3] == i+1) ? "#000" : difficultycolors[songdata[selected[0]][3][i] == 0 ? i+6 : i], 60 + (i*113), 625, "monospace", "25", "center")

}

break;

//ooga booga
default:
cv.text("hello! if you are seeing this, then this means that the game has entered a mode that doesn't currently exist :P", ["#FFA000", colors[1]], res[0]/2, res[1]/2)
break;
}
}

//set up controls
function controlSet() {
Mousetrap.bind(controls[0], function() {if (!keyspressed.includes(1)) {keyspressed.push(1);}}, 'keydown');
Mousetrap.bind(controls[0], function() {keyspressed.splice(keyspressed.indexOf(1), 1)}, 'keyup');
}

function menuSelect(n=0) {
	if (mode == 1) {
		switch (n) {
			case 0:
			if (selected[3] == 0) selected[selected[2]] = Math.min(selected[selected[2]] + 1, [2, 0][selected[2]])
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
		createjs.Sound.stop()
		let a = createjs.Sound.play(songaudios[selected[0]])
		a.position = songdata[selected[0]][4]
		a.volume = a.volume * (songdata[selected[0]][5]/100)
	}
	createjs.Sound.play(sfx[0]);
	}
}

function menuConfirm(enter=true) {
switch (mode) {
	case 0:
	if (enter) mode = 1;
	createjs.Sound.play(sfx[1]);
	a = createjs.Sound.play(songaudios[0]);
	a.position = 7711;
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
	createjs.Sound.play(sfx[sfxplay]);
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


setInterval(draw, 1/60)