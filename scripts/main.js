var cDate = new Date();
var timefunc = [() => {}, 0, true] //function, time, executed already
var debug = false
var debugval = [0, false]

Mousetrap.addKeycodes({
	144: 'numlock'
})

for (i = 0; i < 1; i++) {
console.log((res[0]/2) - (50*(i-3.5))+4)
}

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
2 = ingame
3 = results
*/

//sound stuff
var sfx = ["menu1", "menu2", "fail"]
var songaudios = ["tutorial", "Boo (NES)", "a"]

function sload() {
//sfx
  sfx[0] = soundManager.createSound({url: "audio/sfx/menu1.wav"});
  sfx[1] = soundManager.createSound({url: "audio/sfx/menu2.wav"});
  sfx[2] = soundManager.createSound({url: "audio/sfx/fail.wav"});
  
//songs
  for (let i = 0; i < songdata.length; i++) {
	  songaudios[i] = soundManager.createSound({url: `audio/songs/${songdata[i][2]}`});
  }
}

//other stuff
let colors = ["#FF0000", "#0080FF", "#A000FF"]
let difficultynames = ["Beginner", "Easy", "Medium", "Hard", "Insane", "Nightmare"]
let difficultycolors = ["#0FF", "#4F0", "#FF0", "#F00", "#F0F", "#999", "#088", "#280", "#880", "#800", "#808", "#444"]

let judgementtext = ["true perfect :O", "perfect :D", "great :P", "good :)", "miss..."]
let judgementcolors = ["#FF8000", "#FFFF00", "#149614", "#0080FF", "#FF0000"]

var fps = 60
var fpsarr = []

let fadetomode = async (m) => {
	for (let j = 0; j < 255; j+=2) {
		await new Promise(r => setTimeout(r, 8));
		ID("blackTop").style.backgroundColor = `#000000${j.toString(16)}`;
	}
	soundManager.stopAll();
	songaudios[selected[0]].pause()
	mode = m;
	for (let j = 255; j > 0; j-=2) {
		await new Promise(r => setTimeout(r, 8));
		ID("blackTop").style.backgroundColor = `#000000${j.toString(16)}`;
	}
	
	if (mode==2) {
		playChart([selected[0], selected[3]])
	}
}

let lastTime = 0;

