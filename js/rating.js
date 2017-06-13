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

var indlist= ["HO_BASE", "HO_HISH", "HO_NUMR", "IW_HADI", "IW_HNFW", "JE_EMPL", "JE_LTUR", "JE_PEARN", "SC_SNTWS", "ES_EDUA", "ES_STCS", "ES_EDUEX", "EQ_AIRP", "EQ_WATER", "CG_VOTO", "HS_LEB", "HS_SFRH", "SW_LIFS", "PS_REPH", "WL_EWLH", "WL_TNOW", "JE_LMIS", "CG_SENG", "PS_FSAFEN"];

var measure_list= ["Housing", "Jobs", "Education", "Civic_Engagement", "Life_Satisfaction", "Work_Life_Balance", "Income", "community", "Environment", "Health", "Safety"];

var Housing_list= ["HO_BASE", "HO_HISH", "HO_NUMR"];
var Income_list= ["IW_HADI", "IW_HNFW"];
var Jobs_list= ["JE_EMPL", "JE_LTUR", "JE_PEARN", "JE_LMIS"];
var Community_list= ["SC_SNTWS"];
var Education_list= ["ES_EDUA", "ES_STCS", "ES_EDUEX"];
var Environment_list= ["EQ_AIRP", "EQ_WATER"];
var Civic_Engagement_list= ["CG_VOTO", "CG_SENG"];
var Health_list= ["HS_LEB", "HS_SFRH"];
var Life_Satisfaction_list= ["SW_LIFS"];
var Saftey_list= ["PS_REPH", "PS_FSAFEN"];
var Work_Life_Balance_list= ["WL_EWLH", "WL_TNOW"];

var m_ind_list= 
{"Housing": ["HO_BASE", "HO_HISH", "HO_NUMR"], 
	"Jobs": ["JE_EMPL", "JE_LTUR", "JE_PEARN", "JE_LMIS"],
	"Education": ["ES_EDUA", "ES_STCS", "ES_EDUEX"],
	"Civic_Engagement": ["CG_VOTO", "CG_SENG"],
	"Life_Satisfaction": ["SW_LIFS"],
	"Work_Life_Balance": ["WL_EWLH", "WL_TNOW"],
	"Income":["IW_HADI", "IW_HNFW"], 
	"Community":["SC_SNTWS"],
	"Environment": ["EQ_AIRP", "EQ_WATER"],
	"Health":["HS_LEB", "HS_SFRH"],
	"Safety":["PS_REPH", "PS_FSAFEN"]
};

var prev_measure_value=
{"Housing":50 , "Jobs":50, "Education":50, "Civic_Engagement":50, "Life_Satisfaction":50, "Work_Life_Balance":50, "Income":50, "community":50, "Environment":50, "Health":50, "Safety":50};

var weight_sum=0;

var clist={};
var minlist={};
var maxlist={};

$(document).ready(function(){
	resetPage();
});

function resetPage(){
	var sliders= document.getElementsByClassName("slider");
	for(var i=0; i< sliders.length; i++){
		sliders[i].value= 50;
		console.log(sliders[i].value);
	}
}

init_minmax();
getdata(true).then(function(){
	//console.log("THEN");
	normalize();
	calculate_measure();
	init_score();
});


function init_minmax(){
	for (i=0; i< indlist.length; i++){
		var ind= indlist[i];
		minlist[ind]= 10000000;
		maxlist[ind]= -100000000;
	}
}

function getdata(param){
	return new Promise(function(resolve, reject){
		//do stuff
		var i=0;
		d3.csv("data/reOECD.csv", function(err, data){
			//console.log(data[0]);
			data.forEach(function(d,i){
				var cname= oecd[i];
				clist[cname]= data[i];
				//console.log(d3.keys(d));	
				//console.log(d);
				for(var i=0; i < d3.keys(d).length; i++){
					var ind= d3.keys(d)[i];
					var newvalue= parseFloat(d3.values(d)[i]);
					var minvalue= parseFloat(minlist[ind]);
					var maxvalue= parseFloat(maxlist[ind]);
				//	console.log("max: "+ maxlist[ind]+"/min: "+ minlist[ind]+"/"+ d3.values(d)[i]+"\n");
					if(minvalue> newvalue ) minlist[ind]= newvalue;
					if(maxvalue< newvalue ) maxlist[ind]= newvalue;
				//	console.log("AFTER, max: " + maxlist[ind] + "/ min: "+ minlist[ind]);
				}
			});
			if(err) reject(Error("FAIL"));
			else resolve("result");
		});

	});
}

