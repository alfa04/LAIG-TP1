
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

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

	var error = this.parseTextures(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
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

MySceneGraph.prototype.parseTextures= function(rootElement) {

	console.log("TEXTURES: \n");

	var textures = rootElement.getElementsByTagName('TEXTURES');
	if(textures == null) return "TEXTURES tag not found!";

	var texturesInfo = textures[0];

	var texture = texturesInfo.getElementsByTagName('TEXTURE');
	if(texture == null) return "TEXTURE tag not found!";

	for(var i = 0; i < texture.length; i++){

	var textureInfo = texture[i];

	this.textureInfo = [];
	this.textureInfo["id"] = this.reader.getString(textureInfo, "id", true);

	console.log("\tTEXTURE id: " + this.textureInfo["id"] + "\n");

	var file = textureInfo.getElementsByTagName('file');
	if(file == null) return "file tag not found!";

	var fileInfo = file[0];

	this.fileInfo = [];
	this.fileInfo["path"] = this.reader.getString(fileInfo, "path", true);

	console.log("\tfile path: " + this.fileInfo["path"] + "\n");

	var ampliFactor = textureInfo.getElementsByTagName('amplif_factor');
	if(ampliFactor == null) return "amplif_factor tag not found!";

	var ampliFactorInfo = ampliFactor[0];

	this.ampliFactorInfo = [];
	this.ampliFactorInfo["s"] = this.reader.getFloat(ampliFactorInfo, "s", true);
	this.ampliFactorInfo["t"] = this.reader.getFloat(ampliFactorInfo, "t", true);

	console.log("\tamplif_factor s: " + this.ampliFactorInfo["s"] + ", t: " + this.ampliFactorInfo["t"] + "\n\n");

	}

}


/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

};
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


