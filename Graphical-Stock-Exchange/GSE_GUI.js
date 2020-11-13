
class Tab {
  	constructor(name) {
	    this.name = name;
	    this.out = tabOut===tabNames[this.name];
	    this.hover = false;
	    this.contentHeight = false;
	    this.scroll = 0;
	    this.scrollBar = false;
  	}

  	display(Width,Y,Height,OUT) {
	  	strokeWeight(1);
		if (mouseX<W-sidebarRightWidth && mouseX>W-Width-sidebarRightWidth && mouseY<Y+Height+(mouseX-W+sidebarRightWidth)*(Height/6)/Width && mouseY>Y-(mouseX-W+sidebarRightWidth)*(Height/6)/Width){
		    this.hover = true;
		    hovering = true;
		}
		
		if (OUT){
			fill(C[2].r, C[2].g, C[2].b);
		} else {
			if (this.hover){
				fill(C[1].r, C[1].g, C[1].b);
			}
			else {
				fill(C[0].r, C[0].g, C[0].b);
			}
		}
		if (this.name === 'Buyers'){
			stroke(84, 184, 94,200);
		} else if (this.name === 'Sellers'){
			stroke(181, 81, 78,200);
		} else {
			stroke(C[5].r, C[5].g, C[5].b,200);
		}
		
		if (this.name === 'R E S E T'){
			stroke(158, 203, 230,200);
			fill(33, 55, 69);
		} 
		beginShape();
		vertex(W-sidebarRightWidth,Y);
		vertex(W-Width-sidebarRightWidth,Y+Height/6);
		vertex(W-Width-sidebarRightWidth,Y+5*Height/6);
		vertex(W-sidebarRightWidth,Y+Height);
		endShape();
		
		if (this.name === 'R U N' || this.name === ' R U N '){
			
			noStroke();
			fill(214, 121, 118,85);
			beginShape();
			vertex(W-sidebarRightWidth,Y+Height/2+Height/12);
			vertex(W-sidebarRightWidth,Y);
			vertex(W-Width-sidebarRightWidth,Y+Height/6);
			vertex(W-Width-sidebarRightWidth,Y+Height/2-Height/12);
			endShape();
			stroke(181, 81, 78,200);
			line(W-Width-sidebarRightWidth,Y+Height/2+Height/12,W-Width-sidebarRightWidth,Y+Height/6);
			line(W-Width-sidebarRightWidth,Y+Height/6,W-sidebarRightWidth,Y);
			noStroke();
			fill(113, 209, 122,85);
			beginShape();
			vertex(W-Width-sidebarRightWidth,Y+Height/2-Height/12);
			vertex(W-Width-sidebarRightWidth,Y+5*Height/6);
			vertex(W-sidebarRightWidth,Y+Height);
			vertex(W-sidebarRightWidth,Y+Height/2+Height/12);
			endShape();
			stroke(84, 184, 94,200);
			line(W-Width-sidebarRightWidth,Y+Height/2-Height/12,W-Width-sidebarRightWidth,Y+5*Height/6);
			line(W-Width-sidebarRightWidth,Y+5*Height/6,W-sidebarRightWidth,Y+Height);

		}
		noStroke();
		textFont(fonts[0],15);
		var tW = textWidth(this.name);
		if (tW>Height/2){
		    textSize(15*(Height/2)/tW);
		}  
		push();
		textAlign(CENTER,CENTER);
		
		if (OUT || this.hover){
			fill(C[7].r, C[7].g, C[7].b);
		} else {
			fill(C[6].r, C[6].g, C[6].b);
		}
		if (this.name === 'R E S E T' || this.name === 'R U N' || this.name === ' R U N '){
			fill(C[7].r, C[7].g, C[7].b);
		}
		if (this.name === ' R U N '){
			stroke(C[7].r, C[7].g, C[7].b);
		}
		
		translate(W-7*Width/16-sidebarRightWidth,Y+Height/2);
		rotate(-90);
		text(this.name,0,0);
		pop();
	}
}

class Check {
  	constructor(name,parent,checked) {
	    this.name = name;
	    this.parent = parent;
	    this.hover = false;
	    this.checked = checked;
  	}

  	display(X,Y) {
		rectMode(CENTER);
		noFill();
		strokeWeight(1);
		stroke(C[7].r, C[7].g, C[7].b);
		rect(X,Y,10,10);
		fill(C[5].r, C[5].g, C[5].b);
		noStroke();
		textAlign(LEFT,CENTER);
		textFont(fonts[0],15);
		text(this.name,X+20,Y);
		rectMode(CORNER);
		if (this.checked){
			stroke(C[7].r, C[7].g, C[7].b);
			line(X-4,Y-4,X+4,Y+4);
			line(X-4,Y+4,X+4,Y-4);
		}
		if (mouseX>X-5 && mouseX<X+20+textWidth(this.name) && mouseY>Y-10 && mouseY<Y+10){
			this.hover = true;
			hovering = true;
		}
	}
}

class Slide {
  	constructor(name,parent,value,hoverL,hoverR) {
	    this.name = name;
	    this.parent = parent;
	    this.hover = false;
	    this.value = value;
	    this.hoverL = hoverL;
	    this.hoverR = hoverR;
  	}
  	
