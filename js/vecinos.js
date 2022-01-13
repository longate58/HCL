var vecinos = L.geoJson(vecinos,{
  onEachFeature: function(feature, layer){
    layer.bindPopup(feature.properties["nombre"] + '<br>'+ '(' + feature.properties["direccion"] + ')')
  }
}).addTo(map); 