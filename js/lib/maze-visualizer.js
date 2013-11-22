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
	
	// Camera
	var camera = new THREE.OrthographicCamera( container.clientWidth / -5, container.clientWidth / 5, container.clientHeight / 5, container.clientHeight / -5, 1, 1000 );
	camera.position.z = 200;
	camera.position.y = 0;
	camera.position.x = 0;
	camera.fov = 75;
	camera.lookAt(new THREE.Vector3(0,0,0));
	// Make sure camera matrices are up to date
	camera.updateMatrix();
	camera.updateMatrixWorld();
	
	// Materials
	var wallMaterial =  new THREE.MeshBasicMaterial( { color: wallColor } );
	var spaceMaterial = new THREE.MeshBasicMaterial( { color: mazeColor } );
	
	// Draw plating board
	var size = 10;
	var wallSize = 2;
	var spacing = size + wallSize;
	for (var i = 0; i < maze.x; ++i)
	{
		for (var j = 0; j < maze.y; ++j)
		{
			var geometry = new THREE.PlaneGeometry(size,size,1, 1);
			var material = spaceMaterial;
			var cube = new THREE.Mesh( geometry, material );
			cube.position.x = spacing * i;
			cube.position.y = spacing * j;
			scene.add( cube );
		}
	}
	
	// Draw outer walls
	for (var i = 0; i < maze.x; ++i)
	{
		for (var j = 0; j < maze.y + 1; ++j)
		{
			var index = maze.x * j + i;
			var horizontalEdge = !maze.horizontal[index];
			var verticalEdge = !maze.vertical[index];
			
			// Horizontal
			if (horizontalEdge)
			{
				var geometry = new THREE.PlaneGeometry(size,wallSize,1, 1);
				var material = wallMaterial;
				var cube = new THREE.Mesh( geometry, material );
				cube.position.x = spacing * i;
				cube.position.y = spacing / 2 + spacing * (j-1);
				scene.add( cube );				
			}
			
			// Vertical
			if (verticalEdge)
			{
				var geometry = new THREE.PlaneGeometry(wallSize,size,1, 1);
				var material = wallMaterial;
				var cube = new THREE.Mesh( geometry, material );
				cube.position.x = spacing / 2 + spacing * (j-1);
				cube.position.y = spacing * (i);
				scene.add( cube );				
			}
		}
	}
		
	// Parse maze
	for (var i = 0; i < maze.x; ++i)
	{
		for (var j = 0; j < maze.y; ++j)
		{			
			var geometry = new THREE.PlaneGeometry(size,size,1, 1);
			var material = horizontalEdge === true ? spaceMaterial : wallMaterial;
			var cube = new THREE.Mesh( geometry, material );
			cube.position.x = spacing * i;
			cube.position.y = spacing * j;
			scene.add( cube );
		}
	}	
	
	var animate = function() {
		requestAnimationFrame(animate);
	
		renderer.render( scene, camera);
	}
	
	animate();
}