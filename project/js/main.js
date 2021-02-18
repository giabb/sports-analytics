//Initializing global variables
roleSliderValues = [];
filteredData = [];
ageSliderValues = [17, 41];
overallSliderValues = [72, 94];
var tipT = d3.select(".table-wrap").append("div").attr("class", "tip").style("opacity", 0);
var tipSC = d3.select(".scatter-wrap").append("div").attr("class", "tip").style("opacity", 0);
var countryName;
flagCountry = false;

//////////////////////////////// RADAR CHART OPTIONS/////////////////////////////////////

var margin_radar = {
        top: 80,
        right: 80,
        bottom: 80,
        left: 80
    },
    width_radar = $('.radarChart').width(),
    height_radar = $('.radarChart').height() / 2

var color = d3.scaleOrdinal(d3.schemeCategory10);

var radarChartOptions = {
    w: width_radar,
    h: height_radar,
    margin: margin_radar,
    maxValue: 0.5,
    levels: 5,
    roundStrokes: true,
    color: color
};

////////////////////////////////// DATA FILTERING ///////////////////////////////////////

getRole();
updateData();
drawmap();

$(".roleValue").change(function() {
    getRole();
    updateData();
});

$("#var-select").change(function() {
    updateData();
});

$("#overall-slider").slider({
    range: true,
    min: 72,
    max: 94,
    values: [72, 94],
    step: 1,
    change: function() {
        overallSliderValues = $("#overall-slider").slider("values");
        $("#overallLabel1").text(overallSliderValues[0]);
        $("#overallLabel2").text(overallSliderValues[1]);
        updateData();
    }
});

$("#age-slider").slider({
    range: true,
    min: 17,
    max: 41,
    values: [17, 41],
    step: 1,
    change: function() {
        ageSliderValues = $("#age-slider").slider("values");
        $("#ageLabel1").text(ageSliderValues[0]);
        $("#ageLabel2").text(ageSliderValues[1]);
        updateData();
    }
});

function updateData() {
    focus.selectAll(".knnline").remove()
    d3.json("data/dataVeryFull.json", function(data) {
        filteredData = data.filter(function(d) {
            if (!flagCountry) {
                return (d.age >= ageSliderValues[0] &&
                    d.age <= ageSliderValues[1] &&
                    d.overall20 >= overallSliderValues[0] &&
                    d.overall20 <= overallSliderValues[1] &&
                    roleSliderValues.includes(d.player_positions)
                )
            } else {
                return (d.age >= ageSliderValues[0] &&
                    d.age <= ageSliderValues[1] &&
                    d.overall20 >= overallSliderValues[0] &&
                    d.overall20 <= overallSliderValues[1] &&
                    roleSliderValues.includes(d.player_positions) &&
                    d.nationality == countryName
                )
            }

        })
        if (filteredData.length > 0) {
            maxSlice = $("#var-select").val();
            filteredData = filteredData.slice(0, maxSlice)
            drawTable(filteredData);
            RadarChart(".radarChart", filteredData, radarChartOptions);
            lineChart(filteredData);
            drawScatter(filteredData);
        } else {
            if (!(roleSliderValues.length > 0)) {
                var inputElements = document.getElementsByClassName('roleValue');
                for (var i = 0; inputElements[i]; ++i) {
                    inputElements[i].checked = true;
                }
                getRole();
            } else {
                $("#overall-slider").slider('values', 0, 72);
                $("#overall-slider").slider('values', 1, 94);
                overallSliderValues = $("#overall-slider").slider("values");
                $("#overallLabel1").text(overallSliderValues[0]);
                $("#overallLabel2").text(overallSliderValues[1]);

                $("#age-slider").slider('values', 0, 17);
                $("#age-slider").slider('values', 1, 41);
                ageSliderValues = $("#age-slider").slider("values");
                $("#ageLabel1").text(ageSliderValues[0]);
                $("#ageLabel2").text(ageSliderValues[1]);
            }
            document.getElementById("testbtn").click();
            window.alert("No player available: Values Resetted.");
        }
    })
};

function getRole() {
    roleSliderValues = [];
    var inputElements = document.getElementsByClassName('roleValue');
    for (var i = 0; inputElements[i]; ++i) {
        if (inputElements[i].checked) {
            roleSliderValues.push(inputElements[i].value);
        }
    }
}