  	display(X,Y) {
	  	if (mouseX>X-25 && mouseX<X+20+textWidth(str(this.value))+textWidth(this.name)+5 && mouseY>Y-10 && mouseY<Y+10){
			this.hover = true;
			hovering = true;
			if (mouseX<X){
				this.hoverL = true;
			} else {
				this.hoverR = true;
			}
		}

		strokeWeight(1);
		if (this.value){
			stroke(C[5].r, C[5].g, C[5].b);
			if (this.hoverL){
				stroke(C[7].r, C[7].g, C[7].b);
			}
		} else {
			stroke(C[4].r, C[4].g, C[4].b);
		}
		line(X-10-textWidth(str(this.value))/2,Y,X-5-textWidth(str(this.value))/2,Y-5);
		line(X-10-textWidth(str(this.value))/2,Y,X-5-textWidth(str(this.value))/2,Y+5);
		if (this.hoverR){
			stroke(C[7].r, C[7].g, C[7].b);
		} else {
			stroke(C[5].r, C[5].g, C[5].b);
		}
		line(X+10+textWidth(str(this.value))/2,Y,X+5+textWidth(str(this.value))/2,Y-5);
		line(X+10+textWidth(str(this.value))/2,Y,X+5+textWidth(str(this.value))/2,Y+5);
		fill(C[5].r, C[5].g, C[5].b);
		noStroke();
		textFont(fonts[0],15);
		textAlign(CENTER,CENTER);
		text(this.value,X,Y);
		textAlign(LEFT,CENTER);
		textFont(fonts[0],15);
		text(this.name,X+20+textWidth(str(this.value))/2,Y);
		rectMode(CORNER);
	}
}

class Radio {
  	constructor(name,parent,selected) {
	    this.name = name;
	    this.parent = parent;
	    this.hover = false;
	    this.selected = selected;
  	}

  	display(X,Y) {
		rectMode(CENTER);
		noFill();
		strokeWeight(1);
		stroke(C[7].r, C[7].g, C[7].b);
		ellipse(X,Y-1,12,12);
		fill(C[5].r, C[5].g, C[5].b);
		noStroke();
		textAlign(LEFT,CENTER);
		textFont(fonts[0],15);
		text(this.name,X+20,Y);
		rectMode(CORNER);
		if (this.selected){
			strokeWeight(3);
			stroke(C[7].r, C[7].g, C[7].b);
			point(X,Y-1.25);
		}
		strokeWeight(1);
		if (mouseX>X-5 && mouseX<X+20+textWidth(this.name) && mouseY>Y-10 && mouseY<Y+10){
			this.hover = true;
			hovering = true;
		}
	}
}


class Section {
  	constructor(parent,title,id,contents) {
	  	this.parent = parent;
	  	this.title = title;
	  	this.id = id;
	    this.contents = contents[parent][id];
  	}

  	display(X,Y) {
	  	
	}
}


////////////////////////////////////////////// BACKGROUND



function createBackgroundPattern(){
	pattern = [];
	edgeToCenter = dist(0,0,W/2,H/2);
	for (var x=0; x<W; x+=(W+H)/60){
	    for (var y=0; y<H; y+=(W+H)/60){
	        distanceToCenter = dist(x,y,W/2,H/2);
	        gradientFactor = (edgeToCenter)/(4*distanceToCenter);
	        pattern.push([x,y,color(C[1].r/gradientFactor, C[1].g/gradientFactor, C[1].b/gradientFactor)]);
	    }
	}
}
function drawBackgroundPattern(){
	strokeWeight(3);
	for (var p=0; p<pattern.length-1; p+=1){
	    stroke(pattern[p][2]);
	    point(pattern[p][0],pattern[p][1]);
	}
}


////////////////////////////////////////////// CONTENT TYPE



////////////////////////////////////////////// HEADER



function headerBulk(){
    strokeWeight(1);
    stroke(C[4].r, C[4].g, C[4].b);
    fill(C[2].r, C[2].g, C[2].b,200);
    rect(-1,0,W+1,headerHeight);
}


function headerText(size1,size2){
	switch (titleStyle){
		case 0:
			fill(C[5].r, C[5].g, C[5].b);
			textSize(size1);
			textAlign(LEFT,CENTER);
			strokeWeight(1);
			stroke(C[2].r, C[2].g, C[2].b,50);
			textFont(fonts[1]);
			text("Graphical",50,headerHeight/2 + 4);
			var graphicalWordWidth = textWidth("Graphical ");
			textFont(fonts[2]);
			fill(C[6].r, C[6].g, C[6].b,240);
			text("Stock Exchange",50+2+graphicalWordWidth,headerHeight/2 + 4);
			break;
		case 1:
			fill(C[6].r, C[6].g, C[6].b);
			textSize(size1);
			textAlign(LEFT,CENTER);
			strokeWeight(1);
			stroke(C[2].r, C[2].g, C[2].b,50);
			noStroke();
			
			textFont(fonts[1]);
			text("G",50,headerHeight/2 + 4);
			var graphicalWordWidth1 = textWidth("G");
			textFont(fonts[2]);
			text("raphical",50+ graphicalWordWidth1,headerHeight/2 + 4);
			var graphicalWordWidth2 = textWidth("raphical");
			
			textFont(fonts[1]);
			text("S",50+2+graphicalWordWidth1+graphicalWordWidth2+4,headerHeight/2 + 4);
			var stockWordWidth1 = textWidth("S");
			textFont(fonts[2]);
			text("tock",50+2+graphicalWordWidth1+graphicalWordWidth2+stockWordWidth1+4,headerHeight/2 + 4);
			var stockWordWidth2 = textWidth("tock");
			
			textFont(fonts[1]);
			text("E",50+2+graphicalWordWidth1+graphicalWordWidth2+stockWordWidth1+stockWordWidth2+8,headerHeight/2 + 4);
			var exchangeWordWidth1 = textWidth("E");
			textFont(fonts[2]);
			text("xchange",50+2+graphicalWordWidth1+graphicalWordWidth2+stockWordWidth1+stockWordWidth2+exchangeWordWidth1+8,headerHeight/2 + 4);
			break;
	}
		
	textAlign(RIGHT,CENTER);
	textFont(fonts[3]);
	fill(C[5].r,C[5].g,C[5].b,240);
	noStroke();
	textSize(size2);//simple minimal simulation of a limit-order-book financial exchange,
	text("A Minimal Simulation of a LOB Financial Exchange",W-50,headerHeight/2 + 4);

        
}

function header(){
    headerBulk();
    if (headerHeight>60){
        headerText(H/30,H/40);
    } else {
        headerText(20,15);
    }
}


////////////////////////////////////////////// SIDEBAR


function tabOutCheck(){
	for (var t=tabs.length-1; t>=0; t-=1){
		if (tabs[t].out){
	       tabOut = t;
	    }
	}
}

