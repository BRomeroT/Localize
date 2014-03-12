Datos.CargarPuntoDeRocio = function ()
{
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://www.climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetPuntoRocioActual';
    //Params.dataType = 'json';
    Params.success = function (res)
    {
        var data = $.parseJSON(res.responseText);
        for (var i in data.GetPuntoRocioActualResult.RootResults)
        {
            var medicion = data.GetPuntoRocioActualResult.RootResults[i];
            Datos.MostrarLayer("PuntoDeRocio");
            Datos.MostrarDato("PuntoDeRocio", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-06 Sombra Medicion">' + medicion.DatoMinimo + '</div>')
        }
    }
    $.ajax(Params);
};