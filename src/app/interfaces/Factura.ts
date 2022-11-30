interface cabeceraFactura{
    CZNCBD  ?: string , 
    IVLNAD  ?: string , 
    TOBCTC  ?: string , 
    TOBCTC2 ?: string , 
    ITTFCD  ?: string , 
    IVLIGS  ?: string , 
    ITCCTC  ?: string , 
    TCMPCL  ?: string , 
    IVLNAS  ?: string , 
    IVLAFD  ?: string , 
    NDCCTC  ?: string , 
    CMNDA   ?:  string , 
    ITTFCS  ?: string , 
    NRUC    ?: string ,  
    NRUC2   ?: string ,  
    IVLIGD  ?: string , 
    CCLNT   ?: string ,  
    FDCCTC  ?: string , 
    TDRCOR  ?: string , 
}

interface detalleCabecera{
    TCMTRF ?: string,
    NDCCTC ?: string,
    QAPCTC ?: string,
    IVLDCS ?: number,
    NCRDCC ?: string,
    IVLDCD ?: string,
    CRBCTC ?: string,
    CUTCTC ?: string,
    CUNCNA ?: string,
    ITRCTC ?: number,
    CCNCSD ?: string,
}

const retornarMes = ( mes : any ) =>{
    if ( mes == '01' ) {
        return 'DE ENERO DEL'
    }
    if ( mes == '02' ) {
        return 'DE FEBRERO DEL'
    }
    if ( mes == '03' ) {
        return 'DE MARZO DEL'
    }
    if ( mes == '04' ) {
        return 'DE ABRIL DEL'
    }
    if ( mes == '05' ) {
        return 'DE MAYO DEL'
    }
    if ( mes == '06' ) {
        return 'DE JUNIO DEL'
    }
    if ( mes == '07' ) {
        return 'DE JULIO DEL'
    }
    if ( mes == '08' ) {
        return 'DE AGOSTO DEL'
    }
    if ( mes == '09' ) {
        return 'DE SEPTIEMBRE DEL'
    }
    if ( mes == '10' ) {
        return 'DE OCTUBRE DEL'
    }
    if ( mes == '11' ) {
        return 'DE NOVIEMBRE DEL'
    }
    if ( mes == '12' ) {
        return 'DE DICIEMBRE DEL'
    }
    return ''
}



export {
    cabeceraFactura,
    detalleCabecera,
    retornarMes
}