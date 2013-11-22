//movable[]  - 0 = N, 1 = W, 2 = E, 3 = S
//state is a {}

function go(){

    var toGo = Math.floor(Math.random()*4);
    alert(toGo);
    if(!movable[toGo]){
	return go();
    }
    return toGo;
}

return go();