

// Get user's location information
  // State
  // City
  // More local?  Not sure what affects elections.
  // Specific address affects school districts so we might need that.

// Validate the location info
// If it's bad, return an error

// If it's good, get the list of upcoming elections
// It would be nice to have them sorted and labelled for us, state, and local elections

// For each election, clicking on it should return the list of candidates.

// Under each candidate we want to show where they're getting their $
// User shouldn't have to open a modal, we want it all on the screen at once so they
// can compare side by side with minimal clicking.


// Load candidate ID list from CSV file (needed for OpenSecrets calls)
// $.ajax({
//     url: "pathto/filename.csv",
//     async: false,
//     success: function (csvd) {
//         data = $.csv.toArrays(csvd);
//     },
//     dataType: "text",
//     complete: function () {
//         // call a function on complete
//     }
// });


// https://www.opensecrets.org/api/?method=getOrgs&org=Clinton&apikey=0c3901123cb9b3216d43c9c18bf2e693


$(document).ready(function() {









});

var electionList = [];
var electionList2 = [];

$("#getCandidates").on("click", function() {



  var civicURL = "https://www.googleapis.com/civicinfo/v2/"
  var civicKey = "AIzaSyAVPZRcm8AoSUyWjp_mguSDes1qudW_JpE";

  var electionURL = civicURL + "elections?key=" + civicKey;
  var voterInfoURL = civicURL + "voterinfo?key=" + civicKey;

  // var secretsURL = "";
  // var secretsKey = "0c3901123cb9b3216d43c9c18bf2e693"

  // var address = parseAddress();

  // Get list of upcoming elections
  $.ajax({
    url: electionURL,
    method: "GET"
  }).done(function(response) {
    electionList = response.elections;
    console.log(electionList);


  });

// Need to call this once for each election listed in the first call
// Might not return anything, in which case we don't want to display anything
// but if there are stuff in response.contests then we need to display election.name
// election.electionDay, and for each item in contests
// we need to show contests[i].office, contests[i].district.name,
// for each candidate of that contest
// show contests[i].candidates[j].name, contests[i].candidates[j].party
// candidate website in contests[i].candidates[j].candidateURL
// social media links
// list of links in contests[i].candidates[j].channels[y].type (eg "Facebook")
// and the url in contests[i].candidates[j].channels[y].id ("facebook.com/jerrybrown")

// so all we have is the candidate name to look them up on opensecrets
// can pull their CRP_ID from the bulk data spreadsheet, but the most recent data
// they have is for 2016 elections.  So this might not work for candidates not
// currently in any public office.  be prepared to handle lots of null (missing) info.

  $.ajax({
    url: voterInfoURL,
    method: "GET"
  }).done(function(response) {
    electionList2 = response.elections;
    console.log(electionList);


  });


});

// Doesn't have to be in the $(document).ready() because not called until
// user clicks the button to submit their info.
function parseAddress() {
  var address = $("#address").val().trim().replace(/[^a-zA-Z 0-9]+/g, '');
  var city = $("#city").val().trim().replace(/[^a-zA-Z 0-9]+/g, '');
  var state = $("#state").val().trim().replace(/[^a-zA-Z 0-9]+/g, '');
  // var zip = $("#zip").val().trim().replace(/[^ 0-9]+/g, '');

  // If any of the required data is missing, just means we can't refine the search

  return encodeURIComponent(address + ", " + city + " " + state);
}