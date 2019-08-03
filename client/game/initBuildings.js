function renderMap() {

    if (sessionStorage.getItem("id") === null) {
        window.location.replace('../login/login.html');
    }
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmVsaXhqb2huc3NvbiIsImEiOiJjanh0ZHIwd3kwcjhjM2Rvb2M3ZnVyMW5kIn0.Mdf_WJH-4npMZh3HNu-6wQ';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/felixjohnsson/cjxw8alzq06j71cnunhrfifmz',
        center: [18.07791, 59.317209],
        zoom: 17,
        pitch: 50
    });

    map.on('load', function () {
        //YELLOW HIGHTLIGHT
        map.addSource('yellow-highlight', {
                type: 'geojson',
                data: {
                    "type": "FeatureCollection",
                    "features": []
                }
            }),
            map.addLayer({
                "id": "highlight",
                "source": "yellow-highlight",
                'type': 'line',
                'minzoom': 15,
                'paint': {
                    'line-color': '#ede993',
                    'line-width': 30
                }
            });
        map.on('click', 'buildings', function (e) {
            map.getSource('yellow-highlight').setData({
                "type": "FeatureCollection",
                "features": e.features
            });
        });
        // 3D BUILDINGS
        map.addLayer({
            'id': 'buildings',
            'type': 'fill-extrusion',
            'source': {
                'type': 'geojson',
                'data': 'https://api.myjson.com/bins/17cpr1'
            },
            'paint': {
                'fill-extrusion-color': '#ada795',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'base_height'],
                'fill-extrusion-opacity': 1
            }
        });

        map.on('click', 'buildings', function (e) {

            const lat = e.lngLat.lat;
            const lng = e.lngLat.lng;
            const height = e.features[0].properties.height;
            const m2 = e.features[0].properties.m2;
            const size = m2 * height;
            const sizeRoot = Math.sqrt(size/1.8) *2;
            const numberOfApartments = sizeRoot/10;
            const apartmentClass = 57;

            const latFromCenter = 59.332491 - lat
            const lngFromCenter = 18.077331 - lng

            const latDistancePoints = Math.sqrt(latFromCenter*latFromCenter)*1000;
            const lngDistancePoints = Math.sqrt(lngFromCenter*lngFromCenter)*1000;
            const distancePercentage = (latDistancePoints + lngDistancePoints)/1000;
            console.log(distancePercentage)
            const value =  Math.round(numberOfApartments * (apartmentClass * 2300) * ((100 - distancePercentage)/100));
            let valueStr = (value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            
            document.getElementById('buildingID').innerHTML = lat.toString() + lng.toString()
            document.getElementById('lng').innerHTML = lng;
            document.getElementById('lat').innerHTML = lat;
            document.getElementById('buildingHeight').innerHTML = height;
            document.getElementById('buildingm2').innerHTML = m2;
            document.getElementById('numberOfApartments').innerHTML = Math.round(numberOfApartments);
            document.getElementById('value').innerHTML = valueStr + '€';

        })

        // Change the cursor to a pointer when the mouse is over the states layer.
        map.on('mouseenter', 'buildings', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'buildings', function () {
            map.getCanvas().style.cursor = '';
        });
    });
    const characterID = sessionStorage.getItem("id");
    const API_URL = 'http://localhost:3000/getResident';

    fetch(API_URL, {
        method: 'PUT',
        body: JSON.stringify({characterID}),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(res => res.json())
    .then((e)=> {
        if (e === null){
            document.getElementById('id').innerHTML = 'Error'
        } else {
 
        }
    }) 
    
}
function addBuilding(e) {

    if (buildingID === 'Error'){document.getElementById('res').innerHTML = "Select a building."}

    let apartmentBuilding = {
        id:buildingID,
        numberOfApartments: numberOfApartments,
        rentCost: rentCost,
    }

    if(type === 'apartment'){
        fetch('http://localhost:3000/addBuilding', {
            method: 'PUT',
            body: JSON.stringify(apartmentBuilding),
            headers: {
                'content-type': 'application/json'
            }
        }).then((e) =>{
            if (e.status === 200){
                document.getElementById('res').innerHTML = "Added."
                
                setTimeout(() => {
                document.getElementById('res').innerHTML = ""
                }, 2000);

            } else if (e.status === 400){
                document.getElementById('res').innerHTML = "Already exists."

                setTimeout(() => {
                document.getElementById('res').innerHTML = ""
                }, 2000);
            }
        })
        apartmentBuilding = {}
    }
}
