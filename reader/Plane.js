
/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
function Plane(scene, pts)
{
	CGFobject.call(this,scene);

	this.pts = pts;
	
	this.initBuffers();
};

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.initBuffers = function()
{
	// Generate vertices and normals 
	this.vertices = [
		this.pts[0], this.pts[1], 0,
        this.pts[0], this.pts[3], 0,
        this.pts[2], this.pts[1], 0,
        this.pts[2], this.pts[3], 0,];
	this.normals = [ 
		0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1];
	
	
	// Generating indices
	/* for nrDivs = 3 output will be 
		[
			 0,  4, 1,  5,  2,  6,  3,  7, 
			    7,  4,
			 4,  8, 5,  9,  6, 10,  7, 11,
			   11,  8,
			 8, 12, 9, 13, 10, 14, 11, 15,
		]
	Interpreting this index list as a TRIANGLE_STRIP will draw rows of the plane (with degenerate triangles in between. */

	this.indices = [
        0, 1, 2,
        3, 2, 1,];

    //Corrigir para fatores de ampliação posteriormente
 	this.texCoords = [
        0, 0,
        0, 1,
        1, 0,
        1, 1
    ];

	this.primitiveType = this.scene.gl.TRIANGLES;


	this.initGLBuffers();
};

Plane.prototype.updateTex = function(S, T) {
    this.texCoords = [
        0, 0,
        0, T,
        S, 0,
        S, T
    ];

    this.updateTexCoordsGLBuffers();
};
