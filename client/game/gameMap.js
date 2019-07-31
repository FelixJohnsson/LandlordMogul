function renderMap() {
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
            targetPropertyLocation = e.lngLat;
            targetPropertyValue = e.features[0].properties.value

            map.flyTo({
                center: [
                    targetPropertyLocation.lng,
                    targetPropertyLocation.lat
                ],
                zoom: 18,
                pitch: 75
            });
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(e.features[0].properties.value + '€' + '<hr>' + '<button onclick="buy()">Buy</button>')
                .addTo(map);
        });

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
            document.getElementById('workplace').innerHTML = e.work;
            document.getElementById('titel').innerHTML = e.occupation;
        }
    }) 
    
}



function flyToTarget() {
    map.flyTo({
        center: [
            targetPropertyLocation.lng,
            targetPropertyLocation.lat
        ],
        zoom: 19,
        pitch: 60
    });
}

