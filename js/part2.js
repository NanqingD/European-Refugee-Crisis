 

  var step = 2010.0,
            svg_popup,slider,links = {},
            counts_migration = {},
            data_for_barchart = {};

        //define the colors for the three countries
        var syria_color = "#3498db",
            afghan_color = "#1b9e77",
            iraq_color = "#e74c3c";


        // months array for numerical month to string conversion
        var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];


        // plot a slider which steps over evrery month of a year.
        slider = d3.slider().axis(d3.svg.axis().orient("bottom").ticks(7).tickFormat(d3.format("d"))).min(2010).max(2016).step(1 / 12)
            .value(2010).on("slide", function(evt, value) {
                // update the text on the screen as the slider passes by

                d3.select('#date #month').html(function(d, i) {
                    if (value.toString().split('.').length == 1)
                        return Math.floor(value) + " " + months[0];
                    var first_string = Math.ceil(parseFloat('.' + value.toString().split('.')[1]) * 12);
                    return months[first_string] + " " + Math.floor(value);
                });
            });

        d3.select('#slider').call(slider);


        // function to simulate movement from Syria, Afghanistan and Iraq to Europe
        // Important assumption: Each dot is considered to be equal to 250 people
        var flag_reset = false;
        function animate_people(links, temp_date) {
            if(flag_reset){
                counts_migration = {};
                flag_reset = false;
            }
            var temp_array = links[temp_date];
            temp_array.forEach(function(obj) {
                var no_of_people = Math.floor(obj.magnitude / 300);
                //console.log(obj.origin.country);
                if (!counts_migration.hasOwnProperty([obj.origin.country])) {
                    counts_migration[obj.origin.country] = 0;
                }
                if (!counts_migration.hasOwnProperty([obj.dest.country])) {
                    counts_migration[obj.dest.country] = 0;
                }

                // this data is used to display the total number of migrants to a country
                counts_migration[obj.origin.country] += obj.magnitude;
                counts_migration[obj.dest.country] += obj.magnitude;

                for (var i = 0; i < no_of_people; i++) {
                    //draw a circle and transition it 

                    var circle = arcs.append("circle")
                        .attr("cx", obj.originp[0])
                        .attr("cy", obj.originp[1])
                        .attr("r", "2")
                        .attr("fill", "#ecf0f1")
                        .attr("opacity", "1")
                        .transition()
                        .ease("linear")
                        .duration(4000)
                        .attr("cx", obj.destp[0])
                        .attr("cy", obj.destp[1])
                        .each("end", rendertext);

                    function rendertext() {
                        if(d3.select("#play_pause")[0][0].getAttribute("value") == "PLAY"){
                            d3.selectAll("circle").transition();
                            arcs.selectAll("text").remove();
                            flag_reset = true;
                            return;
                        }
                            
                        if (obj.origin.country == "Syrian Arab Rep.")
                            id = "Syria";
                        else
                            id = obj.origin.country;

                        if (obj.dest.country == "United Kingdom of Great Britain and Northern Ireland")
                            id_dest = "uk";
                        else
                            id_dest = obj.dest.country;

                        d3.select("#" + id_dest+"text").remove();
                        d3.select("#" + id+"text").remove();

                        arcs.append("text")
                            .attr("id", id_dest+"text")
                            .attr("x", obj.destp[0])
                            .attr("y", obj.destp[1])
                            .text("+" + counts_migration[obj.dest.country].toString())
                            .attr("stroke", "#ecf0f1")
                            .attr("opacity","0.8")
                            .attr("fill", "none")
                            .attr("stroke-width", "1px");


                        arcs.append("text")
                            .attr("id", id+"text")
                            .attr("x", obj.originp[0])
                            .attr("y", obj.originp[1])
                            .text("-" + counts_migration[obj.origin.country].toString())
                            .attr("stroke", "#ecf0f1")
                            .attr("opacity","0.8")
                            .attr("fill", "#ecf0f1")
                            .attr("stroke-width", "1px");
                    }
                }
            });

        }

        // function to get the current value of the slider
        function getCurrentSliderValue() {
            var slider_value = slider.value() ? slider.value() : 0;
        }


        function getYdoamin(country_json) {
            var syria_max = 0,
                af_max = 0,
                ir_max = 0,
                syria_min = 0,
                af_min = 0,
                ir_min = 0;
            syria_max = d3.max(country_json, function(d) {
                return d.Syria;
            });
            af_max = d3.max(country_json, function(d) {
                return d.Afghanistan;
            });
            ir_max = d3.max(country_json, function(d) {
                return d.Iraq;
            });

            syria_min = d3.min(country_json, function(d) {
                return d.Syria;
            });

            af_min = d3.min(country_json, function(d) {
                return d.Afghanistan;
            });
            ir_min = d3.min(country_json, function(d) {
                return d.Iraq;
            });

            return [Math.min(syria_min, af_min, ir_min), Math.max(syria_max, af_max, ir_max)];
        }

        // this function renders the line graph on popup.
        // The line graph contains information about the trends that the different countries follow over the years.
        function render_popup(data_country_flow, country_name) {
            obj_temp = {};
            var country_json = [];

            var parse_date = d3.time.format("%Y");

            for (key in data_country_flow) {
                if (data_country_flow[key].Syria == undefined) {
                    data_country_flow[key].Syria = 0;
                }
                if (data_country_flow[key].Afghanistan == undefined) {
                    data_country_flow[key].Afghanistan = 0;
                }
                if (data_country_flow[key].Iraq == undefined) {
                    data_country_flow[key].Iraq = 0;
                }

                obj_temp = {
                    "date": parse_date.parse(key),
                    "Syria": data_country_flow[key].Syria,
                    "Afghanistan": data_country_flow[key].Afghanistan,
                    "Iraq": data_country_flow[key].Iraq
                };
                country_json.push(obj_temp);
                obj_temp = {};
            }

            var svg_popup_width = 300;
            var svg_popup_height = 300;
            //draw a line chart on popup
            svg_popup = d3.select("#info")
                .append("svg").attr("class","svg_2")
                .attr("width", svg_popup_width)
                .attr("height", svg_popup_height);


            var padding_popup = 40;

            var xScale_popup = d3.time.scale().domain(d3.extent(country_json, function(d) {
                return (new Date(d.date));
            })).range([padding_popup, svg_popup_width - padding_popup]);

            var yScale_popup = d3.scale.linear().domain(getYdoamin(country_json)).range([svg_popup_height - padding_popup, padding_popup]);

            var xAxis_popup = d3.svg.axis().scale(xScale_popup).orient("bottom");
            var yAxis_popup = d3.svg.axis().scale(yScale_popup).orient("left").tickFormat(d3.format("s"));

            svg_popup.append("g").attr("transform", "translate(0," + (svg_popup_height - padding_popup) + ")").attr("class", "axis-popup")
                .call(xAxis_popup);
            svg_popup.append("g").attr("transform", "translate(" + padding_popup + ",0)").attr("class", "axis-popup")
                .call(yAxis_popup);

            var syriaLine = d3.svg.line()
                .x(function(d) {
                    return xScale_popup(new Date(d.date));
                })
                .y(function(d) {
                    console.log(yScale_popup(d.Syria));
                    return yScale_popup(d.Syria);
                });

            var afghanLine = d3.svg.line()
                .x(function(d) {
                    return xScale_popup(new Date(d.date));
                })
                .y(function(d) {
                    return yScale_popup(d.Afghanistan);
                });

            var iraqLine = d3.svg.line()
                .x(function(d) {
                    return xScale_popup(new Date(d.date));
                })
                .y(function(d) {
                    return yScale_popup(d.Iraq);
                });

            //add title to the graph

            svg_popup.append("text")
                .attr("x", svg_popup_width / 2 - padding_popup / 2)
                .attr("y", 20)
                .text(country_name)
                .attr("fill", "#ecf0f1")
                .attr("opacity","0.8")
                .attr("stroke", "#ecf0f1")
                .attr("class", "popupLabel");


            //add labels to the graph

            //x axis label

            svg_popup.append("text")
                .attr("x", svg_popup_width / 2)
                .attr("y", svg_popup_height - 10)
                .text("Year")
                .attr("fill", "#ecf0f1")
                .attr("stroke", "#ecf0f1")
                .attr("opacity","0.8")
                .attr("class", "popupLabel");

            svg_popup.append("text")
                .attr("y", 2)
                .attr("x", -65)
                .attr("dy", "0.8em")
                .attr("text-anchor", "end")
                .text("Number of Asylum Seekers")
                .attr("fill", "#ecf0f1")
                .attr("transform", "rotate(-90)")
                .attr("stroke", "#ecf0f1")
                .attr("opacity","0.8")
                .attr("class", "popupLabel");


            svg_popup.append("path").
            attr("d", syriaLine(country_json))
                .attr("class", "outline-syria");

            svg_popup.append("path").
            attr("d", afghanLine(country_json))
                .attr("class", "outline-afghan");

            svg_popup.append("path").
            attr("d", iraqLine(country_json))
                .attr("class", "outline-iraq");

        }

        // function to keep track of the slider and update the entire view accordingly
        
        function animation_update() // no ';' here
        {
            var curr_month = 0,
                curr_year = 2010,
                flag = false;

            var elem = document.getElementById("play_pause");
            if (elem.value == "PLAY") {
                elem.value = "RESET";
                interval = setInterval(function() {
                    value = step;
                    d3.select('#date #month').html(function(d, i) {
                        if (value.toString().split('.').length == 1) {
                            curr_month = 0;
                            curr_year = Math.floor(value);
                            return months[0] + " " + Math.floor(value);
                        }
                        var first_string = Math.ceil(parseFloat('.' + value.toString().split('.')[1]) * 12);
                        if (first_string == 12) {
                            first_string = 0;
                            value = Math.ceil(value);
                            curr_year = value;
                        } else {
                            curr_year = Math.floor(value);
                        }
                        curr_month = first_string;
                        return months[first_string] + " " + Math.floor(value);
                    });
                    if (curr_month == 0 && curr_year == 2010) {
                        counts_migration = {};
                        arcs.selectAll("text").remove();
                    }
                    step = step + 1 / 12;
                    if (step >= 2016) {
                        flag = true;
                        step = 2016;
                    }
                    slider.value(step);
                    value = step;

                    if (!flag) {
                        animate_people(links, months[curr_month] + "-" + curr_year);
                        //draw_barchart(months[curr_month] + "-" + curr_year);
                    }
                }, 350);


            } else {
                flag = false;
                step = 2010;
                d3.select("#arcs").selectAll("circle").transition().duration(0);
                arcs.selectAll("circle").remove();
                arcs.selectAll("text").remove();
                elem.value = "PLAY";
                slider.value(2010);

                clearInterval(interval);
            }
        }
        // line chart to represent the number of asylum seekers from Syria, Afghanistan and Iraq over the years
        
        var width_2_1_3 = 1200,
            height_2_1_3 = 150;

        var probe, hoverData = null;

        // animated line padding defined
        var padding_line = 20;

        var width_2_line = width_2_1_3;
        var height_2_line = height_2_1_3;

        var svg_2_2 = d3.select("#line_chart").append("svg").attr("class","svg_2")
            .attr("width", width_2_1_3)
            .attr("height", height_2_1_3);

        var formatDate_2_line = d3.time.format("%b-%Y");
        
        var bisectDate = d3.bisector(function(d) {
            return d.date;
        }).left;

        probe = d3.select("#line_chart").append("div")
            .attr("id", "probe_line");

        var x_2_line = d3.time.scale()
            .range([padding_line, width_2_line+padding_line + 15]);

        var y_2_line = d3.scale.linear()
            .domain([10, 70000])
            .range([height_2_line - padding_line, padding_line]);

        var xAxis_2_line = d3.svg.axis()
            .scale(x_2_line)
            .orient("bottom");

        var yAxis_2_line = d3.svg.axis()
            .scale(y_2_line)
            .orient("right")
            .ticks(4)
            .tickFormat(d3.format("s"));

        var line_2_af = d3.svg.line()
            .x(function(d) {

                return x_2_line(d.date);
            })
            .y(function(d) {
                return y_2_line(d.total_migrants_af);
            });

        var line_2_ir = d3.svg.line()
            .x(function(d) {
                return x_2_line(d.date);
            })
            .y(function(d) {
                return y_2_line(d.total_migrants_ir);
            });

        var line_2_sy = d3.svg.line()
            .x(function(d) {
                return x_2_line(d.date);
            })
            .y(function(d) {
                return y_2_line(d.total_migrants_sy);
            });

        d3.json("Data/total_migrants_by_month.json", function(error, data_2_line) {
            if (error) throw error;

            data_2_line.forEach(function(d) {
                d.date = formatDate_2_line.parse(d.date);
                d.total_migrants_af = +d.total_migrants_af;

                d.total_migrants_ir = +d.total_migrants_ir;

                d.total_migrants_sy = +d.total_migrants_sy;

            });

            data_2_line.sort(function(a, b) {
                return a.date - b.date;
            });

            x_2_line.domain(d3.extent(data_2_line, function(d) {
                return d.date;
            }));


            

            d3.select("#play_pause").on("click", function() {

                if (d3.select("#play_pause")[0][0].getAttribute("value") == "RESET") {

                svg_2_2.append("g")
                .attr("class", "line-graph_1-x")
                .attr("transform", "translate(0," + (height_2_line - padding_line) + ")")
                .call(xAxis_2_line);

                svg_2_2.append("g")
                .attr("class", "line-graph_1-y")
                .attr("transform", "translate(" + (width_2_line + +padding_line + 15) + ",0)")
                .call(yAxis_2_line);

                    var path_af = svg_2_2.append("path")
                        .datum(data_2_line)
                        .attr("d", line_2_af);

                    var totalLength_af = path_af.node().getTotalLength();


                    path_af
                        .attr("id", "afghan_line")
                        .attr("stroke-dasharray", totalLength_af + " " + totalLength_af)
                        .attr("stroke-dashoffset", totalLength_af)
                        .transition() // Call Transition Method
                        .duration(27000) // Set Duration timing (ms)
                        .ease("linear") // Set Easing option
                        .attr("stroke-dashoffset", 0)
                        .style("stroke-width", "2.5px")
                        .attr("stroke",afghan_color)
                        .attr("fill","none"); // Set final value of dash-offset for transition

                    var path_sy = svg_2_2.append("path")
                        .datum(data_2_line)
                        .style("stroke", syria_color)
                        .style("fill", "none")
                        .style("stroke-width", "2.5px")
                        .attr("d", line_2_sy);

                    var totalLength_sy = path_sy.node().getTotalLength();

                    path_sy
                        .attr("id", "syria_line")
                        .attr("stroke-dasharray", totalLength_sy + " " + totalLength_sy)
                        .attr("stroke-dashoffset", totalLength_sy)
                        .transition() // Call Transition Method
                        .duration(27000) // Set Duration timing (ms)
                        .ease("linear") // Set Easing option
                        .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition


                    var path_ir = svg_2_2.append("path")
                        .datum(data_2_line)
                        .style("stroke", iraq_color)
                        .style("fill", "none")
                        .style("stroke-width", "2.5px")
                        .attr("d", line_2_ir);
                    var totalLength_ir = path_ir.node().getTotalLength();

                    path_ir
                        .attr("id", "iraq_line")
                        .attr("stroke-dasharray", totalLength_ir + " " + totalLength_ir)
                        .attr("stroke-dashoffset", totalLength_ir)
                        .transition() // Call Transition Method
                        .duration(27000) // Set Duration timing (ms)
                        .ease("linear") // Set Easing option
                        .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition



                    svg_2_2.selectAll("path")
                        .on("mousemove", function(d) {
                            var lineName;
                            hoverData = d;
                            if (d==0) {return;}
                            selected_line = d3.select(this);
                            setTextContent(d);
                            selected_line
                                .style("stroke-width", "5px");
                            probe
                                .style({
                                    "display": "block",
                                    "top": (d3.event.pageY - 80) + "px",
                                    "left": (d3.event.pageX + 10) + "px"
                                })
                        })
                        .on("mouseout", function(d) {
                            svg_2_2.selectAll("path").style("stroke-width", "1.5px");
                            hoverData = null;
                            probe.style("display", "none");
                        })
                } else {
                    svg_2_2.selectAll("path").remove();
                     svg_2_2.selectAll("line").remove();
                     svg_2_2.selectAll("text").remove();
                    arcs.selectAll("text").remove();


                }

                function setTextContent(d) {
                    var x0_2 = x_2_line.invert(d3.mouse(selected_line.node())[0]),
                        i = bisectDate(d, x0_2, 1),
                        d0 = d[i - 1],
                        d1 = d[i],
                        d = x0_2 - d0.date > d1.date - x0_2 ? d1 : d0;
                    var value = d;

                    var html;
                    if (selected_line.attr("id") == "afghan_line") {
                        html = "<strong>" + "Afghanistan" + "</strong><br/>" + value.total_migrants_af + "migrants" + "<br/>" +
                            "<span>" + formatDate_2_line(value.date) + "</span>";
                    } else if (selected_line.attr("id") == "syria_line") {
                        html = "<strong>" + "Syria" + "</strong><br/>" + value.total_migrants_sy + "migrants" + "<br/>" +
                            "<span>" + formatDate_2_line(value.date) + "</span>";
                    } else {
                        html = "<strong>" + "Iraq" + "</strong><br/>" + value.total_migrants_ir + "migrants" + "<br/>" +
                            "<span>" + formatDate_2_line(value.date) + "</span>";

                    }
                    probe.html(html);
                }
            });

            if (hoverData) {
                setTextContent(hoverData);
            }

        });


    // -- -- -- -- -- part 2 -- --- -- -- -- //
     // draw map of europe
        var width_2 = 1200,
            height_2 = 500;

        var eu = ["Turkey", "Italy", "Luxembourg", "France", "Slovakia", "United Kingdom", "Norway", "Montenegro", "Slovenia", "Germany", "Belgium", "Spain", "Netherlands", "Denmark", "Finland", "Sweden", "Malta", "Switzerland", "Bulgaria", "Liechtenstein", "Austria", "Greece", "Hungary", "Cyprus"];
        var asylum_seekers = ["Afghanistan", "Syria", "Iraq"];

        var useGreatCirles = true;

        d3.loadData = function() {
            var loadedCallback = null;
            var toload = {};
            var data = {};

            var loaded = function(name, d) {
                delete toload[name];
                data[name] = d;
                return notifyIfAll();
            };

            var notifyIfAll = function() {
                if ((loadedCallback != null) && d3.keys(toload).length === 0) {
                    loadedCallback(data);
                }
            };
            var loader = {
                json: function(name, url) {
                    toload[name] = url;
                    d3.json(url, function(d) {
                        return loaded(name, d);
                    });
                    return loader;
                },
                csv: function(name, url) {
                    toload[name] = url;
                    d3.csv(url, function(d) {
                        return loaded(name, d);
                    });
                    return loader;
                },
                onload: function(callback) {
                    loadedCallback = callback;
                    notifyIfAll();
                }
            };
            return loader;
        };

        var projection_2 = d3.geo.equirectangular()
            .center([10, 55])
            .rotate([10, -1])
            .scale(800)
            .translate([width_2 / 6, height_2 / 4]);


        var path_2 = d3.geo.path()
            .projection(projection_2);

      
        var svg_2 = d3.select("#map").append("svg").attr("class","svg_2")
            .attr("width", width_2)
            .attr("height", height_2);

        var countries = svg_2.append("g").attr("id", "countries");
        var centroids = svg_2.append("g").attr("id", "centroids");
        var arcs = svg_2.append("g").attr("id", "arcs");

        //legend for the map

        svg_2.append("circle")
            .attr("cx", 5)
            .attr("cy", 40)
            .attr("r", "2px")
            .attr("fill", syria_color);

        svg_2.append("circle")
            .attr("cx", 5)
            .attr("cy", 55)
            .attr("r", "2px")
            .attr("fill", afghan_color);

        svg_2.append("circle")
            .attr("cx", 5)
            .attr("cy", 70)
            .attr("r", "2px")
            .attr("fill", iraq_color);

        svg_2.append("circle")
            .attr("cx", 5)
            .attr("cy", 85)
            .attr("r", "2px")
            .attr("fill", "#ecf0f1");

        // add text to the circles

        svg_2.append("text")
            .attr("x", 10)
            .attr("y", 45)
            .attr("fill", syria_color)
            .text("Syrian Arab Republic");

        svg_2.append("text")
            .attr("x", 10)
            .attr("y", 60)
            .attr("fill", afghan_color)
            .text("Afghanistan");

        svg_2.append("text")
            .attr("x", 10)
            .attr("y", 75)
            .attr("fill", iraq_color)
            .text("Iraq");

        svg_2.append("text")
            .attr("x", 10)
            .attr("y", 90)
            .attr("fill", "#ecf0f1")
            .attr("font-size","10pt")
            .text("300 people");




        var g_2 = svg_2.append("g").attr("pointer-event", "none");
        var h_2 = svg_2.append("g");

        d3.loadData()
            .json('countries', 'Data/world-countries.json')
            .json('nodes', 'Data/refugee_nodes.json')
            .json('flows', 'Data/data_by_months.json')
            .json('country_flows', 'Data/pop_updata.json')
            .onload(function(data) {

                d3.select("#loading").attr("visibility", "hidden");

                var nodeDataByName = {},

                    result_array = [];
                var year = '2008';
                var maxMagnitude =
                    d3.max(data.flows, function(d) {
                        return parseFloat(d[year])
                    });
                var magnitudeFormat = d3.format(",.0f");

                var arcWidth = d3.scale.linear().domain([1, maxMagnitude]).range([.1, 7]);
                var minColor = '#f0f0f0',
                    maxColor = 'rgb(8, 48, 107)';
                var arcColor = d3.scale.log().domain([1, maxMagnitude]).range([minColor, maxColor]);
                var arcOpacity = d3.scale.log().domain([1, maxMagnitude]).range([0.3, 1]);

                countries.selectAll("path")
                    .data(data.countries.features)
                    .enter().append("path")
                    .attr("d", path_2)
                    .attr("id",function(d){
                        if(d.properties.name == "United Kingdom")
                            return "UnitedKingdom"
                        return d.properties.name;
                    })
                    .on("mouseover", function(d, i) {
                        document.getElementById("info").innerHTML = "";
                        if (eu.indexOf(d.properties.name) >= 0) {
                            for(var i = 0;i < eu.length; i++){
                                if(eu[i] == "United Kingdom"){
                                     d3.select("path#"+"UnitedKingdom").style("fill","black");
                                }
                             d3.select("path#"+eu[i]).style("fill","black");
                            }
                            render_popup(data.country_flows[d.properties.name], d.properties.name);
                            d3.select(this).style('fill', '#a14ef4');
                           // render it in the corner of the graph
                            d3.select("#info")
                            .style("left","73%")
                            .style("top", "1370px")
                            .style("opacity", "1");
                            d3.select("path#Syria").style('fill', syria_color);
                            d3.select("path#Afghanistan").style('fill', afghan_color);
                            d3.select("path#Iraq").style('fill', iraq_color);
                            d3.select("#info").classed("hidden", false);
                            // highlight syria,afghanistan

                            return;

                        } else if (asylum_seekers.indexOf(d.properties.name) >= 0) {
                            if (d.properties.name == "Afghanistan") {
                                d3.select(this).style('fill', "#1b9e77");
                            } else if (d.properties.name == "Iraq") {
                                d3.select(this).style('fill', "#e74c3c");
                            } else {
                                d3.select(this).style('fill', "#3498db");
                            }
                            document.getElementById("info").innerHTML = d.properties.name;
                        } else {
                            d3.select(this).style('fill', 'black');
                            document.getElementById("info").innerHTML = d.properties.name;

                        }
                        //getCurrentSliderValue();

                        var xPosition_2 = parseFloat(d3.event.pageX) + 15;
                        var yPosition_2 = parseFloat(d3.event.pageY) - 15;
                        d3.select("#info")
                            .style("left", xPosition_2 + "px")
                            .style("top", yPosition_2 + "px")
                            .style("opacity", "1");

                        d3.select("#info").classed("hidden", false);

                    })
                    .on("mouseout", function(d, i) {
                        d3.select(this).style('fill', function(d) {
                            if (asylum_seekers.indexOf(d.properties.name) >= 0) {
                                if (d.properties.name == "Afghanistan") {
                                    return "#1b9e77";
                                } else if (d.properties.name == "Iraq") {
                                    return "#e74c3c";
                                }
                                return "#3498db";
                            } else if (eu.indexOf(d.properties.name) >= 0) {
                                return "#2e343e";
                            } else {
                                return "black";
                            }
                        });

                        for(var i = 0;i < eu.length; i++){
                            d3.select("path#"+eu[i]).style("fill","#2e343e");
                        }
                        d3.select("path#UnitedKingdom").style("fill","#2e343e");
                        d3.select("#info").selectAll("svg").remove();
                        d3.select("#info").classed("hidden", true);
                    })
                    .attr("class", function(d, i) {
                        return "country_" + d.id;
                    })
                    .style("fill", function(d) {
                        if (asylum_seekers.indexOf(d.properties.name) >= 0) {
                            if (d.properties.name == "Afghanistan") {
                                return "#1b9e77";
                            } else if (d.properties.name == "Iraq") {
                                return "#e74c3c";
                            }
                            return "#3498db";
                        } else if (eu.indexOf(d.properties.name) >= 0) {
                            return "#2e343e";
                        } else {
                            return "black";
                        }
                    })
                    .style("stroke", function(d) {
                        return "#6fdae5";
                    })
                    .style("stroke-width", function(d) {
                        if (eu.indexOf(d.properties.name) >= 0) {
                            return "0.4px";
                        }
                        return "0.2px"
                    })
                    .style("pointer-events", "all")
                    .attr('cursor', 'pointer');

                function nodeCoords(node) {
                    var lon = parseFloat(node.longitude),
                        lat = parseFloat(node.latitude);
                    if (isNaN(lon) || isNaN(lat)) return null;
                    return [lon, lat];
                }

                // load the refugee data

                data.nodes.forEach(function(node) {
                    node.coords = nodeCoords(node);
                    node.projection = node.coords ? projection_2(node.coords) : undefined;
                    nodeDataByName[node.country] = node;
                });

                data.flows.forEach(function(flow) {
                    var o = nodeDataByName[flow.Origin],
                        co = o.coords,
                        po = o.projection;
                    var d = nodeDataByName[flow.Destination],
                        cd = d.coords,
                        pd = d.projection;
                    var magnitude = parseInt(flow.Num_Migrants);
                    var year_month = months[flow.Month - 1] + "-" + flow.Year;
                    if (co && cd && !isNaN(magnitude)) {
                        var temp = links[year_month];
                        if (temp == null) {
                            temp = [];
                        }
                        temp.push({
                            magnitude: magnitude,
                            origin: o,
                            dest: d,
                            originp: po,
                            destp: pd
                        });
                        links[year_month] = temp;

                    }

                });


            });



