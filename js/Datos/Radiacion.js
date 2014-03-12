Datos.CargarRadiacion = function ()
{
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/GetRadiacionActual';
    //Params.dataType = 'json';
    Params.success = function (res)
    {
        var data = $.parseJSON(res.responseText);
        for (var i in data.GetRadiacionActualResult.RootResults)
        {
            var medicion = data.GetRadiacionActualResult.RootResults[i];
            Datos.MostrarLayer("Radiación");
            Datos.MostrarDato("Radiación", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-07 Sombra Medicion">' + medicion.DatoMinimo + '</div>')
        }
    }
    $.ajax(Params);
};
