Datos.CargarPrecipitacion = function ()
{
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/GetPrecipitacionActual';
    
    //Params.dataType = 'json';
    Params.success = function (res)
    {
        var data = $.parseJSON(res.responseText);
        for (var i in data.GetPrecipitacionActualResult.RootResults)
        {
            var medicion = data.GetPrecipitacionActualResult.RootResults[i];
            Datos.MostrarLayer("PrecipitacionActual");
            Datos.MostrarDato("PrecipitacionActual", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-03 Sombra Medicion"><span style="color:#808080 !important;">' + medicion.DatoMinimo + '</span></div>')
        }
    }
    $.ajax(Params);
};
Datos.CargarPrecipitacionAcumulada1 = function ()
{
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetPrecipitacionAcumulada?horas=1';
    
    //Params.dataType = 'json';
    Params.success = function (res)
    {
        var data = $.parseJSON(res.responseText);
        for (var i in data.GetPrecipitacionAcumuladaResult.RootResults)
        {
            var medicion = data.GetPrecipitacionAcumuladaResult.RootResults[i];
            Datos.MostrarLayer("PrecipitacionAcumulada1");
            Datos.MostrarDato("PrecipitacionAcumulada1", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-03 Sombra Medicion"><span style="color:#808080 !important;">' + medicion.DatoMinimo + '</span></div>')
        }
    }
    $.ajax(Params);
};
Datos.CargarPrecipitacionAcumulada3 = function ()
{
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetPrecipitacionAcumulada?horas=3';

    //Params.dataType = 'json';
    Params.success = function (res)
    {
        var data = $.parseJSON(res.responseText);
        for (var i in data.GetPrecipitacionAcumuladaResult.RootResults)
        {
            var medicion = data.GetPrecipitacionAcumuladaResult.RootResults[i];
            Datos.MostrarLayer("PrecipitacionAcumulada3");
            Datos.MostrarDato("PrecipitacionAcumulada3", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-03 Sombra Medicion"><span style="color:#808080 !important;">' + medicion.DatoMinimo + '</span></div>')
        }
    }
    $.ajax(Params);
};
Datos.CargarPrecipitacionAcumulada6 = function ()
{
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetPrecipitacionAcumulada?horas=6';

    //Params.dataType = 'json';
    Params.success = function (res)
    {
        var data = $.parseJSON(res.responseText);
        for (var i in data.GetPrecipitacionAcumuladaResult.RootResults)
        {
            var medicion = data.GetPrecipitacionAcumuladaResult.RootResults[i];
            Datos.MostrarLayer("PrecipitacionAcumulada6");
            Datos.MostrarDato("PrecipitacionAcumulada6", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-03 Sombra Medicion"><span style="color:#808080 !important;">' + medicion.DatoMinimo + '</span></div>')
        }
    }
    $.ajax(Params);
};
Datos.CargarPrecipitacionAcumulada12 = function ()
{
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetPrecipitacionAcumulada?horas=12';

    //Params.dataType = 'json';
    Params.success = function (res)
    {
        var data = $.parseJSON(res.responseText);
        for (var i in data.GetPrecipitacionAcumuladaResult.RootResults)
        {
            var medicion = data.GetPrecipitacionAcumuladaResult.RootResults[i];
            Datos.MostrarLayer("PrecipitacionAcumulada12");
            Datos.MostrarDato("PrecipitacionAcumulada12", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-03 Sombra Medicion"><span style="color:#808080 !important;">' + medicion.DatoMinimo + '</span></div>')
        }
    }
    $.ajax(Params);
};
Datos.CargarPrecipitacionAcumulada24 = function ()
{
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetPrecipitacionAcumulada?horas=24';

    //Params.dataType = 'json';
    Params.success = function (res)
    {
        var data = $.parseJSON(res.responseText);
        for (var i in data.GetPrecipitacionAcumuladaResult.RootResults)
        {
            var medicion = data.GetPrecipitacionAcumuladaResult.RootResults[i];
            Datos.MostrarLayer("PrecipitacionAcumulada24");
            Datos.MostrarDato("PrecipitacionAcumulada24", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-03 Sombra Medicion"><span style="color:#808080 !important;">' + medicion.DatoMinimo + '</span></div>')
        }
    }
    $.ajax(Params);
};