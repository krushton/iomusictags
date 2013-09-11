
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

      $("#tagTitle").html(infoJSON.tag.name);
      $("#tagSummary").html(infoJSON.tag.wiki.summary);

    });

    // Get top tracks
    $.getJSON("http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=" + tag + "&api_key=1d4e90a59a76ae5489f0a080f0da6979&format=json", function(tracksJSON){


      for (var i=0; i<4; i++){
        var trackName = tracksJSON.toptracks.track[i].artist.name;
        var trackArtist = tracksJSON.toptracks.track[i].name;

        var link = $("<a href='#'><span class='music'>" + trackArtist + " - " + trackName + "</span></a>");

        link.data('name', trackName);
        link.data('artist',trackArtist);


        $(link).click(function() {
          var track = $(this).data('name');
          var artist = $(this).data('artist');
          
          loadPlayer(artist, track);
        });

        var listItem = $('<li></li>').append(link);
        $("#tracklist").append(listItem);
      }

    });

    // Get top artists
    $.getJSON("http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag="+ tag + "&api_key=1d4e90a59a76ae5489f0a080f0da6979&format=json", function(artistsJSON){

      for (var i=0; i<4; i++){

        var artistName = artistsJSON.topartists.artist[i].name;
        var link = $("<a href='#'><img src='" + artistsJSON.topartists.artist[i].image[2]['#text'] + "'><span class='artistName music'>" + artistsJSON.topartists.artist[i].name + "</span></a>")
        link.data('artist', artistName);
        link.click(function() {
          var artist = $(this).data('artist');
          loadPlayer(artist, "music");
        });

        var div = $("<div class='artist' id='artist" + i +"'></div>").append(link);

        $("#topArtists").append(div);
      }

    });

  }

// Hack to get the chart to fit in that window
function setSizes() {
   var contentHeight = $(".content").height();
   $("#chartwrapper").height(contentHeight - 110);
}

$(window).resize(function() { setSizes(); });

function loadPlayer(artist, track) {
     
    var options = {
      orderby: "relevance",
      q: artist + " " + track, 
      "start-index": 1,
      "max-results": 1,
      v: 2,
      alt: "json"
    };


    $.ajax({
      url: 'http://gdata.youtube.com/feeds/api/videos',
      method: 'get',
      data: options,
      dataType: 'json',
      success: function(data) {

        var player = document.getElementById('myytplayer');
        var id = data.feed.entry[0].id["$t"];
        var mId = id.split(':')[3];

        if (!player) {
            var params = { allowScriptAccess: "always" };
            var atts = { id: "myytplayer" };
            swfobject.embedSWF("http://www.youtube.com/v/" + mId + "?enablejsapi=1&playerapiid=ytplayer&version=3&autoplay=1&autohide=0",
                           "ytapiplayer", "300", "356", "8", null, null, params, atts);
        } else {
          player.loadVideoById(mId, 0, "large");
        }


     
        $('#ytapiplayer').show();


      }, 
      error : function() {
        console.log("error");
      }
      });
}
