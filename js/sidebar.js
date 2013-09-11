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

}