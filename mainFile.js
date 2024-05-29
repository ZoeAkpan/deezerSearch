// The API is from Deezer.

/*
Input: Takes in the name of a song, which ideally is a string that's non-empty. 

Checks to make sure the json
file has status code between 200-299 (is okay). Fetches the json file that contains the top chart information
(top songs according to Deezer stats). Checks the validity of a string and then finds whether or not
their artist has a song that is on the top chart. 

Return: Prints true if artist is on top chart
Prints false is artist is not on top chart
*/
export function songIsOnTheCharts(songName) {
  return fetch("https://api.deezer.com/chart")
    .then(res =>
      res.ok ? res.json() : Promise.reject(`Chart API is unavailable for the following reason: ${res.statusText}`)
    )
    .then(jsonResults => {
      const chartInformation = jsonResults.tracks.data;
      if (typeof songName === "string" && songName !== "") {
        // Standardizing the user input and name. Not character sensitive.
        return Promise.resolve(
          chartInformation.some(songInformation => songInformation.title.toLowerCase() === songName.toLowerCase())
        );
      }
      return Promise.reject("User input was not a string or empty. Need valid song title.");
    })
    .then(artistOnChartsBool => console.log(artistOnChartsBool));
}

/*
Input: Takes in the artistName, which ideally is a string that's non-empty. 

Fetches the json file with the designated artist name by using URL class
and changing the query. Checks to make sure the json file has status code between 
200-299 (is okay) and then, if the artist name is valid, and the artist has at least five songs,
iterate five times to get the top five songs. Puts where the song's position is in an object as well as the title.

Return: Prints an array containing objects with the top five songs of the artist with the aligned position number.
*/
export function topFiveSongsOfArtist(artistName) {
  const adjustedUrl = new URL("https://api.deezer.com/search");
  adjustedUrl.searchParams.append("q", artistName);
  fetch(adjustedUrl.toString())
    .then(res =>
      res.ok ? res.json() : Promise.reject(`Search API is unavailable for the following reason: ${res.statusText}`)
    )
    .then(jsonFile => {
      if (typeof artistName === "string" && artistName !== "") {
        const artistInformation = jsonFile.data;
        const finalTopFiveInfo = [];
        if (artistInformation.length >= 5) {
          for (let i = 0; i < 5; i++) {
            const currentSong = artistInformation[i];
            const positionSongObj = { Position: i + 1, Song: currentSong.title };
            finalTopFiveInfo.push(positionSongObj);
          }
          return Promise.resolve(finalTopFiveInfo);
        }
        return Promise.reject("Artist does not have at least five songs in their discography.");
      }
      return Promise.reject("Invalid artist name. Not a string or empty.");
    })
    .then(topFiveArr => console.log(topFiveArr));
}
