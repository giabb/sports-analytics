function RadarChart(id, data, options, flag = true) {

    var alpha = -1;
    var tip = d3.select(".radarChart").append("div").attr("class", "tip").style("opacity", 0);
    if (data == null || data.length == 0) {
        $(".radarChart").css({
            "display": "none"
        });

    } else {
        $(".radarChart").css({
            "display": "block"
        });
        var output = data.map(function(obj) {
            return Object.keys(obj).map(function(key) {
                return obj[key];
            });
        });
        keys = ['sofifa_id', //0
            'short_name', //1
            'age', //2
            'nationality', //3
            'overall20', //4
            'player_positions', //5
            'pace_diving', //6
            'shooting_handling', //7
            'passing_kicking', //8
            'dribbling_reflexes', //9 
            'defending_speed', //10
            'physic_positioning', //11
            'overall15', //12
            'overall16', //13
            'overall17', //14
            'overall18', //15
            'overall19' //16
        ];

        out = [];
        out2 = [];
        for (i = 0; i < data.length; i++) {
            out.push([{
                    axis: "Pace (GK)Diving",
                    value: output[i][6]
                },
                {
                    axis: "Shooting (GK)Handling",
                    value: output[i][7]
                },
                {
                    axis: "Passing (GK)Kicking",
                    value: output[i][8]
                },
                {
                    axis: "Dribbling (GK)Reflexes",
                    value: output[i][9]
                },
                {
                    axis: "Defending (GK)Speed",
                    value: output[i][10]
                },
                {
                    axis: "Physic (GK)Positioning",
                    value: output[i][11]
                }
            ])

        }

        data = out;

        var cfg = {
            w: 400, //Width of the circle
            h: 400, //Height of the circle
            margin: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            }, //The margins of the SVG
            levels: 3, //How many levels or inner circles should there be drawn
            maxValue: 0, //What is the value that the biggest circle will represent
            labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
            wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
            opacityArea: 0.35, //The opacity of the area of the blob
            dotRadius: 4, //The size of the colored circles of each blog
            opacityCircles: 0.1, //The opacity of the circles of each blob
            strokeWidth: 2, //The width of the stroke around each blob
            roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
            color: d3.scaleOrdinal(d3.schemeCategory10) //Color function
        };

        //Put all of the options into a variable called cfg
        if ('undefined' !== typeof options) {
            for (var i in options) {
                if ('undefined' !== typeof options[i]) {
                    cfg[i] = options[i];
                }
            }
        }

        //If the supplied maxValue is smaller than the actual one, replace by the max in the data
        var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i) {
            return d3.max(i.map(function(o) {
                return o.value;
            }))
        }));

        var allAxis = (data[0].map(function(i, j) {
            return i.axis
        }));

        divRadiusWidth = 2;
        divRadiusHeight = 2;
        circleTransX = 2;
        circleTransY = 3.4;

        total = allAxis.length; //The number of different axes

        // to change the size of the circle 
        radius = Math.min(cfg.w / divRadiusWidth, cfg.h / divRadiusHeight), //Radius of the outermost circle
            Format = d3.format('%'), //Percentage formatting
            angleSlice = Math.PI * 2 / total; //The width in radians of each "slice"

        //Scale for the radius
        var rScale = d3.scaleLinear()
            .range([0, radius])
            .domain([0, maxValue]);

        ///////////////////////////// CREATE SVG /////////////////////////////////////

        //Remove whatever chart with the same id/class was present before
        d3.select(id).select("svg").remove();

        //Initiate the radar chart SVG
        var svg = d3.select(id).append("svg")
            .attr("width", cfg.w)
            .attr("height", cfg.h * 2)
            .attr("class", "radar" + id);
        //Append a g element		
        var g = svg.append("g")
            .attr("transform", "translate(" + (cfg.w / circleTransX) + "," + (cfg.h / circleTransY + cfg.margin.top) + ")");

        //Filter for the outside glow
        var filter = g.append('defs').append('filter').attr('id', 'glow'),
            feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
            feMerge = filter.append('feMerge'),
            feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
            feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        ///////////////////////////// DRAW CIRCULAR GRID /////////////////////////////////////

        //Wrapper for the grid & axes
        var axisGrid = g.append("g").attr("class", "axisWrapper");

        //Draw the background circles
        axisGrid.selectAll(".levels")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .enter()
            .append("circle")
            .attr("class", "gridCircle")
            .attr("r", function(d, i) {
                return (radius / cfg.levels * d);
            })
            .style("fill", "#CDCDCD")
            .style("stroke", "#CDCDCD")
            .style("fill-opacity", cfg.opacityCircles)
            .style("filter", "url(#glow)");

        ///////////////////////////// DRAW AXES /////////////////////////////////////

        //Create the straight lines radiating outward from the center
        var axis = axisGrid.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");
        //Append the lines
        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", function(d, i) {
                return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
            })
            .attr("y2", function(d, i) {
                return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
            })
            .attr("class", "line")
            .style("stroke", "white")
            .style("stroke-width", "2px");

        //Append the labels at each axis
        axis.append("text")
            .attr("class", "legend")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", function(d, i) {
                return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
            })
            .attr("y", function(d, i) {
                return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
            })
            .text(function(d) {
                return d
            })
            .call(wrap, cfg.wrapWidth);

        ///////////////////////////// DRAW BLOBS /////////////////////////////////////

        //The radial line function
        var radarLine = d3.radialLine()
            .curve(d3.curveCardinalClosed)
            .radius(function(d) {
                return rScale(d.value);
            })
            .angle(function(d, i) {
                return i * angleSlice;
            });

        if (cfg.roundStrokes) {
            radarLine.curve(d3.curveCardinalClosed);
        }

        //Create a wrapper for the blobs	
        var blobWrapper = g.selectAll(".radarWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarWrapper");

        //Append the backgrounds	
        blobWrapper
            .append("path")
            .attr("class", "radarArea")
            .attr("d", function(d, i) {
                return radarLine(d);
            })
            .style("fill", function(d, i) {
                if (flag == false) {
                    return "grey";
                } else {
                    return cfg.color(i);
                }

            })
            .style("fill-opacity", cfg.opacityArea)
            .style("visibility", function(d) {
                if (flag == false) {
                    return "hidden";
                } else {
                    return "visible"
                }
            })
            .on('mouseover', function(d, i) {
                tip.html(output[i][1])
                    .style("opacity", 1)
                    .attr('style', 'left:' + eval($('#scatterArea').width() + 10) + 'px; top:' + ($('#map-holder').height()) + 'px')

                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", 0.1);
                //Bring back the hovered over blob
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", 0.7);

            })
            .on('mouseout', function() {
                //Bring back all blobs
                tip.style("opacity", 0)
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", cfg.opacityArea);

            })

        //Create the outlines	
        blobWrapper.append("path")
            .attr("class", "radarStroke")
            .attr("d", function(d, i) {
                return radarLine(d);
            })
            .style("stroke-width", cfg.strokeWidth + "px")
            .style("stroke", function(d, i) {
                if (flag == false) {
                    return "grey"
                } else {
                    return cfg.color(i);
                }
            })
            .style("fill", "none")
            .style("stroke-opacity", function(d) {
                if (flag == false) {
                    return 0.5;
                } else {
                    return 1;
                }
            })
            .style("visibility", function(d) {
                if (flag == false) {
                    return "hidden";
                } else {
                    return "visible"
                }
            })
            .style("filter", "url(#glow)");

        //Append the circles
        blobWrapper.selectAll(".radarCircle")
            .data(function(d, i) {
                return d;
            })
            .enter().append("circle")
            .attr("class", "radarCircle")
            .attr("r", cfg.dotRadius)
            .attr("cx", function(d, i) {
                return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
            })
            .attr("cy", function(d, i) {
                return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
            })
            .style("fill", function(d, i, j) {
                if (flag == false) {
                    return "grey";
                } else {
                    return cfg.color(j);
                }

            })
            .style("opacity", function(d) {

                if (flag == false) {
                    return 0.5;
                } else {
                    return 1;
                }
            })
            .style("visibility", function(d) {
                if (flag == false) {
                    return "hidden";
                } else {
                    return "visible"
                }
            })
            .style("fill-opacity", function(d) {
                if (flag == false) {
                    return 0.5;
                } else {
                    return 0.8;
                }
            });

        ///////////////////////////// TOOLTIP MANAGE /////////////////////////////////////


        //Wrapper for the invisible circles on top
        var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarCircleWrapper");

        //Append a set of invisible circles on top for the mouseover pop-up
        blobCircleWrapper.selectAll(".radarInvisibleCircle")
            .data(function(d, i) {
                return d;
            })
            .enter().append("circle")
            .attr("class", "radarInvisibleCircle")
            .attr("r", cfg.dotRadius * 1.2)
            .attr("cx", function(d, i) {
                return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
            })
            .attr("cy", function(d, i) {
                return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
            })

        .style("fill", function(d, i) {
                if (flag == false) {
                    return "grey";
                } else {
                    alpha++;
                    var vall = Math.floor(alpha / 5);
                    return cfg.color(vall);
                }

            })
            .style("visibility", function(d) {
                if (flag == false) {
                    return "hidden";
                } else {
                    return "visible"
                }
            })
            .style("opacity", function(d, i) {
                if (flag == false) {
                    return 0.1;
                } else {
                    return 1;
                }

            })

        .style("pointer-events", "all")
            .on("mouseover", function(d, i) {
                newX = parseFloat(d3.select(this).attr('cx')) - 10;
                newY = parseFloat(d3.select(this).attr('cy')) - 10;
                tooltip
                    .attr('x', newX)
                    .attr('y', newY)
                    .text(d.value)
                    .transition().duration(200)
                    .style('opacity', 1);
            })
            .on("mouseout", function() {
                tooltip.transition().duration(200)
                    .style("opacity", 0);
            });

        //Set up the small tooltip for when you hover over a circle
        var tooltip = g.append("text")
            .attr("class", "tooltip")
            .style("opacity", 0);

        ///////////////////////////// HELPER FUNCTION /////////////////////////////////////

        //Taken from http://bl.ocks.org/mbostock/7555321
        //Wraps SVG text	
        function wrap(text, width) {
            text.each(function() {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.4,
                    y = parseFloat(text.attr("y")) - 10,
                    x = parseFloat(text.attr("x")) + 10,
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null)
                    .append("tspan")
                    .attr("x", x)
                    .attr("y", y).attr("dy", dy + "em")
                    .style("font-size", "1em")
                    .style("font-weight", "bold");

                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan")
                            .attr("x", x).attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .style("font-size", "1em")
                            .style("font-weight", "bold")
                            .text(word);
                    }
                }
            });
        }
    }
}