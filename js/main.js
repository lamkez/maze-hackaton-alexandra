var maze = {x:3, y:3, vertical:[,true,,,true,,,true,], horizontal:[,true,,,,,true,,true]};

var mazevis = new mazevisualizer.initialize(document.getElementById('chart_div'), maze);
		// 
		// graph.draw(runnerInfo);
		// 
		// var outputDiv = document.getElementById('output');
		// 
		// var selectedRunner, counter = 0, selectCounterStamp;
		// graph.addEventHandler(function(event){
		// 	outputDiv.innerHTML = event.source + " properties: (" + JSON.stringify(event.properties) + ")";
		// 	if (event.source === sportsgraph.EventTypes.RUNNER_SELECTED)
		// 	{
		// 		for (var runnerIndex in runnerInfo.runners)
		// 		{
		// 			var runner = runnerInfo.runners[runnerIndex];
		// 			if (runner.name === event.properties.id)
		// 			{
		// 				selectedRunner = runner;
		// 			}
		// 			runner["follow"] = false;
		// 			runner["yPixelOffset"] = 0;
		// 		}
		// 		
		// 		if (selectedRunner !== undefined)
		// 		{
		// 			selectedRunner.follow = true;
		// 			selectCounterStamp = counter;					
		// 		}
		// 	}
		// });
		// 		
		// setInterval(function(){
		// 	counter += 1;
		// 	// Bounce selected runner
		// 	if (selectedRunner !== undefined)
		// 	{
		// 		var amplitude = 10 * ((50 - (counter - selectCounterStamp)) / 50);
		// 		selectedRunner["yPixelOffset"] = amplitude * Math.abs(Math.sin(counter * 0.25));
		// 		console.log("Update pixel offset to " + amplitude);
		// 		if (amplitude <= 0)
		// 			selectedRunner = undefined;
		// 	}
		// 	
		// 	runnerInfo.runners[0].distance += 1.6;
		// 	runnerInfo.runners[1].distance += 1.42;
		// 	runnerInfo.runners[2].distance += 1.41;
		// 	runnerInfo.runners[3].distance += 1.41;
		// 	runnerInfo.runners[4].distance += 1.49;
		// 	runnerInfo.runners[5].distance += 1.4;
		// 	runnerInfo.runners[6].distance += 1.4;
		// 
		// 	graph.draw(runnerInfo);
		// },33);
//});
