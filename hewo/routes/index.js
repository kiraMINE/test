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
var util = require("util");
//var d3 = require("d3");
//var dbscan = require("dbscan");
var L = require("leaflet");
var clustering = require('density-clustering');
var Distance 	 = require("distance");
var enclose = require('circle-enclose');
var distances    = new Distance();
//dbscan       = new dbscan(distances);
var dbscan = new clustering.DBSCAN();

var args = process.argv;
var type = args[2] || 'text';
var arr = []; 
var bufferString; 
var FILENAME = join(__dirname, 'movement.csv');
var longitude = [];
var latitude = [];
var vect = []; 



function csvHandler(req,res,callback){
  fs.readFile(FILENAME,function (err,data,jsonObj) {

  if (err) {
    return console.log(err);
  }

  //Convert and store csv information into a buffer. 
  bufferString = data.toString(); 

  //Store information for each individual person in an array index. Split it by every newline in the csv file. 
  arr = bufferString.split('\n'); 
  console.log(arr[0]);
  var jsonObj = [];
  var headers = arr[0].split(',');
  for(var i = 1; i < arr.length; i++) {
    var data = arr[i].split(',');
    var obj = {};
    for(var j = 0; j < data.length; j++) {
       obj[headers[j].trim()] = data[j].trim();
    }
    jsonObj.push(obj);
  }
  for(var i = 0; i < jsonObj.length; i++) {
	  latitude[i]= jsonObj[i]['"Latitude"'];
	  longitude[i]= jsonObj[i]['"Longitude"'];
	  delete jsonObj[i]['"CID"'];
	  delete jsonObj[i]['"YYYYMMDD"'];
	  delete jsonObj[i]['"hhmmss (UTC+0)"'];
	  delete jsonObj[i]['"MCC"'];
	  delete jsonObj[i]['"MNC"'];
	  delete jsonObj[i]['"LAC"'];
	  delete jsonObj[i]['"Timezone"'];
	  vect[i]=[parseFloat(latitude[i],10),parseFloat(longitude[i],10)];
  }
  //var clustering_obj = dbscan.cluster(vect,distances);
  //console.log('FINISHED reading ' + vect.length + ' and clustering them');
 var vect1=[];
 var circles=[];
  for(i = 0; i < 100; i++) {
	  vect1[i]=vect[i];
  }
  var List=[];
  var clusters = dbscan.run(vect1, 0.00001, 2);
  var circle
  for(var i = 0; i < clusters.length; i++) {
	  for(var j = 0; j < clusters[i].length; j++) {
		  
	                    List[j]={x: vect[clusters[i][j]][0], y: vect[clusters[i][j]][0]};                       
  }
	 circles[i]= makeCircle(List);
	  
  }
    
  
  console.log(circles);
 // var clusters = dbscan.run(vect, 5, 2);
 // console.log(clusters, dbscan.noise);
 // console.log(clusters[1][0]);
  
//  console.log(vect[0]);
//  console.log(latitude[0]);
//  console.log(longitude[0]);
  
});
}

csvHandler();


function makeCircle(points) {
	// Clone list to preserve the caller's data, do Durstenfeld shuffle
	var shuffled = points.slice();
	for (var i = points.length - 1; i >= 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		j = Math.max(Math.min(j, i), 0);
		var temp = shuffled[i];
		shuffled[i] = shuffled[j];
		shuffled[j] = temp;
	}
	
	// Progressively add points to circle or recompute circle
	var c = null;
	for (var i = 0; i < shuffled.length; i++) {
		var p = shuffled[i];
		if (c == null || !isInCircle(c, p))
			c = makeCircleOnePoint(shuffled.slice(0, i + 1), p);
	}
	return c;
}




//One boundary point known
function makeCircleOnePoint(points, p) {
	var c = {x: p.x, y: p.y, r: 0};
	for (var i = 0; i < points.length; i++) {
		var q = points[i];
		if (!isInCircle(c, q)) {
			if (c.r == 0)
				c = makeDiameter(p, q);
			else
				c = makeCircleTwoPoints(points.slice(0, i + 1), p, q);
		}
	}
	return c;
}


