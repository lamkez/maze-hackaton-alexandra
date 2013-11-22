//movable[]  - 0 = N, 1 = W, 2 = E, 3 = S
//state is a {}

var noGoodDirection = 4;

function go(){
    if(!state.moves){
	state.moves = "";
    }
    
    if(detectLoop()){
	noGoodDirection = state.moves.charAt(state.moves.length-2);
	alert("noGoodDirection: "+noGoodDirection);
    }

    var toGo = 1;
    if(movable[2] && (noGoodDirection != 2)){
	toGo = 2;
    }
    else if(movable[3] && (noGoodDirection != 3)){
	toGo = 3;
    }
    else if(movable[0] && (noGoodDirection != 0)){
	toGo = 0;
    }
    state.moves += toGo;
    
    return toGo;
}

function detectLoop(){    
    var s = state.moves;
    if(s.length < 4){
	return false;
    }    
    var loop1 = s.substring(s.length-5, s.length-3);
    var loop2 = s.substring(s.length-3, s.length-1);
    if(loop1 === loop2){
	return true;
    }
}

return go();