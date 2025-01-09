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
