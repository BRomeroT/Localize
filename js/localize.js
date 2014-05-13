var localize =
{
    areas: new Array(0),
    areaSeleccionada: 0,
    vehiculo: { "Index": "", "Unidad": "", "Area": "", "Etiqueta": "", "Tipo": "", "Estado": false, "Latitud": "", "Longitud": "", "Odometro": "", "OdometroTotal": "", "Velocidad": "", "Direccion": "" },
    vehiculos: new Array(0),
    vehiculosSeleccionados: new Array(0),
    dataLayerPosicionUsuario: null,
    dataLayerUnidades: null,
    grupo: null,
    map: null,
    key: "Ahgj7PSorJMVevySktdVDq4guqmFi4VSW2ZWai3hzuqk_2TwitxkTlPlDArHUS8e",
    puntos: new Array(0),
    puntoUbicacionUsuario: new Array(0),
    visibleUbicacionDeUsuario: false,
    proveedor: "b",
    url: "http://localize.dyndns-ip.com/ClientBin/Localize-Web-ServicioRIA.svc/json/",
    intervalo: null,
    inicializar: function ()
    {
        var alto = $(window).height() - 40;
        $("#LoginPage").css("height", alto + 30);
        $("#LoginPage").css("display", "block");
        $("#InicioPage").css("height", alto);
        $("#Mapa").css("height", alto - 170);
        $("#GrupoAnteriorButton").css("margin-top", (alto - 170) / 2);
        $("#GrupoSiguienteButton").css("margin-top", (alto - 170) / 2);
        $("#InformacionPage").css("height", alto);
        $("#ReportesPage").css("height", alto);
        $("#ConfiguracionPage").css("height", alto);
    },
    inicializarMapaB: function ()
    {
        localize.map = new Microsoft.Maps.Map(document.getElementById('Mapa'),
        {
            credentials: localize.key,
            mapTypeId: Microsoft.Maps.MapTypeId.road,
            center: new Microsoft.Maps.Location(19.040899, -98.138100),
            zoom: 12,
            enableSearchLogo: false,
            showMapTypeSelector: false,
            enableClickableLogo: false
        });
    },
    inicializarMapaG: function ()
    {
        var config =
        {
            center: new google.maps.LatLng(19.040899, -98.138100),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 12,
            panControl: false,
            zoomControl: false,
            mapTypeControl: true,
            scaleControl: false,
            streetViewControl: false,
            overviewMapControl: false
        };
        localize.map = new google.maps.Map(document.getElementById('Mapa'), config);
    },
    timer: function ()
    {
        if (localize.grupo != "")
        {
            localize.vehiculos.length = 0;
            localize.obtenerUnidadesDelGrupo(localize.grupo);
        }
    },
    autenticar: function (usuario, contraseña)
    {
        var Params = {};
        Params.type = 'GET';
        Params.url = localize.url + 'GetUsuarios?$where=((it.usuario1.Trim().ToLower()%253d%253d%2522' + usuario + '%2522)%2526%2526(it.passweb.Trim()%253d%253d%2522' + contraseña + '%2522))&$includeTotalCount=True';
        Params.success = function (res)
        {
            var data = $.parseJSON(res.responseText);
            if (data.GetUsuariosResult.TotalCount > 0)
            {
                var informacion = data.GetUsuariosResult.RootResults[0];
                $("#Acciones").css("display", "block");
                if (localize.proveedor == "b")
                {
                    localize.inicializarMapaB();
                }
                else
                {
                    localize.inicializarMapaG();
                }
                localize.cambiarPagina("#LoginPage", "#InicioPage");
                localize.grupo = informacion.usuario1;
                localize.intervalo = setInterval("localize.timer()", 30000);
                localize.obtenerUnidadesDelGrupo(localize.grupo);
            }
            else
            {
                //TODO:Mostrar el mensaje de error de una forma mas amistosa
                alert('Usuario o contraseña incorrecto');
            }
        }
        $.ajax(Params);
    },
    obtenerUnidadesDelGrupo: function (nombreGrupo)
    {
        clearInterval(localize.intervalo);
        var Params = {};
        Params.type = 'GET';
        Params.url = localize.url + 'ObtenerVehiculosDeGrupo?grupo=' + nombreGrupo;
        Params.success = function (res)
        {
            if (res.responseText != "")
            {
                var data = $.parseJSON(res.responseText);
                var numeroArea = 0;
                for (var i in data.ObtenerVehiculosDeGrupoResult.RootResults)
                {
                    var info = data.ObtenerVehiculosDeGrupoResult.RootResults[i];
                    if ($.inArray(info.DescripcionArea, localize.areas) == -1)
                    {
                        localize.areas[numeroArea] = info.DescripcionArea;
                        numeroArea += 1;
                    }
                }
                $("#GrupoSeleccionado").text(localize.areas[0]);
                for (var i in data.ObtenerVehiculosDeGrupoResult.RootResults)
                {
                    var v = data.ObtenerVehiculosDeGrupoResult.RootResults[i];
                    var u = {};
                    u["Index"] = v.index;
                    u["Unidad"] = v.unidad;
                    u["Area"] = v.DescripcionArea;
                    u["Etiqueta"] = v.Etiqueta;
                    u["Tipo"] = v.tipo;
                    u["Estado"] = v.enginestatus
                    u["Latitud"] = "";
                    u["Longitud"] = "";
                    u["Odometro"] = v.Odometro;
                    u["OdometroTotal"] = v.OdometroTotal;
                    u["Velocidad"] = "";
                    u["Direccion"] = "";
                    localize.vehiculos.push(u);
                }
                localize.cargarUnidades();
            }
        }
        $.ajax(Params);
    },
    obtenerUbicacionDeUnidad: function (indiceUnidad)
    {
        if (indiceUnidad < localize.vehiculos.length)
        {
            var unidad = localize.vehiculos[indiceUnidad]["Unidad"];
            var Params = {};
            Params.type = 'GET';
            Params.url = localize.url + 'GetUltimoPuntoLogHoy?unidad=' + unidad;
            Params.success = function (res)
            {
                if (res.responseText != "") {
                    var data = $.parseJSON(res.responseText);

                    if (data.GetUltimoPuntoLogHoyResult.RootResults.length > 0) {
                        var v = data.GetUltimoPuntoLogHoyResult.RootResults[0];

                        for (var j in localize.vehiculos) {
                            if (v.Unidad == localize.vehiculos[j]["Unidad"]) {
                                localize.vehiculos[j]["Latitud"] = v.lat;
                                localize.vehiculos[j]["Longitud"] = v.lon;
                                localize.vehiculos[j]["Velocidad"] = v.vel;
                            }
                        }
                    }
                }
                localize.obtenerDireccionDeUnidad(indiceUnidad);
            }
            $.ajax(Params);
        }
        else
        {
            localize.intervalo = setInterval("localize.timer()", 30000);
        }
    },
    obtenerDireccionDeUnidad: function (indiceUnidad)
    {
        if (indiceUnidad < localize.vehiculos.length)
        {
            var lat = localize.vehiculos[indiceUnidad]["Latitud"];
            var lon = localize.vehiculos[indiceUnidad]["Longitud"];

            if (lat != "" && lon != "") {
                $.getJSON('http://dev.virtualearth.net/REST/v1/Locations/' + lat + ',' + lon + '?key=' + localize.key + '&o=json&jsonp=?', function (data) {
                    if (data.resourceSets[0].resources.length > 0) {
                        var resource = data.resourceSets[0].resources[0];
                        if (resource.name.length > 0) {
                            localize.vehiculos[indiceUnidad]["Direccion"] = resource.name;
                            $("#ListaDeUnidades > #" + localize.vehiculos[indiceUnidad]["Unidad"] + "> div .Pie span").text(localize.vehiculos[indiceUnidad]["Direccion"]);
                        }
                    }
                    indiceUnidad += 1;
                    localize.obtenerUbicacionDeUnidad(indiceUnidad);
                });
            }
            else {
                indiceUnidad += 1;
                localize.obtenerUbicacionDeUnidad(indiceUnidad);
            }
        }
    },
    cargarUnidades: function ()
    {
        $("#ListaDeUnidades").empty();
        for (var i in localize.vehiculos)
        {
            var icono = "";
            var clase = "";
            if ($.inArray($.trim(localize.vehiculos[i]["Unidad"]), localize.vehiculosSeleccionados) > -1)
            {
                clase = "TileSeleccionado";
            }
            if ($.trim(localize.vehiculos[i]["Tipo"]) == "V" && localize.vehiculos[i]["Estado"] == true)
            {
                icono = '<img src="img/ca.png">';
            }
            else if ($.trim(localize.vehiculos[i]["Tipo"]) == "V" && (localize.vehiculos[i]["Estado"] == false || localize.vehiculos[i]["Estado"] == null))
            {
                icono = '<img src="img/ci.png">';
            }
            else if ($.trim(localize.vehiculos[i]["Tipo"]) == "T" && localize.vehiculos[i]["Estado"] == true)
            {
                icono = '<img src="img/sa.png">';
            }
            else if ($.trim(localize.vehiculos[i]["Tipo"]) == "T" && (localize.vehiculos[i]["Estado"] == false || localize.vehiculos[i]["Estado"] == null))
            {
                icono = '<img src="img/si.png">';
            }
            $("#ListaDeUnidades").append('<div id="' + $.trim(localize.vehiculos[i]["Unidad"]) + '" data-etiqueta="' + localize.vehiculos[i]["Etiqueta"] + '" data-index="' + localize.vehiculos[i]["Index"] + '"  data-area="' + $.trim(localize.vehiculos[i]["Area"]) + '" class="' + clase + '">' +
                                             '<div>' +
                                                 '<div class="Encabezado">' +
                                                     icono +
                                                     '<span class="TituloUnidad">' + localize.vehiculos[i]["Etiqueta"] + '</span>' +
                                                 '</div>' +
                                                 '<div class="Info">' +
                                                     '<table>' +
                                                         '<tr>' +
                                                             '<td>' +
                                                                 '<img src="img/vel.png" style="width:27px; height:20px;">' +
                                                             '</td>' +
                                                             '<td>' +
                                                                 '<span class="VelocidadUnidad">' + localize.vehiculos[i]["Velocidad"] + '</span>' +
                                                             '</td>' +
                                                         '</tr>' +
                                                         '<tr>' +
                                                             '<td>' +
                                                                 '<img src="img/o.png" style="width:24px; height:24px;">' +
                                                             '</td>' +
                                                             '<td>' +
                                                                 '<span class="OdometroUnidad">' + localize.vehiculos[i]["OdometroTotal"] + '</span>' +
                                                             '</td>' +
                                                         '</tr>' +
                                                     '</table>' +
                                                 '</div>' +
                                                 '<div class="Pie">' +
                                                     '<span class="DireccionUnidad">' +
                                                         localize.vehiculos[i]["Direccion"] +
                                                     '</span>' +
                                                 '</div>' +
                                             '</div>' +
                                         '</div>');
        }
        $("#ListaDeUnidades > div").each(function ()
        {
            $(this).click(function ()
            {
                localize.obtenerUbicacionDeUnidadSeleccionada(this);
            });
        });
        $("#ListaDeUnidades > div div .Encabezado img").each(function ()
        {
            $(this).click(function (event)
            {
                event.stopPropagation();
                var pid = $(this).parent().parent().parent().data("index");
                localize.obtenerDetalleDeUnidad(pid);
                localize.cambiarPagina("#InicioPage", "#InformacionPage");
            });
        });
        if (localize.areas.length > 1)
        {
            localize.mostrarUnidadesDelArea(localize.areas[0]);
            localize.mostrarControlesDeNavegacion();
        }
        if (localize.vehiculosSeleccionados.length > 0)
        {
            localize.limpiarMapa(null);
            localize.actualizarUnidad(0);
        }
        if (localize.visibleUbicacionDeUsuario == true) {
            localize.obtenerUbicacionActual();
        } else {
            $('#UbicarButton').css("opacity", "0.6");
        }
        localize.obtenerUbicacionDeUnidad(0);
    },
    obtenerUbicacionDeUnidadSeleccionada: function (nombreUnidad)
    {
        if ($.inArray(nombreUnidad.id, localize.vehiculosSeleccionados) == -1) {
            var Params = {};
            Params.type = 'GET';
            Params.url = localize.url + 'GetUltimoPuntoLogHoy?unidad=' + nombreUnidad.id;
            Params.success = function (res) {
                if (res.responseText != "") {
                    var data = $.parseJSON(res.responseText);
                    var v = data.GetUltimoPuntoLogHoyResult.RootResults[0];
                    var etiqueta = $(nombreUnidad).data('etiqueta');
                    var index = $(nombreUnidad).data('index');
                    var estado = $('div .Encabezado img', nombreUnidad).attr("src");
                    var html = "";
                    if (estado != null) {
                        if (estado == "img/ca.png") {
                            html = '<table style="width:150px;"><tr><td style="width:24px;"><img src="img/cta.png" alt=""></td><td><span class="Etiqueta">' + etiqueta + '</span></td></tr></table>'
                        }
                        else if (estado == "img/ci.png") {
                            html = '<table style="width:150px;"><tr><td style="width:24px;"><img src="img/cti.png" alt=""></td><td><span class="Etiqueta">' + etiqueta + '</span></td></tr></table>'
                        }
                        else if (estado == "img/sa.png") {
                            html = '<table style="width:150px;"><tr><td style="width:24px;"><img src="img/sta.png" alt=""></td><td><span class="Etiqueta">' + etiqueta + '</span></td></tr></table>'
                        }
                        else if (estado == "img/si.png") {
                            html = '<table style="width:150px;"><tr><td style="width:24px;"><img src="img/sti.png" alt=""></td><td><span class="Etiqueta">' + etiqueta + '</span></td></tr></table>'
                        }
                    }
                    localize.agregarPunto(v.lat, v.lon, html);
                    localize.vehiculosSeleccionados.push(nombreUnidad.id);
                    $(nombreUnidad).addClass("TileSeleccionado");
                }
            }
            $.ajax(Params);
        }
        else {
            if (localize.proveedor == "b") {
                localize.dataLayerUnidades.removeAt($.inArray(nombreUnidad.id, localize.vehiculosSeleccionados));
            }
            else {
                localize.puntos[$.inArray(nombreUnidad.id, localize.vehiculosSeleccionados)].setMap(null);
                localize.puntos.splice($.inArray(nombreUnidad.id, localize.vehiculosSeleccionados), 1);
            }
            localize.vehiculosSeleccionados.splice($.inArray(nombreUnidad.id, localize.vehiculosSeleccionados), 1);
            $(nombreUnidad).removeClass("TileSeleccionado");
        }
    },
    mostrarControlesDeNavegacion: function ()
    {
        $("#GrupoAnteriorButton").css("display", "block");
        $("#GrupoSiguienteButton").css("display", "block");
        $("#GrupoSeleccionado").css("display", "block");
    },
    mostrarUnidadesDelAreaAnterior: function (indiceArea)
    {
        if (indiceArea < 0)
        {
            localize.areaSeleccionada = localize.areas.length - 1;
            localize.mostrarUnidadesDelArea(localize.areas[localize.areaSeleccionada]);
        }
        else
        {
            localize.areaSeleccionada = indiceArea;
            localize.mostrarUnidadesDelArea(localize.areas[localize.areaSeleccionada]);
        }
    },
    mostrarUnidadesDelAreaSiguiente: function (indiceArea)
    {
        var lon = localize.areas.length - 1;
        if (indiceArea > lon)
        {
            localize.areaSeleccionada = 0;
            localize.mostrarUnidadesDelArea(localize.areas[localize.areaSeleccionada]);
        }
        else
        {
            localize.areaSeleccionada = lon;
            localize.mostrarUnidadesDelArea(localize.areas[localize.areaSeleccionada]);
        }
    },
    mostrarUnidadesDelArea: function (nombreArea)
    {
        $("#ListaDeUnidades > div").each(function ()
        {
            var a = $(this).data('area');
            if (a != nombreArea)
            {
                $(this).css("display", "none");
            }
            else
            {
                $(this).css("display", "inline-block");
            }
        });
        $("#GrupoSeleccionado").text(nombreArea);
    },
    obtenerDetalleDeUnidad: function (indiceUnidad)
    {
        if (indiceUnidad != "")
        {
            var Params = {};
            Params.type = 'GET';
            Params.url = localize.url + 'GetDetalleVehiculos?$where=(it.Index_flotasdb%253d%253d' + indiceUnidad + ')';
            Params.success = function (res)
            {
                if (res.responseText != "")
                {
                    var data = $.parseJSON(res.responseText);
                    var d = data.GetDetalleVehiculosResult.RootResults[0];
                    localize.obtenerMasInformacionDeUnidad(d.Id);
                    for (var i in localize.vehiculos)
                    {
                        if (localize.vehiculos[i]["Index"] == indiceUnidad)
                        {
                            $("#DireccionUnidad").text(localize.vehiculos[i]["Direccion"]);
                        }
                    }
                }
            }
            $.ajax(Params);
        }
    },
    obtenerMasInformacionDeUnidad: function (idDetalle)
    {
        if (idDetalle != "")
        {
            var Params = {};
            Params.type = 'GET';
            Params.url = localize.url + 'GetInformacionVehiculos?$where=(it.IdDetalle%253d%253dGuid(' + idDetalle + '))';
            Params.success = function (res)
            {
                if (res.responseText != "")
                {
                    var data = $.parseJSON(res.responseText);
                    var d = data.GetInformacionVehiculosResult.RootResults[0];
                    $(".dato").text("");
                    $("#PlacasLabel").text(d.Placas);
                    $("#EconomLabel").text(d.Econom);
                    $("#InstalacionLabel").text(d.Instalacion);
                    $("#MarcaLabel").text(d.Marca);
                    $("#TipoLabel").text(d.Tipo);
                    $("#ColorLabel").text(d.Color);
                    $("#ModeloLabel").text(d.Modelo);
                    $("#SerieLabel").text(d.Serie);
                    $("#MotorLabel").text(d.Motor);
                    $("#RendimientoLabel").text(d.RendimientoTeoricoKMS_LT);
                    $("#ChoferLabel").text(d.Chofer);
                    $("#LicenciaLabel").text(d.Licencia);
                    $("#ExpiraLabel").text(d.Expira);
                    $("#PolizaLabel").text(d.Poliza);
                    $("#AseguradoraLabel").text(d.Aseguradora);
                    $("#VenceLabel").text(d.Vence);
                }
            }
            $.ajax(Params);
        }
    },
    cambiarPagina: function (paginaActual, paginaSiguiente)
    {
        $(paginaActual).css("display", "none");
        $(paginaSiguiente).css("display", "block");
    },
    agregarPunto: function (lat, lon, html)
    {
        if (localize.proveedor == "b")
        {
            if (localize.dataLayerUnidades == null || localize.dataLayerUnidades == undefined) {
                localize.dataLayerUnidades = new Microsoft.Maps.EntityCollection();
                localize.map.entities.push(localize.dataLayerUnidades);
            }

            var pushpinOptions = { width: null, height: null, htmlContent: html, anchor: new Microsoft.Maps.Point(0, 0) };
            var location = new Microsoft.Maps.Location(lat, lon);
            var pushpin = new Microsoft.Maps.Pushpin(location, pushpinOptions);
            localize.dataLayerUnidades.push(pushpin);
            localize.map.setView({ center: new Microsoft.Maps.Location(lat, lon) });
        }
        else
        {
            var posicion = html.indexOf("src");
            var img = html.substr(posicion + 5, 11);
            var location = new google.maps.LatLng(lat, lon);
            var marker = new google.maps.Marker(
            {
                position: location,
                map: localize.map,
                icon: img
            });
            localize.map.setCenter(location);
            localize.puntos.push(marker);
        }
    },
    actualizarUnidad: function (indiceUnidad)
    {
        if (indiceUnidad < localize.vehiculosSeleccionados.length)
        {
            var Params = {};
            Params.type = 'GET';
            Params.url = localize.url + 'GetUltimoPuntoLogHoy?unidad=' + localize.vehiculosSeleccionados[indiceUnidad];
            Params.success = function (res)
            {
                if (res.responseText != "")
                {
                    var objeto = document.getElementById(localize.vehiculosSeleccionados[indiceUnidad]);
                    var data = $.parseJSON(res.responseText);
                    var v = data.GetUltimoPuntoLogHoyResult.RootResults[0];
                    var etiqueta = $(objeto).data('etiqueta');
                    var estado = $('div .Encabezado img', objeto).attr("src");
                    var html = "";
                    if (estado != null)
                    {
                        if (estado == "img/ca.png")
                        {
                            html = '<table style="width:150px;"><tr><td style="width:24px;"><img src="img/cta.png" alt=""></td><td><span class="Etiqueta">' + etiqueta + '</span></td></tr></table>'
                        }
                        else if (estado == "img/ci.png")
                        {
                            html = '<table style="width:150px;"><tr><td style="width:24px;"><img src="img/cti.png" alt=""></td><td><span class="Etiqueta">' + etiqueta + '</span></td></tr></table>'
                        }
                        else if (estado == "img/sa.png")
                        {
                            html = '<table style="width:150px;"><tr><td style="width:24px;"><img src="img/sta.png" alt=""></td><td><span class="Etiqueta">' + etiqueta + '</span></td></tr></table>'
                        }
                        else if (estado == "img/si.png")
                        {
                            html = '<table style="width:150px;"><tr><td style="width:24px;"><img src="img/sti.png" alt=""></td><td><span class="Etiqueta">' + etiqueta + '</span></td></tr></table>'
                        }
                    }
                    localize.agregarPunto(v.lat, v.lon, html);
                    indiceUnidad += 1;
                    localize.actualizarUnidad(indiceUnidad);
                }
            }
            $.ajax(Params);
        }
    },
    limpiarMapa: function (mapa)
    {
        if (localize.proveedor == "b")
        {
            localize.dataLayerUnidades.clear();
            if (localize.dataLayerPosicionUsuario != null) {
                localize.dataLayerPosicionUsuario.clear();
            }
        }
        else
        {
            for (var i = 0; i < localize.puntos.length; i++)
            {
                localize.puntos[i].setMap(mapa);
            }
            localize.puntos = [];
        }
    },
    obtenerUbicacionActual: function () {
        if (localize.proveedor == "b") {
            if (localize.visibleUbicacionDeUsuario == true) {
                if (navigator.geolocation) {
                    if (localize.dataLayerPosicionUsuario == null || localize.dataLayerPosicionUsuario == undefined) {
                        localize.dataLayerPosicionUsuario = new Microsoft.Maps.EntityCollection();
                        localize.map.entities.push(localize.dataLayerPosicionUsuario);
                    }

                    localize.dataLayerPosicionUsuario.clear();
                    navigator.geolocation.getCurrentPosition(localize.mostrarUbicacionActual);
                }
                else {
                    //No soportado
                    localize.visibleUbicacionDeUsuario = false;
                }
            }
            else {
                localize.dataLayerPosicionUsuario.clear();
            }
        }
        else {
            if (localize.visibleUbicacionDeUsuario == true) {
                if (navigator.geolocation) {
                    if (localize.puntoUbicacionUsuario.length > 0) {
                        localize.puntoUbicacionUsuario[0].setMap(null);
                        localize.puntoUbicacionUsuario = [];
                    }
                    localize.puntoUbicacionUsuario = [];
                    navigator.geolocation.getCurrentPosition(localize.mostrarUbicacionActual);
                }
                else {
                    //No soportado
                    localize.visibleUbicacionDeUsuario = false;
                }
            }
            else {
                localize.puntoUbicacionUsuario[0].setMap(null);
                localize.puntoUbicacionUsuario = [];
            }
        }
    },
    mostrarUbicacionActual: function (punto)
    {
        $('#UbicarButton').css("opacity", "");
        if (localize.proveedor == "b") {
            var pushpinOptions = { width: null, height: null, htmlContent: '<img src="img/loc.png" alt="">', anchor: new Microsoft.Maps.Point(0, 0) };
            var location = new Microsoft.Maps.Location(punto.coords.latitude, punto.coords.longitude);
            var pushpin = new Microsoft.Maps.Pushpin(location, pushpinOptions);
            localize.dataLayerPosicionUsuario.push(pushpin);
            localize.map.setView({ center: new Microsoft.Maps.Location(punto.coords.latitude, punto.coords.longitude) });
        }
        else {
            var html = '<img src="img/loc.png" alt="">';
            var posicion = html.indexOf("src");
            var img = html.substr(posicion + 5, 11);
            var location = new google.maps.LatLng(punto.coords.latitude, punto.coords.longitude);
            var marker = new google.maps.Marker(
            {
                position: location,
                map: localize.map,
                icon: img
            });
            localize.map.setCenter(location);
            localize.puntoUbicacionUsuario.push(marker);
        }
    },
    mostrarTextoAleatorio: function ()
    {
        var numero = Math.floor((Math.random() * 4) + 1);
        $("#Caracteristicas li:nth-child(" + numero + ")").css("display", "block");
    }
};