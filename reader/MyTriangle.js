function MyTriangle(scene, args) {
    CGFobject.call(this, scene);
    this.args = args;
 
    this.initBuffers();
};
 
MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;
 
MyTriangle.prototype.initBuffers = function() {

        this.vertices = this.args;
 
        this.indices = [
        0, 1, 2,
    ];
 
    var vec1 = vec3.fromValues(this.x1-this.x2, this.y1-this.y2, this.z1-this.z2);
    console.log("SSSSSSSSSSSSSSSSSSSSS" + this.x1 + this.x2 + this.x3);
    var vec2 = vec3.fromValues(this.x1-this.x3, this.y1-this.y3, this.z1-this.z3);
    var vecNormal = vec3.create();
    vec3.cross(vecNormal, vec1, vec2);
    vec3.normalize(vecNormal, vecNormal);
 
 
    this.normals = [
        vecNormal[0], vecNormal[1], vecNormal[2],
        vecNormal[0], vecNormal[1], vecNormal[2],
        vecNormal[0], vecNormal[1], vecNormal[2],
    ];
 
    this.tex = [
                    0, 0,
                    1, 0,
                    1, 1
        ];
 
        this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
   
};
 
MyTriangle.prototype.updateTex = function(S, T) {};