//Two boundary points known
function makeCircleTwoPoints(points, p, q) {
	var circ = makeDiameter(p, q);
	var left = null;
	var right = null;
	
	// For each point not in the two-point circle
	points.forEach(function(r) {
		if (isInCircle(circ, r))
			return;
		
		// Form a circumcircle and classify it on left or right side
		var cross = crossProduct(p.x, p.y, q.x, q.y, r.x, r.y);
		var c = makeCircumcircle(p, q, r);
		if (c == null)
			return;
		else if (cross > 0 && (left == null || crossProduct(p.x, p.y, q.x, q.y, c.x, c.y) > crossProduct(p.x, p.y, q.x, q.y, left.x, left.y)))
			left = c;
		else if (cross < 0 && (right == null || crossProduct(p.x, p.y, q.x, q.y, c.x, c.y) < crossProduct(p.x, p.y, q.x, q.y, right.x, right.y)))
			right = c;
	});
	
	// Select which circle to return
	if (left == null && right == null)
		return circ;
	else if (left == null)
		return right;
	else if (right == null)
		return left;
	else
		return left.r <= right.r ? left : right;
}


function makeCircumcircle(p0, p1, p2) {
	// Mathematical algorithm from Wikipedia: Circumscribed circle
	var ax = p0.x, ay = p0.y;
	var bx = p1.x, by = p1.y;
	var cx = p2.x, cy = p2.y;
	var ox = (Math.min(ax, bx, cx) + Math.max(ax, bx, cx)) / 2;
	var oy = (Math.min(ay, by, cy) + Math.max(ay, by, cy)) / 2;
	ax -= ox; ay -= oy;
	bx -= ox; by -= oy;
	cx -= ox; cy -= oy;
	var d = (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by)) * 2;
	if (d == 0)
		return null;
	var x = ox + ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
	var y = oy + ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
	var ra = distance(x, y, p0.x, p0.y);
	var rb = distance(x, y, p1.x, p1.y);
	var rc = distance(x, y, p2.x, p2.y);
	return {x: x, y: y, r: Math.max(ra, rb, rc)};
}


function makeDiameter(p0, p1) {
	var x = (p0.x + p1.x) / 2;
	var y = (p0.y + p1.y) / 2;
	var r0 = distance(x, y, p0.x, p0.y);
	var r1 = distance(x, y, p1.x, p1.y);
	return {x: x, y: y, r: Math.max(r0, r1)};
}


/* Simple mathematical functions */

var MULTIPLICATIVE_EPSILON = 1 + 1e-14;

function isInCircle(c, p) {
	return c != null && distance(p.x, p.y, c.x, c.y) <= c.r * MULTIPLICATIVE_EPSILON;
}


//Returns twice the signed area of the triangle defined by (x0, y0), (x1, y1), (x2, y2).
function crossProduct(x0, y0, x1, y1, x2, y2) {
	return (x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0);
}


function distance(x0, y0, x1, y1) {
	return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
}



/*

L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';

var attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>';
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=ab447757cc0b4f368930bfb5711247a7', {
    maxZoom: 18,
    attribution: attribution
//    id: 'your.mapbox.project.id',
//    accessToken: 'your.mapbox.public.access.token'
}).addTo(mymap);
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
var len = latitude.length;
var i = 0;

while (len--) {
	
var val = 1;
var point = {
  x: latitude[i],
  y: longitude[i],
  value: val
};
i=+1;
points.push(point);
}
//heatmap data format

//for data initialization
heatmapInstance.setData(points);




var FILENAME = join(__dirname, 'movement.csv');
d3.csv(FILENAME,function(d) {
   return{ 
	YYYYMMDD : +d['"YYYYMMDD"'],
    hhmmss : +d['"hhmmss (UTC+0)"'],
    MCC : +d['"MCC"'],
    MNC : +d['"MNC"'],
    LAC : +d['"LAC"'],
    CID : +d['"CID"'],
    Latitude : +d['"Latitude"'],
    Longitude : +d['"Longitude"'],
    Timezone : +d['"Timezone"']};
  }, function(data) {
	  console.log(data[0]);
	});

*/

//transmettre le fichier de données à index.ejs

router.get('/', function(req, res, next) {
  res.render('index', { title: 'huhuhu'});
});

module.exports = router;