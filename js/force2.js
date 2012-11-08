
$(document).ready(function() {

      graph = new Graph('#chart');
      index = 0;

      var center = { "name": "pop", "freq" : 100, "id" : 0 };
      draw(center);


function draw(centerNode) {

//if center doesn't exist yet. should only be needed at the start.
if (!graph.findNodeByName(centerNode.name)) {
  graph.addNode(centerNode.id, centerNode.name, centerNode.freq);
}

$.getJSON("http://ws.audioscrobbler.com/2.0/?method=tag.getSimilar"
  + "&api_key=1d4e90a59a76ae5489f0a080f0da6979&format=json&tag=" + centerNode.name, function(data){

  // For each similar tag 
  $.each(data.similartags.tag, function(i,tag){

    //node doesn't exist yet
      if (!graph.nodeExists(tag.name)) {

          // create a new node with appropriate scale
          $.getJSON("http://ws.audioscrobbler.com/2.0/?method=tag.getinfo&tag=" + tag.name
           + "&api_key=1d4e90a59a76ae5489f0a080f0da6979&format=json", 
           function(taginfo){
            nodeFreq = taginfo.tag.taggings/10000; // adjust for radius

            //make sure they don't get toooo big.
            if (nodeFreq > 100) {
              nodeFreq = 100;
            }

            //add new node
            index++;
            graph.addNode(index, tag.name, nodeFreq);
            var newNode = graph.findNode(index);
            graph.appendClickHandler($(newNode), function(d) {
                draw(d);
            });

            //add link, initialize to 0
            graph.addLink(index, centerNode.id, 0);
          });
        }
        else {    //if the node already exists, update the target
            var currNode = graph.findNodeByName(tag.name);
            var newValue = 30;    //todo: replace with similarity weight
            graph.updateLinkTarget(currNode, centerNode, newValue);

        }

    });
  });
deleteLinks();
}

function deleteLinks() {
      //delete broken nodes and links
    var links = graph.getAllLinks();
    for (var i in links ) {

      if (links[i].target  != centerNode) {
        console.log(links[i].source.name);
        graph.removeLink(links[i].source, links[i].target);
        graph.removeNode(links[i].source);
    }
  }
}

});