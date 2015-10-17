
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

	this.enableTextures(true);
    //this.gl.clearColor(1, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.leaveslist = [];

	this.axis=new CGFaxis(this);

	this.wall = new Plane(this);

	// Material Wall
	this.materialWall = new CGFappearance(this);
	this.materialWall.setAmbient(0.5, 0.5, 0.5, 1);
	this.materialWall.setDiffuse(0.5, 0.3, 0.5, 1);
	this.materialWall.setSpecular(0.15, 0.15, 0.15, 1);
	this.materialWall.setShininess(10);
	this.materialWall.loadTexture("floor.png");
	this.materialWall.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");


	this.cylinder = new MyCoveredCylinder(this,6,6);

	// Material Wall
	this.materialcylinder = new CGFappearance(this);
	this.materialcylinder.setAmbient(0.5, 0.5, 0.5, 1);
	this.materialcylinder.setDiffuse(0.5, 0.3, 0.5, 1);
	this.materialcylinder.setSpecular(0.15, 0.15, 0.15, 1);
	this.materialcylinder.setShininess(10);
	this.materialcylinder.loadTexture("floor.png");
	this.materialcylinder.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

	this.triangle = new MyTriangle(this, [0.0,0.0,0.0,3.0,0.0,0.0,3.0,3.0,0.0]);

	// Material Wall
	this.materialtriangle = new CGFappearance(this);
	this.materialtriangle.setAmbient(0.5, 0.5, 0.5, 1);
	this.materialtriangle.setDiffuse(0.5, 0.3, 0.5, 1);
	this.materialtriangle.setSpecular(0.15, 0.15, 0.15, 1);
	this.materialtriangle.setShininess(10);
	this.materialtriangle.loadTexture("head.png");
	this.materialtriangle.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

}

XMLscene.prototype.initLights = function () {

    this.shader.bind();

    for(var i = 0; i<this.graph.lightsList.length; i++){

		this.lights[i].setPosition(this.graph.lightsList[i].position.x, this.graph.lightsList[i].position.y, this.graph.lightsList[i].position.z, this.graph.lightsList[i].position.w);
	    this.lights[i].setDiffuse(this.graph.lightsList[i].diffuse.r, this.graph.lightsList[i].diffuse.g, this.graph.lightsList[i].diffuse.b, this.graph.lightsList[i].diffuse.a);
	    this.lights[i].setAmbient(this.graph.lightsList[i].ambient.r, this.graph.lightsList[i].ambient.g, this.graph.lightsList[i].ambient.b, this.graph.lightsList[i].ambient.a);
	    this.lights[i].setSpecular(this.graph.lightsList[i].specular.r, this.graph.lightsList[i].specular.g, this.graph.lightsList[i].specular.b, this.graph.lightsList[i].specular.a);

		this.lights[i].setVisible(true);

		if(this.graph.lightsList[i].enabled)
			this.lights[i].enable();
		else this.lights[i].disable();
	 	
	  	
	    this.lights[i].update();

	}

    this.shader.unbind();
    this.shader.unbind();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    /*this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	*/
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{	//INITIALS
		//frustum
	this.camera.near = this.graph.initialsInfo.frustum['near'];
    this.camera.far =  this.graph.initialsInfo.frustum['far'];
    	//axis reference
 
	this.axis = new CGFaxis(this,this.graph.initialsInfo.reference['length']);


	//ILLUMINATION

	//background
	this.gl.clearColor(this.graph.backgroundInfo['r'],this.graph.backgroundInfo['g'],this.graph.backgroundInfo['b'],this.graph.backgroundInfo['a']);
	
	//ambient
	this.setGlobalAmbientLight(this.graph.ambientInfo['r'],this.graph.ambientInfo['g'],this.graph.ambientInfo['b'],this.graph.ambientInfo['a']); 

	//LIGHTS
    this.initLights();

    //LEAVES
    this.setLeaves();
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();


	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{

		// Draw axis
		this.axis.display();
	

		this.setDefaultAppearance();

        // setInitials transformations
        this.setInitials();

				//Lights
        for (var i = 0; i < this.graph.lightsList.length; i++)
            this.lights[i].update();
	}

	    // Plane Wall
	this.pushMatrix();
	this.scale(15, 8, 0);
	this.materialWall.apply();
	this.wall.display();
	this.popMatrix();

	//this.materialtriangle.apply();
	//this.cylinder.display();
	this.materialtriangle.apply();
	this.leaveslist[6].display();
 	this.pushMatrix();
	this.translate(0, 0, 1);
	this.materialtriangle.apply();
	this.triangle.display();
	this.popMatrix();

    this.shader.unbind();
};

XMLscene.prototype.setInitials = function() {
	var deg2rad = Math.PI / 180;

	//tranlate
    this.translate(this.graph.initialsInfo.translation['x'], this.graph.initialsInfo.translation['y'],this.graph.initialsInfo.translation['z']);
    
    //rotations
    //x
    this.rotate(this.graph.initialsInfo.rotation['x'] * deg2rad, 1, 0, 0);
    //y          
    this.rotate(this.graph.initialsInfo.rotation['y'] * deg2rad, 0, 1, 0);
    //z        
    this.rotate(this.graph.initialsInfo.rotation['z'] * deg2rad, 0, 0, 1);
                
    //scale
    this.scale(this.graph.initialsInfo.scale['sx'], this.graph.initialsInfo.scale['sy'], this.graph.initialsInfo.scale['sz']);
};

XMLscene.prototype.findRootNode = function() {
	
	for(var i = 0; i<this.graph.nodesList.length; i++){
		if(this.graph.nodesList[i].id == this.rootInfo["id"]){
			return i;
		}

	}

};

XMLscene.prototype.setLeaves = function() {
	//console.log("yyyyyyyyyyyyyyyyyyyyyyyyyy" + this.graph.leaveslist[0]);
	for (var i = 0; i < this.graph.leaveslist.length; i++) {
		var leaf = this.graph.leaveslist[i];
		//console.log("WWWWWWWWWWWWWWWWW"+leaf);
		switch (leaf.type) {
            case "rectangle":
                var rectangle = new Plane(this);
                rectangle.id = leaf.id;
                this.leaveslist.push(rectangle);
                break;
            case "cylinder":
                cylinder = new MyCoveredCylinder(this,6,6);
                cylinder.id = leaf.id;
                this.leaveslist.push(cylinder);
                break;
           /* case "sphere":
                sphere = new MySphere(this, leaf.args);
                sphere.id = leaf.id;
                this.leaveslist.push(sphere);
                break;*/
            case "triangle":
                triangle = new MyTriangle(this,leaf.args);
                console.log("TTTTTTTTT"+leaf.args);
                triangle.id = leaf.id;
                this.leaveslist.push(triangle);
                break;
        }
	}
}