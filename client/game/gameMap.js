function renderMap() {

    if (sessionStorage.getItem("id") === null) {
        window.location.replace('../login/login.html');
    }
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmVsaXhqb2huc3NvbiIsImEiOiJjanh0ZHIwd3kwcjhjM2Rvb2M3ZnVyMW5kIn0.Mdf_WJH-4npMZh3HNu-6wQ';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/felixjohnsson/cjxw8alzq06j71cnunhrfifmz',
        center: [crd.longitude, crd.latitude],
        zoom: 17,
        pitch: 50,
        interactive: true
    });

    map.on('load', function () {
        //LOAD CHARACTER
        const size = 100;

        const pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),

            onAdd: function () {
                const canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext('2d');
            },

            render: function () {
                const duration = 1000;
                const t = (performance.now() % duration) / duration;

                const radius = size / 2 * 0.3;
                const outerRadius = size / 2 * 0.7 * t + radius;
                const context = this.context;

                // draw outer circle
                context.clearRect(0, 0, this.width, this.height);
                context.beginPath();
                context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
                context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
                context.fill();

                // draw inner circle
                context.beginPath();
                context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
                context.fillStyle = 'rgba(222, 130, 102)';
                context.strokeStyle = 'white';
                context.lineWidth = 2 + 4 * (1 - t);
                context.fill();
                context.stroke();

                // update this image's data with data from the canvas
                this.data = context.getImageData(0, 0, this.width, this.height).data;

                // keep the map repainting
                map.triggerRepaint();

                // return `true` to let the map know that the image was updated
                return true;
            }
        };

        map.addImage('pulsing-dot', pulsingDot, {
            pixelRatio: 1
        });

        const geolocationData = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [crd.longitude, crd.latitude]
                }
            }]
        }

        map.addSource('geo-locationData', { type: 'geojson', data: geolocationData });
        map.addLayer({
            "id": "points",
            "type": "symbol",
            "source": "geo-locationData",
            "layout": {
                "icon-image": "pulsing-dot"
            }
        })
        

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
                'data': 'https://api.myjson.com/bins/z2nt9'
            },
            'paint': {
                'fill-extrusion-color': '#ada795',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'base_height'],
                'fill-extrusion-opacity': 1
            }
        });

        map.on('click', 'buildings', function (e) {
            targetPropertyLocation = e.lngLat;
            targetPropertyValue = e.features[0].properties.value

            /*map.flyTo({
                center: [
                    targetPropertyLocation.lng,
                    targetPropertyLocation.lat
                ],
                zoom: 18,
                pitch: 75
            });*/
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
            body: JSON.stringify({
                characterID
            }),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then((e) => {
            if (e === null) {
                document.getElementById('id').innerHTML = 'Error'
            } else {
                document.getElementById('name').innerHTML = e.firstname + ' ' + e.lastname;
                document.getElementById('workplace').innerHTML = e.work;
                document.getElementById('titel').innerHTML = e.occupation;
                document.getElementById('income').innerHTML = e.income + '€';
            }
        })

}
function updateCharLocation(crd){
    newGeolocationData = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [crd.longitude, crd.latitude]
            }
        }]
    }
    map.getSource('geo-locationData').setData(newGeolocationData);
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