require("dotenv").config();
var fs = require("fs");

//import keys
var keys = require("./keys.js");

//require apis
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");

//Spotify keys
var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret,
});

//Twitter keys
var client = new Twitter({
  consumer_key: keys.twitter.consumer_key,
  consumer_secret: keys.twitter.consumer_secret,
  access_token_key: keys.twitter.access_token_key,
  access_token_secret: keys.twitter.access_token_secret,
});

//Allow arguments with multiple words
var subjectInput = "";
for (var i = 3; i < process.argv.length; i++) {
  subjectInput += process.argv[i] + " ";
}

//prints the most recent 20 tweets
if (process.argv[2] == "my-tweets") {
  tweetThis();
}

function tweetThis() {
  var params = { screen_name: "ApiRequiresAcc", count: 20 };

  client.get("statuses/user_timeline", params, function(
    error,
    tweet,
    response
  ) {
    if (error) throw error;
    for (var i = 0; i < tweet.length; i++) {
      console.log(tweet[i].created_at + "\n" + tweet[i].text + "\n");
    }
  });
}

//finds and prints information about the given song.  If no song entered, prints info about 'The Sign' by Ace of Base
if (process.argv[2] == "spotify-this-song") {
  spotifyThis();
}

function spotifyThis(aSong) {
  var song = aSong || subjectInput || "The Sign Ace of Base";

  spotify.search({ type: "track", query: song, limit: 1 }, function(
    error,
    data
  ) {
    if (error) throw error;

    if (data.tracks.items.length > 0) {
      for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
        console.log("Artist: " + data.tracks.items[0].artists[i].name + "\n");
      }
    }
    console.log("Song Name: " + data.tracks.items[0].name + "\n");
    console.log("Preview Link: " + data.tracks.items[0].preview_url + "\n");
    console.log("Album: " + data.tracks.items[0].album.name + "\n");
  });
}

//print movie information given inputted movie title
if (process.argv[2] == "movie-this") {
  movieThis();
}

function movieThis(aMovie) {
  var movieTitle = aMovie || subjectInput || "Mr. Nobody";

  request("http://www.omdbapi.com/?apikey=trilogy&t=" + movieTitle, function(
    error,
    response,
    body
  ) {
    if (!error && response.statusCode === 200) {
      var responseJson = JSON.parse(body);

      var movie = responseJson.Title;
      var year = responseJson.Year;
      var IMDBrating = responseJson.Ratings[0].Value;
      var RTrating = responseJson.Ratings[1].Value;
      var country = responseJson.Country;
      var language = responseJson.Language;
      var plot = responseJson.Plot;
      var actors = responseJson.Actors;

      console.log(
        "Movie title: " +
          movie +
          "\n" +
          "Year: " +
          year +
          "\n" +
          "IMBD Rating: " +
          IMDBrating +
          "\n" +
          "Rotten Tomatoes Rating: " +
          RTrating +
          "\n" +
          "Country: " +
          country +
          "\n" +
          "Language: " +
          language +
          "\n" +
          "Plot: " +
          plot +
          "\n" +
          "Actors: " +
          actors
      );
    }
  });
}

//print information given the command and input in the random.txt file
if (process.argv[2] == "do-what-it-says") {
  fs.readFile("./random.txt", "utf8", function(error, data) {
    if (error) throw error;

    data = data.split(",");

    switch (data[0]) {
      case "my-tweets":
        tweetThis();
        break;
      case "spotify-this-song":
        spotifyThis(data[1]);
        break;
      case "movie-this":
        movieThis(data[1]);
        break;
    }
  });
}
