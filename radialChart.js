(function(global) {
function chart(config) {
    var height = 500;
    var width = 960;
    var domain = [0, 100];
    var arc_spacing = 20;
    var bar_colors = ['#4172B3'];
    var bar_selection_color = '#579346';
    var average_arc_color = '#FDAC52';
    var progress_fill_color = '#FDAC52';
    var circle_stroke = '#CCC';
    var label_fill = "#3E3E3E";
    var circle_stroke_width = '1.5px';
    var transition_duration = 1000;
    var colorscale = d3.scale.ordinal().range(bar_colors);
    var tooltipFn = function(d) {
        var html = "<b>" + d.label + "</b>";

        html += '<br>';
        html += '<span>' + d.value + '</span>';

        return html;
    };

    var bar_count, colorscale;

    function my(selection) {
        selection.each(function(data, i) {
            var container = d3.select(this);
            var g = container.append('g')
                         .attr('transform', "translate(" + width/2 + "," + height/2 + ")");

            var label_radius = height/2 - arc_spacing;
            var bar_radius = label_radius - arc_spacing;
            var barscale = d3.scale.linear().domain(domain).range([0, bar_radius]);
            var keys = data.map(function(d) { return d.label; });
            var arcs = d3.svg.arc()
                         .startAngle(startAngle)
                         .endAngle(endAngle)
                         .innerRadius(0);
            var tip = d3.tip().attr('class', 'd3-radial-tip').html(tooltipFn);

            bar_count = keys.length;
            data = data.sort(function(a, b) { return b.value - a.value; });

            container.call(tip);

            var segments = g.selectAll('path')
                            .data(data)
                            .enter().append('path')
                            .classed('segment', true)
                            .each(function(d) {d.outerRadius = 0;})
                            .style('fill', function(d) { return colorscale(d.label); })
                            .style('cursor', 'pointer')
                            .attr('d', arcs);

            segments
                .transition()
                .ease('elastic')
                .duration(transition_duration)
                .delay(function(d, i) {
                    return (25 - i) * 50;
                })
                .attrTween('d', function(d, idx) {
                    var i = d3.interpolate(d.outerRadius, barscale(+d.value));

                    return function(t) {
                        d.outerRadius = i(t);
                        return arcs(d, idx);
                    };
                });

            segments.on('mouseenter', function(d, i) {
                d.hovered = true;
                update(g, data);
                tip.show(d, i);
            });

            segments.on('mouseleave', function(d, i) {
                d.hovered = false;
                update(g, data);
                tip.hide(d, i);
            });

            g.append('circle')
             .attr('r', bar_radius)
             .classed('outer', true)
             .style('fill', 'none')
             .style('stroke', circle_stroke)
             .style('stroke-width', circle_stroke_width);


            var lines = g.selectAll("line")
                         .data(keys)
                         .enter().append("line")
                         .attr("y2", -bar_radius)
                         .style("stroke", circle_stroke)
                         .style("stroke-width", ".5px")
                         .attr("transform", function(d, i) { return "rotate(" + (i * 360 / bar_count) + ")"; });

            // Labels

            var labels = g.append("g").classed("labels", true);

            labels.append("def")
                  .append("path")
                  .attr("id", "label-path")
                  .attr("d", "m0 " + -label_radius + " a" + label_radius + " " + label_radius + " 0 1,1 -0.01 0");

            labels.selectAll("text")
                  .data(keys)
                  .enter().append("text")
                  .style("text-anchor", "middle")
                  .style("font-size", "0.8em")
                  .style("fill", label_fill)
                  .append("textPath")
                  .attr("xlink:href", "#label-path")
                  .attr("startOffset", function(d, i) {return i * 100 / bar_count + 50 / bar_count + '%';})
                  .text(function(d) {return d; });
        });
    }

    function update(g, data) {
        var segments = g.selectAll('.segment').data(data);

        segments
            .style('fill', function(d) {
                if (d.hovered) {
                    return bar_selection_color
                } else {
                    return colorscale(d.label);
                }
            })
    }

    function startAngle(d, i) {
        return (i * 2 * Math.PI) / bar_count;
    }

    function endAngle(d, i) {
        return ((i + 1) * 2 * Math.PI) / bar_count;
    }

    my.chartHeight = function(value) {
        if (!arguments.length) return height;
        height = value
        return my;
    };

    my.chartWidth = function(value) {
        if (!arguments.length) return width;
        width = value;
        return my;
    };

    my.domain = function(value) {
        if (!arguments.length) return domain;
        domain = value;
        return my;
    };

    my.barColors = function(value) {
        if (!arguments.length) return bar_colors;
        bar_colors = value;
        colorscale = d3.scale.ordinal().range(bar_colors);
        return my;
    };

    my.barSelectionColor = function(value) {
        if (!arguments.length) return bar_selection_color;
        bar_selection_color = value;
        return my;
    };

    my.averageArcColor = function(value) {
        if (!arguments.length) return average_arc_color;
        average_arc_color = value;
        return my;
    };

    my.progressFillColor = function(value) {
        if (!arguments.length) return progress_fill_color;
        progress_fill_color = value;
        return my;
    };

    my.tooltipFn = function(value) {
        if (!arguments.length) return tooltipFn;
        tooltipFn = value;
        return my;
    };

    return my;
}

//just namespacing, there could be other radialBarCharts in the world!
if (!global.MA) {
    global.MA = {};
}

MA.radialBarChart = chart;
})(this);

