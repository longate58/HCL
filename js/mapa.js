//---------- Crear la variable mapa con coordenadas de centro y zoom
let map = L.map('map').setView([10.4739, -66.5087], 13)



//---------- Agregar mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Volar a coordenadas de los sitios de la Lista desplegable
document.getElementById('select-location').addEventListener('change', function(e){
    let coords = e.target.value.split(",");
    map.flyTo(coords,18);
})



//---------- Agregar mapa base para el Mini Mapa
var carto_light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {attribution: '©OpenStreetMap, ©CartoDB',subdomains: 'abcd',maxZoom: 50});



//---------- Agregar plugin MiniMap
var minimap = new L.Control.MiniMap(carto_light,
    {
        toggleDisplay: true,
        minimized: false,
        position: "bottomleft"
    }).addTo(map);



//---------- Agregar escala ----------
 new L.control.scale({imperial: false}).addTo(map);

// Configurar PopUp
function popup(feature,layer){
    if(feature.properties && feature.properties.BARRIO){
        layer.bindPopup("<strong>Barrio: </strong>" + feature.properties.BARRIO + "<br/>" + "<strong>TIPOCOMUNA: </strong>" + feature.properties.TIPOCOMUNA);
    }
}



//---------- Agregar coordenadas para dibujar una polilinea
var coord_camino = [
    [10.488138000, -66.46250400], [10.488002800, -66.426213900], [10.487768800, -66.426210400], [10.487669100, -66.426311800], [10.487616900, -66.426451300]
];

var camino = L.polyline(coord_camino, {
    color: 'red'
}).addTo(map);





//----------------------- Agregar un marcador
var marker_cerro = L.circleMarker(L.latLng(10.502369700, -66.518557900), {
    radius: 16,
    fillColor: "#ff0000",
    color: "blue",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.6,
}).addTo(map);




//------------------------ Agregar control para ver los datos al pasar el puntero

var info = L.control();



//---------- Crear un div con una clase info
info.onAdd = function(map){
    this._div = L.DomUtil.create('div','info');
    this.update();
    return this._div;
};


//-------------------------- Agregar el metodo que actualiza el control segun el puntero vaya pasando
info.update = function(props){
    this._div.innerHTML = '<h4>DATOS DEMOGRAFICOS</h4>' + 
                            '</b><br/>' +
                            (props ? '<b>' + props.BARRIO + '</b><br/>' + props.TOT_POB + ' Habitantes</sup>' + 
                             '</b><br/>' + props.VARONES + ' Masculino</sup>' + '</b><br/>' + props.HEMBRAS + ' Femenino</sup>' +
                             '</b><br/>' + '</b><br/>' + props.ELECTORES + ' Electores' 


                            : 'PASE EL PUNTERO POR LA POLGONAL');
};


info.addTo(map);


//---------- Generar rangos de colores de acuerdo con el atributo o campo TOT_POB
function getColor(d){
    return  d > 90000 ? '#E4EBF8' :
            d > 45000? '#E4EBF8' :
            d > 10000? '#E4EBF8' :
            d > 5000? '#86C1F2' :
            d > 1000 ? '#D79CDC' :
                       '#0000FF';
}

//-------------------- Crear la funcion para mostrar la simbologia de acuerdo al campo TOT_POB

function style(feature){
    return {
        fillColor: getColor(feature.properties.TOT_POB,),
        weight: 1,
        opacity: 1,
        color: 'BLUE',
        dashArray: '3',
        fillOpacity: 0.15
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



//---------- Agregar capa en formato GeoJson----------
barriosJS = L.geoJson(barrios,{
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);




//-------------AGREGAR UN MARCADOR-----------------------------------------
L.marker([10.4892115, -66.5154384]).addTo(map)
    .bindPopup('Poligonal <br> C-RUR-2018-11-0054.')
    .openPopup();
    L.marker([10.4597306, -66.4990616]).addTo(map)
    .bindPopup('Poligonal <br> C-RUR-2018-11-0054.')
    .openPopup();
 L.marker([10.4697198, -66.5188964]).addTo(map)
    .bindPopup('Poligonal <br> C-MIX-2018-11-0103.')
    .openPopup();
L.marker([10.4968300, -66.5304963]).addTo(map)
    .bindPopup('Poligonal <br> C-MIX-2021-05-0009.')
    .openPopup();

 //l--------------logo position: bottomright, topright, topleft, bottomleft
    var logo = L.control({position: 'topleft'});
    logo.onAdd = function(map){
        var div = L.DomUtil.create('div', 'myclass');
        div.innerHTML= "<img src='assets/logo.png'/ width='110' height='110'  >";
        return div;
    }
    logo.addTo(map);






// Agregar atribucion
map.attributionControl.addAttribution('Municipio Zamora, Miranda &copy; HCL Digital.UPF');