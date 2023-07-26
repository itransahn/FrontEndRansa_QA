 interface catalogoExt{
    tipoAgente : {
        id_tipoAgente : number,
        tipo_agente   : string
    }[],
    tipoExtintor : {
        id_tipoExtintor : number,
        tipo_extintor   : string,
    }[],
    ubicacionExtintor : {
        id_ubicacion : number,
        ubicacion    : string,
        sede         : number,
        estado       : number
     }[],
    Capacidad : {
        id : number,
        Capacidad : string
    }[],
    unidadMedicion : {
        id_unidadMedicion : number,
        unidadMedicion    : string
    }[],
    Sedes    :  {
        id_sedeRansa : number,
        sedeRansa    : string 
    }

}


 interface extintor{
    id_extintor : number,
    Fecha_Anterior_Carga : Date,
    Fecha_Proxima_Carga  : Date,
    Nomenclatura         : string,
    vida_util            : number,
    usuario_creador      : number,
    capacidad            : number,
    idUbicacion          : number,
    idExtintor           : number,
    idAgente             : number,
    tipo_agente          : string,
    tipo_extintor        : string,
    Capacidad            : string,
    ubicacion            : string,
    idSede               : number,
    Sede                 : string,
    FechaMaximaVidaUtil  : Date
}[]


export  {
    catalogoExt,
    extintor
}