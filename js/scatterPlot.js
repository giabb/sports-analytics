///////////////////////////// SCATTER PLOT OPTIONS /////////////////////////////////////

margin_scatter = {
        top: 20,
        right: 20,
        bottom: 120,
        left: 40
    },
    width_scatter = $('#scatterArea').width() - margin_scatter.left - margin_scatter.right,
    height_scatter = $('#scatterArea').height() - margin_scatter.top - margin_scatter.bottom,

    x_scatter = d3.scaleLinear().range([0, width_scatter]),
    y_scatter = d3.scaleLinear().range([height_scatter, 0]),

    xAxis_scatter = d3.axisBottom(x_scatter),
    yAxis_scatter = d3.axisLeft(y_scatter);

svg = d3.select("#scatterArea").append("svg")
    .attr("width", width_scatter + margin_scatter.left + margin_scatter.right)
    .attr("height", height_scatter + margin_scatter.top + margin_scatter.bottom)
    .attr("transform", "translate(" + margin_scatter.right + "," + 0 + ")");

focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin_scatter.left + "," + margin_scatter.top + ")");

xAxis = focus.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height_scatter + ")")
    .call(xAxis_scatter);

yAxis = focus.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis_scatter);

focus.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - eval(margin_scatter.left))
    .attr("x", 0 - eval(height_scatter / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Y1");

svg.append("text")
    .attr("transform",
        //"translate(" + ((width_scatter + margin_scatter.right + margin_scatter.left) / 2) + " ," +
        //(height_scatter + margin_scatter.top + margin_scatter.bottom) + ")")
        "translate(" + eval(width_scatter / 2 + margin_scatter.left) + "," + eval(height_scatter + margin_scatter.bottom / 3 + margin_scatter.top) + ")")
    .style("text-anchor", "middle")
    .text("Y2");

tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip hidden");

tooltip_point = d3.select("body")
    .append("div")
    .attr("class", "tooltip_point hidden");

///////////////////////////// SCATTER PLOT DRAWING /////////////////////////////////////

function drawScatter(data) {

    pValue = function(d) {
        return d.player_positions;
    }

    color = d3.scaleOrdinal(d3.schemeCategory10);

    //Update the scale
    var maxHeight = d3.max(data, function(d) {
        return Math.abs(d.Y2)
    });
    var minHeight = d3.min(data, function(d) {
        return Math.abs(d.Y2)
    })
    y_scatter.domain([-maxHeight - 0.5, +maxHeight + 0.5]); //show negative
    var maxWidth = d3.max(data, function(d) {
        return Math.abs(d.Y1)
    });
    var minWidth = d3.min(data, function(d) {
        return Math.abs(d.Y1)
    })
    x_scatter.domain([-maxWidth - 0.5, +maxWidth + 4]); //show negative

    // Update axes
    xAxis_scatter.scale(x_scatter);
    xAxis.transition().call(xAxis_scatter);
    yAxis_scatter.scale(y_scatter);
    yAxis.transition().call(yAxis_scatter);

    focus.selectAll("circle").remove();
    focus.selectAll(".legend").remove();

    //add dots
    dots = focus.selectAll("circle").data(data);
    dots.enter().append("circle")
        .attr("r", 3)
        .attr("class", "knncircle")
        .style("fill", function(d) {
            return color(pValue(d));
        })
        .attr("cx", function(d) {
            return x_scatter(d.Y1);
        })
        .attr("cy", function(d) {
            return y_scatter(d.Y2)
        })
        .on("mousemove", showLegend)
        .on("mouseout", hideLegend)
        .on("click", Knn)

    // append legend
    var legend = focus.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 17 + ")";
        });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width_scatter - 5)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color);

    // draw legend text
    legend.append("text")
        .attr("x", width_scatter - 15)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "0.8em")
        .text(function(d) {
            return d;
        })
}

//show legend on the scatterplot with player name(on mouseover)
function showLegend(d) {
    if (tooltip_point.classed("hidden")) {
        tooltip.classed('hidden', false)
            .html(d.short_name)
            .style('opacity', 1)
            .attr('style', 'left:' + eval($('#scatterArea').width() / 2 + 10) + 'px; bottom:' + eval($('.scatter-wrap').height() / 3 * 2) + 'px')
    };

};

//hide legend on the scatterplot with player name(on mouseout)
function hideLegend(d) {
    tooltip.classed('hidden', true);
}

///////////////////////////// K NEAREST NEIGHBOURS /////////////////////////////////////

function Knn(d) {
    dataTable = [];
    dataT = [];
    var k = 6,

        mouse = {
            x: d3.mouse(this)[0],
            y: d3.mouse(this)[1],
            c: d.Y3,
            di: d.Y4,
            e: d.Y5,
            f: d.Y6
        };

    knn = find_knn(mouse, k);

    //remove old lines 
    focus.selectAll(".knnline").remove()
        //draw lines to nearest neighbours
    for (i = 0; i < knn.length; i++) {
        p = knn[i];
        dataT.push(p.name);

        focus.append("line")
            .attr('class', 'knnline')
            .attr("x1", p.x)
            .attr("y1", p.y)
            .attr("x2", p.x)
            .attr("y2", p.y)
            .transition()
            .duration(1000)
            .attr("x2", mouse.x)
            .attr("y2", mouse.y)
    }
    dataT1 = filteredData.filter(function(d) {
        return (d.sofifa_id == dataT[0] || d.sofifa_id == dataT[1] ||
            d.sofifa_id == dataT[2] || d.sofifa_id == dataT[3] ||
            d.sofifa_id == dataT[4] || d.sofifa_id == dataT[5]);

    })

    drawTable(dataT1);
    RadarChart(".radarChart", dataT1, radarChartOptions);
    lineChart(dataT1);
}

function find_knn(mouse, k) { // return array of the k-nearest-neiboorghs
    var array_points = [];
    filteredData.forEach(
        function(d) {
            array_points.push({
                x: x_scatter(d.Y1),
                y: y_scatter(d.Y2),
                name: d.sofifa_id,
                distance: metrics(d, mouse)
            })
        }
    )

    array_points = array_points.sort(function(a, b) {
        return a.distance - b.distance
    });
    return array_points.slice(0, k)
}

metrics = function(d, mouse) {
    var a = Math.pow(x_scatter(d.Y1) - mouse.x, 2);
    var b = Math.pow(y_scatter(d.Y2) - mouse.y, 2);
    var c = Math.pow(d.Y3 - mouse.c, 2);
    var di = Math.pow(d.Y4 - mouse.di, 2);
    var e = Math.pow(d.Y5 - mouse.e, 2);
    var f = Math.pow(d.Y6 - mouse.f, 2);
    return (a + b + c + di + e + f)
}