var Mapa = {
    mapaElement: null, mapaElementId: "", Eventos: null, Inicializado: false, layers: {},

    Inicializar: function (mapaElementId, Eventos, inicializado, error) {
        this.mapaElementId = mapaElementId;
        this.Eventos = Eventos;
        try {
            this.mapaElement = new Microsoft.Maps.Map(document.getElementById(mapaElementId),
                            {
                                credentials: "Al9zPH654c2ilovwyubEWKEKfK0Z3q_lFHBf-OIsNRHtv49Pf0cuE3m9pVT3hImU",
                                mapTypeId: Microsoft.Maps.MapTypeId.road,
                                center: new Microsoft.Maps.Location(19.040899, -98.138100),
                                zoom: 8,
                                enableSearchLogo: false,
                                showMapTypeSelector: false,
                                enableClickableLogo: false
                            })
            this.Inicializado = true;
            if (inicializado != 'undefined') inicializado();
        } catch (e) {
            this.Inicializado = false;
            if (error != 'undefined') error(e);
        }
    },

    ObtenerLayer: function (nombre) {
        var layer = this.layers[nombre];
        if (layer == null) {
            var layer = new Microsoft.Maps.EntityCollection();
            this.mapaElement.entities.push(layer);
            this.layers[nombre] = layer;
        }
        return layer;
    },

    setLayerVisible:function(layer, visible){
        layer.setOptions({ visible: visible });
    },

    OcultarLayers:function(){
        for (var l in this.layers) {
            this.setLayerVisible(Mapa.layers[l], false);
        }
    },

    AgregarPinEnLayer: function (layer ,html, latitud, longitud) {
        var pos = new Microsoft.Maps.Location(latitud, longitud)
        var pin = new Microsoft.Maps.Pushpin(pos, { htmlContent: html });
        layer.push(pin);
        Microsoft.Maps.Events.addHandler(pin, 'click', function (e) {
            if (Mapa.Eventos != null && Mapa.Eventos.Pin_Click != 'undefined') Mapa.Eventos.Pin_Click(e.target);
        });
        return pin;
    },

    AgregarPin: function (html, latitud, longitud) {
        return this.AgregarPinEnLayer(this.mapaElement.entities, html, latitud, longitud);
    },

    LimpiarDatos: function () {
        //TODO: quitar los Pins del mapa
        this.mapaElement.entities.clear();
        //for (var i = Mapa.mapaElement.entities.getLength() - 1; i >= 0; i--)
        //{
        //    var pushpin = Mapa.mapaElement.entities.get(i);
        //    if (pushpin instanceof Microsoft.Maps.Pushpin)
        //    {
        //        Mapa.mapaElement.entities.removeAt(i);
        //    };
        //}
    }
};