function sidebarRightPartition(Y1,Height,part){
	strokeWeight(1);
	if (part % 2){
		fill(C[1].r, C[1].g, C[1].b);
	} else {
		fill(C[2].r, C[2].g, C[2].b);
	}
	stroke(C[4].r, C[4].g, C[4].b);
	rect(W-sidebarRightWidth,Y1,sidebarRightWidth,Height);
	if (tabs[tabOut].scrollBar){
		stroke(C[4].r, C[4].g, C[4].b);
		fill(C[3].r, C[3].g, C[3].b);
		rect(W-15,headerHeight-tabs[tabOut].scroll*(H-headerHeight)/(tabs[tabOut].contentHeight)+10,5,sq(H-headerHeight)/(tabs[tabOut].contentHeight)-20,5);
	}
}

function tabContent(){
	var yHeight = headerHeight+30*2;
	if (tabOut>-1){
		for (var section=0; section<sections[tabOut].length; section+=1){
			if (sections[tabOut][section].contents){
				sidebarRightPartition(yHeight-30*2+tabs[tabOut].scroll,30*(sections[tabOut][section].contents.length+2),section);
			}
			textAlign(LEFT,CENTER);
			textFont(fonts[0],15);
			fill(C[7].r,C[7].g,C[7].b);
			text(sections[tabOut][section].title,W-sidebarRightWidth+30,yHeight-30+tabs[tabOut].scroll);
			if (sections[tabOut][section].contents){
				for (var content=0; content<sections[tabOut][section].contents.length; content+=1){
					sections[tabOut][section].contents[content].display(W-sidebarRightWidth+35,yHeight+30*content+tabs[tabOut].scroll);
				}
				yHeight += 30*(sections[tabOut][section].contents.length+2);
			}
			
		}
		yHeight -= 30*2;
		tabs[tabOut].contentHeight = yHeight-headerHeight;
		if (tabs[tabOut].contentHeight > H-headerHeight){
			tabs[tabOut].scrollBar = true;
		} else {
			tabs[tabOut].scrollBar = false;
			tabs[tabOut].scroll = 0;
		}
	}
	
}

function updateSidebarWidth(){
	tabOutCheck();
	if (tabOut>-1){
		sidebarRightWidth = sidebarRightOutWidth;
	} else {
		sidebarRightWidth = 0;
	}
}

function siderBarRightBulk(){
	updateSidebarWidth();
	var tabHeightTemporary = 100;
	if (headerHeight+(tabs.length-1)*(9*tabHeightTemporary/10) + tabHeightTemporary > H){
		tabHeightTemporary = (10*(H-headerHeight))/(9*(tabs.length-1) + 10);
	}
	for (var t=tabs.length-1; t>=0; t-=1){
        if (t !== tabOut && tabs[t].name !== ' R U N '){
        	tabs[t].display(tabHeightTemporary/3 + 5,headerHeight+t*(9*tabHeightTemporary/10)+1, tabHeightTemporary,false);
        }
    }
    if (tabOut>-1){
    	tabs[tabOut].display(tabHeightTemporary/3 + 5,headerHeight+tabOut*(9*tabHeightTemporary/10)+1, tabHeightTemporary,true);
    }
    if (tabs[tabNames['R U N']].name === ' R U N '){
	    tabs[tabNames['R U N']].display(tabHeightTemporary/3 + 5,headerHeight+(tabNames['R U N'])*(9*tabHeightTemporary/10)+1, tabHeightTemporary,false);
	}
    
    if (tabOut>-1){
	    stroke(C[4].r, C[4].g, C[4].b);
	    strokeWeight(1);
    	if (sections[tabOut].length % 2){
			fill(C[1].r, C[1].g, C[1].b);
		} else {
			fill(C[2].r, C[2].g, C[2].b);
		}
    	rect(W-sidebarRightWidth,headerHeight,sidebarRightWidth,H-headerHeight);
    }
    tabContent();
}



////////////////////////////////////////////// MAIN CONTENT

function defineWorkingScreenProperties(){
	workingWidth = (W-sidebarRightWidth);
	workingHeight = (H-headerHeight);
	if (graphPosRelative){
		graphWidth = workingWidth;
	} else {
		graphWidth = W;
	}
	graphCenterPos = 53*graphWidth/100;
}

function fadedLine(x1,y1,x2,y2,n,R,G,B){
    for (var i=0; i<n; i+=1){
        stroke(R, G, B, 255*(n-i)/n);
        line((x2-x1)*i/n + x1, (y2-y1)*i/n + y1,(x2-x1)*(i+1)/n + x1,(y2-y1)*(i+1)/n + y1);
    }

};

