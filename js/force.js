var width = 1000,
    height = 700;

var force = d3.layout.force()
    .charge(-130)
    .linkDistance(function(link) {
          return 5 * (100 - link.value); //link.value measures the strength of the correllation, with higher values being a higher "similarity score"
       })
    .gravity(.9)
    .size([width, height]);

var svg = d3.select("#chart").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height )
    .attr("preserveAspectRatio", "xMidYMid meet");

d3.json("fewer.json", function(json) {
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
           return Math.floor(d.freq/3); }) 
      .style("fill", function() { return getRandomColor()})
     .call(force.drag); 

    node.append("svg:text") 
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

    node.on("click", function(d) {
        handleClick(d);
    });

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

  function handleClick(d){
    

    // Reset the append divs and initialize variables
    $("#welcome").hide();
    $("#tagInfo").show();
    $("#topTracks").html("<h2>Top Tracks</h2><ul id='tracklist'></ul>")
    $("#topArtists").html("<h2>Top Artists</h2>");
    tag = d.name;


    // Get title and summary
    $.getJSON("http://ws.audioscrobbler.com/2.0/?method=tag.getinfo&tag=" + tag + "&api_key=1d4e90a59a76ae5489f0a080f0da6979&format=json", function(infoJSON){

      console.log(infoJSON);

      $("#tagTitle").html(infoJSON.tag.name);
      $("#tagSummary").html(infoJSON.tag.wiki.summary);

    });

    // Get top tracks
    $.getJSON("http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=" + tag + "&api_key=1d4e90a59a76ae5489f0a080f0da6979&format=json", function(tracksJSON){

      console.log(tracksJSON);
      // This is how you get the artist name:
      console.log(tracksJSON.toptracks.track[0].artist.name);
      // This is how you get the track name:
      console.log(tracksJSON.toptracks.track[0].name);

      for (var i=0; i<4; i++){

        $("#tracklist").append("<li><a target='player' href='http://www.asian-central.com:8080/" + tracksJSON.toptracks.track[i].name + " " + tracksJSON.toptracks.track[i].artist.name + "'><span class='music'>" + tracksJSON.toptracks.track[i].artist.name + " - " + tracksJSON.toptracks.track[i].name + "</span></a></li>");
      }

    });

    // Get top artists
    $.getJSON("http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag="+ tag + "&api_key=1d4e90a59a76ae5489f0a080f0da6979&format=json", function(artistsJSON){

      console.log(artistsJSON);
      for (var i=0; i<4; i++){

        console.log(artistsJSON.topartists.artist[i].image[2]['#text']);

        $("#topArtists").append("<div class='artist' id='artist" + i +"'><a target='player' href='http://www.asian-central.com:8080/"+artistsJSON.topartists.artist[i].name+"'><img src='" + artistsJSON.topartists.artist[i].image[2]['#text'] + "'><span class='artistName music'>" + artistsJSON.topartists.artist[i].name + "</span></a></div>");
      }

    });

  }

// Hack to get the chart to fit in that window
function setSizes() {
   var contentHeight = $(".content").height();
   $("#chartwrapper").height(contentHeight - 110);
}

$(window).resize(function() { setSizes(); });
