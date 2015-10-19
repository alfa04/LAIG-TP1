	function sphere(scene, args, s, t) {
 	CGFobject.call(this,scene);
	
	this.radius = args[0];
	this.slices = args[1];
	this.stacks = args[2];
	
	this.s = s || 1;
	this.t = t || 1;

 	this.initBuffers();
 };

 sphere.prototype = Object.create(CGFobject.prototype);
 sphere.prototype.constructor = sphere;

 sphere.prototype.initBuffers = function() {

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var ang_0 = 2 * Math.PI / this.slices;
	var ang_1 = Math.PI / this.stacks;
	var angle_fist = 0;
	var angle_second = ang_1;
	var ind_j = 0;
	var aux_j = 4 * this.slices;
	var texture_h = Math.PI * this.radius / this.t;
	var texture_l = 2 * Math.PI * this.radius / this.s;
	
	for (j = 0; j < this.stacks; j++) {
		
		var angle_fist0 = 0;
		var ind_i = 0;

		for (i = 0; i < this.slices; i++) {
			var x0 = this.radius * Math.sin(angle_fist) * Math.cos(angle_fist0);
			var y0 = this.radius * Math.cos(angle_fist);
			var z0 = this.radius * Math.sin(angle_fist) * Math.sin(angle_fist0);

			var x2 = this.radius * Math.sin(angle_second) * Math.cos(angle_fist0);
			var y2 = this.radius * Math.cos(angle_second);
			var z2 = this.radius * Math.sin(angle_second) * Math.sin(angle_fist0);

			angle_fist0 += ang_0;

			var x1 = this.radius * Math.sin(angle_fist) * Math.cos(angle_fist0);
			var y1 = this.radius * Math.cos(angle_fist);
			var z1 = this.radius * Math.sin(angle_fist) * Math.sin(angle_fist0);

			var x3 = this.radius * Math.sin(angle_second) * Math.cos(angle_fist0);
			var y3 = this.radius * Math.cos(angle_second);
			var z3 = this.radius * Math.sin(angle_second) * Math.sin(angle_fist0);

			this.vertices.push(x0,y0,z0); // vertice 0

			this.vertices.push(x1,y1,z1); // vertice 1

			this.vertices.push(x2,y2,z2) // vertice 2

			this.vertices.push(x3,y3,z3); // vertice 3

 			var ind_i_j = ind_i + ind_j;

			this.indices.push(ind_i_j); 	// 0
			this.indices.push(ind_i_j + 1); // 1
			this.indices.push(ind_i_j + 2); // 2

			this.indices.push(ind_i_j + 3); // 3
			this.indices.push(ind_i_j + 2); // 2
			this.indices.push(ind_i_j + 1); // 1

			ind_i += 4;

			// vertice 0
			this.normals.push(x0,y0,z0);
			
			// vertice 1
            this.normals.push(x1,y1,z1);

			// vertice 2
			this.normals.push(x2,y2,z2);
			
			// vertice 3
            this.normals.push(x3,y3,z3);

			// coordenadas texturas
			this.texCoords.push(1 - i / this.slices, j / this.stacks);
			this.texCoords.push(1 - (i + 1) / this.slices, j / this.stacks);
			this.texCoords.push(1 - i / this.slices, (j + 1) / this.stacks);
			this.texCoords.push(1 - (i + 1) / this.slices, (j + 1) / this.stacks);

		}			
		angle_fist += ang_1;
		angle_second += ang_1;
		ind_j += aux_j;
	}
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 	
 };
sphere.prototype.updateTex = function(S, T) {
};
