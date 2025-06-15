const map = new maplibregl.Map({
    container: 'map', // id of the div
    style: 'https://tiles.openfreemap.org/styles/liberty', // style from OpenFreeMap
    center: coor, // Longitude, Latitude
    zoom: 9.5
});
console.log(coor);

// ✅ Add navigation controls (zoom in/out buttons)
map.addControl(new maplibregl.NavigationControl());

// ✅ Add marker
const marker = new maplibregl.Marker({ color: 'red' }) // you can customize color
    .setLngLat(coor)
    .addTo(map);

// ✅ Optional: Add popup to marker
const popup = new maplibregl.Popup({ offset: 25 })
    .setText('Yahan tumhara pyara location hai 💖');

marker.setPopup(popup); // bind popup to marker
