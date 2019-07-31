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
                'data': 'https://api.myjson.com/bins/u2tql'
            },
            'paint': {
                'fill-extrusion-color': '#ada795',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'base_height'],
                'fill-extrusion-opacity': 0.9
            }
        });

        map.on('click', 'buildings', function (e) {

            const lat = e.lngLat.lat;
            const lng = e.lngLat.lng;
            const targetPropertyValue = e.features[0].properties.value

            document.getElementById('id').innerHTML = lat.toString() + lng.toString()
            document.getElementById('value').innerHTML = targetPropertyValue;

            document.getElementById('')
            document.getElementById('')
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
function registerBuilding() {
    
    const buildingID = document.getElementById('id').innerHTML;
    const buildingValue = document.getElementById('value').innerHTML;
    const typeInput = document.getElementById('type');
    const type = typeInput.options[typeInput.selectedIndex].value;
    const numberOfApartments = document.getElementById('apartments').value;
    const rentCost = document.getElementById('rentCost').value;

    if (buildingID === 'Error'){document.getElementById('res').innerHTML = "Select a building."}

    let apartmentBuilding = {
        type:'apartment',
        id:buildingID,
        value: buildingValue,
        numberOfApartments: numberOfApartments,
        rentCost: rentCost,
    }
    let officeBuilding = {
        type:'office',
        id:buildingID,
        value: buildingValue,
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
    } else if(type === 'office') {
        fetch('http://localhost:3000/addBuilding', {
            method: 'PUT',
            body: JSON.stringify(officeBuilding),
            headers: {
                'content-type': 'application/json'
            }
        }).then((e) =>{
            if (e.status === 200){
                document.getElementById('res').innerHTML = "Added."
            } else {
                document.getElementById('res').innerHTML = "Error."
            }
        })
        officeBuilding = {}
    }




}
/*
            


 */