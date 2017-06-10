var colorcode=
["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]

var oecd= [
  "Australia",
  "Austria",
  "Belgium",
  "Canada",
  "Czech Republic",
  "Denmark",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Japan",
  "Korea, Republic of",
  "Luxembourg",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Poland",
  "Portugal",
  "Slovakia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Turkey",
  "United Kingdom",
  "United States",
  "Brazil",
  "Chile",
  "Estonia",
  "Israel",
  "Russian Federation",
  "Slovenia"
]

var clist={};
var minlist={};
var maxlist={};
var indlist=[];

getdata();

//normalize();
//inin();
function csv_parse(cname, dpath){
	var obj= {"name": cname};

	d3.csv(dpath, function (data){
		data.forEach(function(d){
			//console.log(data[0]);
			var indicator= d.INDICATOR;
			d.Value= parseFloat(d.Value);
			obj[indicator]= d.Value;
			indlist.push(indicator);
			//console.log(indicator);
			if( ! (indicator in minlist) ) minlist[indicator]= d.Value;
			else if( minlist[indicator] > d.Value) minlist[indicator]= d.Value;
			
			if( ! (indicator in maxlist) ) maxlist[indicator]= d.Value;
			else if( maxlist[indicator] < d.Value) maxlist[indicator]= d.Value;
			//name= d.Country;
			//clist[name]= new c_obj(d.Country, d.Value) ;
			//console.log(clist.length);
		});
	console.log(obj);
	console.log(Object.keys(obj));
	//console.log(obj["Air pollution"]);
	
	});
	//console.log("MYSTERY~~~~");
return obj;
}

function getdata(){
	var i=0;
	for (i=0; i< 6; i++){
		var cname= oecd[i];
		var datapath= "data/"+ cname+".csv";
		console.log(datapath);
		obj={"name": cname};
		var obj=csv_parse(cname, datapath);
		clist[cname]= obj;
		//console.log("i: "+ i+", "+cname);
		//console.log("done");
		//looparound();
	}
}
function inin(){
	for(iii in minlist){
		if(minlist.hasOwnProperty(iii)) console.log(iii);
		else console.log("nope");
	}
}
function normalize(){

		Object.keys(clist).forEach(function (c, i){
	//for (c in clist){
		var cobj= clist[c];
		//console.log(c);
		//console.log(Object.keys(cobj));
		//for( var key in cobj){
		//for (var key in Object.keys(cobj)){
		/*cobj.forEach(function(key, index){
		//Object.keys(cobj).forEach(function (key, index){
			console.log(key);
			cobj[key]= ( cobj[key]-minlist[key] ) / (maxlist[key]- minlist[key]) ;
		});*/
		//	(cobj["House expenditure"]-minlist["House expenditure"])/ (maxlist["House expenditure"]- minlist["House expenditure"]);
	});
}

function c_obj(c_name, value1){
	this.name= c_name;
	this.security= value1;
	this.total= value1;
	//console.log(this.name+"/"+this.security+"/"+this.total);
}

function looparound(){
	var llen= clist.length;
	console.log("llen: "+llen);
	var i=0; 
	var text= "";
	for ( i=0; i<llen ; i++){
		text += clist[i]+"\n";
	}
	console.log(text);
}


d3.select(window).on("resize", throttle);

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 9])
    .on("zoom", move);

var height = document.getElementById('container').offsetHeight;
var width = document.getElementById('container').offsetWidth;


var topo,projection,path,svg,g;

var graticule = d3.geo.graticule();

var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

setup(width,height);


function setup(width,height){
  projection = d3.geo.mercator()
    .translate([(width/2), (height/2)])
    .scale( width / 2 / Math.PI);

  path = d3.geo.path().projection(projection);

  console.log("height: "+height);
  svg = d3.select("#container").append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(zoom)
      .on("click", click)
      .append("g");

  g = svg.append("g");

}

d3.json("data/world-topo-min.json", function(error, world) {
  var countries = topojson.feature(world, world.objects.countries).features;
  topo = countries;
  draw(topo);
});


Array.prototype.contains = function(element) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == element) {
			return true;
		}
	}
	return false;
}

function hasOwnProperty(obj, prop) {
	    var proto = obj.__proto__ || obj.constructor.prototype;
			    return (prop in obj) &&
						        (!(prop in proto) || proto[prop] !== obj[prop]);
}

function score(cname){
}

//draw the map
function draw(topo) {

  var c=0;
  svg.append("path")
     .datum(graticule)
     .attr("class", "graticule")
     .attr("d", path);


  g.append("path")
   .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
   .attr("class", "equator")
   .attr("d", path);


  var country = g.selectAll(".country").data(topo);

  country.enter().insert("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("id", function(d,i) { return d.id; })
      .attr("title", function(d,i) { return d.properties.name; })
      .style("fill", function(d, i) { 
        if(oecd.contains(d.properties.name)) {
          c=c+1;
					name = d.properties.name;
					if(hasOwnProperty(clist, name)){
						//console.log(clist[name]);
					}
          return d.properties.color;
        }
        else return "#f0f8ff";
			})
	.style("stroke", function(d){
		if(oecd.contains(d.properties.name)) {
			return "none";
		}
		else return "#aaa";
	})

  console.log(c);
  //offsets for tooltips
  var offsetL = document.getElementById('container').offsetLeft+20;
  var offsetT = document.getElementById('container').offsetTop+10;

  //tooltips
	country
		.on("mousemove", function(d,i) {

			var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

			tooltip.classed("hidden", false)
				.attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
				.html(d.properties.name);

		})
	.on("mouseout",  function(d,i) {
		tooltip.classed("hidden", true);
	}); 
}

function redraw() {
  height = document.getElementById('container').offsetHeight;
  width = document.getElementById('container').offsetWidth;

	console.log("height: "+height);
  //width = height * 2;
  d3.select('svg').remove();
  setup(width,height);
  draw(topo);
}


function move() {

  var t = d3.event.translate;
  var s = d3.event.scale; 
  zscale = s;
  var h = height/4;


  t[0] = Math.min(
    (width/height)  * (s - 1), 
    Math.max( width * (1 - s), t[0] )
  );

  t[1] = Math.min(
    h * (s - 1) + h * s, 
    Math.max(height  * (1 - s) - h * s, t[1])
  );

  zoom.translate(t);
  g.attr("transform", "translate(" + t + ")scale(" + s + ")");

  //adjust the country hover stroke width based on zoom level
  
	d3.selectAll(".country").style("stroke-width", 1.0 / s);

}



var throttleTimer;
function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
      redraw();
    }, 200);
}


//geo translation on mouse click in map
function click() {
  var latlon = projection.invert(d3.mouse(this));
  //console.log(latlon);
}


//function to add points and text to the map (used in plotting capitals)
function addpoint(lat,lon,text) {

  var gpoint = g.append("g").attr("class", "gpoint");
  var x = projection([lat,lon])[0];
  var y = projection([lat,lon])[1];

  gpoint.append("svg:circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("class","point")
        .attr("r", 1.5);

  //conditional in case a point has no associated text
  if(text.length>0){

    gpoint.append("text")
          .attr("x", x+2)
          .attr("y", y+2)
          .attr("class","text")
          .text(text);
  }

}

