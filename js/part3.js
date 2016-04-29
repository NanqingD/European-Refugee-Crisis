//---------------------------------------- for part 3 ------------------------------------------------------------//
var height = 500;
var width = 1200;
var margin3 = {left:300, right:300, top:60, down:60};

var svg_3 = d3.select("#economics").append("svg").attr("class","svg_3")
.attr("height", height)
.attr("width", width);

var year = [2010,2011,2012,2013,2014,2015];

var xScale = d3.scale.ordinal().domain(year).rangeRoundPoints([margin3.left, width-margin3.right], 0.3);
var yScale = d3.scale.linear().domain([-20, 70]).range([height-margin3.down, margin3.top]);
var yScale2 = d3.scale.linear().domain([0, 400000]).range([height-margin3.down, margin3.top]);


var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
var yAxis = d3.svg.axis().scale(yScale).orient("left");
var yAxis2 = d3.svg.axis().scale(yScale2).orient("right");

svg_3.append("g").attr("transform", "translate(0," + (height-margin3.down) + ")").attr("class", "axis")
.call(xAxis);
svg_3.append("g").attr("transform", "translate(" + margin3.left + ",0)").attr("class", "axis")
.call(yAxis);
svg_3.append("g").attr("transform", "translate(" + (width-margin3.right) + ",0)").attr("class", "axis")
.call(yAxis2);

// Axis Label
svg_3.append("text").attr("x", margin3.left-50).attr("y", margin3.top-20).text("Percentage(%)").attr("class","plottext");

svg_3.append("text").attr("x", width-margin3.right-50).attr("y",margin3.top-20).text("Asylum Seeker").attr("class","plottext");

// Legend
var xpos1 = 0 + 50;
var colorpos1 = 0 + 60;
var textpos1 = 0 + 110;
var ypos1 = margin3.top + 45;
// Rect
var rect = {widthL:190, left:140, right:50, widthR:170};

svg_3.append("rect").attr("x",xpos1).attr("y",80).attr("height",rect.left).attr("width",rect.widthL);
svg_3.append("line").attr("class","legend").attr("x1",colorpos1).attr("y1",ypos1+5).attr("x2",xpos1+50).attr("y2",ypos1+5).style("stroke","#de2d26");
svg_3.append("line").attr("class","legend").attr("x1",colorpos1).attr("y1",ypos1+45).attr("x2",xpos1+50).attr("y2",ypos1+45).style("stroke","#fc9272");
svg_3.append("line").attr("class","legend").attr("x1",colorpos1).attr("y1",ypos1+85).attr("x2",xpos1+50).attr("y2",ypos1+85).style("stroke","#fee0d2");

svg_3.append("text").attr("class","legend").attr("x",textpos1).attr("y",ypos1).text("Unemployment");
svg_3.append("text").attr("class","legend").attr("x",textpos1).attr("y",ypos1+15).text("Rate");

svg_3.append("text").attr("class","legend").attr("x",textpos1).attr("y",ypos1+40).text("GDP Anual");
svg_3.append("text").attr("class","legend").attr("x",textpos1).attr("y",ypos1+55).text("Growth Rate");

svg_3.append("text").attr("class","legend").attr("x",textpos1).attr("y",ypos1+90).text("Inflation Rate");



var xpos2 = width-margin3.right + 90;
var colorpos2 = width-margin3.right + 100;
var textpos2 = width-margin3.right + 160;
var ypos2 = margin3.top + 45;

svg_3.append("rect").attr("x",xpos2).attr("y",80).attr("height",rect.right).attr("width",rect.widthR);
svg_3.append("line").attr("class","legend").attr("x1",colorpos2).attr("y1",ypos2).attr("x2",xpos2+50).attr("y2",ypos2).style("stroke","#a6d96a");
svg_3.append("text").attr("class","legend").attr("x",textpos2).attr("y",ypos2-5).text("Asylum");
svg_3.append("text").attr("class","legend").attr("x",textpos2).attr("y",ypos2+15).text("Seeker");

svg_3.append("text").attr("class","label").attr("x",width/2).attr("y",ypos2-50).style("text-anchor","middle");

// d3 tip
var uTip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Unemployment:</strong> <span style='color:#de2d26'>" + d.y + "%" + "</span>";
  });

var gTip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>GDP Growth:</strong> <span style='color:#fc9272'>" + d.y + "%" + "</span>";
  });

var iTip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Inflation:</strong> <span style='color:#ffffbf'>" + d.y + "%" + "</span>";
  });

var mTip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Migration:</strong> <span style='color:#a6d96a'>" + d.y + "</span>";
  });

svg_3.call(uTip);
svg_3.call(gTip);
svg_3.call(iTip);
svg_3.call(mTip);

