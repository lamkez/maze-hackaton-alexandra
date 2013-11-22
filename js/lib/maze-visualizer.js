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
    // try {
    //     if (window.WebGLRenderingContext) {
    //         renderer = new THREE.WebGLRenderer( { 
    //            antialias: true
    //         } );
    //     } 
    // }
    // catch (e) {
    // }
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
	var size = 15;
	var wallSize = 2;
	var spacing = size + wallSize;
	
	// Start spot
	{
		var player = imageMarker("couch.png", new THREE.Color("white"), 0.9);
		player.position.x = 0;
		player.position.y = 0;
		scene.add(player);
	}
	
	// Start spot
	{
		var player = imageMarker("duff.png", new THREE.Color("white"), 1.0);
		player.position.x = spacing * (maze.x - 1);
		player.position.y = -spacing * (maze.y - 1);
		scene.add(player);
	}
	
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
	
	function imageMarker(url, color, scale)
	{
		var res, material;
		if (renderer instanceof THREE.CanvasRenderer)
		{
			material = new THREE.ParticleBasicMaterial( { color:color, blending: THREE.NormalBlending, sizeAttenuation:false } );
			res = new THREE.Particle(material);
		}
		else
		{
			material = new THREE.SpriteMaterial({color:color, transparent:false, useScreenCoordinates:false, blending: THREE.NormalBlending});
			res = new THREE.Sprite(material);
		}
		
		// Load image texture from URL and set particle size on load done.
		var texture = THREE.ImageUtils.loadTexture(url, null, function (texture){
			if (material instanceof THREE.ParticleBasicMaterial)
			{
				res.scale.x = scale * 0.4;
				res.scale.y = scale * 0.4;
			}
			else
			{
				res.scale.x = scale * texture.image.width / windowHeight;
				res.scale.y = scale * texture.image.height / windowHeight;
			}
			material.map = texture;
			dirty = true;
		});
		
		return res;
	}
		
	// App player
	var player = imageMarker("homer.png", new THREE.Color("blue"), 0.55);
	player.position.x = 0;
	player.position.y = 0;
	scene.add(player);
	
	this.updatePlayerPosition = function(position)
	{
		player.position.x = position.x * spacing;
		player.position.y = position.y * spacing;
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