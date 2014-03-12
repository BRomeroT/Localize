Datos.CargarViento = function ()
{
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://www.climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetActuales';
    //Params.dataType = 'json';
    Params.success = function (res)
    {
        var data = $.parseJSON(res.responseText);
        for (var i in data.GetActualesResult.RootResults)
        {
            var medicion = data.GetActualesResult.RootResults[i];
            Datos.MostrarLayer("Viento");
            Datos.MostrarDato("Viento", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-04 Sombra Medicion">' + medicion.VelocidadVientoActual + '</div>')
        }
    }
    $.ajax(Params);
};
Datos.CargarDireccionViento = function ()
{
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetVientoDireccion';
    //Params.dataType = 'json';
    Params.success = function (res)
    {
        var data = $.parseJSON(res.responseText);
        for (var i in data.GetVientoDireccionResult.RootResults)
        {
            var medicion = data.GetVientoDireccionResult.RootResults[i];
            Datos.MostrarLayer("DireccionViento");
            Datos.MostrarDato("DireccionViento", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-04 Sombra Medicion">' + medicion.DatoMinimo + '<img src="img/direccion.png" alt="Dirección del viento" style="transform: rotate(' + medicion.DatoMaximo + 'deg);-ms-transform: rotate(' + medicion.DatoMaximo + 'deg);-webkit-transform: rotate(' + medicion.DatoMaximo + 'deg);"></div>')
        }
    }
    $.ajax(Params);
};