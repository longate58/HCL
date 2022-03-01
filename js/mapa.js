// Crear la variable mapa con coordenadas de centro y zoom
let map = L.map('map').setView([10.4869, -66.5287], 14)

// Agregar mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Volar a coordenadas de los sitios de la Lista desplegable
document.getElementById('select-location').addEventListener('change', function(e){
    let coords = e.target.value.split(",");
    map.flyTo(coords,18);
})


// Agregar mapa base para el Mini Mapa
var carto_light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {attribution: '©OpenStreetMap, ©CartoDB',subdomains: 'abcd',maxZoom: 24});

// Agregar plugin MiniMap
var minimap = new L.Control.MiniMap(carto_light,
    {
        toggleDisplay: true,
        minimized: false,
        position: "bottomleft"
    }).addTo(map);

// Agregar escala
 new L.control.scale({imperial: false}).addTo(map);

// Configurar PopUp
function popup(feature,layer){
    if(feature.properties && feature.properties.BARRIO){
        layer.bindPopup("<strong>Barrio: </strong>" + feature.properties.BARRIO + "<br/>" + "<strong>Localidad: </strong>" + feature.properties.LOCALIDAD);
    }
}


// Agregar coordenadas para dibujar una polilinea
var coord_camino = [
    [10.488138000, -66.96250400], [10.488002800, -66.926213900], [10.487768800, -66.926210400], [10.487669100, -66.926311800], [10.487616900, -66.926451300]
];

var camino = L.polyline(coord_camino, {
    color: 'red'
}).addTo(map);

//----------------------- Agregar un marcador
var marker_cerro = L.circleMarker(L.latLng(10.494369700, -66.528557900), {
    radius: 6,
    fillColor: "#ff0000",
    color: "blue",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.6,
}).addTo(map);



//------------------------------ Agregar la leyenda
var populationLegend = L.control({position: 'bottomright'});
var populationChangeLegend = L.control({position: 'bottomright'});

populationLegend.onAdd = function (map) {
var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML +=
    '<img src="assets/leyenda.png" alt="legend" width="234" height="234">';
return div;
};

populationChangeLegend.onAdd = function (map) {
var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML +=
    '<img src="change_leyenda.png" alt="legend" width="234" height="234">';
return div;
};

// Add this one (only) for now, as the Population layer is on by default
populationLegend.addTo(map);

map.on('overlayadd', function (eventLayer) {
    // Switch to the Population legend...
    if (eventLayer.name === 'Population') {
        this.removeControl(populationChangeLegend);
        populationLegend.addTo(this);
    } else { // Or switch to the Population Change legend...
        this.removeControl(populationLegend);
        populationChangeLegend.addTo(this);
    }
});
//------------------------ Agregar control para ver los datos al pasar el puntero

var info = L.control();

// Crear un div con una clase info
info.onAdd = function(map){
    this._div = L.DomUtil.create('div','info');
    this.update();
    return this._div;
};

//-------------------------- Agregar el metodo que actualiza el control segun el puntero vaya pasando
info.update = function(props){
    this._div.innerHTML = '<h4>Total Viviendas por Consejo Comunal</h4>' + 
                            (props ? '<b>' + props.BARRIO + '</b><br/>' + props.TOT_VIVIEN + ' viviendas</sup>'
                            : 'Pase el puntero por un Consejo Comunal');
};

info.addTo(map);

// Generar rangos de colores de acuerdo con el atributo o campo TOT_VIVIEN
function getColor(d){
    return  d > 900 ? '#0D5795' :
            d > 750 ? '#137fd9' :
            d > 600 ? '#009846' :
            d > 450 ? '#A8E2B9' :
            d > 250 ? '#E5E006' :
            d > 100 ? '#FFB553' :
            d > 0    ? '#FEFA46' :
                       '#0000FF';
}

//-------------------- Crear la funcion para mostrar la simbologia de acuerdo al campo TOT_VIVIEN

function style(feature){
    return {
        fillColor: getColor(feature.properties.TOT_VIVIEN),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.4
    };
}

//------------------- AGregar interaccion del puntero con la capa para resaltar el objeto
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.5
    });

    info.update(layer.feature.properties);
}

// -----------------Configurar los cambios de resaltado y zoom de la capa

var barriosJS;

function resetHighlight(e){
    barriosJS.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e){
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer){
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}



// Agregar capa en formato GeoJson
barriosJS = L.geoJson(barrios,{
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);




//-------------AGREGAR UN MARCADOR-----------------------------------------
L.marker([10.4968300, -66.5304963]).addTo(map)
    .bindPopup('Comuna <br> C-MIX-2021-05-0009.')
    .openPopup();


 //l--------------ogo position: bottomright, topright, topleft, bottomleft
    var logo = L.control({position: 'topleft'});
    logo.onAdd = function(map){
        var div = L.DomUtil.create('div', 'myclass');
        div.innerHTML= "<img src='assets/logo.png'/ width='90' height='40'  >";
        return div;
    }
    logo.addTo(map);


// Agregar atribucion
map.attributionControl.addAttribution('Municipio Zamora, Miranda &copy; HCL Digital.EPS');