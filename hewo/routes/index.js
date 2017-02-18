var express = require('express');
var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var join = require('path').join;
//var h337 = require ('heatmap');
var fs = require('fs');
var cv = require('comma-separated-values');
var csv = require('csv');
var http = require('http');
/*
var generator = csv.generate({seed: 1, columns: 2, length: 20});
var parser = csv.parse();
var transformer = csv.transform(function(data){
  return data.map(function(value){return value.toUpperCase()});
});
var stringifier = csv.stringify();

generator.on('readable', function(){
  while(data = generator.read()){
    parser.write(data);
  }
});
*/


//fonction pour lire un fichier csv
/*function readCSVFile(filepath){
	  fs.readFile(filepath, { encoding: 'utf-8' }, function(err, content){
	    if (err){
	      throw err;
	    }
	    var fichier= csv().from(filepath).on('data', console.log);
	// retourne le fichier csv en forme de tableau de tableau
	 var fichier=csv.parse(content, { header: true, delimiter: ',' });
	 if (fichier===null){return "NUL";}
	 else
	    {return (fichier);}
	  });
	}

var FILENAME = join(__dirname, 'movement.csv');
var move=readCSVFile(FILENAME);


*/








/*
//minimal heatmap instance configuration
var document = join(__dirname,'hm.jpeg');

var heatmapInstance = h337.create({
// only container is required, the rest will be defaults
container: document.querySelector('.heatmap')
});

//now generate the data
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
//heatmap data format

//for data initialization
heatmapInstance.setData(points);*/

//transmettre le fichier de données à index.ejs



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'huhuhu'});
});

module.exports = router;