//draw on the canvas for the game
function update() {
cv.clear();

switch (mode) {
//title
case 0:
cv.text("renos   ", colors[0], res[0]-5, 50, "monospace", "50", "right");
cv.text("R", [colors[0], colors[1]], res[0]-45, 50, "monospace", "50");
cv.text("press enter ", colors[0], res[0]-5, 110, "monospace", "50", "right");

cv.text("t0.1", colors[0], 0, 30, "monospace", "25", "left");
break;

//main menu
case 1:
drawMenu();
break;

//ingame
case 2:
//draw the lanes
for (i = 0; i < 6; i++) {
cv.rect(activeLane == 3 ? colors[2] : colors[Math.floor(i/3)], (res[0]/2)+((54*(i-3.5)))+27, res[1]-94, 54, 94)
cv.rect(shadeColor(activeLane == 3 ? colors[2] : colors[Math.floor(i/3)], keyspressed.includes(i) ? -37.5 : -50), (res[0]/2)+((54*(i-3.5)))+29, res[1]-92, 50, 92)
}

for (n = 0; n < game.currentNotes.length; n++) {
if(!game.currentNotes[n].dead) {
cv.rect(activeLane == 3 ? colors[2] : colors[Math.floor(game.currentNotes[n].lane/3)], (res[0])/2+((54*(game.currentNotes[n].lane-3.5)))+27, res[1] * timeToPosition(performance.now() - game.currentNotes[n].timeMade), 54, 12)
cv.rect(shadeColor(activeLane == 3 ? colors[2] : colors[Math.floor(game.currentNotes[n].lane/3)], -37.5), (res[0])/2+((54*(game.currentNotes[n].lane-3.5)))+29, res[1] * timeToPosition(performance.now() - game.currentNotes[n].timeMade)+2, 50, 8)
}
}

for (n = 0; n < game.currentEvents.length; n++) {
switch (game.currentEvents[n][0]) {
	case "purple":
	cv.rect(colors[2], (res[0])/2+(54*-5.5)+29, res[1] * timeToPosition(performance.now() - game.currentEvents[n][1]), 108, 8)
	cv.rect(colors[2], (res[0])/2+(54*2.5)+29, res[1] * timeToPosition(performance.now() - game.currentEvents[n][1]), 108, 8)
	break;
	case "notpurple":
	cv.rect(colors[0], (res[0])/2+(54*-5.5)+29, res[1] * timeToPosition(performance.now() - game.currentEvents[n][1]), 108, 8)
	cv.rect(colors[1], (res[0])/2+(54*2.5)+29, res[1] * timeToPosition(performance.now() - game.currentEvents[n][1]), 108, 8)
	break;
}
}

//judgements
cv.text(game.combo[0], `${game.resultColors()[1]}80`, res[0]/2, res[1]*0.42, "monospace", "50", "center")
if (game.combo[0] >= game.combo[1]) game.combo[1] = game.combo[0]
cv.text(game.currentJudgement == 0 ? "" : judgementtext[game.currentJudgement-1], game.currentJudgement == 0 ? "#000" : judgementcolors[game.currentJudgement-1], res[0]/2, res[1]*0.34, "monospace", "30", "center")

if (activeLane != 3) cv.rect("#00000080", (res[0]/2)*(3 - activeLane-1), 0, res[0]/2, res[1]) //cover half of the screen based on the activeLane


cv.text(songdata[selected[0]][0], "#80808080", res[0]/2, 22, "monospace", "20", "center")
cv.text(difficultynames[selected[3]-1], "#80808080", res[0]/2, 47, "monospace", "20", "center")
cv.text(mods.songSpeed == 1 ? "" : `[${mods.songSpeed}x]`, "#80808080", res[0]/2, 72, "monospace", "20", "center")

cv.text((Math.floor(game.score()*mods.getScoreMult())), colors[0], res[0]-10, 45, "monospace", "50", "right")

let sp = ((((game.score()-game.judgements[0]*8.5)+game.judgements[4]*10) / (150*game.notes())) * 100).toFixed(2)
cv.text(`${isNaN(sp) ? '0.00' : sp}%`, game.resultColors(sp)[0], res[0]-10, 100, "monospace", "50", "right")

jg = game.judgements
for (jd = 0; jd < 5; jd++) {
cv.rect(`${judgementcolors[jd]}80`, 0, 22*jd, (jg[jd] / game.notes())*300, 22)
cv.text(jg[jd], shadeColor(judgementcolors[jd], 50), 3, 16+(22*jd), "monospace", "16", "left", false)
}

break;

//ooga booga
default:
cv.text("hello! if you are seeing this, then this means that the game has entered a mode that doesn't currently exist :P", ["#FFA000", colors[1]], res[0]/2, res[1]/2)
break;
}

fps = 1000/(performance.now() - lastTime)
lastTime = performance.now()

fpsarr.push(fps)

cv.rect("#00000080", 0, res[1]-82, 160, 500)
cv.text(`${((fpsarr.reduce((sum, a) => sum + a, 0))/fpsarr.length).toFixed(1)}avgfps`, "#FF000080", 0, res[1]-62, "monospace", "25", "left")
cv.text(`${Math.round(fps)}fps`, "#FF000080", 0, res[1]-35, "monospace", "25", "left")
cv.text(`t0.1`, "#FF000080", 0, res[1]-8, "monospace", "25", "left")


cv.text(mods.autoplay ? `autoplay${debugval[1] ? ' - with hitsounds' : ''}` : ``, "#0080FF80", res[0], res[1]-89, "monospace", "25", "right")

//debug stuff
if (debug) {
//cv.text(debugval[1] ? `hitsounds` : ``, "#00FF0080", res[0], res[1]-116, "monospace", "25", "right")
cv.text(`${keyspressed}`, "#FF000080", res[0], res[1]-116, "monospace", "30", "right")
cv.text(`${game.currentNotes}`, "#FF000080", res[0], res[1]-89, "monospace", "15", "right")
cv.text(debugval[0] >= 1 ? `${Math.round(debugval[0])}ms` : `${Math.round(debugval[0]*1000)}μs`, "#FF000080", res[0], res[1]-62, "monospace", "25", "right")
cv.text(`event:${Math.round(timefunc[1] - performance.now()).toString().padStart(7)}ms`, "#FF000080", res[0], res[1]-35, "monospace", "25", "right")
cv.text(`total:${Math.round(performance.now()).toString().padStart(7)}ms`, "#FF000080", res[0], res[1]-8, "monospace", "25", "right")
}

window.requestAnimationFrame(update)
}

