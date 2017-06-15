$('head').append('<script src=\'js/radar-chart.js\'><\/script>');

var colorcode=
["#ffffff","#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837", "#222222"];

var green_red=
["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"];

var blue=
["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"];

var YlGn= ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"];


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

var negative_ind_list=["HO_BASE","HO_HISH","JE_LTUR","EQ_AIRP","PS_REPH", "WL_EWLH", "JE_LMIS"];

var prev_weights=
{"Housing":50 , "Jobs":50, "Education":50, "Civic_Engagement":50, "Life_Satisfaction":50, "Work_Life_Balance":50, "Income":50, "Community":50, "Environment":50, "Health":50, "Safety":50};

var raw_score={};
var score_for_color={};
var weight_sum=550;

var clist={};
var minlist={};
var maxlist={};

var save_num=0;
//var rad_chart= d3.select("#r1").append("div")
//.attr("id", "radar_position")

$(document).ready(function(){
	resetPage();
});

function resetPage(){
	var sliders= document.getElementsByClassName("slider");
	for(var i=0; i< sliders.length; i++){
		sliders[i].value= 50;
		//console.log(sliders[i].value);
	}
}

init_minmax();
getdata(true).then(function(){
	//console.log("THEN");
	normalize();
	calculate_measure();
	init_score();
//	draw_radarchart("Australia");

});

/*
function draw_radarchart(cname){
	//produce data
	var c= clist[cname];
	var country_data= {"className": cname};
	var axes= [];
	for(i=0; i< (Object.keys(m_ind_list)).lenght; i++){
		var ind= Object.keys(m_ind_list)[i];
		var value= c[ind];
		var axis= {"axis": measure, "value": value};
		axes.push(axis);
	}
	country_data["axes"]= axes;

	var chart= RadarChart.chart();
	var data= [country_data];
	var w= 600;
	var h= 600;
	console.log(data);
	RadarChart.defaultConfig.radius= 3;
	RadarChart.defaultConfig.w= w;
	RadarChart.defaultConfig.h= h;
	RadarChart.draw("#chart-container", data);

}
*/
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
	//console.log(clist);
	
	for (c in clist){
		var cobj= clist[c];
		//console.log(Object.keys(cobj));
		for( var key in cobj){
			if(maxlist[key]-minlist[key]!=0) {
				//console.log("c:"+c+"/ key: "+key+ "/cobj: "+cobj[key]+ "/max: "+ maxlist[key]+ "/min: "+ minlist[key]);
				cobj[key]= ( cobj[key]-minlist[key] ) / (maxlist[key]- minlist[key]) ;
			}
			if(negative_ind_list.indexOf(key)> -1) cobj[key]= 1- cobj[key];
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
      //.on("click", click)
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
	for (i=0; i< (Object.keys(measure_list)).length; i++){
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
			//console.log("- - "+ ind);
			//if(document.getElementById(ind)==null) console.log("WHY null:"+ ind);
			var weight= document.getElementById(ind).value;
			var val= cobj[ind];
			score+= 50* val;
			//console.log(ind+"	value= "+val+", weight= "+50);
		}
		//cobj["Raw_Score"]= score;
		raw_score[cname]= score;	
	}
	calculate_score_for_color();
}


var slider_bars= document.getElementsByClassName("slider");
for(var i=0; i<slider_bars.length; i++){
	console.log("SLIDER BAR");
	slider_bars[i].addEventListener("input", function(e) {incremental_score_change.call(this);} );

}
/*
var pin_button= document.getElementById("pin");
pin_button.on("click", save_radar);
*/
function save_radar(){
	console.log("SAVE entered");
	if(save_num>=4) {
		alert("Can save chart only up to 4");
		return;
	}
	document.getElementById("radar_row").style.display="block";
	var cname= document.getElementById("current_radar").innerHTML;
	var save_nth= "r"+ save_num;
	var save_pos= save_nth+"_c";
	var save_id_w= "#"+save_nth+"_w";
	var save_id= "#"+save_nth;
	document.getElementById(save_pos).innerHTML= cname;
	country_radar(save_id, save_id_w, cname);
	save_num++;
}
//document.getElementById("HO_BASE").addEventListener("input", incremental_score_change);

