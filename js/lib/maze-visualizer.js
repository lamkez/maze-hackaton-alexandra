var mazevisualizer = {"version":0.1};

mazevisualizer.initialize = function(container, maze)
{
	var windowHeight = container.clientHeight;
	var windowWidth = container.clientWidth;
	var windowHalfX = container.clientWidth / 2;
	var windowHalfY = container.clientHeight / 2;
	
	// COLORS
	var topColorLightnessOffset = 0.15;
	var backgroundColor = new THREE.Color( "gray" );
	var wallColor = new THREE.Color( "black" );
	var mazeColor = new THREE.Color( "white" );
	
	var scene = new THREE.Scene();
	var renderer;
    try {
        if (window.WebGLRenderingContext) {
            renderer = new THREE.WebGLRenderer( { 
               antialias: true
            } );
        } 
    }
    catch (e) {
    }
    if (!renderer) {
        // The attempt to create a WebGLRenderer failed.  Use a
        // CanvasRenderer instead.
        renderer = new THREE.CanvasRenderer();
	}
	
    renderer.context = container;
	
	renderer.setSize( windowWidth, windowHeight );
	renderer.setClearColor( backgroundColor, 1 );
	renderer.sortObjects = true;
	renderer.sortElements = true;
	renderer.autoClear = true;
	container.appendChild( renderer.domElement );
		
	// Materials
	var wallMaterial =  new THREE.MeshBasicMaterial( { color: wallColor } );
	var spaceMaterial = new THREE.MeshBasicMaterial( { color: mazeColor } );
	var startMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color("pink") } );
	var endMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color("lightgreen") } );
	
	// Draw plating board
	var size = 10;
	var wallSize = 2;
	var spacing = size + wallSize;
	
	// Start spot
	{
		var geometry = new THREE.PlaneGeometry(size,size,1, 1);
		var cube = new THREE.Mesh( geometry, startMaterial );
		scene.add( cube );
	}
	
	// Start spot
	{
		var geometry = new THREE.PlaneGeometry(size,size,1, 1);
		var cube = new THREE.Mesh( geometry, endMaterial );
		cube.position.x = spacing * (maze.x - 1);
		cube.position.y = -spacing * (maze.y - 1);
		scene.add( cube );
	}
	
/*	for (var i = 0; i < maze.x; ++i)
	{
		for (var j = 0; j < maze.y; ++j)
		{
			var geometry = new THREE.PlaneGeometry(size,size,1, 1);
			var material = spaceMaterial;
			if (i == 0 && j == 0)
				material = startMaterial;
			if (i == maze.x - 1 && j == maze.y - 1)
				material = endMaterial;
			var cube = new THREE.Mesh( geometry, material.clone() );
			cube.position.x = spacing * i;
			cube.position.y = -spacing * j;
			scene.add( cube );
		}
	}*/
	
	// Draw outer walls
	for (var y = 0; y < maze.y; ++y)
	{
		for (var x = -1; x < maze.x; ++x)
		{
			var horizontalSpace = x == -1 || !maze.horizontal[y][x];
			var verticalSpace = x == -1 || !maze.vertical[x][y];
			
			// Horizontal
			if (verticalSpace)
			{
				var geometry = new THREE.PlaneGeometry(size,wallSize,1, 1);
				var material = wallMaterial;
				var cube = new THREE.Mesh( geometry, material );
				cube.position.x = spacing * y;
				cube.position.y = -(spacing / 2 + spacing * x);
				scene.add( cube );
			}
			
			// Vertical
			if (horizontalSpace)
			{
				var geometry = new THREE.PlaneGeometry(wallSize,size,1, 1);
				var material = wallMaterial;
				var cube = new THREE.Mesh( geometry, material );
				cube.position.x = spacing / 2 + spacing * x;
				cube.position.y = -(spacing * y);
				scene.add( cube );
			}
		}
	}
	
	// Camera
	var camera = new THREE.OrthographicCamera( container.clientWidth / -5, container.clientWidth / 5, container.clientHeight / 5, container.clientHeight / -5, 1, 1000 );
	camera.position.x = spacing * maze.x / 2.0;
	camera.position.y = -spacing * maze.y / 2.0;
	camera.position.z = 200;
	camera.fov = 75;
	camera.lookAt(new THREE.Vector3(camera.position.x,camera.position.y,0));
	// Make sure camera matrices are up to date
	camera.updateMatrix();
	camera.updateMatrixWorld();
			
	var animate = function() {
		requestAnimationFrame(animate);
	
		renderer.render( scene, camera);
	}
	
	animate();
}