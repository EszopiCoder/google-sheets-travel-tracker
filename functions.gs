/**
 * Create new sheet and retrieve airport data from Github.
 * Warning: This will clear active sheet.
*/
function getAirportData() {
  SpreadsheetApp.getActiveSpreadsheet().toast('Adding airports to new sheet','getAirportData()',3);
  // Create array and headers for airport data
  let airportData = [];
  airportData.push(["IATA","ICAO","Name","City","State","Country","Elevation","Latitude","Longitude","Timezone"]);

  // Retrieve airport data from Github and add to array
  const githubData = UrlFetchApp.fetch("https://raw.githubusercontent.com/EszopiCoder/google-sheets-travel-tracker/refs/heads/main/airports.json");
  const githubDataText = JSON.parse(githubData.getContentText());
  for (var key of Object.keys(githubDataText)) {
    if (githubDataText[key].iata) {
      airportData.push([githubDataText[key].iata,githubDataText[key].icao,githubDataText[key].name,githubDataText[key].city,githubDataText[key].state,githubDataText[key].country,githubDataText[key].elevation,githubDataText[key].lat,githubDataText[key].lon,githubDataText[key].tz]);
    }
  }

  // Create sheet and paste data to sheet
  SpreadsheetApp.getActiveSpreadsheet().insertSheet("Airports");
  SpreadsheetApp.getActiveSheet().getRange(1,1,airportData.length,airportData[0].length).setValues(airportData);
  SpreadsheetApp.getActiveSpreadsheet().toast('Completed','getAirportData()',3);
}

  // Paste to sheet
  SpreadsheetApp.getActiveSheet().getRange(1,1,airportData.length,airportData[0].length).setValues(airportData);
}

/**
 * Calculates great circle distance in km.
 * @param {number} lat1 Latitude of location 1.
 * @param {number} lon1 Longitude of location 1.
 * @param {number} lat2 Latitude of location 2.
 * @param {number} lon2 Longitude of location 2.
 * @return Great circle distance in km.
 * @customfunction
*/
function gcmDist(lat1,lon1,lat2,lon2) {
  const lat1Rad = lat1*(Math.PI/180);
  const lon1Rad = lon1*(Math.PI/180);
  const lat2Rad = lat2*(Math.PI/180);
  const lon2Rad = lon2*(Math.PI/180);
  const theta = lon2Rad-lon1Rad;
  let dist = Math.acos(Math.sin(lat1Rad)*Math.sin(lat2Rad)+Math.cos(lat1Rad)*Math.cos(lat2Rad)*Math.cos(theta));
  if (dist < 0) {
    dist += Math.PI;
  }
  dist *= 6371.2;
  return dist;
}

/**
 * Call drawMap and save map as png. 
*/
function saveMap() {
  drawMap(false);
}

/**
 * Draw static map using Google API
 * @param {boolean} insertMap [OPTIONAL] If true, map will be inserted as image on sheet. If false, map will be saved to Drive as png. 
*/
function drawMap(insertMap=true) {
  // Get sheet, last row, and values
  const ss = SpreadsheetApp.getActive().getSheetByName('Map');
  const aVals = ss.getRange("A1:A").getValues();
  const aLast = aVals.filter(String).length;
  const flights = ss.getRange(2,4,aLast-1,4).getValues();

  // Create map
  SpreadsheetApp.getActiveSpreadsheet().toast('Creating map','Maps',3);
  const map = Maps.newStaticMap()
    .setCenter('United States of America')
    .setPathStyle(1,Maps.StaticMap.Color.BLACK,Maps.StaticMap.Color.WHITE)
    .setMarkerStyle(Maps.StaticMap.MarkerSize.TINY,Maps.StaticMap.Color.RED,'0');
  for (let i = 0; i < flights.length; i++) {
    map.addPath([flights[i][0],flights[i][1],flights[i][2],flights[i][3]]);
    map.addMarker(flights[i][0],flights[i][1]);
    map.addMarker(flights[i][2],flights[i][3]);
  }

  if (insertMap) {
    // Insert map into Google Sheets as image
    ss.insertImage(map.getBlob(),1,1);
    SpreadsheetApp.getActiveSpreadsheet().toast('Inserted into active sheet','Maps',3);
  } else {
    // Save as png
    DriveApp.createFile(Utilities.newBlob(map.getMapImage(), 'image/png', 'map.png'),);
    SpreadsheetApp.getActiveSpreadsheet().toast('Saved to Google Drive','Maps',3);
  }
}
