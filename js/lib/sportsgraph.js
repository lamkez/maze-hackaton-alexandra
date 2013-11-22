//var THREE = require("three");
//var THREE = require("three");

var sportsgraph = {"version":0.1};

sportsgraph.Runner = function ( name, url, speed, dist, yPixelOffset ) {

	this.set(name, url, speed, dist, yPixelOffset);
	
	return this;
};

sportsgraph.Runner.prototype = {

	constructor: sportsgraph.Runner,

	name: "", 
	distance: 0, 
	speed: 0,
	yPixelOffset: 0,
	url: undefined,
	geometry: undefined,

	set: function ( name, url, speed, dist, yPixelOffset ) {
		if ( name !== undefined ) this.name = name;
		if ( url !== undefined ) this.url = url;
		if ( speed !== undefined ) this.speed = speed;
		if ( dist !== undefined ) this.dist = dist;
		if ( yPixelOffset !== undefined ) this.yPixelOffset = yPixelOffset;
	}
};

sportsgraph.EventTypes = {
	SECTION_SELECTED : "section_pressed",
	RUNNER_SELECTED : "runner_pressed"
}

sportsgraph.Event = function (source, properties) {
	if (source !== undefined && properties !== undefined)
		this.set(source, properties);
	return this;
}

sportsgraph.Event.prototype = {
	constructor: sportsgraph.Event,
	
	source: "",
	properties: undefined,
	
	set: function (source, properties) {
		if (source !== undefined) this.source = source;
		if (location !== undefined) this.properties = properties;
	}
};

var mul_table = [ 1,57,41,21,203,34,97,73,227,91,149,62,105,45,39,137,241,107,3,173,39,71,65,238,219,101,187,87,81,151,141,133,249,117,221,209,197,187,177,169,5,153,73,139,133,127,243,233,223,107,103,99,191,23,177,171,165,159,77,149,9,139,135,131,253,245,119,231,224,109,211,103,25,195,189,23,45,175,171,83,81,79,155,151,147,9,141,137,67,131,129,251,123,30,235,115,113,221,217,53,13,51,50,49,193,189,185,91,179,175,43,169,83,163,5,79,155,19,75,147,145,143,35,69,17,67,33,65,255,251,247,243,239,59,29,229,113,111,219,27,213,105,207,51,201,199,49,193,191,47,93,183,181,179,11,87,43,85,167,165,163,161,159,157,155,77,19,75,37,73,145,143,141,35,138,137,135,67,33,131,129,255,63,250,247,61,121,239,237,117,29,229,227,225,111,55,109,216,213,211,209,207,205,203,201,199,197,195,193,48,190,47,93,185,183,181,179,178,176,175,173,171,85,21,167,165,41,163,161,5,79,157,78,154,153,19,75,149,74,147,73,144,143,71,141,140,139,137,17,135,134,133,66,131,65,129,1];
        
   
var shg_table = [0,9,10,10,14,12,14,14,16,15,16,15,16,15,15,17,18,17,12,18,16,17,17,19,19,18,19,18,18,19,19,19,20,19,20,20,20,20,20,20,15,20,19,20,20,20,21,21,21,20,20,20,21,18,21,21,21,21,20,21,17,21,21,21,22,22,21,22,22,21,22,21,19,22,22,19,20,22,22,21,21,21,22,22,22,18,22,22,21,22,22,23,22,20,23,22,22,23,23,21,19,21,21,21,23,23,23,22,23,23,21,23,22,23,18,22,23,20,22,23,23,23,21,22,20,22,21,22,24,24,24,24,24,22,21,24,23,23,24,21,24,23,24,22,24,24,22,24,24,22,23,24,24,24,20,23,22,23,24,24,24,24,24,24,24,23,21,23,22,23,24,24,24,22,24,24,24,23,22,24,24,25,23,25,25,23,24,25,25,24,22,25,25,25,24,23,24,25,25,25,25,25,25,25,25,25,25,25,25,23,25,23,24,25,25,25,25,25,25,25,25,25,24,22,25,25,23,25,25,20,24,25,24,25,25,22,24,25,24,25,24,25,25,24,25,25,25,25,22,25,25,25,24,25,24,25,18];

function boxBlurCanvasRGBA( context, top_x, top_y, width, height, radius, iterations ){
	if ( isNaN(radius) || radius < 1 ) return;
	
	radius |= 0;
	
	if ( isNaN(iterations) ) iterations = 1;
	iterations |= 0;
	if ( iterations > 3 ) iterations = 3;
	if ( iterations < 1 ) iterations = 1;

	var imageData;
	
	try {
	  try {
		imageData = context.getImageData( top_x, top_y, width, height );
	  } catch(e) {
	  
		// NOTE: this part is supposedly only needed if you want to work with local files
		// so it might be okay to remove the whole try/catch block and just use
		// imageData = context.getImageData( top_x, top_y, width, height );
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			imageData = context.getImageData( top_x, top_y, width, height );
		} catch(e) {
			alert("Cannot access local image");
			throw new Error("unable to access local image data: " + e);
			return;
		}
	  }
	} catch(e) {
	  alert("Cannot access image");
	  throw new Error("unable to access image data: " + e);
	  return;
	}
			
	var pixels = imageData.data;
		
	var rsum,gsum,bsum,asum,x,y,i,p,p1,p2,yp,yi,yw,idx,pa;		
	var wm = width - 1;
  	var hm = height - 1;
    var wh = width * height;
	var rad1 = radius + 1;
    
	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];

	var r = [];
    var g = [];
    var b = [];
	var a = [];
	
	var vmin = [];
	var vmax = [];
  
	while ( iterations-- > 0 ){
		yw = yi = 0;
	 
		for ( y=0; y < height; y++ ){
			rsum = pixels[yw]   * rad1;
			gsum = pixels[yw+1] * rad1;
			bsum = pixels[yw+2] * rad1;
			asum = pixels[yw+3] * rad1;
			
			
			for( i = 1; i <= radius; i++ ){
				p = yw + (((i > wm ? wm : i )) << 2 );
				rsum += pixels[p++];
				gsum += pixels[p++];
				bsum += pixels[p++];
				asum += pixels[p]
			}
			
			for ( x = 0; x < width; x++ ) {
				r[yi] = rsum;
				g[yi] = gsum;
				b[yi] = bsum;
				a[yi] = asum;

				if( y==0) {
					vmin[x] = ( ( p = x + rad1) < wm ? p : wm ) << 2;
					vmax[x] = ( ( p = x - radius) > 0 ? p << 2 : 0 );
				} 
				
				p1 = yw + vmin[x];
				p2 = yw + vmax[x];
				  
				rsum += pixels[p1++] - pixels[p2++];
				gsum += pixels[p1++] - pixels[p2++];
				bsum += pixels[p1++] - pixels[p2++];
				asum += pixels[p1]   - pixels[p2];
					 
				yi++;
			}
			yw += ( width << 2 );
		}
	  
		for ( x = 0; x < width; x++ ) {
			yp = x;
			rsum = r[yp] * rad1;
			gsum = g[yp] * rad1;
			bsum = b[yp] * rad1;
			asum = a[yp] * rad1;
			
			for( i = 1; i <= radius; i++ ) {
			  yp += ( i > hm ? 0 : width );
			  rsum += r[yp];
			  gsum += g[yp];
			  bsum += b[yp];
			  asum += a[yp];
			}
			
			yi = x << 2;
			for ( y = 0; y < height; y++) {
				
				pixels[yi+3] = pa = (asum * mul_sum) >>> shg_sum;
				if ( pa > 0 )
				{
					pa = 255 / pa;
					pixels[yi]   = ((rsum * mul_sum) >>> shg_sum) * pa;
					pixels[yi+1] = ((gsum * mul_sum) >>> shg_sum) * pa;
					pixels[yi+2] = ((bsum * mul_sum) >>> shg_sum) * pa;
				} else {
					pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
				}				
				if( x == 0 ) {
					vmin[y] = ( ( p = y + rad1) < hm ? p : hm ) * width;
					vmax[y] = ( ( p = y - radius) > 0 ? p * width : 0 );
				} 
			  
				p1 = x + vmin[y];
				p2 = x + vmax[y];

				rsum += r[p1] - r[p2];
				gsum += g[p1] - g[p2];
				bsum += b[p1] - b[p2];
				asum += a[p1] - a[p2];

				yi += width << 2;
			}
		}
	}
	
	context.putImageData( imageData, top_x, top_y );
	
}

