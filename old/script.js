function launch() {
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
        map.addSource('owned-buildings', {
                type: 'geojson',
                data: {
                    "type": "FeatureCollection",
                    "features": [],
                }
            }),

        map.addLayer({
            'id': 'buildings',
            'type': 'fill-extrusion',
            'source': {
                'type': 'geojson',
                'data': 'https://api.myjson.com/bins/u2tql'
            },
            'paint': {
                'fill-extrusion-color': '#838991',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'base_height'],
                'fill-extrusion-opacity': 1
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

                showInfo();
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


function showInfo(){
    document.getElementById('owner').innerHTML = 'John Doe';
    document.getElementById('value').innerHTML = targetPropertyValue + '€';
    document.getElementById('soldDate').innerHTML = '27/04 2019';
    document.getElementById('type').innerHTML = 'Apartments';

    document.getElementById('class').innerHTML = 'C+';
    document.getElementById('streetClass').innerHTML = 'B-';
    document.getElementById('neighbourhoodClass').innerHTML = 'B+';
    document.getElementById('averageRent').innerHTML = '1,230€';
    document.getElementById('numberOfApartments').innerHTML = '6';
    document.getElementById('residents').innerHTML = '12';
    document.getElementById('energyClass').innerHTML = 'C-';
    document.getElementById('happiness').innerHTML = 'C+';
    document.getElementById('security').innerHTML = 'B-';

    document.getElementById('energyStatus').innerHTML = '[###--] B Class';
    document.getElementById('securityStatus').innerHTML = '[#----] E Class';
    document.getElementById('windowsStatus').innerHTML = '[##---] C Class';
    document.getElementById('roofStatus').innerHTML = '[##---] C Class';
    document.getElementById('insolationStatus').innerHTML = '[#####] A Class';
}

function buy() {
    let balance = document.getElementById('balance').innerHTML.split(',');

    if (Number(targetPropertyValue.split(' ').join('')) > Number(balance.join('').slice(0, -1))){
        document.getElementById('balance').style.color = "red"
        document.getElementById('balance').style.fontSize = "140%"
        setTimeout(() =>{
            document.getElementById('balance').style.color = "whitesmoke"
            document.getElementById('balance').style.fontSize = "100%"
        },1000)

    } else {
        document.getElementById('balance').innerHTML = Number(balance.join('').slice(0, -1)) - Number(targetPropertyValue.split(' ').join('')) + '€';

        let currentAmount = document.getElementById('propertiesCounter').innerHTML;
        currentAmount = Number(currentAmount);
        ++currentAmount

        document.getElementById('propertiesCounter').innerHTML = currentAmount;
        document.getElementById('dailyIncome').innerHTML = Math.floor((1230 * 6) / 7) * currentAmount + '€'; 
    }
    
}