// This commented out nodes works, but has been replaced with the JSON data. I'm leaving it here for reference on how it looks.
// var nodes = [{"name":"Rock","freq":100},{"name":"Heavy Metal","freq":50},{"name":"Disco","freq":40},{"name":"French House","freq":10}];

// This links is currently being used. It's fake data, since I didn't make an algorithm for calculating similarity yet.
var links = [{"source":1,"target":0,"value":70},{"source":2,"target":0,"value":30},{"source":3,"target":0,"value":20},{"source":2,"target":1,"value":20},{"source":3,"target":1,"value":10},{"source":3,"target":2,"value":80}];

// These are for creating nodes. nodeNames and nodeFreqs are combined later to form nodes.
var nodes = [];
var nodeNames = [];
var nodeFreqs = [];

// Get similar tags for Pop tag
$.getJSON("http://ws.audioscrobbler.com/2.0/?method=tag.getsimilar&tag=pop&api_key=1d4e90a59a76ae5489f0a080f0da6979&format=json", function(data){
  console.log(data);

  // For each similar tag, append it to nodeNames
  $.each(data.similartags.tag, function(i,tag){
      var nodeName = tag.name;
      nodeNames.push(nodeName);

      // Get the popularity of each similar tag and append it to nodeFreqs
      $.getJSON("http://ws.audioscrobbler.com/2.0/?method=tag.getinfo&tag="+tag.name+"&api_key=1d4e90a59a76ae5489f0a080f0da6979&format=json", function(taginfo){
        nodeFreq = taginfo.tag.taggings/10000; // adjust for radius
        nodeFreqs.push(nodeFreq);

        // IMPORTANT
        // I could not figure out how to run the later stuff after the JSONs finished, so I kind of did a hack job here.
        //After the 4th tag frequency is retrieved, all the JSONs are done. At this point, run the later function.
        if (nodeFreqs.length == 4){
          laterFunction();
        }
      });

      // Only get the first 4 similar tags to Pop
      if ( i == 3 ) return false;
    });
});

function laterFunction(){

  // Combine the names and frequencies and append them to nodes
  for (var i = 0; i < nodeNames.length; i++){
    var node = {"name":nodeNames[i],"freq":nodeFreqs[i]};
    nodes.push(node);
  }

  // Just checking stuff
  console.log(nodeNames);
  console.log(nodeFreqs);
  console.log(nodes);
  console.log(links);


  var width = 1200,
      height = 700;

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

  force
      .nodes(nodes)
      .links(links)
      .start();

  var link = svg.selectAll("line.link")         //code for links with text adapted from https://groups.google.com/forum/?fromgroups=#!topic/d3-js/GR4FeV85drg
      .data(links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", 0) //  no stroke renders bubbles in space
      .text("test");

  var node = svg.selectAll("g.node") 
      .data(nodes) 
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
      .attr("font-family", "sans-serif")
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


    function getRandomColor() {
        var letters = 'ABCDE'.split('');
        var color = '#';
        for (var i=0; i<3; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
        }
    return color;
    }
}
    
      