//updatePrec
function updatePrec() {
if (performance.now() >= timefunc[1] && !timefunc[2]) {timefunc[0](); timefunc[2] = true;}

//check for notes
if (game.noteQueue.length >= 1) {
ft = game.noteQueue[0][1]
while (game.noteQueue.length >= 1 && game.noteQueue[0][1] == ft && performance.now()-game.timeStarted >= ft) {summonNote(game.noteQueue[0][0][0]-1, game.noteQueue[0][0][1]); game.noteQueue.shift()}
}

for (let b = 0; b < game.currentNotes.length; b++) {
	if (game.currentNotes[b].dead) setTimeout(game.currentNotes.shift, 50)
}

if (mods.autoplay && game.currentNotes.length >= 1) {
	let icnn = 0;
	for (icnn = 0; icnn < game.currentNotes.length - 1 && game.currentNotes[icnn].dead; icnn++) {
		{};
	}
	activeLane = activeLane == 3 ? 3 : 1+Math.floor(game.currentNotes[icnn].lane/3)
	if (Math.abs(performance.now() - game.currentNotes[icnn].timeMade) >= 1000/*+(Math.random()*200)-22*/) {
		//game.currentNotes[0].hit(); 
		
		hitNote(game.currentNotes[icnn].lane)
		
		if(debugval[1]) sfx[1].play()}
}


//check for events
if (game.eventQueue.length >= 1) {
fte = game.eventQueue[0][1]
while (game.eventQueue.length >= 1 && game.eventQueue[0][1] == fte && performance.now()-game.timeStarted >= fte) {game.currentEvents.push([game.eventQueue[0][0], performance.now()]); game.eventQueue.shift()}
}

if (game.currentEvents.length >= 1) {
	if (Math.abs(performance.now() - game.currentEvents[0][1]) >= 1000) {
		switch (game.currentEvents[0][0]) {
			case "purple":
			activeLane = 3
			break;
			
			case "notpurple":
			activeLane = 1+Math.floor(game.currentNotes[0].lane/3)
			break;
		}
	game.currentEvents.shift()
	}
}

}

//key stuff
let controls = ["a", "s", "d", "j", "k", "l", "c", "n"]
let keyspressed = []


//game stuff
let activeLane = 1

let mods = {
	scrollSpeed: 1,
	songSpeed: 1,
	truePerfect: false,
	keymods: [false, false], //auto-switch, 4k
	hitWindowMult: 1,
	autoplay: false,
	getScoreMult: () => {
	let mult = []
	let base = 1
	mult.push((mods.songSpeed >= 1) ? 1 + ((mods.songSpeed/1.5)-2/3) : 1.2*mods.songSpeed-0.2)
	mult.push((1/mods.hitWindowMult >= 1) ? 1 + (((1/mods.hitWindowMult)/2)-0.5) : 1.15*(1/mods.hitWindowMult)-0.15)
	mult.push(mods.keymods[0] ? 0.5 : 1)
	mult.push(mods.keymods[1] ? 0.6 : 1)
	for (m = 0; m < mult.length; m++) {
		base *= mult[m]
	}
	return base
	}
}

