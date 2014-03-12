Datos.CargarDatosHistoricos = function ()
{
    if (Datos.EstacionSeleccionada != null)
    {
        var fecha = new Date();
        var cuarto;
        if (fecha.getMinutes() >= 8 && fecha.getMinutes() <= 22)
        {
            cuarto = '15';
        }
        else if (fecha.getMinutes() >= 23 && fecha.getMinutes() <= 37)
        {
            cuarto = '30';
        }
        else if (fecha.getMinutes() >= 38 && fecha.getMinutes() <= 52)
        {
            cuarto = '45';
        }
        else if ((fecha.getMinutes() >= 53 && fecha.getMinutes() <= 59) || (fecha.getMinutes() >= 0 && fecha.getMinutes() <= 7))
        {
            cuarto = '00';
        }

        var mesActual;
        var diaActual;
        var horaActual;
        var mesAnterior;
        var diaAyer;

        //Calcular el mes actual
        if ((fecha.getMonth() + 1) < 10)
        {
            mesActual = '0' + (fecha.getMonth() + 1);
        }
        else
        {
            mesActual = (fecha.getMonth() + 1);
        }
        //Calcular el dia actual
        if (fecha.getDate() < 10)
        {
            diaActual = '0' + fecha.getDate();
        }
        else
        {
            diaActual = fecha.getDate();
        }
        //Calcular la hora actual
        if (fecha.getHours() < 10)
        {
            horaActual = '0' + fecha.getHours();
        }
        else
        {
            horaActual = fecha.getHours();
        }

        var ayer = new Date();
        ayer.setDate(ayer.getDate() - 15);
        if ((ayer.getMonth() + 1) < 10)
        {
            mesAnterior = '0' + (ayer.getMonth() + 1);
        }
        else
        {
            mesAnterior = (ayer.getMonth() + 1);
        }
        //Calcular dia de ayer
        if (ayer.getDay() < 1)
        {
            diaAyer = '0' + ayer.getDate();
        }
        else
        {
            diaAyer = ayer.getDate();
        }

        var fechaInicio = fecha.getFullYear() + '-' + mesActual + '-' + diaActual + 'T' + horaActual + '%3a' + cuarto + '%3a00';
        var fechaFinal = ayer.getFullYear() + '-' + mesAnterior + '-' + diaAyer + 'T' + horaActual + '%3a' + cuarto + '%3a00';

        var informacion = [];
        var Params = {};
        Params.type = 'GET';
        //Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/ObtenerDatosHistoricosDeEstacion?numEstacion=41536&fechaInicial=2013-09-11T15%3a30%3a00&fechaFinal=2014-02-10T15%3a30%3a00';
        //Params.url = 'http://www.climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/JSON/GetActuales';
        Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/ObtenerDatosHistoricosDeEstacion?numEstacion=' + Datos.EstacionSeleccionada.Numero + '&fechaInicial=' + fechaFinal + '&fechaFinal=' + fechaInicio;
        //Params.dataType = 'json';
        Params.success = function (res)
        {
            if (res.responseText != "")
            {
                $("#DatosHistoricosBody").empty();
                var data = $.parseJSON(res.responseText);
                for (var i in data.ObtenerDatosHistoricosDeEstacionResult.RootResults)
                {
                    var historico = data.ObtenerDatosHistoricosDeEstacionResult.RootResults[i];
                    var f = new Date(parseInt(historico.Fecha.substr(6)));
                    var fila = "<tr>" +
                                   "<td>" +
                                       f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear() +
                                   "</td>" +
                                   "<td>" +
                                       historico.MaxTemp +
                                   "</td>" +
                                   "<td>" +
                                       historico.MinTemp +
                                   "</td>" +
                                   "<td>" +
                                       historico.AvgTemp +
                                   "</td>" +
                                   "<td>" +
                                       historico.AvgPuntoDeRocio +
                                   "</td>" +
                                   "<td>" +
                                       historico.MaxHumedadRelativa +
                                   "</td>" +
                                   "<td>" +
                                       historico.MinHumedadRelativa +
                                   "</td>" +
                                   "<td>" +
                                       historico.AvgHumedadRelativa +
                                   "</td>" +
                                   "<td>" +
                                       historico.Precipitacion +
                                   "</td>" +
                                   "<td>" +
                                       historico.AvgDireccionDelViento +
                                   "</td>" +
                                   "<td>" +
                                       historico.AvgVelocidadDelViento +
                                   "</td>" +
                                   "<td>" +
                                       historico.MaxVelocidadDelViento +
                                   "</td>" +
                                   "<td>" +
                                       historico.RadiacionGlobal +
                                   "</td>" +
                                   "<td>" +
                                       historico.ETo +
                                   "</td>" +
                               "</tr>";
                    $("#DatosHistoricosBody").append(fila);
                }
            }
        }
        $.ajax(Params);
    }
};