function drawLOB(){
	
	var dml = checkLOBDataMoreLess();
	lobGraphNums = fullLOB[dml].length;
	
	var T = TimeProgress * lobGraphNums/inputLobGraphNums;
	
	if (dml){
		var lobGraphNum=floor(T+lobGraphNums/inputLobGraphNums);
	} else {
		var lobGraphNum=floor(T);

	}
	if (lobGraphNum>=lobGraphNums){
		lobGraphNum = lobGraphNums-1;
	}


	if (!lob[dml].length){
		constructLOB(fullLOB,dml);
	}
	if (lob[dml][lobGraphNum].length){
		var maxPrice = 50;
		var maxPriceDiff = 50;
		var lobGroup = sortGroupLOB(lob[dml][lobGraphNum]);
/*
		if (checks[tabNames['Display']][1][1].checked){ // Variable X
			for (var i=0; i<2; i+=1){
				if (abs(lobGroup[i][0][0] - lobGroup[i][lobGroup[i].length-1][0])>maxPriceDiff){
					maxPriceDiff = abs(lobGroup[i][0][0] - lobGroup[i][lobGroup[i].length-1][0]);
				}
			}
			if (abs(lobGroup[0][lobGroup[0].length-1][0]-marketValue[dml][lobGraphNum])>abs(lobGroup[1][lobGroup[1].length-1][0]-marketValue[dml][lobGraphNum])){
				maxPrice = abs(lobGroup[0][lobGroup[0].length-1][0]-marketValue[dml][lobGraphNum]);
			} else {
				maxPrice = abs(lobGroup[1][lobGroup[1].length-1][0]-marketValue[dml][lobGraphNum]);
			}
		} 
		else {
*/
			marketValue[dml][lobGraphNum] = 100;
// 		}
		
		if (radios[tabNames['Display']][3][1].selected){ // Resize Vol
			var maxCF = 0;
			for (var i=0; i<2; i+=1){
				if (lob[dml][lobGraphNum][i].length>maxCF){
					maxCF = lob[dml][lobGraphNum][i].length;
				}
			}
		} else {
			maxCF = maxCFofAll;
		}
		
		lobHeight = (workingHeight/150)*(80);
		lobTopPos = headerHeight+3*workingHeight/4-lobHeight;

	}
		
	for (var i=0; i<2; i+=1){
		
		// i=0 --> BIDS
		// i=1 --> ASKS
		
		strokeWeight(1);
		if (radios[tabNames['Display']][1][0].selected){
			if (!i){
				noFill();
				stroke(255,255,255,100);
				line(graphCenterPos,headerHeight+3*workingHeight/4,graphCenterPos,lobTopPos);
				line(graphCenterPos,lobTopPos,graphCenterPos - 5,lobTopPos+5);
				line(graphCenterPos,lobTopPos,graphCenterPos + 5,lobTopPos+5);
				for (var j=1; j<5; j+=1){
					line(graphCenterPos-3,lobTopPos+7+(1-j/5)*lobHeight,graphCenterPos+3,lobTopPos+7+(1-j/5)*lobHeight);
				}
				fill(255,255,255,100);
				noStroke();
				textSize(12);
				textAlign(CENTER,TOP);
				
				fill(255,255,255,180);
				if (lob[dml][lobGraphNum].length){
					text(round(marketValue[dml][lobGraphNum]),graphCenterPos,headerHeight+3*workingHeight/4+15);
				}
				text('PRICE  –  Pence ',graphCenterPos,headerHeight+3*workingHeight/4+45);
				textAlign(CENTER,BOTTOM);
				text('VOLUME  –  Bids / Asks ',graphCenterPos,lobTopPos-15);
			}
			if (lob[dml][lobGraphNum].length){
				textSize(13);
				textAlign(CENTER,TOP);
				fill(255,255,255,150);
				noStroke();
				for (var n=1; n<7; n+=1){
					text(round(marketValue[dml][lobGraphNum] + (2*i-1)*(n*maxPrice/6)),graphCenterPos+(2*i-1)*(maxPrice)*(graphWidth/50)*(15/maxPriceDiff) * n/6,headerHeight+3*workingHeight/4+15);
				}
				for (var n=1; n<6; n+=1){
					text(round(maxCF* n/5),graphCenterPos-2+4*i+(2*i-1)*(maxPrice)*(graphWidth/50)*(15/maxPriceDiff)+(2*i-1) + (2*i-1)*20,headerHeight+3*workingHeight/4-(maxCF* n/5)*(workingHeight/150)*(80/(maxCF)));
				}
			}
		} else {
			if (lob[dml][lobGraphNum].length){
				if (!i){
					noFill();
					stroke(255,255,255,100);
					line(graphCenterPos,headerHeight+workingHeight/4,graphCenterPos,headerHeight+workingHeight/4 + (maxPrice)*(workingHeight/50)*(25/maxPriceDiff)+1);
				}
			}
		}
		
		if (lob[dml][lobGraphNum].length){
			if (lob[dml][lobGraphNum][i].length){
				if (radios[tabNames['Display']][0][0].selected){
					strokeWeight(1);
					if (i){
						fill(214, 121, 118,85);
						stroke(181, 81, 78);
					} else {
						fill(113, 209, 122,85);
						stroke(84, 184, 94);
					}
				} else {
					noFill();
					if (i){
						stroke(181, 81, 78);
					} else {
						stroke(84, 184, 94);
					}
		
				}
			}
			strokeWeight(1);
			if (radios[tabNames['Display']][1][0].selected){
				strokeWeight(1);
				
				if (lob[dml][lobGraphNum][i].length){
					beginShape();
					cf = 0;
					vertex(graphCenterPos-2+4*i+(lobGroup[i][0][0]-marketValue[dml][lobGraphNum])*(graphWidth/50)*(15/maxPriceDiff),headerHeight+3*workingHeight/4+1);
					for (var j=0; j<lobCum[dml][lobGraphNum][i].length; j+=1){
						vertex(graphCenterPos-2+4*i+(lobCum[dml][lobGraphNum][i][j][0]-marketValue[dml][lobGraphNum])*(graphWidth/50)*(15/maxPriceDiff),headerHeight+3*workingHeight/4 - (lobCum[dml][lobGraphNum][i][j][1])*(workingHeight/150)*(80/maxCF)+1);
						if (radios[tabNames['Display']][2][1].selected && j<lobCum[dml][lobGraphNum][i].length-1){
							vertex(graphCenterPos-2+4*i+(lobCum[dml][lobGraphNum][i][j+1][0]-marketValue[dml][lobGraphNum])*(graphWidth/50)*(15/maxPriceDiff),headerHeight+3*workingHeight/4 - (lobCum[dml][lobGraphNum][i][j][1])*(workingHeight/150)*(80/maxCF)+1);
						}
					}
					vertex(graphCenterPos-2+4*i+(2*i-1)*(maxPrice)*(graphWidth/50)*(15/maxPriceDiff),headerHeight+3*workingHeight/4 - (lobCum[dml][lobGraphNum][i][lobCum[dml][lobGraphNum][i].length-1][1])*(workingHeight/150)*(80/maxCF)+1);
					vertex(graphCenterPos-2+4*i+(2*i-1)*(maxPrice)*(graphWidth/50)*(15/maxPriceDiff),headerHeight+3*workingHeight/4 + 1);
					endShape();
				}
				
	
				
				textSize(13*sqrt(W/1000));
				noStroke();
				if (!i){
					textAlign(LEFT,BOTTOM);
					fill(182, 242, 187);
					text('BID',graphCenterPos-2+4*i+(2*i-1)*(maxPrice)*(graphWidth/50)*(15/maxPriceDiff) + 14,headerHeight+3*workingHeight/4-7);
					strokeWeight(2);
					fadedLine(graphCenterPos-2+4*i+(2*i-1)*(maxPrice)*(graphWidth/50)*(15/maxPriceDiff),headerHeight+3*workingHeight/4 + 1,graphCenterPos,headerHeight+3*workingHeight/4 + 1,20,84, 184, 94);
				} else {
					textAlign(RIGHT,BOTTOM);
					fill(255, 181, 179);
					text('ASK',graphCenterPos-2+4*i+(2*i-1)*(maxPrice)*(graphWidth/50)*(15/maxPriceDiff) - 14,headerHeight+3*workingHeight/4-7);
					strokeWeight(2);
					fadedLine(graphCenterPos-2+4*i+(2*i-1)*(maxPrice)*(graphWidth/50)*(15/maxPriceDiff),headerHeight+3*workingHeight/4 + 1,graphCenterPos,headerHeight+3*workingHeight/4 + 1,20,181, 81, 78);
				}

				if (lob[dml][lobGraphNum][i].length){
					strokeWeight(2);
					stroke(C[0].r, C[0].g, C[0].b);
					line(graphCenterPos-2+4*i+(2*i-1)*(maxPrice)*(graphWidth/50)*(15/maxPriceDiff)+(2*i-1),headerHeight+3*workingHeight/4 - (cf)*(workingHeight/150)*(80/maxCF)+1,graphCenterPos-2+4*i+(2*i-1)*(maxPrice)*(graphWidth/50)*(15/maxPriceDiff)+(2*i-1),headerHeight+3*workingHeight/4 + 1);
				}
			} else if (radios[tabNames['Display']][1][1].selected){
				if (lob[dml][lobGraphNum][i].length){
					beginShape();
					cf = 0;
					vertex(graphCenterPos-4+9*i+(2*i-1)*cf*graphWidth/100* 30/maxCF,headerHeight+workingHeight/4 + ((2*i-1)*(lobCum[dml][lobGraphNum][i][0][0]-marketValue[dml][lobGraphNum]))*(workingHeight/50)*(25/maxPriceDiff)+1);
					for (var j=0; j<lobCum[dml][lobGraphNum][i].length; j+=1){
						if (radios[tabNames['Display']][2][1].selected && j){
							vertex(graphCenterPos-4+9*i+(2*i-1)*lobCum[dml][lobGraphNum][i][j-1][1]*graphWidth/100* 30/maxCF,headerHeight+workingHeight/4 + ((2*i-1)*(lobCum[dml][lobGraphNum][i][j][0]-marketValue[dml][lobGraphNum]))*(workingHeight/50)*(25/maxPriceDiff)+1);
						}
						vertex(graphCenterPos-4+9*i+(2*i-1)*lobCum[dml][lobGraphNum][i][j][1]*graphWidth/100* 30/maxCF,headerHeight+workingHeight/4 + ((2*i-1)*(lobCum[dml][lobGraphNum][i][j][0]-marketValue[dml][lobGraphNum]))*(workingHeight/50)*(25/maxPriceDiff)+1);
					}
					vertex(graphCenterPos-4+9*i+(2*i-1)*lobCum[dml][lobGraphNum][i][lobCum[dml][lobGraphNum][i].length-1][1]*graphWidth/100* 30/maxCF,headerHeight+workingHeight/4 + ((maxPrice))*(workingHeight/50)*(25/maxPriceDiff)+1);
					vertex(graphCenterPos-4+9*i,headerHeight+workingHeight/4 + ((maxPrice))*(workingHeight/50)*(25/maxPriceDiff)+1);	
					endShape();
				}
				if (lob[dml][lobGraphNum][i].length){
					strokeWeight(2);
					line(graphCenterPos-4+9*i+(2*i-1)*lobCum[dml][lobGraphNum][i][lobCum[dml][lobGraphNum][i].length-1][1]*graphWidth/100* 30/maxCF,headerHeight+workingHeight/4 + ((maxPrice))*(workingHeight/50)*(25/maxPriceDiff)+1,graphCenterPos-4+9*i,headerHeight+workingHeight/4 + ((maxPrice))*(workingHeight/50)*(25/maxPriceDiff)+1);
					fadedLine(graphCenterPos-4+9*i+(2*i-1)*lobCum[dml][lobGraphNum][i][lobCum[dml][lobGraphNum][i].length-1][1]*graphWidth/100* 30/maxCF,headerHeight+workingHeight/4 + ((maxPrice))*(workingHeight/50)*(25/maxPriceDiff)+1,graphCenterPos-4+9*i,headerHeight+workingHeight/4 + ((maxPrice))*(workingHeight/50)*(25/maxPriceDiff)+1,20,C[0].r, C[0].g, C[0].b);
				}
	
				strokeWeight(2);
				stroke(C[0].r, C[0].g, C[0].b);
				line(7*graphWidth/16,headerHeight+workingHeight/4,9*graphWidth/16,headerHeight+workingHeight/4);
				stroke(255,255,255);
				line(graphCenterPos-5,headerHeight+workingHeight/4,graphCenterPos+5,headerHeight+workingHeight/4);
				textSize(13*sqrt(W/1000));
				noStroke();
				if (!i){
					textAlign(RIGHT,BOTTOM);
					fill(182, 242, 187);
					text('BID',graphCenterPos - 14,headerHeight+workingHeight/4 + (maxPrice)*(workingHeight/50)*(25/maxPriceDiff)+1-5);
				} else {
					textAlign(LEFT,BOTTOM);
					fill(255, 181, 179);
					text('ASK',graphCenterPos + 14,headerHeight+workingHeight/4 + (maxPrice)*(workingHeight/50)*(25/maxPriceDiff)+1-5);
				}
	
			}
			
			
			if (lob[dml][lobGraphNum][i].length && checks[tabNames['Display']][0][0].checked && radios[tabNames['Display']][1][0].selected && mouseY<lobTopPos+lobHeight && mouseY>lobTopPos && mouseX>graphCenterPos-2+4*0+(2*0-1)*(maxPrice)*(graphWidth/50)*(15/maxPriceDiff)+(2*0-1) && mouseX<graphCenterPos-2+4*1+(2*1-1)*(maxPrice)*(graphWidth/50)*(15/maxPriceDiff)+(2*1-1)){
				strokeWeight(1);
				stroke(150,200);
				var currentPrice = marketValue[dml][lobGraphNum]+(mouseX-graphCenterPos)*(maxPriceDiff/15)*(50/graphWidth);
				
				function interpolateVol(currentVol,i,j){
					if (radios[tabNames['Display']][2][0].selected){
						if (lobCum[dml][lobGraphNum][i][j]){
							var higherPrice = lobCum[dml][lobGraphNum][i][j][0];
							if (j<lobCum[dml][lobGraphNum][i].length){
								var lowerPrice = lobCum[dml][lobGraphNum][i][j-1][0]; // error property 0 undefined 797
								var prevVol = lobCum[dml][lobGraphNum][i][j-1][1];
							} else {
								var lowerPrice = currentPrice;
								var prevVol = currentVol;
							}
							currentVol = prevVol + (currentVol-prevVol)*((currentPrice-lowerPrice)/(higherPrice-lowerPrice));
						}
					} else {
						currentVol = lobCum[dml][lobGraphNum][i][j-1][1];
					}
					return currentVol;
				}
				
				if (!i){
					if (lobCum[dml][lobGraphNum][i][lobCum[dml][lobGraphNum][i].length-1][0]>currentPrice){
						currentVol = lobCum[dml][lobGraphNum][i][lobCum[dml][lobGraphNum][i].length-1][1];
					} else if (lobCum[dml][lobGraphNum][i][0][0]<currentPrice){
						currentVol = 0;
					} else {
						for (var j=0; j<lobCum[dml][lobGraphNum][i].length; j+=1){
							if (lobCum[dml][lobGraphNum][i][j][0]<=currentPrice){
								currentVol = interpolateVol(lobCum[dml][lobGraphNum][i][j][1],i,j);
								break;
							}
						}
						if (!currentVol){
							currentVol = lobCum[dml][lobGraphNum][i][0][1];
						}
					}
					if (currentVol>=1){
						textSize(15);
						textAlign(LEFT,CENTER);
						textFont(fonts[2]);
						text(round(currentVol) + ' bids\n' +round(currentPrice) + ' pence',graphCenterPos+4*(2+4*0+(2*0-1)*(maxPrice)*(graphWidth/50)*(15/maxPriceDiff)+(2*0-1))/5,lobTopPos+5+lobHeight*4/5);
						textFont(fonts[0]);
					}
				} else {
					if (lobCum[dml][lobGraphNum][i][0][0]>currentPrice){
						currentVol = 0;
					} else {
						for (var j=0; j<lobCum[dml][lobGraphNum][i].length; j+=1){
							if (lobCum[dml][lobGraphNum][i][j][0]>=currentPrice){
								currentVol = interpolateVol(lobCum[dml][lobGraphNum][i][j][1],i,j);
								break;
							}
						}
						if (!currentVol){
							currentVol = lobCum[dml][lobGraphNum][i][lobCum[dml][lobGraphNum][i].length-1][1];
						}
					}
					if (currentVol>=1){
						textSize(15);
						textAlign(RIGHT,CENTER);
						textFont(fonts[2]);
						text(round(currentVol) + ' asks\n' +round(currentPrice) + ' pence',graphCenterPos-4*(2+4*0+(2*0-1)*(maxPrice)*(graphWidth/50)*(15/maxPriceDiff)+(2*0-1))/5,lobTopPos+5+lobHeight*4/5);
						textFont(fonts[0]);
					}
				}
				if (currentVol>=1){
					if (!i){
						stroke(182, 242, 187,150);
						fill(182, 242, 187);
					} else {
						stroke(255, 181, 179,150);
						fill(255, 181, 179);
					}
					line(mouseX-0.5,headerHeight+3*workingHeight/4,mouseX-0.5,headerHeight+3*workingHeight/4 - (currentVol)*(workingHeight/150)*(80/maxCF));
					ellipse(mouseX,headerHeight+3*workingHeight/4 - (currentVol)*(workingHeight/150)*(80/maxCF)+2.5,5,5);
					ellipse(mouseX,lobTopPos+lobHeight+1,5,5);
				}
			}
		}
	}
}