function incremental_score_change(){
	var change_id= this.id;
	//	var change_id= change_obj.id; 
	var prev= prev_weights[change_id];
	var cur= this.value;
	prev_weights[change_id]= cur;

	weight_sum+= (cur-prev);
	console.log("CHANGE: "+change_id);
	for(c in clist){
		console.log(c);
		var cobj= clist[c];
		raw_score[c]+= (cur-prev)*cobj[change_id];
		//cobj["Raw_Score"]+= (cur-prev)* cobj[change_id];
	}

	calculate_score_for_color();
	recolor();
	
	// no need to ichange the radar chart if not weighted
	var radar_cname= document.getElementById("current_radar").innerHTML;
	//country_radar("#c_radar","#w_radar", radar_cname);
	country_radar_weight("#w_radar", radar_cname);

	for(var i=0; i<save_num; i++){
		var wid= "#r"+i+"_w";
		var saveId= "r"+i+"_c";
		var cname= document.getElementById(saveId).innerHTML;
		country_radar_weight(wid, cname);
	}
}

var color = d3. scale.linear()
//.domain([0, 0.1 , 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1])
	.domain([0, 0.125, 0.25, 0.375, 0.5, 0.675, 0.75, 0.875, 1])
	.range(YlGn);

function calculate_score_for_color(){
	var values= Object.values(raw_score);
	var min= Math.min(...values);
	var max= Math.max(...values);
	if(max-min==0 || max-min===0) return 0;//;
	else {
		var denominator= max-min;
		for(cname in clist){
			score_for_color[cname]= (raw_score[cname]-min)/denominator;
		}	 
	}
}

function recolor(){
	console.log("RECOLOR");
	for(c in clist){
		var cobj= clist[c];
		var cid= cobj["ID"];
		//console.log(d3.selectAll("path.country")[0][cid]);
		var item= d3.selectAll("path.country")[0][cid];	
		//var newcolor= color( cobj["Raw_Score"]/ weight_sum);
		var newcolor= color(score_for_color[c]);
		item.setAttribute("style", "fill: "+newcolor);

	}
}

function minmin(){
	var min=100000;
	for(c in clist){
		var cobj= clist[c];
		for(m in m_ind_list){
			if(cobj[m]< min) min= cobj[m];
		}	
	}
	return min;
}

function maxmax(){
	var max=-100000;
	for(c in clist){
		var cobj= clist[c];
		for(m in m_ind_list){
			if(cobj[m]> max) max= cobj[m];
		}	
	}
	return max;
}

function cmin(c){
	var min=1000000;
	var cobj= clist[c];
	for(m in m_ind_list){
		if(cobj[m]<min) min= cobj[m];
	}	
	return min;
}

function cmax(c){
	var max=-100000;
	var cobj= clist[c];
	for(m in m_ind_list){
		if(cobj[m]> max) max= cobj[m];
	}	
	return max;
}

function wmax(){
	var max=-100000;
	for(m in m_ind_list){
		var v= document.getElementById(m).value;
		console.log(v);
		if(max< (v/weight_sum)) max= v/weight_sum;
	}
	return max*11;
}

