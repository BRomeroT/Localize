Datos.CargarTemperaturaActual = function ()
{
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetActuales';
    //Params.dataType = 'json';
    //Params.timeout = 20000;
    Params.success = function (res)
    {
        var data = $.parseJSON(res.responseText);
        for (var i in data.GetActualesResult.RootResults)
        {
            var medicion = data.GetActualesResult.RootResults[i];
            if (medicion.TemperaturaActual != null && medicion.TemperaturaActual != null)
            {
                Datos.MostrarLayer("TemperaturaActual");
                Datos.MostrarDato("TemperaturaActual", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-02 Sombra Medicion"><span style="color:#fff !important; text-align:center;">' + medicion.TemperaturaActual + '</span></div>');
            }
        }
    }
    $.ajax(Params);
};
Datos.CargarTemperaturaMaximaHoy = function ()
{
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://www.climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetTemperaturaMaxMinHoy';
    //Params.dataType = 'json';
    //Params.timeout = 20000;
    Params.success = function (res)
    {
        var data = $.parseJSON(res.responseText);
        for (var i in data.GetTemperaturaMaxMinHoyResult.RootResults)
        {
            var medicion = data.GetTemperaturaMaxMinHoyResult.RootResults[i];
            if (medicion.DatoMaximo != null && medicion.DatoMinimo != null)
            {
                Datos.MostrarLayer("TemperaturaMaxima");
                Datos.MostrarDato("TemperaturaMaxima", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-02 Sombra Medicion"><span style="color:#fff !important; text-align:center;">' + medicion.DatoMaximo + '</span></div>');
            }
        }
    }
    $.ajax(Params);
};
Datos.CargarTemperaturaMinimaHoy = function ()
{
    var Params = {};
    Params.type = 'GET';
    Params.url = 'http://www.climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetTemperaturaMaxMinHoy';
    //Params.dataType = 'json';
    //Params.timeout = 20000;
    Params.success = function (res)
    {
        var data = $.parseJSON(res.responseText);
        for (var i in data.GetTemperaturaMaxMinHoyResult.RootResults)
        {
            var medicion = data.GetTemperaturaMaxMinHoyResult.RootResults[i];
            if (medicion.DatoMaximo != null && medicion.DatoMinimo != null)
            {
                Datos.MostrarLayer("TemperaturaMinima");
                Datos.MostrarDato("TemperaturaMinima", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-02 Sombra Medicion"><span style="color:#fff !important; text-align:center;">' + medicion.DatoMinimo + '</span></div>');
            }
        }
    }
    $.ajax(Params);
};
Datos.CargarTemperaturaMaxMin = function () {
    var xhr = new XMLHttpRequest();
    var onLoaderHandler = function (event) {
        var data = $.parseJSON(event.target.responseText);
        for (var i in data.GetTemperaturaMaxMinAyerResult.RootResults) {
            var medicion = data.GetTemperaturaMaxMinAyerResult.RootResults[i];
            if (medicion.DatoMaximo != null && medicion.DatoMinimo != null) {
                Datos.MostrarLayer("TemperaturaMaxMin");
                Datos.MostrarDato("TemperaturaMaxMin", Datos.Estaciones[medicion.Numero], '<div class="Tile-Redondeado-5 degradado-02 Sombra Medicion>' + '<span style="color:#ff1300 !important; text-align:center;">' + medicion.DatoMaximo + '</span>, ' + '<span style="color:#007aff !important; text-align:center;">' + medicion.DatoMinimo + '</span>' + '</div>');
            }
        }
    }
    xhr.open('GET', 'http://www.climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetTemperaturaMaxMinAyer');
    xhr.withCredentials = false;
    xhr.onload = onLoaderHandler;
    xhr.send();
}