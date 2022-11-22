interface cabeceraFactura{
    CZNCBD ?: string , 
    IVLNAD ?: string , 
    TOBCTC ?: string , 
    ITTFCD ?: string , 
    IVLIGS ?: string , 
    ITCCTC ?: string , 
    TCMPCL ?: string , 
    IVLNAS ?: string , 
    IVLAFD ?: string , 
    NDCCTC ?: string , 
    CMNDA  ?:  string , 
    ITTFCS ?: string , 
    NRUC   ?: string ,  
    IVLIGD ?: string , 
    CCLNT  ?: string ,  
    FDCCTC ?: string , 
    TDRCOR ?: string , 
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
    ITRCTC ?: string,
    CCNCSD ?: string,
}



export {
    cabeceraFactura,
    detalleCabecera
}