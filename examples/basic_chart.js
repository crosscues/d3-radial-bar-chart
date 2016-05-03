window.onload = function() {
    var data = [];

    for (var i = 0; i < 10; i++) {
        data.push({
            label: "Label-" + i,
            value: Math.random() * 100
        });
    }

    var height = 500;
    var width = 500;
    var chart = MA.radialBarChart()
                .chartHeight(height)
                .chartWidth(width)
                .domain([0, 100])
                .barColors(['#073336'])
                .barSelectionColor('#7FCCC1')
                .averageArcColor('#FDAC52')
                .progressFillColor('#FDAC52');
    var svg = d3.select('#chart-container')
                .append('svg')
                .datum(data)
                .attr('width', width)
                .attr('height', height);

    svg.call(chart);
};
