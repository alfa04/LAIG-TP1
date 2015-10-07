
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
	var error = this.parseGlobalsExample(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

MySceneGraph.prototype.parseInitials= function(rootElement) {

	console.log("INITIALS: \n");

	this.initialsInfo={};

}

MySceneGraph.prototype.parseIlumination= function(rootElement) {

	console.log("ILUMINATION: \n");

	var ilumination = rootElement.getElementsByTagName('ILLUMINATION');
	if(ilumination == null) return "ILLUMINATION tag not found!";


	var iluminationInfo = ilumination[0];

	var ambient = iluminationInfo.getElementsByTagName("ambient");
	if(ambient == null) return "AMBIENT not found!";

	console.log("AMBIENT: ");

	var ambientInfo = ambient[0];
	this.ambientInfo = [];
	this.ambientInfo["r"] = this.reader.getFloat(ambientInfo, "r", true);
	this.ambientInfo["g"] = this.reader.getFloat(ambientInfo, "g", true);
	this.ambientInfo["b"] = this.reader.getFloat(ambientInfo, "b", true);
	this.ambientInfo["a"] = this.reader.getFloat(ambientInfo, "a", true);

	console.log("R: " + this.ambientInfo["r"] + "G: " + this.ambientInfo["g"] + "B: " + this.ambientInfo["g"] + "A: " + this.ambientInfo["a"] + "\n");

	var background = iluminationInfo.getElementsByTagName("background");
	if(background == null) return "BACKGROUND not found!";

	console.log("BACKGROUND: ");

	var backgroundInfo = background[0];
	this.backgroundInfo = [];
	this.backgroundInfo["r"] = this.reader.getFloat(backgroundInfo, "r", true);
	this.backgroundInfo["g"] = this.reader.getFloat(backgroundInfo, "g", true);
	this.backgroundInfo["b"] = this.reader.getFloat(backgroundInfo, "b", true);
	this.backgroundInfo["a"] = this.reader.getFloat(backgroundInfo, "a", true);

	console.log("R: " + this.backgroundInfo["r"] + "G: " + this.backgroundInfo["g"] + "B: " + this.backgroundInfo["g"] + "A: " + this.backgroundInfo["a"] + "\n");
	
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


