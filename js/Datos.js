var Datos = {

    estacionesSelectId: "estacionesSelect",

    Estaciones: {},

    EstacionSeleccionada: null,

    Eventos: null,

    EventosMapa: {
        Pin_Click: function (pin) {
            //Cacha el Click por cada pin
            Datos.SeleccionarPin(pin);
        }
    },

    SeleccionarPin: function (pin) {
        //analiza los datos del pin y manda a seleccionar la estación
        Datos.SeleccionarEstacion($(pin._htmlContent).attr('id').replace('estacion', ''));
    },

    SeleccionarEstacion: function (estacionNumero) {
        var estacion = Datos.Estaciones[estacionNumero];
        if (Datos.EstacionSeleccionada != estacion) {
            Datos.EstacionSeleccionada = estacion;
            //Selecciona en el Select la estación correspondiente (por si fue seleccionada en el mapa)
            if ($("#" + Datos.estacionesSelectId).val() != estacion.Numero) {
                $("#" + Datos.estacionesSelectId + " option").removeAttr("selected");
                $("#" + Datos.estacionesSelectId + " option[value=" + estacionNumero + "]").attr("selected", "selected");
            }
            Datos.Eventos.EstacionSeleccionada(estacion);
        }
    },

    CargarEstaciones: function () {
        Datos.Limpiar();
        var Params = {};
        Params.type = 'GET';
        Params.url = 'http://www.climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetEstaciones';
        //Params.dataType = 'json';
        Params.success = function (res) {
            var data = $.parseJSON(res.responseText);
            var esPrimera = true;//para selecionar la primera estacion
            for (var i in data.GetEstacionesResult.RootResults) {
                var estacion = data.GetEstacionesResult.RootResults[i];
                Datos.Estaciones[estacion.Numero] = estacion;
                var htmlContent = '<div id="estacion' + estacion.Numero + '" class="punto" style="background-color:' + estacion.ColorDistintivo + ';">';
                var pin = Mapa.AgregarPin(htmlContent, estacion.Latitud, estacion.Longitud);
                /*Llenar el select*/
                if (esPrimera == true) {
                    $("#" + Datos.estacionesSelectId).append('<option value="' + estacion.Numero + '" selected="selected">' + estacion.Nombre + '</option>');
                }
                else {
                    $("#" + Datos.estacionesSelectId).append('<option value="' + estacion.Numero + '">' + estacion.Nombre + '</option>');
                }
                $("#" + Datos.estacionesSelectId).change(function () {
                    Datos.SeleccionarEstacion($(this).val());
                });
                if (esPrimera == true) {
                    esPrimera = false;
                }
            }

            //Sort listbox after population with JSON result.
            var elementId = Datos.estacionesSelectId;
            // Convert the listbox options to a javascript array and sort (ascending)
            var sortedList = $.makeArray($("#" + elementId + " option")).sort(function (a, b) { return $(a).text() < $(b).text() ? -1 : 1; });
            // Clear the options and add the sorted ones
            $("#" + elementId).empty().html(sortedList);

            Datos.Eventos.EstacionesListas();
        };
        $.ajax(Params);
    },

    Limpiar: function () {
        $.each(Datos.Estaciones, function (index, value) {
            $("#M" + value.Numero).empty();
        });
    },

    MostrarDato: function (layer, estacion, htmlContent) {
        Mapa.AgregarPinEnLayer(Mapa.layers[layer], htmlContent, estacion.Latitud, estacion.Longitud);
    },

    MostrarLayer: function (layer) {
        var l = Mapa.ObtenerLayer(layer);
        Mapa.OcultarLayers();
        Mapa.setLayerVisible(Mapa.layers[layer], true);
    },

    MostrarFechaDeMedicion: function () {
        var Params = {};
        Params.type = 'GET';
        Params.url = 'http://www.climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/FechaUltimaMedicion';
        Params.success = function (res) {
            $("#FechaActualizacion").empty();
            if (res.responseText == '') return;
            var data = $.parseJSON(res.responseText);
            for (var i in data.GetActualesResult.RootResults) {
                var fecha = data.GetActualesResult.RootResults[i];
                $("#FechaActualizacion").append(fecha);

            }
        }
        $.ajax(Params);
    },

    CargarInfo: null,
    CargarCondicionesActuales: null,
    CargarTemperatura: null,
    CargarPrecipitacion: null,
    CargarViento: null,
    CargarHumedadRelativa: null,
    CargarPuntoDeRocio: null,
    CargarGraficas: null,
    CargarObservaciones: null,
    CargarRadiacion: null,
    CargarSateliteNacional: null,
    CargarIR4: null,
    CargarRadar: null
}