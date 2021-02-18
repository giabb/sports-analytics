///////////////////////////// OVERALLS CHART OPTIONS /////////////////////////////////////

width = $('#chart').width() //432
height = $('#chart').height() //334

marginX = width / 8;
marginY = height / 9;
duration = 250;

lineOpacity = "0.25";
lineOpacityHover = "0.85";
otherLinesOpacityHover = "0.1";
lineStroke = "1.5px";
lineStrokeHover = "2.5px";

circleOpacity = '0.85';
circleOpacityOnLineHover = "0.25"
circleRadius = 3;
circleRadiusHover = 6;

// Scale
xScale = d3.scaleTime().range([0, width - marginX * 2]);

yScale = d3.scaleLinear().range([height - 3 * marginY, 0]);

yScale.domain([45, 100])

linexAxis = d3.axisBottom(xScale).ticks(5);
lineyAxis = d3.axisLeft(yScale).ticks(10);

// Add svg1 

svg1 = d3.select("#chart").append("svg")
    .attr("width", (width) + "px")
    .attr("height", (height) + "px")
    //.attr("transform", "translate(0,0)")
    .append('g')
    .attr("transform", `translate(${marginX}, ${marginY/5})`);

// Add Axis into svg1 
linexAxisl = svg1.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${eval(height - 3*marginY)})`)
    .call(linexAxis);

lineyAxis1 = svg1.append("g")
    .attr("class", "y axis")
    .call(lineyAxis)
    .append('text')
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")

svg1.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - marginY)
    .attr("x", 0 - (height / 3))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Overall");

svg1.append("text")
    .attr("y", height - marginY * 2.5)
    .attr("x", 176)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Year")

///////////////////////////// ADDING DATA TO CHART /////////////////////////////////////

function lineChart(dataLine) {

    if (dataLine == null) {
        $(".line-group").css({
            "display": "none"
        });
        $(".lineCircle").css({
            "display": "none"
        });
    } else {
        $("#chart").css({
            "display": "block"
        });

        dataTemp = [];
        //Helper array having 6 positions, one per each year
        lineLabel = [
            [],
            [],
            [],
            [],
            [],
            []
        ];

        //Loop through each player in the filtered data
        dataLine.forEach(function(player) {
            //Extract all data related to that player from the whole data set
            brokenLineData = dataLine.filter(function(d) {
                return (player.sofifa_id == d.sofifa_id)
            });
            //Loop through those related data to place each one in its position in values array
            //If a player doesn't have a registered overall for that year, assign the minimum value 
            brokenLineData.forEach(function(over) {

                if (!(over.overall15 == null)) {
                    lineLabel[0] = {
                        date: 2015,
                        oa: over.overall15
                    }
                } else {
                    lineLabel[0] = {
                        date: 2015,
                        oa: 45
                    }
                }
                if (!(over.overall16 == null)) {
                    lineLabel[1] = {
                        date: 2016,
                        oa: over.overall16
                    }
                } else {
                    lineLabel[1] = {
                        date: 2016,
                        oa: 45
                    }
                }
                if (!(over.overall17 == null)) {
                    lineLabel[2] = {
                        date: 2017,
                        oa: over.overall17
                    }
                } else {
                    lineLabel[2] = {
                        date: 2017,
                        oa: 45
                    }
                }
                if (!(over.overall18 == null)) {
                    lineLabel[3] = {
                        date: 2018,
                        oa: over.overall18
                    }
                } else {
                    lineLabel[3] = {
                        date: 2018,
                        oa: 45
                    }
                }
                if (!(over.overall19 == null)) {
                    lineLabel[4] = {
                        date: 2019,
                        oa: over.overall19
                    }
                } else {
                    lineLabel[4] = {
                        date: 2019,
                        oa: 45
                    }
                }
                if (!(over.overall20 == null)) {
                    lineLabel[5] = {
                        date: 2020,
                        oa: over.overall20
                    }
                } else {
                    lineLabel[5] = {
                        date: 2020,
                        oa: 45
                    }
                }

            });

            dataTemp.push({
                    name: player.short_name,
                    values: lineLabel
                })
                //Flush the array to be used again for the next element of the filtered data
            lineLabel = [
                [],
                [],
                [],
                [],
                [],
                []
            ];

        });

        data = dataTemp;

        colorLine = d3.scaleOrdinal(d3.schemeCategory10);

        // Format Data 
        var parseDate = d3.timeParse("%Y");
        data.forEach(function(d) {
            d.values.forEach(function(d) {
                d.date = parseDate(d.date);
                d.oa = +d.oa;
            });
        });
        line = d3.line()
            .x(function(d) {
                return xScale(d.date)
            })
            .y(function(d) {
                if (d.oa == 0) {}
                return yScale(d.oa)
            });

        svg1.selectAll(".lines").remove();
        xScale.domain(d3.extent(data[0].values, d => d.date))
        linexAxis.scale(xScale);
        linexAxisl.transition().call(linexAxis);
        lineyAxis.scale(yScale);
        lineyAxis1.transition().call(lineyAxis);

        // Add line into svg1 
        lines = svg1.append('g')
            .attr('class', 'lines');

        lines.selectAll('.line-group')
            .data(data).enter()
            .append('g')
            .attr('class', 'line-group')
            .on("mouseover", function(d, b) {
                svg1.append("text")
                    .attr("class", "title-text")
                    .style("fill", colorLine(b))
                    .text(d.name)
                    .attr("text-anchor", "middle")
                    .attr("x", (width - marginX) / 2)
                    .attr("y", 5);
            })
            .on("mouseout", function(d) {
                svg1.select(".title-text").remove();
            })
            .append('path')
            .attr('class', 'line')
            .attr('d', function(d, i) {
                return line(d.values)
            })
            .style('stroke', (d, b) => colorLine(b))
            .style('opacity', lineOpacity)
            .on("mouseover", function(d) {
                d3.selectAll('.line')
                    .style('opacity', otherLinesOpacityHover);
                d3.selectAll('.circle')
                    .style('opacity', circleOpacityOnLineHover);
                d3.select(this)
                    .style('opacity', lineOpacityHover)
                    .style("stroke-width", lineStrokeHover)
                    .style("cursor", "pointer");
            })
            .on("mouseout", function(d) {
                d3.selectAll(".line")
                    .style('opacity', lineOpacity);
                d3.selectAll('.circle')
                    .style('opacity', circleOpacity);
                d3.select(this)
                    .style("stroke-width", lineStroke)
                    .style("cursor", "none");
            });

        // Add circles in the line
        lines.selectAll("circle-group")
            .data(data).enter()
            .append("g")
            .style("fill", (d, b) => colorLine(b))
            .selectAll("circle")
            .data(d => d.values).enter()
            .append("g")
            .attr("class", "lineCircle")
            .on("mouseover", function(d) {
                d3.select(this)
                    .style("cursor", "pointer")
                    .append("text")
                    .attr("class", "text")
                    .text(`${d.oa}`)
                    .attr("x", d => xScale(d.date) + 5)
                    .attr("y", d => yScale(d.oa) - 10);
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .style("cursor", "none")
                    .transition()
                    .duration(duration)
                    .selectAll(".text").remove();
            })
            .append("circle")
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d.oa))
            .attr("r", circleRadius)
            .style('opacity', circleOpacity)
            .on("mouseover", function(d) {
                d3.select(this)
                    .transition()
                    .duration(duration)
                    .attr("r", circleRadiusHover);
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .transition()
                    .duration(duration)
                    .attr("r", circleRadius);
            });
    }
}