// Circular graph
sportsgraph.circular = function(container, options, data) {
    MESH_SIDE = {
        FRONT_SIDE : "front_side",
        BACK_SIDE : "back_side",
        TOP : "top"
    };

	var eventHandlers = new Array();
		var mouseX = -2, mouseY = -2, mouseXOnMouseDown = 0, mousePressed = false;
		targetRotation = -Math.PI / 2, mouseTargetRotation = targetRotation, currentRotation = targetRotation, targetRotationOnMouseDown = 0;
		var mouseDictatesRotation = false;
		var mouseDictatesTimeout = 1500;
		var bFollowMode = false;
		var lastRenderTime = new Date();

		var windowHeight = container.clientHeight;
		var windowWidth = container.clientWidth;
		var windowHalfX = container.clientWidth / 2;
		var windowHalfY = container.clientHeight / 2;
					
		// COLORS
		var topColorLightnessOffset = 0.15;
		var whiteColor = new THREE.Color( "white" );
		var bottomColor = new THREE.Color(0x707070);
		var outsideMeshColor = new THREE.Color(0x53C7FD); 
		var insideMeshColor = new THREE.Color(0x2F9FFD);
		var backGroundColor = new THREE.Color(0xffffff);
		var markerColor = new THREE.Color(0x000000);
		var hoverColor = new THREE.Color(0xDB1A49);
		var selectedColor = new THREE.Color(0xDB1A49);
		
		// SPRITE URLS
		var circleTextureURL = "images/sprites/circle.png";
		var circleSprite = new THREE.Texture( generateSprite( markerColor ));
				
		// SCENE PROPERTIES
		var fGap = 2 * Math.PI / 200; // The angle in radian between start and end of graph
		var fTotalAngle = 2 * Math.PI - fGap; // DO NOT TOUCH
		var fRadius = container.clientWidth / 5.5; // The radius of the graph (DO NOT TOUCH)
        var fGraphWidth = 6; // The witdh of the graph
        var fLookatHeight = 25; // The camera elevation above the graph

		// GRAPH HEIGHT PROPERTIES
		var fMinHeight = 5; // The minimum height of the graph
		var fMaxHeight = 20; // The maximum height of the graph
		var fMin = 1000000, fMax = -1000000;
		var fHeightScale = 1.0; // The computed graph scale
		var fMaxScale = 1.0; // The maximum allowed computed scale. (Avoids scaling tracks with small height differences)
		var ruteDistance = 0.0; // The computed route distance
		
		var fTweeningFactor = 0.005; // The tween animation factor when rotating the graph
		
		var trackData = data;
		var runners = {};
        
		// SETUP CAMERA
		// camera = new THREE.PerspectiveCamera( 75, container.clientWidth / container.clientHeight, 1, 5000 );
		camera = new THREE.OrthographicCamera( container.clientWidth / -5, container.clientWidth / 5, container.clientHeight / 5, container.clientHeight / -5, 1, 1000 );
		camera.position.z = fRadius + 200;
		camera.position.y = 45;
		fLookatHeight = 20;
		camera.fov = 75;
		camera.lookAt(new THREE.Vector3(0,fLookatHeight,0));
		fMaxHeight = container.clientHeight / 8;
		// Make sure camera matrices are up to date
		camera.updateMatrix();
		camera.updateMatrixWorld();

   		var backgroundTexture = new THREE.Texture( generateBackgroundShadows( whiteColor, markerColor, camera, fLookatHeight, fGraphWidth ));
        backgroundTexture.needsUpdate = true;			
		var bg = new THREE.Mesh(
			new THREE.PlaneGeometry(2, 2, 0),
			new THREE.MeshBasicMaterial({map: backgroundTexture, overdraw : 0.6, color: whiteColor, side: THREE.FrontSide})
		);
	
                
        // The bg plane shouldn't care about the z-buffer.
        bg.material.depthTest = false;
        bg.material.depthWrite = false;

        var bgScene = new THREE.Scene();
        var bgCam = new THREE.Camera();
        bgScene.add(bg);        
        
		var scene = new THREE.Scene();
		var projector = new THREE.Projector();
		var raycaster = new THREE.Raycaster();

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
			outsideMeshColor.multiplyScalar(0.75);
			insideMeshColor.multiplyScalar(0.75);
			markerColor.multiplyScalar(0.75);
			selectedColor.multiplyScalar(0.75);
			hoverColor.multiplyScalar(0.75);
        }
        renderer.context = container;
		
		renderer.setSize( container.clientWidth, container.clientHeight );
		renderer.setClearColor( backGroundColor, 1 );
		renderer.sortObjects = false;
		renderer.sortElements = true;
		renderer.autoClear = false;
		container.appendChild( renderer.domElement );

		// Add stats dom element
		var stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild(stats.domElement);

		// Precomputations
		computeMinMax();
		var distances = computeDistances();
		ruteDistance = distances[distances.length - 1];
		

		// Add height graph mesh
		var meshMaterial = new THREE.MeshBasicMaterial( { color:outsideMeshColor, opacity:1.0, shading: THREE.FlatShading, side: THREE.FrontSide, overdraw: 0.75, vertexColors: THREE.VertexColors } );
		var insideMaterial = new THREE.MeshBasicMaterial( { color:insideMeshColor, opacity:1.0, shading: THREE.FlatShading, side: THREE.FrontSide, overdraw: 0.75, vertexColors: THREE.VertexColors } );
		var topMaterial = new THREE.MeshBasicMaterial( { color:outsideMeshColor.clone(), opacity:1.0, shading: THREE.FlatShading, side: THREE.FrontSide, overdraw: 0.75, vertexColors: THREE.VertexColors } );
		
		var sections = new Array();

        var previousSectionEnd = 0;
       
        // fill out array(s) of sections
        if (options.hasOwnProperty("sections"))
        {
            for(var index in options.sections)
            {
                var section = options.sections[index];
           	 	var start, end, name, color, hoverColor, selColor;
                // fill out gap between sections if any
                if (Math.abs(previousSectionEnd - section.startLocation) > 0.01)
                {
					start = previousSectionEnd;
					end = section.startLocation;
					sections.push({"start":start, "end":end});
                }
				start = section.startLocation;
				end = section.endLocation;
				name = section.name;
				color = section.hasOwnProperty("color") ? section.color : undefined;
				hoverColor = section.hasOwnProperty("hoverColor") ? section.hoverColor : color;
				selColor = section.hasOwnProperty("selectedColor") ? section.selectedColor : color;
				
				sections.push({"start":start, "end":end, "name":name, "color":color, "selectedColor": selColor, "hoverColor": hoverColor});
                
                previousSectionEnd = section.endLocation;
            }
        }
        // if the last section did not cover the last part of the route add this part
        if (previousSectionEnd < ruteDistance)
        {
			sections.push({"start":previousSectionEnd, "end":ruteDistance});
        }
        
        var section;
		for (var sectionIndex in sections)
		{
			section = sections[sectionIndex];
            var startDistance = section.start;
            var endDistance = section.end;

			var outsideMesh = new THREE.Mesh(meshFromTrackRanged(null, startDistance, endDistance, bottomColor, whiteColor, MESH_SIDE.FRONT_SIDE), meshMaterial.clone());
			outsideMesh.name = sectionIndex;
			outsideMesh.material.color.set(section.color !== undefined ? section.color : outsideMeshColor); 
			scene.add(outsideMesh);
			section.outside = outsideMesh;

			var insideMesh = new THREE.Mesh(meshFromTrackRanged(null, startDistance, endDistance, bottomColor, whiteColor, MESH_SIDE.BACK_SIDE), insideMaterial.clone());
			insideMesh.name = sectionIndex;
			insideMesh.flipSide = true;
			insideMesh.material.color.set(section.color !== undefined ? section.color : insideMeshColor);
			scene.add(insideMesh);
			section.inside = insideMesh;

			var topMesh = new THREE.Mesh(meshFromTrackRanged(null, startDistance, endDistance, whiteColor, whiteColor, MESH_SIDE.TOP), topMaterial.clone());
			topMesh.name = sectionIndex;
			topMesh.material.color.set(section.color !== undefined ? section.color : outsideMeshColor).offsetHSL(0,0,topColorLightnessOffset);
			scene.add(topMesh);
			section.top = topMesh;
        }
        
		// Add marking geometry
		var markingGeometry = parseMarkings(options.markings);
		for (var index in markingGeometry)
		{
			var element = markingGeometry[index];
			scene.add(element);
		}
				
		// var planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.25*fRadius, 2.25*fRadius, 1, 1), new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("images/sprites/shadow.png"), side:THREE.FrontSide, transparent:true, opacity:1, blending:THREE.NormalBlending}));
		// var planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.25*fRadius, 2.25*fRadius, 1, 1), new THREE.MeshBasicMaterial({color:0xff0000, side:THREE.FrontSide, transparent:true, opacity:0.75, blending:THREE.NormalBlending}));
		// planeMesh.rotation.x = -Math.PI / 2;
		// planeMesh.updateMatrix();
		// scene.add(planeMesh);
		// scene.autoUpdate = true;
				