function normalize(){
	console.log("normalize-------------\n");
	console.log(clist);
	
	for (c in clist){
		var cobj= clist[c];
		console.log(Object.keys(cobj));
		for( var key in cobj){
			if(maxlist[key]-minlist[key]!=0) {
				//console.log("c:"+c+"/ key: "+key+ "/cobj: "+cobj[key]+ "/max: "+ maxlist[key]+ "/min: "+ minlist[key]);
				cobj[key]= ( cobj[key]-minlist[key] ) / (maxlist[key]- minlist[key]) ;
			}
		}
	}

	//country_score();
}

function calculate_measure(){
	console.log("calculate_measure-----------------");
	for (c in clist){
		var cobj= clist[c];
		//console.log(Object.keys(measure_list));
		for (var measure in m_ind_list){
			var measure_avg= 0;
			for (i=0 ;i < (m_ind_list[measure]).length; i++){
			//for( indicator in measure_list[measure]){
			  var indicator= (m_ind_list[measure])[i];
				//console.log(indicator);
				measure_avg+= cobj[indicator];
			}
			//console.log("measure:" + measure);
			measure_avg= measure_avg/ (m_ind_list[measure].length);
			cobj[measure]= measure_avg;
		}
	}
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

function country_score(cname){	
	console.log("country_score called");
	var cobj= clist[cname];
	var score= 0;
	for (i=0; i< 2; i++){//(Object.keys(measure_list)).length; i++){
		var ind= Object.keys(m_ind_list)[i];	
		var weight= document.getElementById(ind).value;
		var val= cobj[ind];
		score+= weight* val;
		//console.log(ind+"	value= "+val+", weight= "+weight);
	}
	score= score/(Object.keys(m_ind_list)).length; 
	score= score/100.0;
	console.log("Total score: "+ score);
	return score;
}

function init_score(){
	for (cname in clist){
		var cobj= clist[cname];
		var score= 0;
		for (i=0; i< (Object.keys(m_ind_list)).length; i++){
			var ind= Object.keys(m_ind_list)[i];	
			console.log("- - "+ ind);
			//if(document.getElementById(ind)==null) console.log("WHY null:"+ ind);
			var weight= document.getElementById(ind).value;
			var val= cobj[ind];
			score+= 50* val;
			if(i==0) weight_sum+= 50;
			//console.log(ind+"	value= "+val+", weight= "+50);
		}
		cobj["Raw_Score"]= score;
	}
}

console.log("indlist:"+indlist.length);
var measure= document.getElementsByClassName("measure");
for(var i=0; i<measure.length; i++){
	//console.log(measure[i]);
	measure[i].addEventListener("input", incremental_score_change);

}

//document.getElementById("HO_BASE").addEventListener("input", incremental_score_change);

function incremental_score_change(){
	console.log("onchange!");
	var change_id= this.id;
	var prev= prev_measure_list[change_id];
	var cur= this.value;
	prev_measure_list[change_id]= cur;
	for(c in clist){
		var cobj= clist[c];
		
	}
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

	var color = d3. scale.linear()
		.domain([0, 0.1 , 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1])
		.range( ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"] );


  country.enter().insert("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("id", function(d,i) { return d.id; })
      .attr("title", function(d,i) { return d.properties.name; })
      .style("fill", function(d, i) { 
        if(oecd.contains(d.properties.name)) {
          var cobj= clist[d.properties.name];
					if(cobj=== undefined) return d.properties.color;
					//var value= country_score(d.properties.name);
					var value= cobj["Raw_Score"]/ weight_sum;
					//console.log(d.properties.name+", value: "+value);
					if( color(value)==="#NaNNaNNaN") console.log("XXXXXXXXXXX"+ d.properties.name+": "+ value);
					return color(value);
					/*c=c+1;
					name = d.properties.name;
					if(hasOwnProperty(clist, name)){
						//console.log(clist[name]);
					}
          return d.properties.color;
					*/
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