////////////////////////////////////////////// EXECUTE


function resetHover(){
	hovering = false;
	for (var t=tabs.length-1; t>=0; t-=1){
		tabs[t].hover = false;
		for (var id=0; id<checks[t].length; id+=1){
			for (var check=0; check<checks[t][id].length; check+=1){
				checks[t][id][check].hover = false;	
			}
		}
		for (var id=0; id<slides[t].length; id+=1){
			for (var slide=0; slide<slides[t][id].length; slide+=1){
				slides[t][id][slide].hover = false;	
				slides[t][id][slide].hoverL = false;
				slides[t][id][slide].hoverR = false;		
			}
		}
		for (var id=0; id<radios[t].length; id+=1){
			for (var radio=0; radio<radios[t][id].length; radio+=1){
				radios[t][id][radio].hover = false;	
			}
		}
	}
	scrollBarHover = false;
}

function dragSection(){
	if (sidebarRightDragOn && ((tabOut > -1 && mouseY>headerHeight && mouseX>W-sidebarRightOutWidth-5 && mouseX<W-sidebarRightOutWidth+5) || sidebarRightWidthDrag)){
		cursor('col-resize');
		if (mouseIsPressed){
			sidebarRightOutWidth = W-mouseX;
			sidebarRightWidthDrag = true;
		}
	}
	
	if ((tabOut > -1 && tabs[tabOut].scrollBar && mouseX>W-15 && mouseX<W-10 && mouseY>headerHeight+10-tabs[tabOut].scroll && mouseY<headerHeight+10-tabs[tabOut].scroll+sq(H-headerHeight)/tabs[tabOut].contentHeight) || scrollBarDrag){
		if (mouseIsPressed){
			cursor('grabbing');
			if ((tabs[tabOut].scroll>=H-headerHeight-tabs[tabOut].contentHeight || mouseY-pmouseY<0) && (tabs[tabOut].scroll<=0 || mouseY-pmouseY>0)){
				tabs[tabOut].scroll -= mouseY-pmouseY;
			}
			scrollLimit(tabOut);
			scrollBarDrag = true;
		} else {
			cursor('grab');
		}
	}
}

