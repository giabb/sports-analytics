////////////////////////////// TABLE DRAWING //////////////////////////////
function drawTable(data) {
    const keys = ['sofifa_id', 'overall20', 'short_name', 'age', 'nationality', 'player_positions', 'pace_diving', 'shooting_handling', 'passing_kicking', 'dribbling_reflexes', 'defending_speed', 'physic_positioning']
    d3.selectAll(".table-remove").remove();
    d3.selectAll(".legend_table").remove();
    $(".html_table").css("display", "none");

    var table = d3.select(".table-wrap")
        .append("table")
        .attr("class", "fixed_header")
        .attr("class", "table-remove")
        .attr("transform", "translate(300px,300px)")

    thead = table.append("thead")
        .attr("class", "thead")
        .on("mouseover", function() {
            tipT.html('OA: Overall | Pos: Position | Other attributes explanation in the starplot')
                .style('opacity', 1)
                .attr('style', 'right:' + eval($('#table').width() + 1) + 'px; top:' + eval($(window).height() - 2 * $('#table').height()) + 'px')
        })
        .on("mouseout", function() {
            tipT.style("opacity", 0)
        })
    tbody = table.append("tbody").attr("class", "tbody")

    var header = thead.append("tr")
        .selectAll("th")
        .data(keys)
        .enter()
        .append("th")
        .attr("class", "td")
        .text(function(d) {
            if (d == "sofifa_id") {
                return "ID";
            }
            if (d == "overall20") {
                return "OA";
            }
            if (d == "short_name") {
                return "Name";
            }
            if (d == "age") {
                return "Age";
            }
            if (d == "nationality") {
                return "Nationality";
            }
            if (d == "player_positions") {
                return "Pos";
            }
            if (d == "pace_diving") {
                return "P/D";
            }
            if (d == "shooting_handling") {
                return "S/H";
            }
            if (d == "passing_kicking") {
                return "P/K";
            }
            if (d == "dribbling_reflexes") {
                return "D/R";
            }
            if (d == "defending_speed") {
                return "D/S";
            }
            if (d == "physic_positioning") {
                return "P/P";
            }
            return d;
        })

    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .style("height", "fit-content")
        .on("mouseover", function(d) {
            d3.select(this)
                .style("background-color", "lightblue");
            tipT.html('<img src=' + d.player_url + '>')
                .style('opacity', 1)
                .attr('style', 'right:' + eval($('#table').width() + 1) + 'px; top:' + eval($(window).height() - 2 * $('#table').height()) + 'px')
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("background-color", "transparent");
            tipT.style("opacity", 0)
        });

    var cells = rows.selectAll("td")
        .data(function(row) {
            return keys.map(function(d, i) {
                return {
                    i: d,
                    value: row[d]
                };
            });
        })
        .enter()
        .append("td")
        .attr("class", "td")
        .html(function(d) {
            return d.value;
        });
}