///////////		

        var composer, dpr, effectFXAA, renderScene;

        dpr = 1;
        if (window.devicePixelRatio !== undefined) {
           dpr = window.devicePixelRatio;
         }

        renderBGScene = new THREE.RenderPass(bgScene, bgCam);
//        renderBGScene.clear = true;
        renderScene = new THREE.RenderPass(scene, camera);
        renderScene.clear = false;
        effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
        effectFXAA.uniforms['resolution'].value.set(1 / (windowWidth * dpr), 1 / (windowHeight * dpr));
        effectFXAA.renderToScreen = true;

        composer = new THREE.EffectComposer(renderer);
        composer.setSize(windowWidth * dpr, windowHeight * dpr);
        composer.addPass(renderBGScene);
        composer.addPass(renderScene);
        composer.addPass(effectFXAA);
/////////////
        
                
		// Called at each frame
		var date, deltaTime, selection, newSelection, dirty = true;
		var animate = function() {			
			// Update stats module
			stats.update();
			
			if (!dirty) {
				requestAnimationFrame(animate);
				return;
			}
			dirty = false;

			// Update rotational state
			date = new Date();
			deltaTime = date - lastRenderTime;
			lastRenderTime = date;
			
			updateRotation(deltaTime);
			
			scene.rotation.y = currentRotation;
			scene.updateMatrix();
			scene.updateMatrixWorld();
			
			// Find intersection
			newSelection = computeSelection();
			{
				// Remove selection from
				if (selection !== undefined) {
					if (selection instanceof sportsgraph.Runner) {
						
					} else {
	                	var section = selection;
						if (section !== undefined && section.hasOwnProperty("name") && section.name !== undefined) {
							section.inside.material.color.set(section.color !== undefined ? section.color : insideMeshColor);
							section.outside.material.color.set(section.color !== undefined ? section.color : outsideMeshColor); 
							section.top.material.color.set(section.color !== undefined ? section.color : outsideMeshColor).offsetHSL(0,0,topColorLightnessOffset); 						
						}
					}
				}
				
				selection = newSelection;
				if (selection !== undefined)
				{
					if (selection instanceof sportsgraph.Runner) {
						
					} else {
	                	var section = selection;
						if (section !== undefined && section.hasOwnProperty("name") && section.name !== undefined) {
	                        var color;
							if (mousePressed) {
								color = section.selectedColor !== undefined ? section.selectedColor : selectedColor;
							} else {
								color = section.hoverColor !== undefined ? section.hoverColor : hoverColor;
							}
						
							section.inside.material.color.set(color);
							section.outside.material.color.set(color);
							section.top.material.color.set(color).offsetHSL(0,0,topColorLightnessOffset);

						}
					}
				}
			}
			
//			renderer.clear();
//			renderer.render(bgScene, bgCam);
////////
            composer.render();

            // Render scene
//			renderer.render( scene, camera);
						
			requestAnimationFrame(animate);
		};
		
		animate();
		
		// Tells the graph to start a rendering loop
		this.draw = function(runnerInfo) {
			// Update runners based on info
			updateRunners(runnerInfo);
			
			dirty = true;
		}
		
		// Update the graph with runner info
		this.update = function(runnerInfo) {
			this.draw(runnerInfo);
		}
		
		this.addEventHandler = function(handler) {
			eventHandlers.push(handler);
		}
		
		this.removeEventHandler = function(handler) {
			eventHandlers.pop(handler);
		}
		
		function handleEvent( event )
		{
			var length = eventHandlers.length,
			    element = null;
			for (var i = 0; i < length; i++) {
				element = eventHandlers[i];
				if (element !== undefined && typeof element === 'function')
				{
					element(event);
				}
			}
		}
		
		// Compute the intersection with geometry
		function computeSelection() {
			var vector = new THREE.Vector3(mouseX, mouseY, 1);
			var raycaster = projector.pickingRay(vector, camera);
			
			// Find intersection with runners
			var matrixPosition = new THREE.Vector3();
			var intersects = [];
			for (var runner in runners)
			{
				var object = runners[runner].geometry;
				matrixPosition.getPositionFromMatrix( object.matrixWorld );
				var distance = raycaster.ray.distanceToPoint( matrixPosition );

				if ( distance > 5.0 ) {
					continue;
				}

				intersects.push( {
					distance: distance,
					point: object.position,
					face: null,
					object: object
				} );
			}
			
			if (intersects.length == 0)
				intersects = intersects.concat(raycaster.intersectObjects(scene.children));

			if ( intersects.length > 0 ) {
				var object = intersects[ 0 ].object;
				if (object instanceof THREE.Mesh)
				{
					if (object.name !== undefined)
						return sections[object.name];
				}
				else if (object instanceof THREE.Sprite || object instanceof THREE.Particle)
				{
					if (object.name !== undefined)
						return runners[object.name];
				}
			}

			return undefined;
		}
		
		// Update the scene rotation angle "currentRotation"
		function updateRotation(deltaTimeSeconds) {
			var target;
			
			if (!bFollowMode)
			{
				targetRotation = 15.0 * mouseTargetRotation;
			}
			
			if (mouseDictatesRotation)
			{
				target = mouseTargetRotation;
			}
			else
			{
				target = targetRotation;

				while (target - currentRotation > Math.PI)
				{
					currentRotation += 2 * Math.PI;
				}
				
				while (target - currentRotation < -Math.PI)
				{
					currentRotation -= 2 * Math.PI;
				}		
			}
			
			currentRotation = currentRotation + (target - currentRotation) * Math.min(1, deltaTimeSeconds*fTweeningFactor);
			
			if (Math.abs(currentRotation - target) > 0.01 || mouseDictatesRotation)
			{
				dirty = true;
			}
		}

		function updateRunners(runnerInfo) {
			if (runnerInfo.hasOwnProperty("runners"))
			{
				// Update existing runners
				var missingNames = Object.keys(runners);
				
				for (runnerIndex in runnerInfo.runners)
				{
					var runner = runnerInfo.runners[runnerIndex];
					var dist = 0, url = 0, name = "", speed = 0, yPixelOffset = 0; 
					if (runner.hasOwnProperty("distance"))
					{
						dist = runner.distance;
					}

					if (runner.hasOwnProperty("follow") && runner.follow)
					{
						bFollowMode = true;
						var fraction = dist / ruteDistance;
						if (fraction > 1) 
						{
							fraction = 1;
						}
						var rotation = -fraction * 2 * Math.PI - Math.PI / 2;
						targetRotation = rotation;
					}
					
					if (runner.hasOwnProperty("url"))
					{
						url = runner.url;
					}
					
					if (runner.hasOwnProperty("name"))
					{
						name = runner.name;
					}
					
					if (runner.hasOwnProperty("speed"))
					{
						speed = runner.speed;
					}
					
					if (runner.hasOwnProperty("yPixelOffset"))
					{
						yPixelOffset = runner.yPixelOffset;
					}
					
					if (!runners.hasOwnProperty(name))
					{
						// Create new runner obejct
						runners[name] = new sportsgraph.Runner(name, url, speed, dist, yPixelOffset);
						// Set geometry for marker
						runners[name].geometry = imageMarker(dist, url, whiteColor, 1, yPixelOffset);
						runners[name].geometry.name = name;
						scene.add(runners[name].geometry);
					}
					else
					{
						// Update changable properties
						runners[name].speed = speed;
						runners[name].dist = dist;
						runners[name].yPixelOffset = yPixelOffset;
						
						// Update geometry position
						var imageHeight = runners[name].geometry.material.map.image == undefined ? 40 : runners[name].geometry.material.map.image.height;
						runners[name].geometry.position.copy(locationTransform(dist, true, runners[name].yPixelOffset + imageHeight / 2));
					}

					var indexOfNameInMissingArray = missingNames.indexOf(name);
					
					if (indexOfNameInMissingArray > -1) 
					{						
						//delete missingNames[indexOfNameInMissingArray];
						missingNames.splice(indexOfNameInMissingArray,1);
					}
				}
				
				// Remove unseed names
				for (var missingNamesIndex in missingNames)
				{
					scene.remove(runners[missingNames[missingNamesIndex]].geometry);
					delete runners[missingNames[missingNamesIndex]];
				}
			}
			else
			{
				for (var runner in runners)
				{
					scene.remove(runner.geometry);
				}
				runners.clear();
			}
		}

		/**
		* markings is a JSON tuple
		* Marking
		*	location : int (required)
		*	repeats : int (number of repeats, -1 for infinit)
		*	url : string (url location for image texture)
		*	type : "circle" or "box"
		*   size : int (size of marker 1 == 100%, 2 == 200%)
		*   color : hex (color of simpe type)
		*/
		function parseMarkings(markings) {
			var geometry = new Array();
			
			// TODO keep map with allready allocated locations
			
			for(var index in markings)
			{
				var marking = markings[index];
				var location = marking.location;
				var yPixelOffset = marking.hasOwnProperty("yPixelOffset") ? marking.yPixelOffset : 0;
			
				var repeats = marking.hasOwnProperty("repeats") ? marking.repeats : 1;
				if (repeats < 0)
				{
					repeats = ruteDistance / location;
				}
				var size = marking.hasOwnProperty("size") ? marking.size : 1;
				for (var i = 1; i <= repeats; ++i)
				{
					var markerLocation = i * location;
					
					if (marking.hasOwnProperty("url"))
					{
						var color = marking.hasOwnProperty("color") ? new THREE.Color(marking.color) : new THREE.Color(0xffffff);
						geometry.push(imageMarker(markerLocation, marking.url, color, size, yPixelOffset));
					}
					else
					{
						var type = marking.hasOwnProperty("type") ? marking.type : "circle";
						var color = marking.hasOwnProperty("color") ? new THREE.Color(marking.color) : markerColor;
						geometry.push(marker(markerLocation, type, size, color));
					}
				}
			}
			return geometry;
		}
		
		function marker(location, type, scale, color)
		{
			var res;
			if (type === "circle")
			{
				if (renderer instanceof THREE.CanvasRenderer)
				{
					res = new THREE.Particle(new THREE.ParticleBasicMaterial( { color:color, map: circleSprite, blending: THREE.NormalBlending } ));					
					res.scale.x = res.scale.y = scale / 10;
				}
				else
				{
					res = new THREE.Sprite(new THREE.SpriteMaterial( { color:color, map: THREE.ImageUtils.loadTexture(circleTextureURL, null, function(texture){
						dirty = true;
						res.scale.x = 2.5 * scale / windowHeight;
						res.scale.y = 2.5 * scale / windowHeight;
					}), useScreenCoordinates:false, blending: THREE.NormalBlending } ));										
				}
			}
			else if (type === "box")
			{
				res = new THREE.Mesh(new THREE.CubeGeometry(size), material);
			}
			
			var transform = locationTransform(location, true);
			transform.y += 3;
			res.position.copy(transform);
			return res;
		}
		
		function imageMarker(location, url, color, scale, fYPixelOffset)
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
				
				var transform = locationTransform(location, true, fYPixelOffset + texture.image.height / 2);
				res.position.copy(transform);
			});
			
			return res;
		}

		function generatePlane(color) {
			var canvas = document.createElement( 'canvas' );
			canvas.width = 256;
			canvas.height = 256;

			var context = canvas.getContext( '2d' );
			var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
			gradient.addColorStop( 0, 'rgba(' + ( 1 * 255 ) + ',' + ( 1 * 255 ) + ',' + ( 1 * 255 ) + ', 1)');
			gradient.addColorStop( 0.7, 'rgba(' + ( 1 * 255 ) + ',' + ( 1 * 255 ) + ',' + ( 1 * 255 ) + ', 1)');
			gradient.addColorStop( 0.8, 'rgba(' + ( color.r * 255 ) + ',' + ( color.g * 255 ) + ',' + ( color.b * 255 ) + ', 1)');
			gradient.addColorStop( 0.9, 'rgba(' + ( 1 * 255 ) + ',' + ( 1 * 255 ) + ',' + ( 1 * 255 ) + ', 1)');
			gradient.addColorStop( 1, 'rgba(' + ( 1 * 255 ) + ',' + ( 1 * 255 ) + ',' + ( 1 * 255 ) + ', 1)');

			context.fillStyle = gradient;
			context.fillRect( 0, 0, canvas.width, canvas.height );

			return canvas;

		}
				
		function generateSprite(color) {
			var canvas = document.createElement( 'canvas' );
			canvas.width = 10;
			canvas.height = 10;

			var context = canvas.getContext( '2d' );
			var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
			gradient.addColorStop( 0, 'rgba(' + ( color.r * 255 ) + ',' + ( color.g * 255 ) + ',' + ( color.b * 255 ) + ', 1)');
			gradient.addColorStop( 1, 'rgba(' + ( color.r * 255 ) + ',' + ( color.g * 255 ) + ',' + ( color.b * 255 ) + ', 0)');

			context.fillStyle = gradient;
			context.fillRect( 0, 0, canvas.width, canvas.height );

			return canvas;
		}

        function ellipse(context, cx, cy, rx, ry){
            context.save(); // save state
            context.beginPath();

            context.translate(cx-rx, cy-ry);
            context.scale(rx, ry);
            context.arc(1, 1, 1, 0, 2 * Math.PI, false);

            context.restore(); // restore to original state
            context.stroke();
        }
        
		function generateBackgroundShadows(backgroundColor, shadowColor, camera, lookatHeight, graphTrackWidth) {
			var canvas = document.createElement( 'canvas' );
            canvas.setAttribute("id", "backgroundImage");
			canvas.width = 2*windowHalfX;
			canvas.height = 2*windowHalfY;

   			var context = canvas.getContext( '2d' );
            
            context.rect(0,0,canvas.width ,canvas.height );
            context.fillStyle='rgba(' + ( backgroundColor.r * 255 ) + ',' + ( backgroundColor.g * 255 ) + ',' + ( backgroundColor.b * 255 ) + ', 1)';
            context.fill();
            
            context.lineWidth = 12 + graphTrackWidth;
            context.strokeStyle='rgba(' + ( shadowColor.r * 255 ) + ',' + ( shadowColor.g * 255 ) + ',' + ( shadowColor.b * 255 ) + ', 1)';

            var projector = new THREE.Projector();

			var radius = fRadius * 1.015;
            var widthVector = projector.projectVector( new THREE.Vector3(-radius, 0, 0), camera );
            widthVector.x = ( widthVector.x * windowHalfX ) + windowHalfX;
            widthVector.y = - ( widthVector.y * windowHalfY ) + windowHalfY;

            var heightVector = projector.projectVector( new THREE.Vector3(0, 0, -radius), camera );
            heightVector.x = ( heightVector.x * windowHalfX ) + windowHalfX;
            heightVector.y = - ( heightVector.y * windowHalfY ) + windowHalfY;

            var centerVector = projector.projectVector( new THREE.Vector3(0, 0, 0), camera );
            centerVector.x = ( centerVector.x * windowHalfX ) + windowHalfX;
            centerVector.y = -( centerVector.y * windowHalfY ) + windowHalfY;
            
//            ellipse(context, canvas.width / 2, canvas.height * 0.685, canvas.width *0.37, canvas.height *0.18)

            ellipse(context, centerVector.x, centerVector.y, (widthVector.x-centerVector.x), (heightVector.y-centerVector.y));
            boxBlurCanvasRGBA( context, 0, 0, canvas.width, canvas.height, 6, 3 );

            return canvas;
		}
		
		function computeDistances() {
			var distances = new Array();
			var distance = 0.0;
			distances.push(distance);
			
			if (trackData.length < 2){
				return distance;				
			}
			
			var data = trackData[0];
			var latLongToMeters = gps.lattitudeToMeters(data["Position"][0]["LatitudeDegrees"]);
			var prevPos = new THREE.Vector3(latLongToMeters.lattitudeToMeters * data["Position"][0]["LatitudeDegrees"], 
										latLongToMeters.longitudeToMeters * data["Position"][0]["LongitudeDegrees"], 
										1.0 * data["AltitudeMeters"][0]);
			
			for (var i = 1; i < trackData.length; ++i)
			{
				var trackPoint = trackData[i];
				
				if (trackPoint.hasOwnProperty("Position"))
				{
					var lat = trackPoint["Position"][0]["LatitudeDegrees"];
					var long = trackPoint["Position"][0]["LongitudeDegrees"];
					
					var latLongToMeters = gps.lattitudeToMeters(lat);
					var pos = new THREE.Vector3(latLongToMeters.lattitudeToMeters * lat, 
												latLongToMeters.longitudeToMeters * long, 
												1.0 * trackPoint["AltitudeMeters"][0]);
					var deltaDistance = pos.clone().sub(prevPos).length();
					
					distance += deltaDistance;
					distances.push(distance);
					prevPos = pos;
				}
			}
			
			return distances;
		}
				
		function computeMinMax() {
			fMin = 10000000000;
			fMax = -10000000000;
			
			for (var i = 0; i < trackData.length; ++i)
			{
				var trackPoint = trackData[i];
				if (trackPoint.hasOwnProperty("AltitudeMeters"))
				{
					fMin = Math.min(fMin, trackPoint["AltitudeMeters"]);
					fMax = Math.max(fMax, trackPoint["AltitudeMeters"]);
				}
			}
			
			fHeightScale = Math.min(fMaxScale, fMaxHeight / (fMax - fMin));
			fMin -= fMinHeight;
		}

		function meshFromTrackRanged(geometry, startDistance, endDistance, meshColor, meshColorTop, meshSide ) {	
			if (trackData == null)
				return geometry;
				
			if (geometry == null)
				geometry = new THREE.Geometry();
                
            var startPercentage = startDistance / ruteDistance;
            var endPercentage = endDistance / ruteDistance;

            var fCurrentRadius = fRadius - fGraphWidth/2;

            var isFrontside = (meshSide == this.MESH_SIDE.FRONT_SIDE);
            var isTop = (meshSide == this.MESH_SIDE.TOP);
            
            if (isFrontside || isTop)
            {
                fCurrentRadius += fGraphWidth;
            }
                            
			var indexCounter = 0;
			var prevColorTop;
            var previousPercentage = 0;
            var previousAltitude = 0;


            if (isTop && startDistance == 0.0)
            {
                var angle = 0;//-startPercentage * fTotalAngle;

       			var x = Math.cos(angle);
				var z = Math.sin(angle);

                var bottomPointOuter = new THREE.Vector3(fCurrentRadius * x, 0, fCurrentRadius * z);
                geometry.vertices.push(bottomPointOuter);
 
                var bottomPointInner = new THREE.Vector3((fCurrentRadius - fGraphWidth) * x, 0, (fCurrentRadius - fGraphWidth) * z);
                geometry.vertices.push(bottomPointInner);
                indexCounter++;
            }
  

            var percentage = 0.0;

			for (var i = 0; i < trackData.length; ++i)
			{
				var trackPoint = trackData[i];
				percentage = distances[i] / ruteDistance;

				// Initial mesh
                if ( percentage >= startPercentage && previousPercentage < startPercentage)
                {
                    var angle = -startPercentage * fTotalAngle;
        			var x = Math.cos(angle);
					var z = Math.sin(angle);
					var altitudeHere = fHeightScale * (trackPoint["AltitudeMeters"] - fMin);

                    var s = (startPercentage - previousPercentage) / (percentage - previousPercentage);
                    var altitude = s * altitudeHere + (1 - s)*previousAltitude;


                    if (isTop)
                    {
                        var topPointOuter = new THREE.Vector3(fCurrentRadius * x, altitude, fCurrentRadius * z);
                        geometry.vertices.push(topPointOuter);
 
                        var topPointInner = new THREE.Vector3((fCurrentRadius - fGraphWidth) * x, altitude, (fCurrentRadius - fGraphWidth) * z);
                            geometry.vertices.push(topPointInner);
                    }
                    else
                    {
                        var topPoint = new THREE.Vector3(fCurrentRadius * x, altitude, fCurrentRadius * z);
                        geometry.vertices.push(topPoint);
                        geometry.vertices.push(new THREE.Vector3(fCurrentRadius * x, 0, fCurrentRadius * z));
                    }

					
					var t = altitude / (fMax * fHeightScale);
					var colorTop = meshColor.clone().lerp(meshColorTop, t);
					
					if (indexCounter > 0)
					{
						var normal = new THREE.Vector3(x, 0, z);
                        if (isFrontside)
                        {
							normal *= -1;
                            geometry.faces.push(new THREE.Face3(2 * indexCounter, 2 * (indexCounter-1), 2*indexCounter+1, normal, [colorTop, prevColorTop, meshColor], 0));
                            geometry.faces.push(new THREE.Face3(2 * (indexCounter-1), 2*(indexCounter-1)+1, 2 * indexCounter+1, normal, [prevColorTop, meshColor, meshColor], 0));
                        }
                        else if (isTop)
                        {
                            geometry.faces.push(new THREE.Face3(2 * (indexCounter-1)+0, 2 * (indexCounter)+1, 2*(indexCounter-1)+1, normal, [meshColor, meshColor, meshColor], 0));
                            geometry.faces.push(new THREE.Face3(2 * (indexCounter-1)+0, 2 * (indexCounter)+0, 2*(indexCounter)+1, normal, [meshColor, meshColor, meshColor], 0));
                        }
                        else
                        {
                            geometry.faces.push(new THREE.Face3(2 * indexCounter, 2*indexCounter+1, 2 * (indexCounter-1), normal, [colorTop, meshColor, prevColorTop], 0));
                            geometry.faces.push(new THREE.Face3(2 * (indexCounter-1), 2 * indexCounter+1, 2*(indexCounter-1)+1, normal, [prevColorTop, meshColor, meshColor], 0));
                        }

					}
					indexCounter++;
					prevColorTop = colorTop;

                }
				
                // Final mesh
                if ( percentage >= endPercentage && previousPercentage < endPercentage)
                {
                    var angle = -endPercentage * fTotalAngle;
        			var x = Math.cos(angle);
					var z = Math.sin(angle);
					var altitudeHere = fHeightScale * (trackPoint["AltitudeMeters"] - fMin);

                    var s = (endPercentage - previousPercentage) / (percentage - previousPercentage);
                    var altitude = s * altitudeHere + (1 - s)*previousAltitude;
                    
                   if (isTop)
                    {
                        var topPointOuter = new THREE.Vector3(fCurrentRadius * x, altitude, fCurrentRadius * z);
                        geometry.vertices.push(topPointOuter);
 
                        var topPointInner = new THREE.Vector3((fCurrentRadius - fGraphWidth) * x, altitude, (fCurrentRadius - fGraphWidth)    * z);
                            geometry.vertices.push(topPointInner);
                    }
                    else
                    {
                        var topPoint = new THREE.Vector3(fCurrentRadius * x, altitude, fCurrentRadius * z);
                        geometry.vertices.push(topPoint);
                        geometry.vertices.push(new THREE.Vector3(fCurrentRadius * x, 0, fCurrentRadius * z));
                    }
                    
					var t = altitude / (fMax * fHeightScale);
					var colorTop = meshColor.clone().lerp(meshColorTop, t);
					//console.log(t + " color: " + colorTop.getHexString());
				
					if (indexCounter > 0)
					{
						var normal = new THREE.Vector3(x, 0, z);
                        if (isFrontside)
                        {
							normal *= -1;
                            geometry.faces.push(new THREE.Face3(2 * indexCounter, 2 * (indexCounter-1), 2*indexCounter+1, normal, [colorTop, prevColorTop, meshColor], 0));
                            geometry.faces.push(new THREE.Face3(2 * (indexCounter-1), 2*(indexCounter-1)+1, 2 * indexCounter+1, normal, [prevColorTop, meshColor, meshColor], 0));
                        }
                        else if (isTop)
                        {
                            geometry.faces.push(new THREE.Face3(2 * (indexCounter-1)+0, 2 * (indexCounter)+1, 2*(indexCounter-1)+1, normal, [meshColor, meshColor, meshColor], 0));
                            geometry.faces.push(new THREE.Face3(2 * (indexCounter-1)+0, 2 * (indexCounter)+0, 2*(indexCounter)+1, normal, [meshColor, meshColor, meshColor], 0));
                        }
                        else
                        {
                            geometry.faces.push(new THREE.Face3(2 * indexCounter, 2*indexCounter+1, 2 * (indexCounter-1), normal, [colorTop, meshColor, prevColorTop], 0));
                            geometry.faces.push(new THREE.Face3(2 * (indexCounter-1), 2 * indexCounter+1, 2*(indexCounter-1)+1, normal, [prevColorTop, meshColor, meshColor], 0));
                        }

					}
					indexCounter++;
					prevColorTop = colorTop;

                }
                
                previousPercentage = percentage;
                previousAltitude = fHeightScale * (trackPoint["AltitudeMeters"] - fMin);
                
                if ( percentage < startPercentage || percentage > endPercentage )
                {
                    continue;
                }
                
				var angle = -percentage * fTotalAngle;
				// Mesh parts in between
				if (trackPoint.hasOwnProperty("AltitudeMeters"))
				{
					var x = Math.cos(angle);
					var z = Math.sin(angle);
					var altitude = fHeightScale * (trackPoint["AltitudeMeters"] - fMin);
					
                   if (isTop)
                    {
                        var topPointOuter = new THREE.Vector3(fCurrentRadius * x, altitude, fCurrentRadius * z);
                        geometry.vertices.push(topPointOuter);
 
                        var topPointInner = new THREE.Vector3((fCurrentRadius - fGraphWidth) * x, altitude, (fCurrentRadius - fGraphWidth) * z);
                            geometry.vertices.push(topPointInner);
                    }
                    else
                    {
                        var topPoint = new THREE.Vector3(fCurrentRadius * x, altitude, fCurrentRadius * z);
                        geometry.vertices.push(topPoint);
                        geometry.vertices.push(new THREE.Vector3(fCurrentRadius * x, 0, fCurrentRadius * z));
                    }

					
					var t = altitude / (fMax * fHeightScale);
					var colorTop = meshColor.clone().lerp(meshColorTop, t);
					//console.log(t + " color: " + colorTop.getHexString());
					
					if (indexCounter > 0)
					{
						var normal = new THREE.Vector3(x, 0, z);
                        if (isFrontside)
                        {
							normal *= -1;
                            geometry.faces.push(new THREE.Face3(2 * indexCounter, 2 * (indexCounter-1), 2*indexCounter+1, normal, [colorTop, prevColorTop, meshColor], 0));
                            geometry.faces.push(new THREE.Face3(2 * (indexCounter-1), 2*(indexCounter-1)+1, 2 * indexCounter+1, normal, [prevColorTop, meshColor, meshColor], 0));
                        }
                        else if (isTop)
                        {
                            geometry.faces.push(new THREE.Face3(2 * (indexCounter-1)+0, 2 * (indexCounter)+1, 2*(indexCounter-1)+1, normal, [meshColor, meshColor, meshColor], 0));
                            geometry.faces.push(new THREE.Face3(2 * (indexCounter-1)+0, 2 * (indexCounter)+0, 2*(indexCounter)+1, normal, [meshColor, meshColor, meshColor], 0));
                        }
                        else
                        {
                            geometry.faces.push(new THREE.Face3(2 * indexCounter, 2*indexCounter+1, 2 * (indexCounter-1), normal, [colorTop, meshColor, prevColorTop], 0));
                            geometry.faces.push(new THREE.Face3(2 * (indexCounter-1), 2 * indexCounter+1, 2*(indexCounter-1)+1, normal, [prevColorTop, meshColor, meshColor], 0));
                        }

					}
					indexCounter++;
					prevColorTop = colorTop;
				}
		  	}
            
            if (isTop && endDistance == ruteDistance)
            {
   				var angle = -percentage * fTotalAngle;

       			var x = Math.cos(angle);
				var z = Math.sin(angle);

                var bottomPointOuter = new THREE.Vector3(fCurrentRadius * x, 0, fCurrentRadius * z);
                geometry.vertices.push(bottomPointOuter);
 
                var bottomPointInner = new THREE.Vector3((fCurrentRadius - fGraphWidth)  * x, 0, (fCurrentRadius - fGraphWidth)  * z);
                geometry.vertices.push(bottomPointInner);
                
                geometry.faces.push(new THREE.Face3(2 * (indexCounter-1)+0, 2 * (indexCounter)+1, 2*(indexCounter-1)+1, normal, [meshColor, meshColor, meshColor], 0));
                geometry.faces.push(new THREE.Face3(2 * (indexCounter-1)+0, 2 * (indexCounter)+0, 2*(indexCounter)+1, normal, [meshColor, meshColor, meshColor], 0));

                indexCounter++;
            }
  
            
			geometry.dynamic = false;
			geometry.computeCentroids();
			geometry.computeBoundingBox();
			geometry.computeBoundingSphere();
			return geometry;
		}
		
		function lineFromTrack() {
			var geometry = new THREE.Geometry();
			
			var fOffset = renderer instanceof THREE.WebGLRenderer ? 0.25 : 0.45;
			
			var indexCounter = 0;
			var totalDistance = distances[distances.length-1];
			for (var i = 0; i < trackData.length; ++i)
			{
				var trackPoint = trackData[i];
				var percentage = distances[i] / totalDistance;
				var angle = -percentage * fTotalAngle;
				if (trackPoint.hasOwnProperty("AltitudeMeters"))
				{
					var x = Math.cos(angle);
					var z = Math.sin(angle);
					var topPoint = new THREE.Vector3((fCurrentRadius - fGraphWidth)  * x, trackPoint["AltitudeMeters"] - fMin + fOffset, (fCurrentRadius - fGraphWidth)  * z);
					geometry.vertices.push(topPoint);
					indexCounter++;
				}
		  	}
			geometry.dynamic = false;
			var mesh = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color: lineColor, linewidth: 2, depthTest:true } ));
			return mesh;
		}
		
		function locationTransform(location, top, yPixelOffset)
		{
			if (top === undefined) top = true;
			if (yPixelOffset === undefined) yPixelOffset = 0;
			
			var split = location / ruteDistance;
			
			if (split>1)
			{
				split = 1;
			}
			
			var splitAngle = -split * fTotalAngle;
			
			var projector = new THREE.Projector();
			var offset = projector.unprojectVector(new THREE.Vector3(0, yPixelOffset, 0).divide(new THREE.Vector3(windowHalfX, windowHalfY, 1)), camera);
			var center = projector.unprojectVector(new THREE.Vector3(), camera);
			var offset = offset.sub(center);
			
			var x = fRadius * Math.cos(splitAngle);
			var y = (top ? heightAtLocation(location) : 0) + offset.y;
			var z = fRadius * Math.sin(splitAngle);
			
			return new THREE.Vector3(x, y, z);
		}
		
		function heightAtLocation(location)
		{
			// Find split
			var trackIndex;
			for (trackIndex = 1; trackIndex < distances.length; ++trackIndex)
			{
				if (distances[trackIndex] > location)
					break;
			}
			trackIndex = Math.min(trackIndex, distances.length-1);
			
			var trackPointBefore = trackData[trackIndex-1];
			var trackPointAfter = trackData[trackIndex];
			
			var altitudeBefore = fHeightScale * (trackPointBefore["AltitudeMeters"] - fMin);
			var altitudeAfter = fHeightScale * (trackPointAfter["AltitudeMeters"] - fMin);
			var t = (location - distances[trackIndex-1]) / (distances[trackIndex] - distances[trackIndex-1]);
			
			return (t * altitudeAfter + (1-t) * altitudeBefore);
		}
		
		function markings(interval) {
			var geometry = new THREE.Geometry();
			
			var fOrgRadius = fRadius;
			
			for (var i = interval; i <= ruteDistance; i+=interval)
			{
				var transform = locationTransform(i, true);
				geometry.vertices.push(new THREE.Vector3(transform.x, 0, transform.z));
				geometry.vertices.push(transform);
		  	}
			geometry.dynamic = false;
			
			fRadius = fOrgRadius;
			var mesh = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color: lineColor, linewidth: 2, depthTest:true } ), THREE.LinePieces);
			return mesh;
		}
		
		function startEndLines() {
			var geometry = new THREE.Geometry();
			
			var trackPoint = Math.max((trackData[0])["AltitudeMeters"], (trackData[trackData.length - 1])["AltitudeMeters"]) - fMin + 3;
			console.log("start end height " + trackPoint);
			var x = Math.cos(0);
			var z = Math.sin(0);
			geometry.vertices.push(new THREE.Vector3(fRadius * x, trackPoint, fRadius * z));
			geometry.vertices.push(new THREE.Vector3(fRadius * x, 0, fRadius * z));
		
			x = Math.cos(-fTotalAngle);
			z = Math.sin(-fTotalAngle);
			geometry.vertices.push(new THREE.Vector3(fRadius * x, trackPoint, fRadius * z));
			geometry.vertices.push(new THREE.Vector3(fRadius * x, 0, fRadius * z));
		
			var mesh = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color: lineColor, linewidth: 2, depthTest:true } ), THREE.LinePieces);
			return mesh;
		}
		
		// Event handlers
		function onWindowResize() {
			windowWidth = container.clientWidth;
			windowHeight = container.clientHeight;
			windowHalfX = container.clientWidth / 2;
			windowHalfY = container.clientHeight / 2;

			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( container.clientWidth, container.clientHeight );
		}
		window.addEventListener( 'resize', onWindowResize, false );

		function onDocumentMouseDown( event ){
			// Bail if press is outside container
			if (event.clientX < 0 || event.clientX > windowWidth || event.clientY < 0 || event.clientY > windowHeight)
				return;
				
			event.preventDefault();

			mouseXOnMouseDown = ( event.clientX / container.clientWidth ) * 2 - 1;
			targetRotationOnMouseDown = currentRotation;
			mouseTargetRotation = targetRotationOnMouseDown;
			
			mouseDictatesRotation = true;
			dirty = true;
			mousePressed = true;
		}

		function onDocumentMouseMove( event ) {
			mouseX = ( event.clientX / container.clientWidth ) * 2 - 1;
			mouseY = - ( event.clientY / container.clientHeight ) * 2 + 1;
			
			if(mousePressed)
				mouseTargetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown );
		}

		function onDocumentMouseUp( event ) {
			if (Math.abs((mouseX - mouseXOnMouseDown) * windowHalfX) < 10)
			{
				mouseDictatesRotation = false;
			}
			else
			{
				window.clearTimeout();
				setTimeout(function(){
					mouseDictatesRotation = false;
				},mouseDictatesTimeout);				
			}
						
			if (selection !== undefined && selection.hasOwnProperty("name"))
			{
				// Send press event
				var eventType = selection instanceof sportsgraph.Runner ? sportsgraph.EventTypes.RUNNER_SELECTED : sportsgraph.EventTypes.SECTION_SELECTED;
				handleEvent(new sportsgraph.Event(eventType, {x:container.clientWidth * (mouseX + 1) / 2, y:-container.clientHeight * (mouseY - 1) / 2, id:selection.name}));					
			}
			
			mousePressed = false;
			dirty = false;	
		}
			
		function onDocumentTouchStart( event ) {
			if ( event.touches.length === 1 ) {
				// Bail if press is outside container
				if (event.touches[ 0 ].pageX < 0 || event.touches[ 0 ].pageX > windowWidth || event.touches[ 0 ].pageY < 0 || event.touches[ 0 ].pageY > windowHeight)
					return;
				
				mouseDictatesRotation = true;

				event.preventDefault();

				mouseXOnMouseDown = ( event.touches[ 0 ].pageX / container.clientWidth ) * 2 - 1;
				targetRotationOnMouseDown = currentRotation;
				mouseTargetRotation = targetRotationOnMouseDown;
				
				dirty = true;
			}
		}

		function onDocumentTouchMove( event ) {
			if ( event.touches.length === 1 ) {

				event.preventDefault();

				mouseX = ( event.touches[ 0 ].pageX / container.clientWidth ) * 2 - 1;
				mouseY = - ( event.touches[ 0 ].pageY / container.clientHeight ) * 2 + 1;

				mouseTargetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown );
			}
		}
		
		function onDocumentTouchEnd( event ) {
			if ( event.touches.length === 1 ) {					
				window.clearTimeout();
				setTimeout(function(){
					mouseDictatesRotation = false;
				},mouseDictatesTimeout);	

				if (selection !== undefined && selection.hasOwnProperty("name"))
				{
					var eventType = selection instanceof Runner ? sportsgraph.EventTypes.RUNNER_SELECTED : sportsgraph.EventTypes.SECTION_SELECTED;
					// Send press event
					handleEvent(new sportsgraph.Event(eventType, {x:container.clientWidth * (mouseX + 1) / 2, y:-container.clientHeight * (mouseY - 1) / 2, id:selection.name}));										
				}

				dirty = false;
			}
		}

		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );
		document.addEventListener( 'touchend', onDocumentTouchEnd, false );
	};