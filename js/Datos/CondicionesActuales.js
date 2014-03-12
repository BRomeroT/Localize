Datos.CargarInfo = function (estacion) {
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://www.climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetActuales?$where=(it.Numero%253d%253d' + estacion.Numero + ')';
    //Params.dataType = 'json';
    var mostrarMedicion = function (idInfo, idLiveTile, htmlContent) {
        $("#" + idInfo).empty();
        $("#" + idInfo).append(htmlContent);
        $("#" + idLiveTile).append(htmlContent + '<br />' + estacion.Nombre);
    }
    mostrarMedicion("areaTemperatura", 'NA');
    mostrarMedicion("Humedad", 'NA');
    mostrarMedicion("Viento", 'NA');
    mostrarMedicion("PuntoDeRocio", 'NA');
    mostrarMedicion("Lluvia", 'NA');
    mostrarMedicion("Lluvia", 'NA');

    $('#CondicionesActualesTileInfo').empty();
    $('#TemperaturaActualTileInfo').empty();
    $('#HumedadTileInfo').empty();
    $('#VientoActualTileInfo').empty();
    $('#PuntoDeRocioTileInfo').empty();
    $('#PrecipitacionTileInfo').empty();
    $('#RadiacionTileInfo').empty();

    Params.success = function (res) {
        var data = $.parseJSON(res.responseText);
        for (var i in data.GetActualesResult.RootResults) {
            var medicion = data.GetActualesResult.RootResults[i];
            mostrarMedicion("areaTemperatura", "TemperaturaActualTileInfo", medicion.TemperaturaActual.toFixed(2) + ' °C');
            $("#CondicionesActualesTileInfo").append(medicion.TemperaturaActual.toFixed(2) + ' °C' + '<br />' + estacion.Nombre);
            mostrarMedicion("Humedad", "HumedadTileInfo", medicion.HumesdadRelativaActual.toFixed(2) + ' %');
            mostrarMedicion("Viento", "VientoActualTileInfo", medicion.DireccionVientoActual + ' ' + medicion.VelocidadVientoActual.toFixed(2) + ' km/h');
            mostrarMedicion("PuntoDeRocio", "PuntoDeRocioTileInfo", medicion.PuntoDeRocioActual.toFixed(2) + ' °C');
            mostrarMedicion("Lluvia", "PrecipitacionTileInfo", medicion.PrecipitacionActual.toFixed(2) + ' mm');
        }
        var mostrarRadiacion = function () {
            var Params = {};
            Params.type = 'GET';
            Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/GetRadiacionActual';
            //Params.dataType = 'json';
            Params.success = function (res) {
                var data = $.parseJSON(res.responseText);
                for (var i in data.GetRadiacionActualResult.RootResults) {
                    var medicion = data.GetRadiacionActualResult.RootResults[i];
                    if (medicion.Numero == estacion.Numero) {
                        $('#RadiacionTileInfo').append(medicion.DatoMinimo.toFixed(2) + '<br />' + estacion.Nombre);
                    }
                }
            }
            $.ajax(Params);
        };
        mostrarRadiacion();
        Datos.MostrarFechaDeMedicion();
    }
    $.ajax(Params);
};

Datos.CargarCondicionesActuales = function () {
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://www.climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetActuales';
    //Params.dataType = 'json';
    Params.success = function (res) {
        var data = $.parseJSON(res.responseText);
        //TODO: Mapa.LimpiarLayer("DatosActuales");
        for (var i in data.GetActualesResult.RootResults) {
            var medicion = data.GetActualesResult.RootResults[i];
            Datos.MostrarLayer("DatosActuales");
            Datos.MostrarDato("DatosActuales", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-01 Sombra Medicion">' + medicion.TemperaturaActual + '</div>');
            //alert(medicion.Numero + " - " + medicion.TemperaturaActual);
        }
    }
    $.ajax(Params);
};

Datos.FechaUltimaMedicion = function ()
{
    $("#FechaMedicion").empty();
    $.getJSON("http://200.79.18.252:9000/Home/FechaUltimaMedicion", null, function (fecha)
    {
        //$('#Tiempo').val(tiempo);
        var f = new Date(parseInt(fecha.substr(6)));
        $("#FechaMedicion").html("<span>" + f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear() + "</span>");
    });
    //var Params = {};
    //Params.type = 'GET';
    //Params.url = 'http://www.climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/FechaUltimaMedicion';
    //Params.url = 'http://200.79.18.252:9000/Home/FechaUltimaMedicion';
    //Params.dataType = 'json';
    //Params.success = function (res)
    //{
        //$("#FechaActualizacion").empty();
    //    if (res.responseText != "")
    //    {
    //        var fecha = new Date(parseInt(res.responseText.substr(6)));
    //        $("#FechaMedicion").html("<span>" + fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + "</span>");
    //    }

        //var data = $.parseJSON(res.responseText);
        //for (var i in data.GetActualesResult.RootResults)
        //{
        //    var fecha = data.GetActualesResult.RootResults[i];
        //    $("#FechaActualizacion").append(fecha);
        //}
    //}
    //Params.error = function() {
    //    $("#FechaMedicion").text("error");
    //}
    //$.ajax(Params);
};