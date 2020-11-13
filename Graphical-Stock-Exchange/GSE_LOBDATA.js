
function checkLOBDataMoreLess(){
	if (radios[tabNames['Graphs']][0][0].selected){
		return 0;
	} else {
		return 1;
	}
}

function constructLOB(LOBDATA,dataMoreLess){
	lobGraphNums = LOBDATA[dataMoreLess].length;
	for (var lobGraphNum=0; lobGraphNum<lobGraphNums; lobGraphNum+=1){
		
		lob[dataMoreLess].push([]);
		lobCum[dataMoreLess].push([]);
		marketValue[dataMoreLess].push([]);
		
		lobInit = LOBDATA[dataMoreLess][lobGraphNum];
		
		while ((lobInit[0].length===0 && lobInit[1].length===0) && lobGraphNum<lobGraphNums-1){
			lobGraphNum+=1;
			lobInit = LOBDATA[dataMoreLess][lobGraphNum];
			lob[dataMoreLess][lobGraphNum] = [];
		}
		lob[dataMoreLess][lobGraphNum] = [[],[]];
		
		for (var i=0; i<2; i+=1){
			for (var j=0; j<lobInit[i].length; j+=1){
				for (var k=0; k<lobInit[i][j][1]; k+=1){
// 						lob[dataMoreLess][lobGraphNum][i].push(lobInit[i][j][0]);	
					if (i){
						if (lobInit[i][j][0]<bse_sys_maxprice){				
							lob[dataMoreLess][lobGraphNum][i].push(lobInit[i][j][0]);	
						} else {
// 								print(lobInit[i][j][0]);
							lob[dataMoreLess][lobGraphNum][i].push(bse_sys_maxprice);	
						}
					} else {
						if (lobInit[i][j][0]>bse_sys_minprice){
							lob[dataMoreLess][lobGraphNum][i].push(lobInit[i][j][0]);	
						} else {
// 								print(lobInit[i][j][0]);
							lob[dataMoreLess][lobGraphNum][i].push(bse_sys_minprice);	
						}
					}
				}
			}
		}
// 					print(lobInit)
// 			print('\nLOB')
// 			print(lob[dataMoreLess][lobGraphNum])
	
		lobGroup = sortGroupLOB(lob[dataMoreLess][lobGraphNum]);
// 			print('\nLOB GROUP')
// 			print(lobGroup)
	// 	print(lobGroup)
		lobCum[dataMoreLess][lobGraphNum] = [];
		var cf = 0;
		for (var i=0; i<2; i+=1){
			lobCum[dataMoreLess][lobGraphNum].push([]);
			cf = 1;
			for (var j=0; j<lobGroup[i].length; j+=1){
				lobCum[dataMoreLess][lobGraphNum][i].push([lobGroup[i][j][0],cf]);
				cf += lobGroup[i][j][1];
			}
		}
// 			print(lobGroup)
		var sumLobGroup=0;
		var nInLobGroup=0;
		for (var i=0; i<2; i+=1){
			for (var j=0; j<lobGroup[i].length; j+=1){
				sumLobGroup += lobGroup[i][j][0]*lobGroup[i][j][1];
				nInLobGroup += lobGroup[i][j][1];
			}
		}
// 		print(sumLobGroup)
		marketValue[dataMoreLess][lobGraphNum] = sumLobGroup/nInLobGroup;
		
		var maxCF = 0;
		for (var i=0; i<2; i+=1){
			if (lob[dataMoreLess][lobGraphNum][i].length>maxCF){
				maxCF = lob[dataMoreLess][lobGraphNum][i].length;
			}
		}
		if (maxCF>maxCFofAll){
			maxCFofAll = maxCF;
		}
	}
}

function processLOBDATA(LOBDATA){
	lob = [];
	lobCum = [];
	marketValue = [];
	maxCFofAll=0;
	for (var dataMoreLess=0; dataMoreLess<2; dataMoreLess+=1){
// 		print(LOBDATA[dataMoreLess])
		lob.push([]);
		lobCum.push([]);
		marketValue.push([]);
		if (dataMoreLess === checkLOBDataMoreLess()){
			constructLOB(LOBDATA,dataMoreLess);
		}
	}
}

function initLOB(LOBDATA){
	var lobGraphNum=lobGraphNum;
	if (TimeProgress>=lobGraphNums){
		lobGraphNum = lobGraphNums-1;
	}
	while ((lobInit[0].length===0 || lobInit[1].length===0) && lobGraphNum<lobGraphNums-1){
		lobGraphNum+=1;
		lobInit = LOBDATA[lobGraphNum];
	}
	lob = [[],[]];
	for (var i=0; i<2; i+=1){
		for (var j=0; j<lobInit[i].length; j+=1){
			for (var k=0; k<lobInit[i][j][1]; k+=1){
				lob[i].push(lobInit[i][j][0]);	
			}
		}
	}
/*
	print(lobInit)
	print(lob)
*/
	lobGroup = sortGroupLOB(lob);
// 	print(lobGroup)
	lobCum = [];
	var cf = 0;
	for (var i=0; i<2; i+=1){
		lobCum.push([]);
		cf = 1;
		for (var j=0; j<lobGroup[i].length; j+=1){
			lobCum[i].push([lobGroup[i][j][0],cf]);
			cf += lobGroup[i][j][1];
		}
	}
			
	marketValue = (lobGroup[1][0][0]+lobGroup[0][0][0])/2;
// 	print(lobCum);
}

function sortGroupLOB(LOB){
	var editLob = LOB;
	editLob[0] = editLob[0].sort(function(a, b){return b-a});
	editLob[1] = editLob[1].sort(function(a, b){return a-b});
	var newLob = [[],[]];
	var sequenceNum;
	for (var j=0; j<2; j+=1){
		sequenceNum = 1;
		if (editLob[j].length===1){
			newLob[j].push([editLob[j][0], 1]);
		} else {
			for (var i=1; i<editLob[j].length+1; i+=1){
				if (editLob[j][i] === editLob[j][i-1]){
					sequenceNum += 1;
				} else {
					newLob[j].push([editLob[j][i-1], sequenceNum]);
					sequenceNum = 1;
				}
			}
		}
	}	
	return newLob;
}

function computingLOB(){
	inputLobGraphNums = getLobGraphNums();
	TimeProgress = 0;
	playTime = true;
	lobGraphNums = inputLobGraphNums;
	cursor('progress');
	fullLOB = experimentSetUp(lobGraphNums);
	lob_data_less = fullLOB[0];
	lob_data_more = fullLOB[1];
	processLOBDATA(fullLOB);
	lobGraphNums = fullLOB[checkLOBDataMoreLess()].length;
// 	print(lobGraphNums);
// 	initLOB(fullLOB);
	tabs[tabNames['R U N']].name = 'R U N';
}

function getLobGraphNums(){
	for (var timestepOption=0; timestepOption<timestepOptions.length; timestepOption+=1){
		if (radios[tabNames['Config']][0][timestepOption].selected){
			return timestepOptions[timestepOption];
		}
	}
}