var unemploymentLine, gdpLine, inflationLine, migrationLine;
var uPoints, gPoints, iPoints, mPoints;
var uCircles, gCircles, iCircles, mCircles;

	// Line 
	unemploymentLine = d3.svg.line()
	.x(function (d) { return xScale(d["year"]); })
	.y(function (d) { return yScale(d["unemployment"]); });

	gdpLine = d3.svg.line()
	.x(function (d) { return xScale(d["year"]); })
	.y(function (d) { return yScale(d["GDP"]); });

	inflationLine = d3.svg.line()
	.x(function (d) { return xScale(d["year"]); })
	.y(function (d) { return yScale(d["inflation"]); });

	migrationLine = d3.svg.line()
	.x(function (d) { return xScale(d["year"]); })
	.y(function (d) { return yScale2(d["migration"]); });

	var country;

d3.csv("Data/syria.csv", function (error, data) {
	if (error) {
		console.log(error);
	}
	country = data;
	d3.select(".label").text("Syria");
	plot();
});

function changeToSyria () {

	d3.csv("Data/syria.csv", function (error, data) {
	if (error) {
		console.log(error);
	}

	country = data;
	
	d3.select(".label").text("Syria");
	update();
	plot();
    });
}

function changeToAfghan () {
	d3.csv( "Data/afghanisdhan.csv", function (error, data) {
	if (error) {
		console.log(error);
	}

	country = data;
	
	d3.select(".label").text("Afghanistan");
	update();
	plot();
    });
}


function changeToIraq () {

	d3.csv( "Data/iraq.csv", function (error, data) {
	if (error) {
		console.log(error);
	}
	country = data;
	
	d3.select(".label").text("Iraq");
	update();
	plot();
    });
}

function update () {

		d3.selectAll(".plot").remove();
		d3.selectAll("circle").remove();		
}

function plot () {
	svg_3.append("path").attr("d", unemploymentLine(country))
	.attr("class", "plot").attr("stroke", "#de2d26");

	svg_3.append("path").attr("d", gdpLine(country))
	.attr("class", "plot").attr("stroke", "#fc9272");

	svg_3.append("path").attr("d", inflationLine(country))
	.attr("class", "plot").attr("stroke", "#ffffbf");

	svg_3.append("path").attr("d", migrationLine(country))
	.attr("class", "plot").attr("stroke", "#a6d96a");

	// Circles
	// Unemployment
	uPoints = country.map(function (d) {
		return {
			x: Number(d["year"]),
		 	y: Number(d["unemployment"])
		};
	});

	uCircles = svg_3.selectAll(".uPoint").data(uPoints);

	uCircles.enter().append("circle")
	.attr("class", "uPoint")
	.attr("cx", function (d) { return xScale(d.x); })
	.attr("cy", function (d) { return yScale(d.y); })
	.attr("r", 10)
	.style("fill", "#de2d26")
	.style("opacity", 0.5)
	.on('mouseover', uTip.show)
    .on('mouseout', uTip.hide);

    //GDP
    gPoints = country.map(function (d) {
		return {
			x: Number(d["year"]),
		 	y: Number(d["GDP"])
		};
	});

	gCircles = svg_3.selectAll(".gPoint").data(gPoints);

	gCircles.enter().append("circle")
	.attr("class", "gPoint")
	.attr("cx", function (d) { return xScale(d.x); })
	.attr("cy", function (d) { return yScale(d.y); })
	.attr("r", 10)
	.style("fill", "#fc9272")
	.style("opacity", 0.5)
	.on('mouseover', gTip.show)
    .on('mouseout', gTip.hide);

    // Inflation
    iPoints = country.map(function (d) {
		return {
			x: Number(d["year"]),
		 	y: Number(d["inflation"])
		};
	});

	iCircles = svg_3.selectAll(".iPoint").data(iPoints);

	iCircles.enter().append("circle")
	.attr("class", "iPoint")
	.attr("cx", function (d) { return xScale(d.x); })
	.attr("cy", function (d) { return yScale(d.y); })
	.attr("r", 10)
	.style("fill", "#ffffbf")
	.style("opacity", 0.5)
	.on('mouseover', iTip.show)
    .on('mouseout', iTip.hide);

    mPoints = country.map(function (d) {
		return {
			x: Number(d["year"]),
		 	y: Number(d["migration"])
		};
	});

	mCircles = svg_3.selectAll(".mPoint").data(mPoints);

	mCircles.enter().append("circle")
	.attr("class", "mPoint")
	.attr("cx", function (d) { return xScale(d.x); })
	.attr("cy", function (d) { return yScale2(d.y); })
	.attr("r", 10)
	.style("fill", "#a6d96a")
	.style("opacity", 0.5)
	.on('mouseover', mTip.show)
    .on('mouseout', mTip.hide);
}