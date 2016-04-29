
//create svg from now on // 
	var data_1 = {
		2010:272084,
		2011:329220,
		2012:365526,
		2013:478845,
		2014:676198,
		2015:1451641,
		//2016:180917,
	}

	var data_2 = {};

	//scale the data first;
	var xScale = d3.scale.linear().domain([0, 1460000]).range([1, 31]);
	for(v in data_1){
		var newnum  = data_1[v];
		newnum = Math.floor(xScale(newnum));
		//console.log(newnum);
		data_2[v] = newnum;//update the json value;		
	}

	//create svg;
	var padding_1 = 20;
	var height_1 = 500;
	var width_1 = 960;
		
	var svg_1 = d3.select("#div2").append("svg")
		.attr("height",height_1).attr("width",width_1);

	//svg_1.append("polygons").attr("points",d).attr("class","man1");

	var svg_12 =d3.select("#image_explian").append("svg").attr("height",height_1).attr("width",width_1);
	svg_12.append("svg:image")
				.attr("xlink:href","icon_edit.jpg")
				.attr("x",5)
				.attr("y",10)
				.style("height", 60)
				.style("width",30)
				.style("opacity",1);
				
	
	function change_text(year_1){
		var x_start = 1;
		var peo_year_data = data_1[year_1];

		svg_12.selectAll("text").remove();

		svg_12.append("text").text("=4,000 people").attr("x",50).attr("y",55).attr("class","img_text_org").style("opacity",1);
	
		//svg_12.append("text").text("There are").attr("x",220*x_start).attr("y",55).attr("class","img_text_white").style("opacity",1);
		svg_12.append("text").text(peo_year_data).attr("x",320*x_start).attr("y",55).attr("class","img_text_org").style("opacity",1);
		svg_12.append("text").text("refugees come into Europe in").attr("x",410*x_start).attr("y",55).attr("class","img_text_white").style("opacity",1);
		svg_12.append("text").text(year_1).attr("x",713*x_start).attr("y",55).attr("class","img_text_org").style("opacity",1);


	}

	//  re-init the dots  //

	function init_pic(){
		var hori_trans = 75;
		for(var col = 0; col < 3; col++){
			for(var row = 0; row < 10; row++){
				var idnum = col*10 + row + 1;
				var bodyid = "body" + idnum
				idnum = "manid" + idnum;

				svg_1.append("svg:image")
				.attr("xlink:href","icon_edit.jpg").attr("x",hori_trans * row)
				.attr("y",-100)
				.attr("class","imgman")
				.attr("id",idnum);

			}
		}
	}

//-----try to move the button here-----//

	
	function move_man(num){
		//move the pic and text first
		var child=document.getElementById("europic");
		if(child != null){
			child.parentNode.removeChild(child);
		}
		

		var child2 = document.getElementById("entering_Text");
		if(child2 != null){
			child2.parentNode.removeChild(child2);
		}

		document.getElementById("image_explian").style.visibility = "visible";


		// move the man;
		if(num == "2015"){
			document.getElementById("exp_text_12").style.visibility = "visible";
		}
		d3.selectAll(".imgman").remove();
		init_pic();
		var hori_trans = 75;
		var virt_trans = 100;
		var num_people = data_2[num];
		//alert(num_people);
		if(num_people <= 10){
			for(var row = 0; row < num_people; row++){
				var idnum = row + 1;
				var bodyid = "body" + idnum
				idnum = "manid" + idnum;

				d3.select("#"+idnum).transition()
				.duration(500)
				.attr("x",50 + hori_trans * row)
				.attr("y",70);
			

			}
			
		}

		if(num_people > 10 && num_people <= 20){
			var col = 0;
			for(var row = 0; row < 10; row++){
					var idnum = col*10 + row + 1;
					var bodyid = "body" + idnum
					idnum = "manid" + idnum;

					d3.select("#"+idnum).transition()
					.duration(500)
					.attr("x",50 + hori_trans * row)
					.attr("y",70);
				}
				col = 1;
				for(var row = 10; row < num_people; row++){
					var idnum = col*10 + row - 10 + 1;
					var bodyid = "body" + idnum
					idnum = "manid" + idnum;

					d3.select("#"+idnum).transition()
					.duration(500)
					.attr("x",50 + hori_trans * (row-10))
					.attr("y",70 + virt_trans * col);
				}
		
		}

		if(num_people > 20){
			for(var col = 0; col < 2; col++){
				for(var row = 0; row < 10; row++){
					var idnum = col*10 + row + 1;
					var bodyid = "body" + idnum
					idnum = "manid" + idnum;

					d3.select("#"+idnum).transition()
					.duration(500)
					.attr("x",50 + hori_trans * row)
					.attr("y",70 + virt_trans * col);
				}
			}
		

				col = 2;
				for(var row = 20; row < num_people; row++){
					var idnum = col*10 + row -20 + 1;
					var bodyid = "body" + idnum
					idnum = "manid" + idnum;
					//alert(idnum);
					d3.select("#"+idnum).transition()
					.duration(500)
					.attr("x",50 + hori_trans * (row-20))
					.attr("y",70 + virt_trans * col);
				}
			
			
			}

	
		change_text(num);
	
	}