let game = {
	timeStarted: 0,
	noteQueue: [],
	eventQueue: [],
	currentNotes: [],
	currentEvents: [],
	combo: [0, 0], //combo, max combo
	judgements: [0, 0, 0, 0, 0], //:O, :D, :P, :), :( | TP, P, Gr, Gd, M
	score: () => { return game.judgements[0]*160 + game.judgements[1]*150 + game.judgements[2]*100 + game.judgements[3]*50 + game.judgements[4]*-10 },
	notes: () => {
		let nc = 0;
		for (l = 0; l < game.judgements.length; l++) {
			nc += game.judgements[l]
		}
		return nc
	},
	resultColors: (acc) => {
		let resulty = ["#FF0000", "#808080"]
		
		let gradeColors = ["#B30000", "#CC0000", "#E60000", "#FF0000", "#FF004D", "#FF00C3", "#CC00FF", "#2A00FF", "#004CFF", "#00AAFF", "#00FFFF", "#00FFD0", "#00FF5E", "#00FF0D", "#40FF00", "#80FF00", "#AAFF00", "#D4FF00", "#FFFF00", "#FFD500", "#FFAA00", "#FF8000", "#808080"]
		let gradeValues = [0,         52,        58,        60,        62,        68,        70,        72,        78,        80,        82,        88,        90,        91,        94,        95,        96,        99,        100,       100.2,     100.8,     101,       Infinity]
		for (gc = 0; gc < gradeValues.length; gc++) {
			if (acc >= gradeValues[gc] && acc < gradeValues[gc+1]) {resulty[0] = gradeColors[gc]; break;}
		}
		
		let comboColors = ["#A05000", "#A0A000", "#18A018", "#A0A0A0", "#808080"]
		let cc = 4
		switch (game.clearStatus()) {
			case "TPFC":
			cc = 0
			break;
			
			case "PFC":
			cc = 1
			break;
			
			case "GFC":
			cc = 2
			break;
			
			case "C":
			if (game.combo[0] == game.combo[1]) cc = 3
			else cc = 4
			break;
		}
		
		resulty[1] = comboColors[cc]
		
		return resulty
	},
	clearStatus: () => {
		jg = game.judgements
		if (jg[0]+jg[1]+jg[2]+jg[3]+jg[4] == 0) return "C"
		if (jg[0] >= 1 && jg[1]+jg[2]+jg[3]+jg[4] == 0) return "TPFC"
		if (jg[0]+jg[1] >= 1 && jg[2]+[3]+jg[4] == 0) return "PFC"
		if (jg[0]+jg[1]+jg[2] >= 1 && jg[3]+jg[4] == 0) return "GFC"
		if (jg[4]>=1) return "C"
	},
	timings: () => { return (selected[3] >= 3 ? [15, 30, 60, 90, 120] : [25, 50, 100, 140, 180]).map(item => item*mods.hitWindowMult) },
	currentJudgement: 0,
}

let timeToPosition = (n) => {return (94/res[1]*-1) + (n / (1/mods.scrollSpeed*1000)) + (1 - mods.scrollSpeed)}

class note {
	constructor(lane, timeMade) {
		this.lane = lane;
		this.timeMade = timeMade;
		this.j = 0; //for the hit
		this.dead = false;
		this.init = () => {if (performance.now() - this.timeMade >= 1000+game.timings()[4] && !this.dead) {console.log("bye"); game.combo[0] = 0; game.currentJudgement = 5; game.judgements[4] += 1; this.dead = true; clearInterval(this.initer);}};
		this.initer = setInterval(this.init, 1)
		this.hit = () => {
			let ptm = Math.abs((performance.now() - this.timeMade) - 1000);
			debugval[0] = ptm
			for (this.jd = 0; this.jd < 5; this.jd++) {
				if (ptm <= game.timings()[this.jd]) {clearInterval(this.initer); console.log("hi"); game.combo[0] = (this.jd == 4 ? 0 : game.combo[0]+=1); game.currentJudgement = this.jd+1; game.judgements[this.jd] += 1; this.dead = true; this.init(); break;}
			}
		}
	}
}

