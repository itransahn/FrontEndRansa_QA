
interface dataUsuario {
    id_usuario :number,
    id_dptofisico : number,
    id_sexo : number,
    id_usuarioRansa : string,
    correo : string,
    nombreCompleto : string,
    telegono : string,
    puestoRansa : string,
    id_area : number,
    id_rol : number,
    imgPerfil : string,
    sede      : number,
    rol       : string,
    usuario   : string,
}


interface modulos {
    id_modulo ?: number,
    imagen    ?: string,
    modulo    ?: string,
    icon      ?: string
}

interface menushijos{
        data : {
            menu : [
                {
                    id_menuPadre : number,
                    menuPadre    : string,
                    icon         : string,
                    id_modulo    : number,
                     hijos : {
                            idMenuPadre : number,
                            idMenuHijo  : number,
                            menuHijo    : string,
                            icon        : string,
                            url         : string,
                            insertar    : number,
                            actualizar  : number,
                            eliminar    : number
                     }[]
                }
            ]
        },
        errors : [],
        hasError : boolean
}


interface usuario {
            
            usuarioRansa ?: string,
            usuario      ?: string,
            Nombre       ?: string,
            estado       ?: number,
            idRol        ?: number,
            rol          ?: string,
            idSede       ?: number,
            sede         ?: string,
            Departamento ?: string
}[]

interface DatausuarioComplete {
    /* DATA DE PERSONA */
    nombreCompleto     ?: string,
    telefono           ?: string,
    direccion          ?: string,
    nacimiento         ?: string,
    identidad          ?: string,
    correo             ?: string,
    tipoIdentificacion ?: number,
    id_sexo            ?: number,
    idCiudad           ?: number,
    tipoSangre         ?: number,
    /* DATA DE USUARIO */
    usuarioRansa       ?: string,
    fechaIngreso       ?: string,
    DepartamentoFisico ?:number,
    idPuesto           ?: number,
    urlImagen       ?: string,
    usuario         ?: string,
    estado          ?: number,
    idRol           ?: number,
    cco             ?: string,    
    idSede          ?: number,
}[]

interface roles {
        ID       ?: number,
        rol      ?: string,
        idEstado ?: number,
        Estado   ?: string
}[]

interface modulosPadre {

    data : {
        menu : [
            {
                id_modulo       ?: number,
                modulo          ?: string,
                icono           ?: string,
                imagen          ?: string,
                estado          ?: number
                padres : {
                    id_menuPadre ?: number,
                    id_modulo    ?: number,
                    menuPadre    ?: string,
                    icon         ?: string
                }[]
            }
        ]
    },
    errors : [],
    hasError : boolean
}[]

interface MenusP {

    data : {
        menu : [
            {
                id_menuPadre        ?: number,
                 menuPadre          ?: string,
                 icon               ?: string,
                 id_modulo          ?: number,
                 modulo             ?: string,
                 estado             ?: number,
                hijos : {
                    id_menuHijo ?: number,
                    icon        ?: number,
                    menuHijo    ?: string,
                    url         ?: string,
                    estado      ?: number
                         }[]
            }
        ]
    },
    errors : [],
    hasError : boolean
}[]

interface modulosP{
        id_modulo       ?: number,
        modulo          ?: string,
        padres : {
            id_menuPadre ?: number,
            id_modulo    ?: number,
            menuPadre    ?: string,
            icon         ?: string
        }[]
}

interface menus{
    id_menuPadre       ?: number,
    menuPadre          ?: string,
    icon               ?: string,
    id_modulo          ?: number,
    modulo             ?: string,
    estado             ?: number,
    hijos : {
        id_menuHijo ?: number,
        icon        ?: number,
        menuHijo    ?: string,
        url         ?: string,
        estado      ?: number
    }[]
}


