export function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a1 = Math.sin(dLat/2) * Math.sin(dLat/2) 
  var a2 = Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
  var a3 = Math.sin(dLon/2) * Math.sin(dLon/2); 
  var a = a1  + (a2 * a3)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.log("Geo is not supported")
    }
    navigator.geolocation.getCurrentPosition(pos => {
      resolve({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      })
    }, err => {
      reject(err)
    })
  })
} 