function playPauseHover(){
    if (mouseY>=headerHeight+3*workingHeight/4+34-3 && mouseY<=headerHeight+3*workingHeight/4+48+3 && mouseX>=workingWidth/18+4-3 && mouseX<=workingWidth/18+15+3){
        cursor('Pointer');
        return true; 
    } else {
        return false;
    }
};

function timeCircleHover(T){
    if (mouseY>=lobTopPos+7+(lobGraphNums-T)*lobHeight/lobGraphNums-5.5-3 && mouseY<=lobTopPos+7+(lobGraphNums-T)*lobHeight/lobGraphNums+5.5+3 && mouseX>=workingWidth/18-3 && mouseX<=workingWidth/18+11+38){
        cursor('Pointer');
        return true; 
    } else {
        return false;
    }
};

function drawTimeline(T){
	textFont(fonts[0],13);
    stroke(C[5].r, C[5].g, C[5].b,100);
    noStroke();
    fill(C[0].r, C[0].g, C[0].b);
    rect(workingWidth/18-12,lobTopPos-43,75,lobHeight+105,2);
    stroke(C[5].r, C[5].g, C[5].b);
    line(workingWidth/18+5,lobTopPos+7,workingWidth/18+5,lobTopPos+5+lobHeight);
    ellipse(workingWidth/18+5.5,lobTopPos+7,5,5);
    ellipse(workingWidth/18+5.5,lobTopPos+7+lobHeight,5,5);
	stroke(158, 203, 230);
	if (!timeCircleHover(T) && !grabTimeCircle){
    	fill(C[0].r, C[0].g, C[0].b);
    } else {
	    fill(158, 203, 230,150);
    }
    ellipse(workingWidth/18+5.5,lobTopPos+7+(lobGraphNums-T)*lobHeight/lobGraphNums,11,11);
    fill(158, 203, 230);
    if (!timeCircleHover(T) && !grabTimeCircle){
    	ellipse(workingWidth/18+5.5,lobTopPos+7+(lobGraphNums-T)*lobHeight/lobGraphNums,2,2);
    }
	stroke(158, 203, 230);
    textAlign(LEFT,CENTER);
    noStroke();
    textSize(12);
    text('–  '+str(round(T * inputLobGraphNums/lobGraphNums)),workingWidth/18+18,lobTopPos+7+(lobGraphNums-T)*lobHeight/lobGraphNums);

    fill(255,180);
    text('TIMESTEP',workingWidth/18-3,lobTopPos-23);
    textSize(12);
    
    for (var i=0; i<6; i+=1){
	    if (T/lobGraphNums<(20*i-5)/100 || T/lobGraphNums>(20*i+5)/100){fill(C[6].r, C[6].g, C[6].b);} else {fill(C[6].r, C[6].g, C[6].b,100);}
		text('–  '+round(i*lobGraphNums/5  * inputLobGraphNums/lobGraphNums),workingWidth/18+18,lobTopPos+7+(1-i/5)*lobHeight);
    }
    
    fill(C[7].r, C[7].g, C[7].b,100);

    textFont(fonts[0]);
    if (!playPauseHover()){
    	noFill();
    }
    stroke(C[6].r, C[6].g, C[6].b);
    if (playTime){
        rect(workingWidth/18+3,headerHeight+3*workingHeight/4+34,3,12);
        rect(workingWidth/18+10,headerHeight+3*workingHeight/4+34,3,12);
    } else {
        triangle(workingWidth/18+4,headerHeight+3*workingHeight/4+34,workingWidth/18+15,headerHeight+3*workingHeight/4+41,workingWidth/18+4,headerHeight+3*workingHeight/4+48);
    }
    
    if (playTime && T<lobGraphNums){
	    for (var radio=0; radio<playBackSpeeds.length; radio+=1){//playBackSpeeds
			if (radios[tabNames['Display']][4][radio].selected){
				playBackSpeed = playBackSpeeds[radio];
				break;
			}
		}
	    TimeProgress+=0.1*playBackSpeed;
    } else {
	    playTime = false;
    }
    
    if (grabTimeCircle){
	    if (mouseY>lobTopPos+7 && mouseY<lobTopPos+5+lobHeight){
	    	TimeProgress = (lobGraphNums/lobHeight)*(lobTopPos+7+lobHeight-mouseY) * inputLobGraphNums/lobGraphNums;
	    } else if (mouseY<=lobTopPos+7){
		    TimeProgress = inputLobGraphNums;
	    } else if (mouseY>=lobTopPos+5+lobHeight){
		    TimeProgress = 0;
	    }
    }
};

