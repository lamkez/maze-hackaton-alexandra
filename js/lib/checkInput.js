/**
* Returns true if the inputted text contains any mention of a function
* that is not part of the allowed text
**/

function checkUserInput(text){
    var p1 = /function\(/gi;
    var p2 = /foo\(/gi;
    if(text.match(p1)){
	return false;
    }
    if(text.match(p2)){
	return false;
    }

    var scriptPattern = /[<|<\/]script>/gi;
    if(text.match(scriptPattern)){
	alert("Nope - CHEATER.. Do not jump out of your sandbox script");
	return false;
    }

    var positionPattern = /currentPos/ig;
    if(text.match(positionPattern){
	alert("Nope - CHEATER.. Do not try to change the position yourself");
	return false;
    }

    return true;
    //pattern which matches any function call (I think) :)
    //var patt = /[\w*|\s*]*\(\s*(.*?)\s*\)\s*;/gi;
    
}