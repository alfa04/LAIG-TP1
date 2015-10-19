
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph = this;
		
	// File reading 
	this.reader = new CGFXMLreader();



    this.leaveslist = [];

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}



/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseInitials(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	var error = this.parseIllumination(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	var error = this.parseLights(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	var error = this.parseTextures(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	
	var error = this.parseMaterials(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	var error = this.parseLeaves(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	var error = this.parseNodes(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	



	this.loadedOk=true;
	
	this.scene.onGraphLoaded();
};

// Parser INITIALS
MySceneGraph.prototype.parseInitials= function(rootElement) {

	console.log("INITIALS: \n");
	this.initialsInfo={};
	var elems = rootElement.getElementsByTagName('INITIALS');

	if(elems == null) return "'INITIALS' tag is missing.";
	if(elems.length != 1) return "More than one 'INITIALS' tag.";

	var initials = elems[0];

	//Frustum
	elemsFrustum = initials.getElementsByTagName('frustum');
	if(elemsFrustum == null) return "'frustum' tag is missing.";
	if(elemsFrustum.length != 1) return "More than one 'frustum' tag.";
	var frustum = elemsFrustum[0];

	this.initialsInfo.frustum={};

	this.initialsInfo.frustum['near'] = this.reader.getFloat(frustum,'near',true);
	this.initialsInfo.frustum['far'] = this.reader.getFloat(frustum,'far',true);

	if(isNaN(this.initialsInfo.frustum['near'])) return "'frustum near' must be a float.";
	if(isNaN(this.initialsInfo.frustum['far'])) return "'frustum far' must be a float";
	
	//Translation
	elemsTranslation = initials.getElementsByTagName('translation');
	if(elemsTranslation == null) return "'translation' tag is missing.";
	if(elemsTranslation.length != 1) return "More than one 'translation' tag.";
	var translation = elemsTranslation[0];

	this.initialsInfo.translation={};

	this.initialsInfo.translation['x'] = this.reader.getFloat(translation,'x',true);
	this.initialsInfo.translation['y'] = this.reader.getFloat(translation,'y',true);
	this.initialsInfo.translation['z'] = this.reader.getFloat(translation,'z',true);

	if(isNaN(this.initialsInfo.translation['x'])) return "'translation x' must be a float.";
	if(isNaN(this.initialsInfo.translation['y'])) return "'translation y' must be a float.";
	if(isNaN(this.initialsInfo.translation['z'])) return "'translation z' must be a float.";

	//Rotation
	elemsRotation = initials.getElementsByTagName('rotation');
	if(elemsRotation == null) return "'rotation' tag is missing.";
	if(elemsRotation.length != 3) return "'rotation' tag: exactly 3 required.";
	
	this.initialsInfo.rotation={};

	this.initialsInfo.rotation[this.reader.getString(elemsRotation[0],'axis',true)] = this.reader.getFloat(elemsRotation[0],'angle',true);
	this.initialsInfo.rotation[this.reader.getString(elemsRotation[1],'axis',true)] = this.reader.getFloat(elemsRotation[1],'angle',true);
	this.initialsInfo.rotation[this.reader.getString(elemsRotation[2],'axis',true)] = this.reader.getFloat(elemsRotation[2],'angle',true);

	if(this.reader.getString(elemsRotation[0],'axis',true) != "x")  return "value of the first axis be x.";
	if(this.reader.getString(elemsRotation[1],'axis',true) != "y")	return "value of the second must be y.";
	if(this.reader.getString(elemsRotation[2],'axis',true) != "z")	return "value of the third must be z.";

	if(isNaN(this.initialsInfo.rotation[this.reader.getString(elemsRotation[0],'axis',true)])) return "'angle' in x axis must be a float.";
	if(isNaN(this.initialsInfo.rotation[this.reader.getString(elemsRotation[1],'axis',true)])) return "'angle' in y axis must be a float.";
	if(isNaN(this.initialsInfo.rotation[this.reader.getString(elemsRotation[2],'axis',true)])) return "'angle' in z axis must be a float.";

	//Scale
	elemsScale = initials.getElementsByTagName('scale');
	if(elemsScale == null) return "'scale' tag is missing.";
	if(elemsScale.length != 1) return "'More than one 'scale' tag.";
	var scale = elemsScale[0];

	this.initialsInfo.scale={};

	this.initialsInfo.scale['sx'] = this.reader.getFloat(scale,'sx',true);
	this.initialsInfo.scale['sy'] = this.reader.getFloat(scale,'sy',true);
	this.initialsInfo.scale['sz'] = this.reader.getFloat(scale,'sz',true);

	if(isNaN(this.initialsInfo.scale['sx'])) return "'scale sx' must be a float.";
	if(isNaN(this.initialsInfo.scale['sy'])) return "'scale sy' must be a float";
	if(isNaN(this.initialsInfo.scale['sz'])) return "'scale sz' must be a float";

    //Reference
    elemsReference = initials.getElementsByTagName('reference');
	if(elemsFrustum == null) return "'reference' tag is missing.";
	if(elemsFrustum.length != 1) return "More than one 'reference' tag.";
	var reference = elemsReference[0];

	this.initialsInfo.reference={};

	this.initialsInfo.reference['length'] = this.reader.getFloat(reference,'length',true);

	if(isNaN(this.initialsInfo.reference['length'])) return "'reference length' must be a float.";

}

MySceneGraph.prototype.parseIllumination= function(rootElement) {

	console.log("ILLUMINATION: \n");

	var illumination = rootElement.getElementsByTagName('ILLUMINATION');
	if(illumination == null) return "ILLUMINATION tag not found!";


	var illuminationInfo = illumination[0];

	var ambient = illuminationInfo.getElementsByTagName("ambient");
	if(ambient == null) return "AMBIENT not found!";

	console.log("\tAMBIENT: ");

	var ambientInfo = ambient[0];
	this.ambientInfo = [];
	this.ambientInfo["r"] = this.reader.getFloat(ambientInfo, "r", true);
	this.ambientInfo["g"] = this.reader.getFloat(ambientInfo, "g", true);
	this.ambientInfo["b"] = this.reader.getFloat(ambientInfo, "b", true);
	this.ambientInfo["a"] = this.reader.getFloat(ambientInfo, "a", true);

	console.log("\t\tR: " + this.ambientInfo["r"] + ", G: " + this.ambientInfo["g"] + ", B: " + this.ambientInfo["g"] + ", A: " + this.ambientInfo["a"] + "\n");

	var background = illuminationInfo.getElementsByTagName("background");
	if(background == null) return "BACKGROUND not found!";

	console.log("\tBACKGROUND: ");

	var backgroundInfo = background[0];
	this.backgroundInfo = [];
	this.backgroundInfo["r"] = this.reader.getFloat(backgroundInfo, "r", true);
	this.backgroundInfo["g"] = this.reader.getFloat(backgroundInfo, "g", true);
	this.backgroundInfo["b"] = this.reader.getFloat(backgroundInfo, "b", true);
	this.backgroundInfo["a"] = this.reader.getFloat(backgroundInfo, "a", true);

	console.log("\t\t\R: " + this.backgroundInfo["r"] + ", G: " + this.backgroundInfo["g"] + ", B: " + this.backgroundInfo["g"] + ", A: " + this.backgroundInfo["a"] + "\n");
	
}

//Parser LIGTHS
MySceneGraph.prototype.parseLights= function(rootElement) {


	console.log("LIGHTS: \n");

	this.lightsList = [];

	var lights = rootElement.getElementsByTagName('LIGHTS');
	if(lights == null) return "LIGHTS tag not found!";

	var lightsInfo = lights[0];

	var light = lightsInfo.getElementsByTagName('LIGHT');
	if(light == null) return "LIGTH tag not found!";

	for(var i = 0; i < light.length; i++){

	var lightInfo = light[i];

	var myLight = new Light(this.reader.getString(lightInfo, "id", true));

	console.log("\tLIGHT id: " + myLight.id + "\n");
	
	//enable
	var enable = lightInfo.getElementsByTagName('enable');
	if(enable == null) return "enable tag not found!";

	var enableInfo = enable[0];

	myLight.enabled = this.reader.getItem(enableInfo, 'value', ['1','0']);

	console.log("\tenable value: " + myLight.enabled + "\n");
	
	//position
	var position = lightInfo.getElementsByTagName("position");
	if(position == null) return "position not found!";

	console.log("position: ");

	var positionInfo = position[0];

	myLight.position.x = this.reader.getFloat(positionInfo, "x", true);
	myLight.position.y = this.reader.getFloat(positionInfo, "y", true);
	myLight.position.z = this.reader.getFloat(positionInfo, "z", true);
	myLight.position.w = this.reader.getFloat(positionInfo, "w", true);

	console.log("\t\tX: " + myLight.position.x + ", Y: " + myLight.position.y + ", Z: " + myLight.position.z + ", W: " + myLight.position.w + "\n");

	//ambient
	var ambientLight = lightInfo.getElementsByTagName("ambient");
	if(ambientLight == null) return "ambient not found!";

	console.log("ambient: ");

	var ambientLightInfo = ambientLight[0];

	myLight.ambient.r = this.reader.getFloat(ambientLightInfo, "r", true);
	myLight.ambient.g = this.reader.getFloat(ambientLightInfo, "g", true);
	myLight.ambient.b = this.reader.getFloat(ambientLightInfo, "b", true);
	myLight.ambient.a = this.reader.getFloat(ambientLightInfo, "a", true);

	console.log("\t\tR: " + myLight.ambient.r + ", G: " + myLight.ambient.g + ", B: " + myLight.ambient.b + ", A: " + myLight.ambient.a + "\n");
	
	//diffuse
	var diffuse = lightInfo.getElementsByTagName("diffuse");
	if(diffuse == null) return "diffuse not found!";

	console.log("diffuse: ");

	var diffuseInfo = diffuse[0];

	myLight.diffuse.r = this.reader.getFloat(diffuseInfo, "r", true);
	myLight.diffuse.g = this.reader.getFloat(diffuseInfo, "g", true);
	myLight.diffuse.b = this.reader.getFloat(diffuseInfo, "b", true);
	myLight.diffuse.a = this.reader.getFloat(diffuseInfo, "a", true);

	console.log("\t\tR: " + myLight.diffuse.r + ", G: " + myLight.diffuse.g + ", B: " + myLight.diffuse.b + ", A: " + myLight.diffuse.a + "\n");
	
	//specular
	var specular = lightInfo.getElementsByTagName("specular");
	if(specular == null) return "specular not found!";

	console.log("specular: ");

	var specularInfo = specular[0]; 

	myLight.specular.r = this.reader.getFloat(specularInfo, "r", true);
	myLight.specular.g = this.reader.getFloat(specularInfo, "g", true);
	myLight.specular.b = this.reader.getFloat(specularInfo, "b", true);
	myLight.specular.a = this.reader.getFloat(specularInfo, "a", true);

	console.log("\t\tR: " + myLight.specular.r + ", G: " + myLight.specular.g + ", B: " + myLight.specular.b + ", A: " + myLight.specular.a + "\n");

	this.lightsList.push(myLight);

	}


}

MySceneGraph.prototype.parseTextures= function(rootElement) {

	console.log("TEXTURES: \n");

	this.texturesList = [];

	var textures = rootElement.getElementsByTagName('TEXTURES');
	if(textures == null) return "TEXTURES tag not found!";

	var texturesInfo = textures[0];

	var texture = texturesInfo.getElementsByTagName('TEXTURE');
	if(texture == null) return "TEXTURE tag not found!";

	for(var i = 0; i < texture.length; i++){

	var textureInfo = texture[i];

	var myTexture = new Texture(this.reader.getString(textureInfo, "id", true));

	console.log("\tTEXTURE id: " + myTexture.id + "\n");

	var file = textureInfo.getElementsByTagName('file');
	if(file == null) return "file tag not found!";

	var fileInfo = file[0];

	myTexture.filePath = "scenes/" + this.reader.getString(fileInfo, "path", true);

	console.log("\tfile path: " + myTexture.filePath + "\n");

	var ampliFactor = textureInfo.getElementsByTagName('amplif_factor');
	if(ampliFactor == null) return "amplif_factor tag not found!";

	var ampliFactorInfo = ampliFactor[0];

	myTexture.amplifFactor_S = this.reader.getFloat(ampliFactorInfo, "s", true);
	myTexture.amplifFactor_T = this.reader.getFloat(ampliFactorInfo, "t", true);

	console.log("\tamplif_factor s: " + myTexture.amplifFactor_S  + ", t: " + myTexture.amplifFactor_T + "\n\n");

	this.texturesList.push(myTexture);

	}

}

//Parser MATERIALS
MySceneGraph.prototype.parseMaterials= function(rootElement) {

	console.log("MATERIALS: \n");

	this.materialsList = [];

	var materials = rootElement.getElementsByTagName('MATERIALS');
	if(materials == null) return "MATERIALS tag not found!";

	var materialsInfo = materials[0];

	var material = materialsInfo.getElementsByTagName('MATERIAL');
	if(material == null) return "MATERIAL tag not found!";

	for(var i = 0; i < material.length; i++){

	var materialInfo = material[i];

	var myMaterial = new Material(this.reader.getString(materialInfo, "id", true));

	console.log("\tMATERIAL id: " + myMaterial.id + "\n");
	
	//shininess
	var shininess = materialInfo.getElementsByTagName('shininess');
	if(shininess == null) return "shininess tag not found!";

	var shininessInfo = shininess[0];

	myMaterial.shininessValue = this.reader.getFloat(shininessInfo, 'value', true);

	console.log("\tshininess value: " + myMaterial.shininessValue + "\n");
	
	//specular
	var specular = materialInfo.getElementsByTagName("specular");
	if(specular == null) return "specular not found!";

	console.log("specular: ");

	var specularInfo = specular[0];

	myMaterial.specular.r = this.reader.getFloat(specularInfo, "r", true);
	myMaterial.specular.g = this.reader.getFloat(specularInfo, "g", true);
	myMaterial.specular.b = this.reader.getFloat(specularInfo, "b", true);
	myMaterial.specular.a  = this.reader.getFloat(specularInfo, "a", true);

	console.log("\t\t\R: " + myMaterial.specular.r + ", G: " + myMaterial.specular.g + ", B: " + myMaterial.specular.b + ", A: " + myMaterial.specular.a + "\n");

	//diffuse
	var diffuse = materialInfo.getElementsByTagName("diffuse");
	if(diffuse == null) return "diffuse not found!";

	console.log("diffuse: ");

	var diffuseInfo = diffuse[0];

	myMaterial.diffuse.r = this.reader.getFloat(diffuseInfo, "r", true);
	myMaterial.diffuse.g = this.reader.getFloat(diffuseInfo, "g", true);
	myMaterial.diffuse.b = this.reader.getFloat(diffuseInfo, "b", true);
	myMaterial.diffuse.a = this.reader.getFloat(diffuseInfo, "a", true);

	console.log("\t\t\R: " + myMaterial.diffuse.r + ", G: " + myMaterial.diffuse.g + ", B: " + myMaterial.diffuse.b + ", A: " + myMaterial.diffuse.a + "\n");
	
	//ambient
	var ambient = materialInfo.getElementsByTagName("ambient");
	if(ambient == null) return "ambient not found!";

	console.log("ambient: ");

	var ambientInfo = ambient[0];

	myMaterial.ambient.r = this.reader.getFloat(ambientInfo, "r", true);
	myMaterial.ambient.g = this.reader.getFloat(ambientInfo, "g", true);
	myMaterial.ambient.b = this.reader.getFloat(ambientInfo, "b", true);
	myMaterial.ambient.a = this.reader.getFloat(ambientInfo, "a", true);

	console.log("\t\t\R: " + myMaterial.ambient.r + ", G: " + myMaterial.ambient.g + ", B: " + myMaterial.ambient.b + ", A: " + myMaterial.ambient.a + "\n");

	//emission
	var emission = materialInfo.getElementsByTagName("emission");
	if(emission == null) return "emission not found!";

	console.log("emission: ");

	var emissionInfo = emission[0];

	myMaterial.emission.r = this.reader.getFloat(emissionInfo, "r", true);
	myMaterial.emission.g = this.reader.getFloat(emissionInfo, "g", true);
	myMaterial.emission.b = this.reader.getFloat(emissionInfo, "b", true);
	myMaterial.emission.a = this.reader.getFloat(emissionInfo, "a", true);

	console.log("\t\t\R: " + myMaterial.emission.r + ", G: " + myMaterial.emission.g + ", B: " + myMaterial.emission.b + ", A: " + myMaterial.emission.a + "\n");
	
	this.materialsList.push(myMaterial);

	}
}
//Parser LEAVES
MySceneGraph.prototype.parseLeaves= function(rootElement) {

	console.log("LEAVES: \n");

	var leaves = rootElement.getElementsByTagName('LEAVES');
	if(leaves == null) return "LEAVES tag not found!";

	var leavesInfo = leaves[0];

	var leaf = leavesInfo.getElementsByTagName('LEAF');
	if(leaf == null) return "LEAF tag not found!";

	for(var i = 0; i < leaf.length; i++){

	var leafInfo = new Leaf (leaf[i].getAttribute('id'));

	leafInfo.type= this.reader.getItem(leaf[i], "type", ['rectangle', 'cylinder', 'sphere', 'triangle']);

	if(leafInfo.type == "rectangle"){
		leafInfo.args.push(this.reader.getRGBA(leaf[i], "args"));
		console.log(leafInfo.args);
	}
	else if(leafInfo.type == "cylinder"){
		var aux = this.reader.getString(leaf[i], "args", true);
		leafInfo.args.push(parseFloat(aux.split(" ")[0]));
		leafInfo.args.push(parseFloat(aux.split(" ")[1]));
		leafInfo.args.push(parseFloat(aux.split(" ")[2]));
		leafInfo.args.push(parseFloat(aux.split(" ")[3]));
		leafInfo.args.push(parseFloat(aux.split(" ")[4]));
		console.log(leafInfo.args); 
	}

	else if(leafInfo.type == "sphere"){
		var aux = this.reader.getString(leaf[i], "args", true);
		leafInfo.args.push(aux.split(" "));
		console.log(leafInfo.args); 
	}

	else if(leafInfo.type == "triangle"){
		var aux = this.reader.getString(leaf[i], "args", true);
		var aux2 = aux.split("  ");
		//console.log("sssssssssssssssss"+aux2[2].split(" ")[1]); 
		leafInfo.args.push(parseFloat(aux2[0].split(" ")[0]));
		leafInfo.args.push(parseFloat(aux2[0].split(" ")[1]));
		leafInfo.args.push(parseFloat(aux2[0].split(" ")[2]));
		leafInfo.args.push(parseFloat(aux2[1].split(" ")[0]));
		leafInfo.args.push(parseFloat(aux2[1].split(" ")[1]));
		leafInfo.args.push(parseFloat(aux2[1].split(" ")[2]));
		leafInfo.args.push(parseFloat(aux2[2].split(" ")[0]));
		leafInfo.args.push(parseFloat(aux2[2].split(" ")[1]));
		leafInfo.args.push(parseFloat(aux2[2].split(" ")[2]));
	}

	this.leaveslist.push(leafInfo);
	}


}

//Parser Nodes
MySceneGraph.prototype.parseNodes= function(rootElement) {

	console.log("NODES: \n");

	this.nodesList = [];

	var nodes = rootElement.getElementsByTagName('NODES');
	if(nodes == null) return "NODES tag not found!";	

	var nodesInfo = nodes[0];

	var root = nodesInfo.getElementsByTagName('ROOT');
	if(root == null) return "ROOT tag not found!";	

	var rootInfo = root[0];

	this.rootInfo = [];
	this.rootInfo["id"] = this.reader.getString(rootInfo, "id", true);
	console.log("\tROOT id: " + this.rootInfo["id"] + "\n");
	
	var node = nodesInfo.getElementsByTagName('NODE');
	if(node == null) return "NODE tag not found!";	

	for(var i = 0; i < node.length; i++){

		var nodeInfo = node[i];

		var myNode = new Node(this.reader.getString(nodeInfo, "id", true));
		console.log("\tNODE id: " + myNode.id+ "\n");

		var material = nodeInfo.getElementsByTagName('MATERIAL');
		if(material == null) return "MATERIAL tag not found!";	

		var materialInfo = material[0];

		myNode.material = this.reader.getString(materialInfo, "id", true);
		console.log("\t\tMATERIAL id: " + myNode.material + "\n");

		var texture = nodeInfo.getElementsByTagName('TEXTURE');
		if(texture == null) return "TEXTURE tag not found!";	

		var textureInfo = texture[0];

		this.textureInfo = [];
		myNode.texture = this.reader.getString(textureInfo, "id", true);
		console.log("\t\tTEXTURE id: " + myNode.texture + "\n");

		var transformations = [];

		var transformationsNodesLength = nodeInfo.children.length-1; 

		

		for(var j = 2 ; j<transformationsNodesLength; j++){
			if(nodeInfo.children[j].tagName == 'ROTATION'){
				var rotationInfo = nodeInfo.children[j];
				var rotationInfoTmp = [];
				
				rotationInfoTmp["axis"] = this.reader.getString(rotationInfo, "axis", true);
				rotationInfoTmp["angle"] = this.reader.getFloat(rotationInfo, "angle", true) * Math.PI / 180;
				console.log("\t\tROTATION axis: " + rotationInfoTmp["axis"] + ", angle(rad): " + rotationInfoTmp["angle"] + "\n");
				var rotMatrix = [];
				if(rotationInfoTmp["axis"] == "x")
					this.rotMatrix = [1,0,0];
				else if(rotationInfoTmp["axis"] == "y")
					this.rotMatrix = [0,1,0];
				else if(rotationInfoTmp["axis"] == "z")
					this.rotMatrix = [0,0,1];
				mat4.rotate(myNode.matrix, myNode.matrix, rotationInfoTmp["angle"], this.rotMatrix);
				transformations.push(rotationInfoTmp);
			}

			else if(nodeInfo.children[j].tagName == 'TRANSLATION'){
				var translationInfo = nodeInfo.children[j];
				var translationInfoTmp = [];

				translationInfoTmp.push(this.reader.getFloat(translationInfo, "x", true));
				translationInfoTmp.push(this.reader.getFloat(translationInfo, "y", true));
				translationInfoTmp.push(this.reader.getFloat(translationInfo, "z", true));
				console.log("\t\tTRANSLATION: " + this.translationInfoTmp + "\n");
				mat4.translate(myNode.matrix, myNode.matrix, translationInfoTmp);
				transformations.push(translationInfoTmp);	
			}

			else if(nodeInfo.children[j].tagName == 'SCALE'){
				var scaleInfo = nodeInfo.children[j];
				var scaleInfoTmp = [];

				scaleInfoTmp.push(this.reader.getFloat(scaleInfo, "sx", true));
				scaleInfoTmp.push(this.reader.getFloat(scaleInfo, "sy", true));
				scaleInfoTmp.push(this.reader.getFloat(scaleInfo, "sz", true));
				mat4.scale(myNode.matrix, myNode.matrix, scaleInfoTmp);
				transformations.push(scaleInfoTmp);
			}

		}

		var descendants = nodeInfo.getElementsByTagName('DESCENDANTS');
		if(descendants == null) return "DESCENDANTS tag not found!";	

		var descendantsInfo = descendants[0];

		console.log("\t\tDESCENDANTS");

		var descendant = descendantsInfo.getElementsByTagName('DESCENDANT');
		if(descendant == null) return "DESCENDANTS tag not found!";	

		for(var k = 0; k < descendant.length; k++){

			var descendantInfo = descendant[k];

			
			myNode.descendants[k] = this.reader.getString(descendantInfo, "id", true);
			console.log("\t\t\tDESCENDANT id: " + myNode.descendants[k] + "\n");

		}

		this.nodesList.push(myNode);
	}

}
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};

function Light(id) {
    this.id = id;
    this.enabled = false;
    this.position = {
    	x: 0.0,
    	y: 0.0,
    	z: 0.0,
    	w: 0.0	
    };

    this.ambient = {
    	r: 0.0,
    	g: 0.0,
    	b: 0.0,
    	a: 0.0	
    };

    this.diffuse = {
    	r: 0.0,
    	g: 0.0,
    	b: 0.0,
    	a: 0.0	
    };

    this.specular = {
    	r: 0.0,
    	g: 0.0,
    	b: 0.0,
    	a: 0.0	
    };
}

function Texture(id) {
    this.id = id;
    this.filePath = "";
    this.amplifFactor_S = 0.0;
    this.amplifFactor_T = 0.0;
}

function Material(id) {
    this.id = id;
    this.shininessValue = 0.0;
    this.specular = {
    	r: 0.0,
    	g: 0.0,
    	b: 0.0,
    	a: 0.0	
    };

    this.diffuse = {
    	r: 0.0,
    	g: 0.0,
    	b: 0.0,
    	a: 0.0	
    };

    this.ambient = {
    	r: 0.0,
    	g: 0.0,
    	b: 0.0,
    	a: 0.0	
    };

    this.emission = {
    	r: 0.0,
    	g: 0.0,
    	b: 0.0,
    	a: 0.0	
    };
}

function Node(id) {
    this.id = id;
    this.material = null;
    this.texture = null;
    this.matrix = mat4.create();
    this.descendants = [];
}

function Leaf(id) {
    this.id = id;
    this.type = "";
    this.args = [];
}
