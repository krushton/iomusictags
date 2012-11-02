
var width = 1200,
    height = 800;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
     force.linkDistance(function(link) {
        return 3 * (100 - link.value); //link.value measures the strength of the correllation, with higher values being a higher "similarity score"
     })
    .size([width, height]);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("sampledata.json", function(json) {
  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll("line.link")         //code for links with text adapted from https://groups.google.com/forum/?fromgroups=#!topic/d3-js/GR4FeV85drg
      .data(json.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", 0) //  no stroke renders bubbles in space
      .text("test");

  var node = svg.selectAll("g.node") 
      .data(json.nodes) 
      .enter().append("svg:g") 
      .attr("class", "node"); 

    node.append("svg:circle") 
      .attr("r", function(d) { 
        console.log(d.freq);
        return d.freq; }) 
      .style("fill", function() { return getRandomColor()}) 
      .call(force.drag); 

    node.append("svg:text") 
      .style("pointer-events", "none") 
      .attr("fill", "#000") 
      .attr("font-size", "15px") 
      .attr("dx", "8") 
      .attr("dy", ".35em") 
      .text(function(d) { return d.name; }); 

    node.append("svg:title") 
      .style("pointer-events", "none") 
      .text(function(d) { return d.name; }); 

    force.on("tick", function() { 

    link.attr("x1", function(d) { return d.source.x; }) 
      .attr("y1", function(d) { return d.source.y; }) 
      .attr("x2", function(d) { return d.target.x; }) 
      .attr("y2", function(d) { return d.target.y; }); 

    node.attr("transform", function(d) { return "translate(" + d.x + 
"," + d.y + ")"; }); 

    }); 
});

 
    function getRandomColor() {
        var letters = 'ABCDE'.split('');
        var color = '#';
        for (var i=0; i<3; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
        }
    return color;
    }
    
    
      