function summonNote(n, hl=0) {
	game.currentNotes.push(new note(n, performance.now()))
}

function playChart() {
	game.timeStarted = performance.now()
	betterTimeout(() => {
		songaudios[selected[0]].playbackRate = Math.max(Math.min(mods.songSpeed, 10), 0.25);
		songaudios[selected[0]].currentTime = 0;
		songaudios[selected[0]].play();
	}, 4000+songdata[selected[0]][6][1])
	//console.log(chartdata[selected[0]][selected[3]-1])
	/console.log(chartdata[selected[0]][selected[3]-1].length)
	curbpm = songdata[selected[0]][6][0] * mods.songSpeed
	for (c = 0; c < chartdata[selected[0]][selected[3]-1].length; c++) {
		qn = chartdata[selected[0]][selected[3]-1][c]
		//console.log(qn)
		if (typeof qn == "number") {
			if (!(qn < 1 || qn > 6)) game.noteQueue.push([[qn, 0], 3000+((60/curbpm)*(1000*c))])
		}
		if (typeof qn == "object") {
			for (qqn = 0; qqn < qn.length; qqn++) {
				if (typeof qn[qqn] == "number") game.noteQueue.push([[qn[qqn], 0], 3000+((60/curbpm)*(1000*c))])
				if (typeof qn[qqn] == "string") {
					if (!/h/i.test(qn[qqn])) game.eventQueue.push([qn[qqn], 3000+((60/curbpm)*(1000*c))])
				}
			}
		}
	}
	//console.log(chartdata[selected[0]][selected[3]-1])
}

function hitNote(la) {
	for (let p = 0; p < game.currentNotes.length; p++) {
		if (game.currentNotes[p].lane == la /*Math.abs(performance.now() - game.currentNotes[p].timeMade) < 1000+game.timings()[4]*/ && !game.currentNotes[p].dead) {game.currentNotes[p].hit(); break;}
	}
}

let controlSetter = {
	controlSet: () => {
		for (k = 0; k < 6; k++) {controlSetter.controlSet2(k)}
	Mousetrap.bind(controls[6], function() {if (activeLane != 1 && activeLane != 3 && mode == 2) activeLane = 1}, "keydown")
	Mousetrap.bind(controls[7], function() {if (activeLane != 2 && activeLane != 3 && mode == 2) activeLane = 2}, "keydown")
	},
	controlSet2: (a) => {
		Mousetrap.bind(controls[a], function() {if (!keyspressed.includes(a) && activeLane != 2-Math.floor(a/3)) {hitNote(a); keyspressed.push(a);}}, 'keydown');
		Mousetrap.bind(controls[a], function() {if (keyspressed.includes(a)) keyspressed.splice(keyspressed.indexOf(a), 1)}, 'keyup');
	}
}

controlSetter.controlSet()


function betterTimeout(func, ms) {
	if (typeof func != "function") console.warn("the first value needs to be a function")
	else {
		timefunc[0] = func;
		timefunc[1] = performance.now() + ms;
		timefunc[2] = false;
	}
}

Mousetrap.bind("shift+numlock", function() {debug = !debug; sfx[0].play()})
Mousetrap.bind("shift+/", function() {mods.autoplay = !mods.autoplay; sfx[1].play()})
Mousetrap.bind("shift+*", function() {debugval[1] = !debugval[1]})

window.requestAnimationFrame(update)
setInterval(updatePrec, 1)