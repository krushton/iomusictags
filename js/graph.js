function Graph(el) {

// Add and remove elements on the graph object
this.addNode = function (id, name, freq) {
    nodes.push({"id":id, "name": name, "freq": freq});
    update();
};

this.updateNode = function (id, name, freq) {
    var n = findNode(id);
    n.name = name;
    n.freq = freq;
    update();
};

this.nodeExists = function(name) {
   if (this.findNodeByName(name)) {
    return true;
   }
   return false;
}

this.removeNode = function (id) {
    var i = 0;
    var n = this.findNode(id);
    while (i < links.length) {
        if ((links[i]['source'] == n)||(links[i]['target'] == n))
        {
            links.splice(i,1);
        }
        else i++;
    }
    nodes.splice(this.findNodeIndex(id),1);
    update();
};

this.removeLink = function (source,target){
    for(var i=0;i<links.length;i++)
    {
        if(links[i].source == source && links[i].target == target)
        {
            links.splice(i,1);
            break;
        }
    }
    update();
};

this.updateLinkTarget = function(source, newTarget, newValue) {
    for(var i=0;i<links.length;i++)
    { 
      if (links[i].source.id == source.id) {
          links[i].target = newTarget;
          links[i].target = newValue;
          return;
      }
    }
    update();
};


this.removeallLinks = function(){
    links.splice(0,links.length);
    update();
};

this.removeAllNodes = function(){
    nodes.splice(0,links.length);
    update();
};

this.getAllNodes = function(){
    return nodes;
};

this.getAllLinks = function(){
    return links;
};


this.addLink = function (source, target, value) {
    links.push({"source": this.findNode(source),"target": this.findNode(target),"value":value});
    update();
};


this.findNode = function(id) {
    for (var i in nodes) {
        if (nodes[i]["id"] === id) return nodes[i];};
};

this.findLink = function(sourceId) {
for (var i in links) {
        if (links[i].source.id == id) return links[i];};
};

this.findNodeIndex = function(id) {
    for (var i=0;i<nodes.length;i++) {
        if (nodes[i].id==id){
            return i;
        }
        };
};

this.findNodeByName = function(name) {
    for (var i in nodes) {
        if (nodes[i]["name"] === name) return nodes[i];};
};

this.getNodeLengh = function() {
     return nodes.length;
};

this.appendClickHandler = function(node, callback) {
    vis.selectAll("g.node").on("click", function(d) {
        callback(d);
    });
};

// set up the D3 visualisation in the specified element
var width = 1200,
    height = 1000;

 var vis = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "svg")
      .attr("pointer-events", "all")
      .attr("viewBox","0 0 "+width+" "+height)
      .attr("perserveAspectRatio","xMinYMid")
      .append('svg:g');

var force = d3.layout.force()
      .charge(-100)
       force.linkDistance(function(link) {
          return 3 * (150 - link.value); //link.value measures the strength of the correllation
       })
      .size([width, height]);

var nodes = force.nodes(),
    links = force.links();

var update = function () {

    var link = vis.selectAll("line")
        .data(links, function(d) { 
            return d.source.id + "-" + d.target.id; 
        });

      link.enter().append("line")
      .attr("id",function(d){return d.source.id + "-" + d.target.id;})
      .attr("class", "link")
      .style("stroke-width", 0) //  no stroke renders bubbles in space
      .text("test");


    link.append("title")
    .text(function(d){ return d.value;  });

    link.exit().remove();

    var node = vis.selectAll("g.node")
        .data(nodes, function(d) { return d.id;});

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    nodeEnter.append("svg:circle") 
      .attr("r", function(d) { return d.freq; }) 
      .style("fill", function() { return getRandomColor()}) 
      .attr("id",function(d) { return "Node;"+d.id;})
      .attr("class","nodeStrokeClass")
      .call(force.drag); 

    nodeEnter.append("svg:text") 
      .style("pointer-events", "none") 
      .attr("text-anchor", "middle")
      .attr("fill", "#000") 
      .attr("font-size", "15px")
      .attr("font-family", "sans-serif")
      .attr("dx", "8") 
      .attr("dy", ".35em") 
      .text(function(d) { return d.name; }); 


    node.append("svg:title") 
      .style("pointer-events", "none") 
      .text(function(d) { return d.name; }); 

    node.exit().remove();
    force.on("tick", function() {

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y         + ")"; });

        link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
    });

    // Restart the force layout.
    force
    .gravity(.05)
    .distance(350)
    .size([width, height])
    .start();
};


// Make it all go
update();
}

function getRandomColor() {
    var letters = 'ABCDE'.split('');
    var color = '#';
    for (var i=0; i<3; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

//much credit for this code goes to:
//http://stackoverflow.com/questions/11400241/updating-links-on-a-force-directed-graph-from-dynamic-json-data