function drawCopyright(){
	fill(C[6].r, C[6].g, C[6].b);
	textAlign(CENTER,BOTTOM);
	if (headerHeight>60){
        textSize(10*sqrt(H/600));
	} else {
		textSize(10);
	}
}

function drawGUI(){
	resetHover();
	background(C[0].r, C[0].g, C[0].b);
	drawBackgroundPattern();
	defineWorkingScreenProperties();
	drawLOB();
	siderBarRightBulk();
	header();
	if (tabs[tabNames['R U N']].name === ' R U N '){
		cursor('progress');
	} else {
		if (hovering){
			cursor('pointer');
		} else {
			cursor('default');
		}
	}
	dragSection();
	drawCopyright();
	drawTimeline(TimeProgress * lobGraphNums/inputLobGraphNums);
}

function draw(){
	drawGUI();
	if (computeLOB){
		computeLOB = false;
		setTimeout(computingLOB, 1000);
		tabs[tabNames['R U N']].name = ' R U N ';
	}
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    W = windowWidth;
	H = windowHeight;
	createBackgroundPattern();
	if (H<600){
        headerHeight = 60;
    } else {
        headerHeight = H/10;
    }
    updateSidebarWidth();
    defineWorkingScreenProperties();
	select('#CopyrightWrapper').style('width',str(workingWidth)+'px');
}


