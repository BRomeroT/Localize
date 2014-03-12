Datos.CargarGraficaTemperatura = function ()
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
        if((fecha.getMonth() + 1) < 10)
        {
            mesActual = '0' + (fecha.getMonth() + 1);
        }
        else
        {
            mesActual = (fecha.getMonth() + 1);
        }
        //Calcular el dia actual
        if(fecha.getDate() < 10)
        {
            diaActual = '0' + fecha.getDate();
        }
        else
        {
            diaActual = fecha.getDate();
        }
        //Calcular la hora actual
        if(fecha.getHours() < 10)
        {
            horaActual = '0' + fecha.getHours();
        }
        else
        {
            horaActual = fecha.getHours();
        }
       
        var ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        //Calcular el mes actual
        if((ayer.getMonth()+1) < 10)
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
        Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/ObtenerGraficaTemperatura?numEstacion=' + Datos.EstacionSeleccionada.Numero + '&inicio=' + fechaFinal + '&fin=' + fechaInicio;
        //Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/ObtenerGraficaTemperatura?numEstacion=27788&inicio=2014-02-10T08%3a00%3a00&fin=2014-02-10T12%3a00%3a00';
        //Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/ObtenerGraficaTemperatura?numEstacion=41536' + '&inicio=' + fechaInicio + '&fin=' + fechaFinal;
        //Params.dataType = 'json';
        Params.success = function (res)
        {
            if (res.responseText != "" && res.responseText != null)
            {
                var cont = 0;
                var data = $.parseJSON(res.responseText);
                for (var i in data.ObtenerGraficaTemperaturaResult.RootResults)
                {
                    cont++;
                    var punto = data.ObtenerGraficaTemperaturaResult.RootResults[i];
                    var fecha = new Date(parseInt(punto.Fecha.substr(6)));
                    var h;
                    var m;
                    if (punto.Hora.length == 4)
                    {
                        //PT8H <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 1);
                        m = "00";
                    }
                    else if (punto.Hora.length == 7)
                    {
                        //PT8H15M <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 1);
                        m = punto.Hora.substr(4, 2);
                    }
                    else if (punto.Hora.length == 5)
                    {
                        //PT10H <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 2);
                        m = "00";
                    }
                    else if (punto.Hora.length == 8)
                    {
                        //PT10H <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 2);
                        m = punto.Hora.substr(5, 2);
                    }
                    var f = h + ":" + m;
                    var v = punto.Dato;
                    informacion.push({'fecha': f, 'valor': v});
                }
                $("#GraficaTemperatura").width(cont * 18);
                $("#GraficaTemperatura").kendoChart(
                {
                    theme: "metro",
                    dataSource:
                    {
                        data: informacion
                    },
                    legend:
                    {
                        visible: false
                    },
                    title:
                    {
                        text: "Temperatura"
                    },
                    seriesDefaults:
                    {
                        type: "area",
                        area:
                        {
                            line:
                            {
                                style: "smooth"
                            }
                        }
                    },
                    valueAxis:
                    {
                        labels:
                        {
                            format: "{0} °C"
                        },
                        line:
                        {
                            visible: false
                        },
                        axisCrossingValue: -10
                    },
                    tooltip:
                    {
                        visible: true,
                        format: "{0} °C",
                        template: "#= series.name #: #= value #"
                    },
                    series:
                        [{
                            field: "valor",
                            name: "Temperatura",
                            color: "#ff3b30"
                        }],
                    categoryAxis:
                    {
                        field: "fecha",
                        labels:
                        {
                            rotation: -90
                        },
                        majorGridLines:
                        {
                            visible: false
                        }
                    }
                });
            }
        }
        $.ajax(Params);
    }
};
Datos.CargarGraficaViento = function ()
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
        ayer.setDate(ayer.getDate() - 1);
        //Calcular el mes actual
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
        Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/ObtenerGraficaVientos?numEstacion=' + Datos.EstacionSeleccionada.Numero + '&inicio=' + fechaFinal + '&fin=' + fechaInicio;
        //Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/ObtenerGraficaVientos?numEstacion=27788&inicio=2014-02-10T08%3a00%3a00&fin=2014-02-10T12%3a00%3a00';
        //Params.dataType = 'json';
        Params.success = function (res)
        {
            if (res.responseText != "" && res.responseText != null)
            {
                var cont = 0;
                var data = $.parseJSON(res.responseText);
                for (var i in data.ObtenerGraficaVientosResult.RootResults)
                {
                    cont++;
                    var punto = data.ObtenerGraficaVientosResult.RootResults[i];
                    var fecha = new Date(parseInt(punto.Fecha.substr(6)));
                    var h;
                    var m;
                    if (punto.Hora.length == 4)
                    {
                        //PT8H <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 1);
                        m = "00";
                    }
                    else if (punto.Hora.length == 7)
                    {
                        //PT8H15M <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 1);
                        m = punto.Hora.substr(4, 2);
                    }
                    else if (punto.Hora.length == 5)
                    {
                        //PT10H <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 2);
                        m = "00";
                    }
                    else if (punto.Hora.length == 8)
                    {
                        //PT10H <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 2);
                        m = punto.Hora.substr(5, 2);
                    }
                    var f = h + ":" + m;
                    var v = punto.Dato;
                    informacion.push({ 'fecha': f, 'valor': v });
                }
                $("#GraficaViento").width(cont * 18);
                $("#GraficaViento").kendoChart(
                {
                    theme: "metro",
                    dataSource:
                    {
                        data: informacion
                    },
                    legend:
                    {
                        visible: false
                    },
                    title:
                    {
                        text: "Velocidad del viento"
                    },
                    seriesDefaults:
                    {
                        type: "area",
                        area:
                        {
                            line:
                            {
                                style: "smooth"
                            }
                        }
                    },
                    valueAxis:
                    {
                        labels:
                        {
                            format: "{0} km/hr"
                        },
                        line:
                        {
                            visible: false
                        },
                        axisCrossingValue: -10
                    },
                    tooltip:
                    {
                        visible: true,
                        format: "{0} km/hr",
                        template: "#= series.name #: #= value #"
                    },
                    series:
                        [{
                            field: "valor",
                            name: "Velocidad del viento",
                            color: "#ff9500"
                        }],
                    categoryAxis:
                    {
                        field: "fecha",
                        labels:
                        {
                            rotation: -90
                        },
                        majorGridLines:
                        {
                            visible: false
                        }
                    }
                });
            }
        }
        $.ajax(Params);
    }
};
Datos.CargarGraficaPrecipitacion = function ()
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
        ayer.setDate(ayer.getDate() - 1);
        //Calcular el mes actual
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
        Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/ObtenerGraficaPrecipitaciones?numEstacion=' + Datos.EstacionSeleccionada.Numero + '&inicio=' + fechaFinal + '&fin=' + fechaInicio;
        //Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/ObtenerGraficaPrecipitaciones?numEstacion=27788&inicio=2014-02-10T08%3a00%3a00&fin=2014-02-11T07%3a46%3a00';
        //Params.dataType = 'json';
        Params.success = function (res)
        {
            if (res.responseText != "" && res.responseText != null)
            {
                var cont = 0;
                var data = $.parseJSON(res.responseText);
                for (var i in data.ObtenerGraficaPrecipitacionesResult.RootResults)
                {
                    cont++;
                    var punto = data.ObtenerGraficaPrecipitacionesResult.RootResults[i];
                    var fecha = new Date(parseInt(punto.Fecha.substr(6)));
                    var h;
                    var m;
                    if (punto.Hora.length == 4)
                    {
                        //PT8H <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 1);
                        m = "00";
                    }
                    else if (punto.Hora.length == 7)
                    {
                        //PT8H15M <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 1);
                        m = punto.Hora.substr(4, 2);
                    }
                    else if (punto.Hora.length == 5)
                    {
                        //PT10H <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 2);
                        m = "00";
                    }
                    else if (punto.Hora.length == 8)
                    {
                        //PT10H <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 2);
                        m = punto.Hora.substr(5, 2);
                    }
                    var f = h + ":" + m;
                    var v = punto.Dato;
                    informacion.push({ 'fecha': f, 'valor': v });
                }
                $("#GraficaPrecipitacion").width(cont * 18);
                $("#GraficaPrecipitacion").kendoChart(
                {
                    theme: "metro",
                    dataSource:
                    {
                        data: informacion
                    },
                    legend:
                    {
                        visible: false
                    },
                    title:
                    {
                        text: "Precipitación"
                    },
                    seriesDefaults:
                    {
                        type: "area",
                        area:
                        {
                            line:
                            {
                                style: "smooth"
                            }
                        }
                    },
                    valueAxis:
                    {
                        labels:
                        {
                            format: "{0} mm"
                        },
                        line:
                        {
                            visible: false
                        },
                        axisCrossingValue: -10
                    },
                    tooltip:
                    {
                        visible: true,
                        format: "{0} mm",
                        template: "#= series.name #: #= value #"
                    },
                    series:
                        [{
                            field: "valor",
                            name: "Precipitación",
                            color: "#ffcc00"
                        }],
                    categoryAxis:
                    {
                        field: "fecha",
                        labels:
                        {
                            rotation: -90
                        },
                        majorGridLines:
                        {
                            visible: false
                        }
                    }
                });
            }
        }
        $.ajax(Params);
    }
};
Datos.CargarGraficaRadiacion = function ()
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
        ayer.setDate(ayer.getDate() - 1);
        //Calcular el mes actual
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
        Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/ObtenerGraficaRadiacion?numEstacion=' + Datos.EstacionSeleccionada.Numero + '&inicio=' + fechaFinal + '&fin=' + fechaInicio;
        //Params.url = 'http://climapuebla.org.mx/ClientBin/Sysne-Clima-Portal-Svr-RIAService.svc/json/ObtenerGraficaRadiacion?numEstacion=27788&inicio=2014-02-10T08%3a00%3a00&fin=2014-02-10T12%3a00%3a00';
        //Params.dataType = 'json';
        Params.success = function (res)
        {
            if (res.responseText != "" && res.responseText != null)
            {
                var cont = 0;
                var data = $.parseJSON(res.responseText);
                for (var i in data.ObtenerGraficaRadiacionResult.RootResults)
                {
                    cont++;
                    var punto = data.ObtenerGraficaRadiacionResult.RootResults[i];
                    var fecha = new Date(parseInt(punto.Fecha.substr(6)));
                    var h;
                    var m;
                    if (punto.Hora.length == 4)
                    {
                        //PT8H <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 1);
                        m = "00";
                    }
                    else if (punto.Hora.length == 7)
                    {
                        //PT8H15M <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 1);
                        m = punto.Hora.substr(4, 2);
                    }
                    else if (punto.Hora.length == 5)
                    {
                        //PT10H <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 2);
                        m = "00";
                    }
                    else if (punto.Hora.length == 8)
                    {
                        //PT10H <- Ejemplo del valor que se formatea
                        h = punto.Hora.substr(2, 2);
                        m = punto.Hora.substr(5, 2);
                    }
                    var f = h + ":" + m;
                    var v = punto.Dato;
                    informacion.push({ 'fecha': f, 'valor': v });
                }
                $("#GraficaRadiacion").width(cont * 18);
                $("#GraficaRadiacion").kendoChart(
                {
                    theme:"metro",
                    dataSource:
                    {
                        data: informacion
                    },
                    legend:
                    {
                        visible: false
                    },
                    title:
                    {
                        text: "Radiación"
                    },
                    seriesDefaults:
                    {
                        type: "area",
                        area:
                        {
                            line:
                            {
                                style: "smooth"
                            }
                        }
                    },
                    valueAxis:
                    {
                        labels:
                        {
                            format: "{0} W/m²"
                        },
                        line:
                        {
                            visible: false
                        },
                        axisCrossingValue: -10
                    },
                    tooltip:
                    {
                        visible: true,
                        format: "{0} W/m²",
                        template: "#= series.name #: #= value #"
                    },
                    series:
                        [{
                            field: "valor",
                            name: "Radiación",
                            color: "#4cd964"
                        }],
                    categoryAxis:
                    {
                        field: "fecha",
                        labels:
                        {
                            rotation: -90
                        },
                        majorGridLines:
                        {
                            visible: false
                        }
                    }
                });
            }
        }
        $.ajax(Params);
    }
};