

//////////////////////////////////////////////////////////////////// BSE ///////////////



var bse_sys_minprice;  // minimum price in the system, in cents/pennies
var bse_sys_maxprice;  // maximum price in the system, in cents/pennies
var ticksize;  // minimum change in price, in cents/pennies

var lob_data = [];
var lob_data_less;
var lob_data_more;

var computeLOB;


//////////////////////////////////////////////////////////////////// GUI ///////////////

var theme;
var C;
var distanceToCenter;
var edgeToCenter;
var gradientFactor;

var titleStyle;

var headerHeight;

var sidebarRightOutWidth;
var sidebarRightWidth;
var sidebarRightWidthDrag;
var sidebarRightDragOn;

var tabNames;
var tabs;
var tabOut;
var sections;
var checks;
var slides;
var radios;

var hovering;

var pattern;

var scrollBarHover;
var scrollBarDrag;

var fonts;

var graphPosRelative;
var graphWidth;
var graphCenterPos;

var lob; // LIMIT ORDER BOOK
var lobGroup;
var lobCum;
var maxCFofAll
var workingWidth;
var workingHeight;
var lobTopPos;
var lobHeight;

var TimeProgress;
var prevTimeProgress;
var playTime;
var grabTimeCircle;

var lobGraphNums;
var inputLobGraphNums;

var marketValue;

var fullLOB;

var traderNames;
var trader_types;
var traderNumOptions;
var timestepOptions;
var stepModes;
var timeModes;
var playBackSpeeds;
var playBackSpeed;

////////////////////////// This code should work for fonts when on server, but not local as CORS error...

// let lato100, lato300, lato400;


