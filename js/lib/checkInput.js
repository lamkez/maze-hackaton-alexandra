/**
* Returns true if the inputted text contains any mention of a function
* that is not part of the allowed text
**/

function checkUserInput(text){
    var p1 = /move\(/gi;
    var p2 = /canMoveFromPosition\(/gi;
    var p3 = /getMovable\(/gi;
    var p4 = /solveMaze\(/gi;

    var internal_function = "Nope - Do not use internal functions";
    if(text.match(p1)){
	alert(internal_function);
	return false;
    }
    if(text.match(p2)){
	alert(internal_function);
	return false;
    }
    if(text.match(p3)){
	alert(internal_function);
	return false;
    }
    if(text.match(p4)){
	alert(internal_function);
	return false;
    }

    var setxPattern = /x\s*=/gi;
    var setyPattern = /y\s*=/gi;

    if(text.match(setxPattern) || text.match(setyPattern)){
	alert("Nope - CHEATER.. Do not set x or y");
	return false;
    }

    var scriptPattern = /[<|<\/]script>/gi;
    if(text.match(scriptPattern)){
	alert("Nope - CHEATER.. Do not jump out of your sandbox script");
	return false;
    }

    var positionPattern = /currentPos/ig;
    if(text.match(positionPattern)){
	alert("Nope - CHEATER.. Do not try to change the position yourself");
	return false;
    }

    return true;
    //pattern which matches any function call (I think) :)
    //var patt = /[\w*|\s*]*\(\s*(.*?)\s*\)\s*;/gi;
    
}