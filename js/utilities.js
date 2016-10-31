'use strict';

function clamp(val, min, max){
	return Math.max(min, Math.min(max, val));
}

function simplePreload(imageArray){
	// loads images all at once
	for (var i = 0; i < imageArray.length; i++) {
		var img = new Image();
		img.src = imageArray[i];
	}
}

function loadImagesWithCallback(sources, callback) {
    var imageObjects = [];
    var numImages = sources.length;
    var numLoadedImages = 0;

    for (var i = 0; i < numImages; i++) {
        imageObjects[i] = new Image();
        imageObjects[i].onload = function() {
            numLoadedImages++;
            console.log("loaded image at '" + this.src + "'")

            if(numLoadedImages >= numImages) {
                callback(imageObjects); // send the images back
            }
        };
        imageObjects[i].src = sources[i];
    }
}

function circlesIntersect(c1, c2){
	var dx = c2.x - c1.x;
	var dy = c2.y - c1.y;
	var distance = Math.sqrt(dx*dx + dy*dy);
	return distance < c1.radius + c2.radius;
}