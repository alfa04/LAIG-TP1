/**
 * MyCoveredCylinder
 * @constructor
 */

var degToRad = Math.PI / 180.0;

function MyCoveredCylinder(scene, args) {
    CGFobject.call(this, scene);

    this.args = args;
    this.height = this.args[0];
    this.bottomRadius = this.args[1];
    this.topRadius = this.args[2];
    this.stacks = this.args[3];
    this.slices = this.args[4];

    this.top = new MyCircle(this.scene, this.topRadius,this.slices);
    this.bot = new MyCircle(this.scene, this.bottomRadius,this.slices);
    this.cylinder = new MyCylinder(this.scene, this.slices, this.stacks,this.topRadius,this.bottomRadius);
    this.initBuffers();
};

MyCoveredCylinder.prototype = Object.create(CGFobject.prototype);
MyCoveredCylinder.prototype.constructor = MyCoveredCylinder;

MyCoveredCylinder.prototype.display = function () {
    this.scene.pushMatrix();

    this.scene.translate(0, 0, this.height/2);
    this.scene.scale(1, 1, this.height);

    //top
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 0.5);
    this.top.display();
    this.scene.popMatrix();

    //bot
    this.scene.pushMatrix();
    this.scene.translate(0, 0, -0.5);
    this.scene.rotate(-180 * degToRad, 1, 0, 0);
    this.bot.display();
    this.scene.popMatrix();

    //cylinder
    this.scene.pushMatrix();
    this.cylinder.display();
    this.scene.popMatrix();

    this.scene.popMatrix();

    //CGFobject.prototype.display.call(this);
};

MyCoveredCylinder.prototype.updateTex = function(S, T) {
};