function setup() {
	
/*
	lato100 = loadFont('https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHh30AXC-qNiXg7Q.woff2');
    lato300 = loadFont('https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh7USSwiPGQ3q5d0.woff2');
    lato400 = loadFont('https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wXiWtFCc.woff2');
	
	
*/

	//////////////////////////////////////////////////////////////////// BSE ///////////////
	
	bse_sys_minprice = 50;  // minimum price in the system, in cents/pennies
	bse_sys_maxprice = 150;  // maximum price in the system, in cents/pennies
	ticksize = 1;  // minimum change in price, in cents/pennies
	
	//////////////////////////////////////////////////////////////////// GUI ///////////////
	
	W = window.innerWidth;
	H = window.innerHeight;
	
	frameRate(30);
	
	angleMode(DEGREES);
	
	theme = 'Dark';
	
	C = [
	    {r:4, g:12, b:20},
	    {r:11, g:21, b:30},
	    {r:21, g:31, b:39},
	    {r:46, g:55, b:63},
	    {r:64, g:76, b:87},
	    {r:129, g:143, b:155},
	    {r:164, g:176, b:186},
	    {r:201, g:206, b:209},
	    {r:225, g:229, b:232},
	    {r:245, g:248, b:250}
	];
	
	
	if (theme==='Light'){
		var C2=[];
		for (var c=C.length-1; c>=0; c-=1){
			C2.push(C[c]);
		}
		C = C2;
	}
	
	distanceToCenter = 0;
	edgeToCenter = 0;
	
	if (H<600){
        headerHeight = 60;
    } else {
        headerHeight = H/10;
    }
    
    titleStyle = 0;
    
    graphPosRelative = true;
	
	sidebarRightOutWidth = 165;
	sidebarWidthDrag = false;
	sidebarRightDragOn = false;
	
	tabNames = {'R U N':0,'Buyers':1,'Sellers':2,'Config':3,'Display':4,'Graphs':5,'R E S E T':6};
	tabOut = 1;
	tabs = [];
	for (var TAB=0; TAB<Object.keys(tabNames).length; TAB+=1){
		tabs.push(new Tab(Object.keys(tabNames)[TAB]));
	}
	sections = [];
	checks = [];
	slides = [];
	radios = [];
	
	scrollBarDrag = false;
	
	traderNames = ['Giveaway','ZIC','Shaver','Sniper','ZIP'];
	trader_types = ['GVWY','ZIC','SHVR','SNPR','ZIP'];
	traderNumOptions = [10,30,50,100,200,300];
	timestepOptions = [10,30,50,100,200];
	stepModes = ['fixed','jittered','random'];
	timeModes = ['drip-fixed', 'drip-jitter'];
	playBackSpeeds = [0.50,0.75,1.00,1.25,1.50];
	playBackSpeed = 1;
	
	for (var tab=0; tab<tabs.length; tab+=1){
		checks.push([]);
		slides.push([]);
		radios.push([]);
		switch (tab){
			case 1:
				radios[tab].push([]);
				for (var radio=0; radio<traderNumOptions.length; radio+=1){
					radios[tab][0].push(new Radio(traderNumOptions[radio],tab,radio===2));
				}

				slides[tab].push([]);
				for (var slide=0; slide<traderNames.length; slide+=1){
					slides[tab][0].push(new Slide(traderNames[slide],tab,1));
				}
				break;
			case 2:
				radios[tab].push([]);
				for (var radio=0; radio<traderNumOptions.length; radio+=1){
					radios[tab][0].push(new Radio(traderNumOptions[radio],tab,radio===2));
				}
				
				slides[tab].push([]);
				for (var slide=0; slide<traderNames.length; slide+=1){
					slides[tab][0].push(new Slide(traderNames[slide],tab,1));
				}
				break;
			case 3:
				radios[tab].push([]);
				for (var radio=0; radio<timestepOptions.length; radio+=1){
					radios[tab][0].push(new Radio(timestepOptions[radio],tab,radio===2));
				}
				
				slides[tab].push([]);
				slides[tab][0].push(new Slide('High Bid',tab,150));
				slides[tab][0].push(new Slide('Low Ask',tab,50));
				
				radios[tab].push([]);
				for (var radio=0; radio<stepModes.length; radio+=1){
					radios[tab][1].push(new Radio(stepModes[radio],tab,stepModes[radio]==='fixed'));
				}
				
				radios[tab].push([]);
				for (var radio=0; radio<timeModes.length; radio+=1){
					radios[tab][2].push(new Radio(timeModes[radio],tab,timeModes[radio]==='drip-fixed'));
				}
				
				slides[tab].push([]);
				slides[tab][1].push(new Slide('Interval',tab,20));
				
				break;
			case 4:
				radios[tab].push([]);
				for (var radio=0; radio<2; radio+=1){
					if (!radio){radios[tab][0].push(new Radio("Filled ",tab,true));}
					else {radios[tab][0].push(new Radio("Border ",tab,false));}
				}
				radios[tab].push([]);
				for (var radio=0; radio<2; radio+=1){
					if (!radio){radios[tab][1].push(new Radio("Landscape ",tab,true));}
					else {radios[tab][1].push(new Radio("Portrait ",tab,false));}
				}
				radios[tab].push([]);
				for (var radio=0; radio<2; radio+=1){
					if (!radio){radios[tab][2].push(new Radio("Smooth ",tab,false));}
					else {radios[tab][2].push(new Radio("Stepped ",tab,true));}
				}
				checks[tab].push([]);
				checks[tab][0].push(new Check("Price Point ", tab,true));
				
				checks[tab].push([]);
				checks[tab][1].push(new Check("Variable X ", tab,false));
				checks[tab][1].push(new Check("Variable Y ", tab,false));
				
				radios[tab].push([]);
				for (var radio=0; radio<playBackSpeeds.length; radio+=1){//playBackSpeeds
					radios[tab][3].push(new Radio("x "+str(playBackSpeeds[radio]),tab, playBackSpeeds[radio]===1));
				}
				
				break;
			case 5:
				radios[tab].push([]);
				radios[tab][0].push(new Radio("LOB -",tab,false));
				radios[tab][0].push(new Radio("LOB +",tab,true));
				break;
		}
	}
	
	sections = [
		[],
		[new Section(1,'N°  Buyers:',0,radios),new Section(1,'Buyer Ratios:',0,slides)],
		[new Section(2,'N°  Sellers:',0,radios),new Section(2,'Seller Ratios:',0,slides)],
		[new Section(3,'Timesteps:',0,radios),new Section(3,'Ranges:',0,slides),new Section(3,'Stepmodes:',1,radios),new Section(3,'Timemodes:',2,radios),new Section(3,'Replenishment:',1,slides)],
		[new Section(4,'Colour:',0,radios),new Section(4,'Orientation:',1,radios),new Section(4,'Style:',2,radios),new Section(4,'LOB Controls:',0,checks),new Section(4,'Axes:',1,checks),new Section(4,'Playback Speed:',3,radios)],
		[new Section(5,'Graph Type:',0,radios)],
		[]
	];
	
	lob = [];
	lobCum = [];
	marketValue = [];
	maxCFofAll = 0;
	
	hovering = false;
	
	lobGraphNums = 50;
	inputLobGraphNums = lobGraphNums;
	
	TimeProgress = lobGraphNums/2;
	prevTimeProgress = TimeProgress;
	playTime = false;
	grabTimeCircle = false;
	
	canvas = createCanvas(W, H);
  
	cursor('default');
	
	
	//// FONTS WHEN ON SERVER:
	// 	fonts = [oslight,osmedium];
	
	
	// FONTS WHEN NOT ON SERVER
// 	fonts = ['AvenirNext-Regular','AvenirNext-Medium','AvenirNext-UltraLight','AvenirNext-Regular'];
	fonts = ['Lato-Light','Lato-Regular','Lato-Hairline','Lato-Light'];
// 	fonts = [lato300,lato400,lato100,lato300];
// 	fonts = ['Lato','Lato','Lato','Lato'];
	
	textFont(fonts[0]);
	
// 	print(textFont(fonts[0]));
	
	createBackgroundPattern();
	
	updateSidebarWidth();
    defineWorkingScreenProperties();
	select('#CopyrightWrapper').style('width',str(workingWidth)+'px');
	
// 	drawGUI();
	
	
	background(C[0].r, C[0].g, C[0].b);
	
	computeLOB = false;
	
	fullLOB = experimentSetUp(lobGraphNums);
// 	print(fullLOB)
	
// 	initLOB(fullLOB);
	processLOBDATA(fullLOB);
	
	if (!window.chrome){
		alert('BROWSER_ALERT: please switch to Google Chrome\n\nSorry! This web app needs Chrome to function correctly...');
	}
	
// 	print(fullLOB);
}
