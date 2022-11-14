mapboxgl.accessToken = "pk.eyJ1Ijoia3lsZXVuZzF1dyIsImEiOiJjbGFmcWgyeXkxNHJoM3FxdDllNTdjMWdiIn0.SgZ2WhbKwf32LN0Z0Kj5Gw";

let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    zoom: 6.5, // starting zoom
    center: [-120.74, 47.75] // starting center
});

async function geojsonFetch() {
    let response, cities, washington, table;
    response = await fetch('assets/wa_cities.geojson');
    cities = await response.json();
    response = await fetch('assets/wa_state.geojson');
    washington = await response.json();

    //load data to the map as new layers and table on the side.
    map.on('load', function loadingData() {
        map.addSource('cities', {
            type: 'geojson',
            data: cities
        });

        map.addLayer({
            'id': 'cities-layer',
            'type': 'circle',
            'source': 'cities',
            'paint': {
                'circle-radius': 8,
                'circle-stroke-width': 2,
                'circle-color': 'red',
                'circle-stroke-color': 'white'
            }
        });

        map.addSource('washington', {
            type: 'geojson',
            data: washington
        });

        map.addLayer({
            'id': 'washington-layer',
            'type': 'fill',
            'source': 'washington',
            'paint': {
                'fill-color': '#0080ff', // blue color fill
                'fill-opacity': 0.5
            }
        });

    });

    table = document.getElementsByTagName("table")[0];
    let row, cell1, cell2, cell3;
    for (let i = 0; i < cities.features.length; i++) {
        // Create an empty <tr> element and add it to the 1st position of the table:
        row = table.insertRow(-1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);
        cell1.innerHTML = cities.features[i].properties.Name;
        cell2.innerHTML = cities.features[i].properties.Population;
        cell3.innerHTML = cities.features[i].properties.County;
    }
};

geojsonFetch();

let btn = document.querySelector("#side-panel button");

btn.addEventListener('click', sortTable);

// define the function to sort table
function sortTable(e) {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementsByTagName("table")[0];
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = parseFloat(rows[i].getElementsByTagName("td")[1].innerHTML);
            y = parseFloat(rows[i + 1].getElementsByTagName("td")[1].innerHTML);
            //check if the two rows should switch place:
            if (x < y) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}