function mouseClicked(){
	for (var tab=0; tab<tabs.length; tab+=1){
		if (tabs[tab].name === 'R U N' || tabs[tab].name === 'R E S E T'){
			if (tabs[tab].name === 'R U N'){
				if (tabs[tab].hover){
					computeLOB = true;
					if (tabOut>-1){
						tabs[tabOut].out = false;
						tabOut = -1;
						updateSidebarWidth();
					    defineWorkingScreenProperties();
						select('#CopyrightWrapper').style('width',str(workingWidth)+'px');
					}
				}
			} else if (tabs[tab].name === 'R E S E T'){
				if (tabs[tab].hover){
					setup();
				}
			}
		} else {
			if (tabs[tab].hover){
				if (tabs[tab].out){
					tabOut = -1;
					tabs[tab].out = false;
				} else {
					for (var t2=tabs.length-1; t2>=0; t2-=1){
						tabs[t2].out = false;
					}
					tabs[tab].out = true;
					tabOut = t2;
				}
				updateSidebarWidth();
				defineWorkingScreenProperties();
				select('#CopyrightWrapper').style('width',str(workingWidth)+'px');
			}
		}
		for (var id=0; id<checks[tab].length; id+=1){
			for (var check=0; check<checks[tab][id].length; check+=1){
				if (checks[tab][id][check].hover){
					if (checks[tab][id][check].checked){
						checks[tab][id][check].checked = false;
					} else {
						checks[tab][id][check].checked = true;
					}
				}
			}
		}
		for (var id=0; id<radios[tab].length; id+=1){
			for (var radio=0; radio<radios[tab][id].length; radio+=1){
				if (radios[tab][id][radio].hover){
					if (!radios[tab][id][radio].selected){
						for (var radio2=0; radio2<radios[tab][id].length; radio2+=1){
							radios[tab][id][radio2].selected = false;
						}
						radios[tab][id][radio].selected = true;
					}
				}
			}
		}

		for (var id=0; id<slides[tab].length; id+=1){
			for (var slide=0; slide<slides[tab][id].length; slide+=1){
				if (slides[tab][id][slide].hover){
					if (slides[tab][id][slide].value > 0 && slides[tab][id][slide].hoverL){
						slides[tab][id][slide].value -= 1;
					} else if (slides[tab][id][slide].hoverR) {
						slides[tab][id][slide].value += 1;
					}
				}
			}
		}
	}
	
	if (playPauseHover()){
		if (TimeProgress>=lobGraphNums){
			TimeProgress=0;
			playTime = 1-playTime;
		}
		playTime = 1-playTime;
	}
}

function mousePressed(){
	if (timeCircleHover(TimeProgress * lobGraphNums/inputLobGraphNums)){
		grabTimeCircle = true;
	}
}

function keyPressed(){
	if (keyCode===38){
		if (TimeProgress * lobGraphNums/inputLobGraphNums<lobGraphNums){
			playTime = 0;
			TimeProgress = floor(TimeProgress+1);
		}
	} else if (keyCode===40){
		if (TimeProgress * lobGraphNums/inputLobGraphNums>0){
			playTime = 0;	
			TimeProgress = floor(TimeProgress-1);
		}
	} else if (keyCode===32){
		if (TimeProgress * lobGraphNums/inputLobGraphNums>=lobGraphNums){
			TimeProgress=0;
			playTime = 1-playTime;
		}
		playTime = 1-playTime;
	}
}

function keyReleased(){
	prevTimeProgress = TimeProgress;
}

function mouseReleased(){
	sidebarRightWidthDrag = false;
	scrollBarDrag = false;
	grabTimeCircle = false;
	prevTimeProgress = TimeProgress;
}

function scrollLimit(T){
	if (tabs[T].scroll<H-headerHeight-tabs[T].contentHeight){
		tabs[T].scroll = H-headerHeight-tabs[T].contentHeight;
	}
	if (tabs[T].scroll>0){
		tabs[T].scroll = 0;
	}
}

function mouseWheel(event) {
	for (var tab=0; tab<tabs.length; tab+=1){
		if (tabs[tab].out && tabs[tab].scrollBar){
			if (mouseX>W-sidebarRightWidth && mouseY>headerHeight){
				if ((tabs[tab].scroll>=H-headerHeight-tabs[tab].contentHeight || event.deltaY<0) && (tabs[tab].scroll<=0 || event.deltaY>0)){
					tabs[tab].scroll -= event.deltaY;
				}
				scrollLimit(tab);
			}
		}
	}
	if (mouseX<W-sidebarRightWidth){
		
		if ((TimeProgress>0 && event.deltaY>0) || (TimeProgress * lobGraphNums/inputLobGraphNums<lobGraphNums && event.deltaY<0)){
			TimeProgress -= event.deltaY/500;
		}
		if ((TimeProgress>0 && event.deltaX<0) || (TimeProgress * lobGraphNums/inputLobGraphNums<lobGraphNums && event.deltaX>0)){
			TimeProgress += event.deltaX/500;
		}
		
		if (TimeProgress<0){
			TimeProgress = 0;
		} if (TimeProgress * lobGraphNums/inputLobGraphNums>lobGraphNums){
			TimeProgress = inputLobGraphNums;
		}
		
		if (event.deltaY===0 && event.deltaX===0){
			prevTimeProgress = TimeProgress;
		}
	}
}