function country_radar(div_select, div_select_2, cname){
	//RadarChart.defaultConfig.color = function() {};
	RadarChart.defaultConfig.radius = 3;
	RadarChart.defaultConfig.w= 175;
	RadarChart.defaultConfig.h= 150;
	RadarChart.defaultConfig.colorcode= colorcode;

	RadarChart.defaultConfig.minValue= minmin();
	RadarChart.defaultConfig.maxValue= maxmax();

	var c_data= {"className": "Raw"};
	var c_w_data= {"className": "Weighted"};
	var cobj= clist[cname];
	//console.log(cobj);
	var axes= [];
	var w_axes= [];
	//for (var i=0; i< m_ind_list.length; i++){
	for (m in m_ind_list){
		//var m= Object.keys(m_ind_list)[i];
		var val= cobj[m];
		var axis={};//{"axis": m, "value":, val};
		axis["axis"]= m;
		axis["value"]= val; //* 1/11.0;
		axes.push(axis);
	
		var w_axis={};
		var w= document.getElementById(m).value;
		w_axis["axis"]=m;
		w_axis["value"]= val* w/parseFloat(weight_sum) *11;
		w_axes.push(w_axis);
	}	
	c_data["axes"]= axes;
	c_w_data["axes"]= w_axes;
	var data= [c_data];
	var w_data=[c_w_data];

	RadarChart.defaultConfig.levelTick = true;
	RadarChart.draw(div_select, data); //".chart-container"

	RadarChart.defaultConfig.minValue= 0;
	RadarChart.defaultConfig.maxValue= wmax();
	RadarChart.draw(div_select_2, w_data);
}	


function country_radar_weight(div_select,  cname){
	//RadarChart.defaultConfig.color = function() {};
	RadarChart.defaultConfig.radius = 3;
	RadarChart.defaultConfig.w= 175;
	RadarChart.defaultConfig.h= 150;
	RadarChart.defaultConfig.colorcode= colorcode;

	var c_w_data= {"className": "Weighted"};
	var cobj= clist[cname];
	//console.log(cobj);
	var w_axes= [];
	//for (var i=0; i< m_ind_list.length; i++){
	for (m in m_ind_list){
		//var m= Object.keys(m_ind_list)[i];
		var val= cobj[m];
	
		var w_axis={};
		var w= document.getElementById(m).value;
		w_axis["axis"]=m;
		w_axis["value"]= val* w/parseFloat(weight_sum) *11;
		w_axes.push(w_axis);
	}	
	c_w_data["axes"]= w_axes;
	var w_data=[c_w_data];

	RadarChart.defaultConfig.minValue= 0;
	RadarChart.defaultConfig.maxValue= wmax();

	RadarChart.defaultConfig.levelTick = true;
	RadarChart.draw(div_select, w_data); //".chart-container"
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
				var cname= d.properties.name;
        if(oecd.contains(cname)) {
          var cobj= clist[cname];
					cobj["ID"]= d.id;
					if(cobj=== undefined) return d.properties.color;
					var newcolor= color(score_for_color[cname]);
					//if( newcolor==="#NaNNaNNaN") console.log("XXXXXXXXXXX"+ d.properties.name+": "+ score_for_color[c]);
					return newcolor;
        }
        else return "#f0f8ff";
			})
	.style("stroke", function(d){
		if(oecd.contains(d.properties.name)) {
			return "none";
		}
		else return "#aaa";
	})
	var offsetL = document.getElementById('container').offsetLeft+20;
	var offsetT = document.getElementById('container').offsetTop+10;

	//tooltips
	country
		.on("mousemove", function(d,i) {

			var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

			tooltip.classed("hidden", false)
				.attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
				.html(d.properties.name);

			if(oecd.contains(d.properties.name)) {
				//d3.select("#radar").attr("display", "inline");
				//d3.select("#radar-chart").attr("display", "inline");
				document.getElementById("current_radar").innerHTML= d.properties.name;
				country_radar("#c_radar", "#w_radar", d.properties.name);
				document.getElementById("pin").style.display="inline";
				//country_radar(d.properties.name);
			}
		})
	.on("mouseout",  function(d,i) {
		console.log("out");
		tooltip.classed("hidden", true);
		//d3.select("#radar").attr("display", "none");
		//d3.select(".radar-chart").attr("display", "none");
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


