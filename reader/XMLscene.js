
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

	this.enableTextures(true);
    this.gl.clearColor(1, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

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


	this.cylinder = new MyCoveredCylinder(this, 6,6);

	// Material Wall
	this.materialcylinder = new CGFappearance(this);
	this.materialcylinder.setAmbient(0.5, 0.5, 0.5, 1);
	this.materialcylinder.setDiffuse(0.5, 0.3, 0.5, 1);
	this.materialcylinder.setSpecular(0.15, 0.15, 0.15, 1);
	this.materialcylinder.setShininess(10);
	this.materialcylinder.loadTexture("floor.png");
	this.materialcylinder.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

	this.triangle = new MyTriangle(this, [3.0,0.0,0.0,0.0,3.0,0.0,0.0,0.0,3.0]);

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

	this.lights[0].setPosition(2, 2, 5, 1);
    this.lights[0].setDiffuse(1,1,1.0,1.0);
    
	this.lights[0].setVisible(true);
    this.lights[0].update();
 
    this.shader.unbind();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	//this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
    this.lights[0].enable();
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

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.lights[0].update();
	}

	    // Plane Wall
	this.pushMatrix();
	this.scale(15, 8, 0);
	this.materialWall.apply();
	this.wall.display();
	this.popMatrix();

	this.materialcylinder.apply();
	this.cylinder.display();

	this.materialtriangle.apply();
	this.triangle.display();

    this.shader.unbind();
};

