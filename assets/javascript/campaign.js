
var civicURL = "https://www.googleapis.com/civicinfo/v2/";
var civicKey = "AIzaSyAVPZRcm8AoSUyWjp_mguSDes1qudW_JpE";

var electionURL = civicURL + "elections?key=" + civicKey;
var voterInfoURL = civicURL + "voterinfo?key=" + civicKey;

var electionList = [];
var candidateList = [];


// Get list of upcoming elections
// Called before user has a chance to provide any input so it should be ready
$.ajax({
  url: electionURL,
  method: "GET"
  }).done(function(response) {
  electionList = response.elections;
  console.log(electionList);
  });


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



$("#getCandidates").on("click", function() {

  // https://www.googleapis.com/civicinfo/v2/elections?key=AIzaSyAVPZRcm8AoSUyWjp_mguSDes1qudW_JpE
  // https://www.googleapis.com/civicinfo/v2/voterinfo?key=AIzaSyAVPZRcm8AoSUyWjp_mguSDes1qudW_JpE&address=14442%20Grassmere%20Ln%2C%20Tustin%20CA&electionId=2000
  // var secretsURL = "";
  // var secretsKey = "0c3901123cb9b3216d43c9c18bf2e693"
  // var address = parseAddress();



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


  // Get sanitized, URL-encoded address
  var address = parseAddress();

  // For each election in the list
  for(var i = 0; i < electionList.length; i++) {
    // If this election is one relevant to the user
    if(isApplicable($("#state").val(), electionList[i].ocdDivisionId)) {
      // Display the election info
      var thisElection = $("<div>", {
                            "class" : "election",
                            "id" : electionList[i].id
                          });
      var electionName = $("<span>", {
                            "class" : "electionName",
                            "text" : electionList[i].name
                          });
      var electionDate = $("<span>", {
                            "class" : "electionDate",
                            "text" : electionList[i].electionDay
                          });
      thisElection.append(electionName);
      thisElection.append(electionDate);

      $("#dataWrapper").append(thisElection);

      // Get the info for that election
      $.ajax({
        url: voterInfoURL + "&address=" + address + "&electionId=" + electionList[i],
        method: "GET"
      }).done(function(response) {

        // Show their polling location info under the election name
        var polls = response.pollingLocations;
        for(var i = 0; i < polls.length; i++) {
          var locationTxt = "Polling location: " + polls[i].address.line1 + ", " +
                            polls[i].address.city + ", " + polls[i].address.state +
                            " " + polls[i].address.zip + " | "
                            + "Hours: " + polls[i].pollingHours;
          var location = $("<div>", {
                            "class" : "poll",
                            "text" : locationTxt
                          });
          $("#dataWrapper").append(location);
        }

        var contests = response.contests;
        // For each contest in this election
        for(var i = 0; i < contests.length; i++) {
          // Display the name of the contest (office that's up for election)
          var office = $("<div>", {
                          "class" : "office",
                          "text" : contest[i].office
                        });
          $("#dataWrapper").append(office);

          var candidates = contests[i].candidates;
          // For each candidate running for office
          for(var i = 0; i < candidates.length; i++) {
            var candName = candidates[i].name;
            var candParty = candidates[i].party;
            var candURL = candidates[i].candidateUrl;
            var socialMedia = candidates[i].channels; // array of social media types and links
            // Display the candidates's info (name & party)
            var candInfo = $("<div>", {
                              "class" : "candiate"
                            });
            var cName = $("<span>", {
                            "class" : "candName",
                            "text" : candName
                          });
            var cParty = $("<span>", {
                            "class" : "candParty",
                            "text" : candParty
                          });
            candInfo.append(cName);
            candInfo.append(cParty);


            // Display links to their webpage and social media channels




            // Here's where we make the ajax call to OpenSecrets to look for their info
            //
            //
            //
            //
            //



          }
        }

      });
    }
  }






});

// Since the VoterInfo API isn't behaving like it says it should, we have to
// check each election in the list to see if the state matches the user's.
// (API is requiring the electionId param even though it says it's optional)
// Returns true if the user's state is found in the ocdDivisionId for an election
// Currently only works with US and state elections due to a lack of data to
// test local elections with.
// divisionString is of the format "ocd-division/country:us/state:ca"
function isApplicable(state, divisionString) {
  var divisons = divisionString.split("/");
  // False if the election is not in the US
  if(divisions[1].substr(-2,2) != "us") {
    return false;
  }
  // False if the state for this election isn't equal to the user's state
  else if (divisions[2].substr(-2,2) != state) {
    return false;
  }
  // When we have better data, add more conditions to check for more local divisions like
  // cities, school districts, etc.  Don't know what they're called since there isn't any
  // data in the test DB for these.
  return true;
}

// Returns the address in a URL encoded string
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