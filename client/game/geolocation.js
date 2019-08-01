let counter = 0;
const options = {
    timeout: 60000,
};

function success(pos) {
    counter++;
    crd = pos.coords;

    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`Counter: ${counter}`)
    if(counter===1){renderMap(crd)}
    else {updateCharLocation(crd)}
    updateCharLocation
}

function error(err) {
    document.getElementById('map').innerHTML = "Can't find your location! Try restarting after awhile."
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function locate() {
    navigator.geolocation.watchPosition(success, error, options);
    console.log('Watching...')
}
