var http = require('http');
var join = require('path').join;
var h337 = require ('heatmap');
var fs = require('fs');
var csv = require('comma-separated-values');
var csv = require('csv');
var app= require('app');

//fonction pour lire un fichier csv
function readCSVFile(filepath){
	  fs.readFile(filepath, { encoding: 'utf-8' }, function(err, content){
	    if (err){
	      throw err;
	    }
	// retourne le fichier csv en forme de tableau de tableau
	 var fichier=new csv(content, { header: true, delimiter: ';' });
	    return (fichier.parse());
	  });
	}


var FILENAME = join(__dirname, 'movement.csv');

var move=readCSVFile(FILENAME);



// minimal heatmap instance configuration
var document = join(__dirname,'hm.jpeg');

var heatmapInstance = h337.create({
  // only container is required, the rest will be defaults
  container: document.querySelector('.heatmap')
});

// now generate some random data
var points = [];
var len = move.length;
var i = 0;

while (len--) {
	i=+1;
  var val = 1;
  var point = {
    x: move[i][7],
    y: move[i][8],
    value: val
  };
  points.push(point);
}
// heatmap data format

// for data initialization
heatmapInstance.setData(points);