interface catalogo{
        modulos :  {
               id_modulo ?: number,
               modulo    ?: string,
               icon      ?: string,
               imagen    ?: string,
               estado    ?: number 
                }[],
        menuPadres : {
            id_menuPadre ?: number,
            menuPadre    ?: string,
            icon         ?: string,
            estado       ?: number,
            id_modulo    ?: number
        }[],
        menuHijos :{
            id_menuHijo  ?: number,
            menuHijo     ?: string,
            icon         ?: string,
            urlM         ?: string,
            estado       ?: number,
            id_menuPadre ?: number
        }[],
        roles : {
            id_rol ?: number,
            rol    ?: string,
            estado ?: number
        }[],
        sexos :{
            id_sexo  ?: number,
            sexo     ?: string
        }[],
        sedes : {
            id_sedeRansa ?: number,
            sedeRansa    ?: string
        }[],
        tipoSangres : {
            id_tipoSangre ?: number,
            tipoSangre    ?: string
        }[],
        tipoIdentificacion :    {
            id_tipoIdentificacion ?: number,
            tipoIdentificacion    ?: string
        }[],
        tipoLlanta : {
            id_tipoLlanta ?: number,
            tipoLlanta    ?: string
        }[],
        estados : {
            id_estadoGeneral ?: number,
            estadoGeneral    ?: string
        }[],
        ccos :   {
                id_cco     ?: number,
                cco        ?: string,
                codigo_cco ?: string
        }[],
        departamentoFisicos : {
            id_departamentoFisico  ?: number,
            departamentoFisico     ?: string,
            id_sedeRansa           ?: number
        }[],
        areasRansa : {
            id_areaDeOperacion  ?: number,
            area                ?: string,
        }[],
        estadoUsuarios : {
            id_estadoUsuario ?: number,
            estadoUsuario    ?: string
        }[],
        puesto : {
            id_puesto   ?:number,
            puestoRansa ?: string
        }[],
        departamentos: {
            id_departamento ?: number,
            departamento    ?: string
        }[],
        ciudades: {
            id_ciudad       ?: number,
            ciudad          ?: string,
            id_departamento ?: number
        }[],
        proveedorLlanta: {
            idProveedor ?: number,
            proveedor   ?: string,
            estado      ?: number
        }[],
        ladoCambiar: {
            idLado ?: number,
            lado   ?: string,
        }[],
        tiposMaquina : {
            id_tipo  ?: number,
            tiipo    ?: string
        }[],
        tipoLlantaMaquina : {
            id_relacion    ?: number,
            id_tipoLlanta  ?: number,
            id_tipoMaquina ?: number
        }[],
        Maquinas : {
            id_maquina     ?: number,
            maquina        ?: string,
            id_tipoMaquina ?: number
        }[],
        UsuariosR : {
            ID      ?: number,
            usuario ?: string,
            area    ?: number
        }[],
        SedesExtintor : {
            id_sedeRansa ?: number,
            sedeRansa    ?: string
        }[],
        usuariosCAB : {
            USUARIO  ?: string,
            idUsuario  ?: string,
            Cod_Empleado  ?: string
        }[]

}

const mensajes = {
    warning   : 'Advertencia',
    error     : 'Error',
    success   : 'Acción correcta'
}
const mask = {
    numberPhone : 'XXXX-XXXX',
    decimal     : '0*.00',
    identidad   : 'XXXX-XXXX-XXXXX',
    lote        : 'AXXXXXXXX',
    cantidad    : "0000",
    placa       : "AAA-0000",
    RTN         : 'XXXX-XXXX-XXXXX-X',
    anio        : '0000',
    recibo      : '00000',
    factura     : '000-000-00-00000000'
}


const GeneraRandomPassword =  Math.random().toString(36).slice(-12);



interface usuarioEspecifico  {
    ID                    ?: number ,
    Nombre                ?: string ,
    id_usuarioRansa       ?: number ,
    FechaIngreso          ?: string ,
    direccion             ?: string ,
    fechaNacimiento       ?: number ,
    IMAGEN                ?: string ,
    Usuario               ?: string ,
    id_cco                ?: number ,
    identidad             ?: string ,
    CentroCosto           ?: string ,
    id_sede               ?: number ,
    id_persona            ?: number ,
    telefono              ?: string ,
    Sede                  ?: string ,
    correo                ?: string ,
    IdDepartamento        ?: number ,
    departamento          ?: string ,
    id_ciudad             ?: number ,
    ciudad                ?: string ,
    id_sexo               ?: number ,
    sexo                  ?: string ,
    id_estadoUsuario      ?: number ,
    Estado                ?: string ,
    id_puesto             ?: number ,
    Puesto                ?: string ,
    id_tipoSangre         ?: number ,
    TipoSangre            ?: string ,
    id_rol                ?: number ,
    rol                   ?: string ,
    id_departamentoFisico ?: number ,
    departamentoFisico    ?: string ,
    id_tipoIdentificacion ?: number ,
    edad                  ?: number 
}


const Acumulador = ( arreglo ?: any[], ValorBuscar ?:string )=>{
    let subtotal = 0;
for ( let i=0; i< arreglo.length; i++){
    subtotal += Number(arreglo[i][ValorBuscar])
}
return subtotal;
}


const meses = (mes :number ) =>{ 
        if ( mes == 1){
            return 'Enero'
        }
        if ( mes == 2){
            return 'Febrero'
        }
        if ( mes == 3){
            return 'Marzo'
        }
        if ( mes == 4){
            return 'Abril'
        }
        if ( mes == 5){
            return 'Mayo'
        }
        if ( mes == 6){
            return 'Junio'
        }
        if ( mes == 7){
            return 'Julio'
        }
        if ( mes == 8){
            return 'Agosto'
        }
        if ( mes == 9){
            return 'Septiembre'
        }
        if ( mes == 10){
            return 'Octubre'
        }
        if ( mes == 11){
            return 'Noviembre'
        }
        if ( mes == 12){
            return 'Diciembre'
        }else{
            return ''
        }
}


const validadorRol = ( codigo : number ) =>{
    if ( codigo === 1  ){
        return true
    }else{
        return false
    }
}

export { 
    dataUsuario,
    modulos,
    menushijos,
    usuario,
    roles,
    modulosPadre,
    MenusP,
    modulosP,
    menus,
    catalogo,
    mensajes,
    mask,
    usuarioEspecifico,
    Acumulador,
    GeneraRandomPassword,
    validadorRol,
    meses
}


