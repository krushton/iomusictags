function bodyLoad(){
  $("#welcome").show();
  $("#tagInfo").hide();
}

function loadTag(){

  // Reset the append divs and initialize variables
  $("#welcome").hide();
  $("#tagInfo").show();
  $("#topArtists").html("");
  tag = ($("#tagInput").val());


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

  });

  // Get top artists
  $.getJSON("http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag="+ tag + "&api_key=1d4e90a59a76ae5489f0a080f0da6979&format=json", function(artistsJSON){

    console.log(artistsJSON);
    for (var i=0; i<4; i++){

      console.log(artistsJSON.topartists.artist[i].image[2]['#text']);

      $("#topArtists").append("<div class='artist' id='artist" + i +"'><img src='" + artistsJSON.topartists.artist[i].image[2]['#text'] + "'><span class='artistName'>" + artistsJSON.topartists.artist[i].name + "</span></div>");
    }

  });

}