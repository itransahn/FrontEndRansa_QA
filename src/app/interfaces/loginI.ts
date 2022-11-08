export default interface loginI{
 result  : {
    data : {
        token ?: any,
        dataUsuario : {},
        modulosPermitidos : {
            id_modulo : number,
            modulo    : string,
            imagen    : string
        }[]
    },
    errors : string,
    hasError : boolean
 }
}