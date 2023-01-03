import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';


export const _filter = ( opt : string[], value : string):string[]=>{
  const filterValue = value.toLowerCase();
  return opt?.filter( (item:string) => item.toLowerCase().indexOf(filterValue) === 0)
};

@Component({
  selector: 'app-modal-ca',
  templateUrl: './modal-ca.component.html',
  styleUrls: ['./modal-ca.component.scss']
})
export class ModalCaComponent implements OnInit {

  public  modalForm  : FormGroup;
  public  visible    : boolean = false; 
  public  enable     : boolean = false;
  public  botton     : boolean = false;
  public  catalogo   : any;
  public  catalogoT  : any;
  public  titulo     : string;
  public  subtitulo  : string;
  filteredOptions : Observable<Transportes[]>;
  public opciones  = [
    {
      id    : 0,
      valor :'NO'
    },
    {
      id    : 1,
      valor :'SI'
    }
  ]
  myControl = new FormControl('');
  
  constructor(
    private dialogRef:MatDialogRef<ModalCaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth : AuthService,
    public toast: ToastServiceLocal, 
    public transporteService : TransporteService
  ) { }


  ngOnInit() {
    this.catalogoT = this.transporteService.returnCatalogo();
    this.catalogo  = this.auth.returnCatalogo();
    this.validacion();
    // this.Autocomplete();
  }

  Autocomplete (){
    this.filteredOptions = this.modalForm.get('transporte')!.valueChanges
    .pipe(
      startWith(''),
      map( (value:string) => this._filterGroup(value))
    )
  }
  
  private _filterGroup(value: string): Transportes[] {
    if (value) {
      return this.catalogoT?.['transportes']
        .map(transporte => ( {nombreEmpresa: _filter(transporte, value)} ))
        .filter(transporte => transporte.nombreEmpresa.length > 0);
    }
    return this.catalogoT?.['transportes'];
  }

  validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `` 
      this.subtitulo  = String(this.data['camion']); 
      this.cargarFormGet(),
      this.SetForm()
    }

    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nuevo Camión`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }

    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `` 
      this.subtitulo  = String(this.data['camion']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

  cargarFormGet(){
      this.modalForm = new FormGroup({
        // camion      : new FormControl({ value: '', disabled : this.enable },  [] ),
        tipoUnidad   : new FormControl({ value: '', disabled : this.enable },  [] ),
        placa        : new FormControl({ value: '', disabled : this.enable },  [] ),
        transporte   : new FormControl({ value: '', disabled : this.enable },  [] ),
        gps          : new FormControl({ value: '', disabled : this.enable }, [] ),
        rampa        : new FormControl({ value: '', disabled : this.enable }, [] ),
        refrigerado  : new FormControl({ value: '', disabled : true }, [] ),
        sede         : new FormControl({ value: '', disabled : true }, [] ),
        marca        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
        modelo       : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
        tonelada     : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
        metraje      : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
        anio         : new FormControl({ value: '', disabled : this.enable }, [Validators.required, Validators.maxLength(4)] ),
        color        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      })
  }

  cargarFormPost(){
    this.modalForm = new FormGroup({
      // camion       : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      tipoUnidad   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      placa        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      transporte   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      gps          : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      rampa        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      refrigerado  : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      sede         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      marca        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      modelo       : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      tonelada     : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      metraje      : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      anio         : new FormControl({ value: '', disabled : this.enable }, [Validators.required, Validators.maxLength(4)] ),
      color        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    })
}

cargarFormPut(){
  this.modalForm = new FormGroup({
    // camion       : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    tipoUnidad   : new FormControl ({ value: '', disabled : this.enable }, [Validators.required] ),
    placa        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    transporte   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    gps          : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    rampa        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    refrigerado  : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    sede         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    marca        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    modelo       : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    tonelada     : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    metraje      : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    anio         : new FormControl({ value: '', disabled : this.enable }, [Validators.required, Validators.maxLength(4)] ),
    color        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
     
  })
}



SetForm(){
this.modalForm.setValue({
  // camion       :  this.data['camion'], 
  tipoUnidad   :  this.data['idUnidad'], 
  placa        :  this.data['placa'], 
  transporte   :  this.data['idTransportista'], 
  gps          :  this.data['GPS'], 
  rampa        :  this.data['Rampa'], 
  refrigerado  :  this.data['Refrigerado'], 
  sede         :  this.data['idSede'], 
  marca        : this.data['idMarca'],
  modelo       : this.data['idModelo'],
  tonelada     : this.data['idtonelada'],
  metraje      : this.data['idMetraje'],
  anio         : this.data['anio'],
  color        : this.data['idColor']
  })
}


  insertar(){
    let url    = 'transporte/InsCamiones';
    let params = {
      // descripcionCamion  : this.modalForm.value.camion,
      tipoUnidad         : this.modalForm.value.tipoUnidad,
      placa              : this.modalForm.value.placa,
      idTransportista    : this.modalForm.value.transporte,
      gps                : this.modalForm.value.gps,
      rampa              : this.modalForm.value.rampa,
      refrigerado        : this.modalForm.value.refrigerado,
      sede               : this.modalForm.value.sede,
      usuario            : this.auth.dataUsuario['id_usuario'], 
      marca             : this.modalForm.value.marca,
      modelo             : this.modalForm.value.modelo,
      tonelada           : this.modalForm.value.tonelada,
      metraje            : this.modalForm.value.metraje,
      anio               : this.modalForm.value.anio,
      color               : this.modalForm.value.color,
    } 
console.log( params)
    // this.transporteService.put(url,params).subscribe(
    //   res=>{
    //     if(!res.hasError){
    //         if ( res?.data.Table0[0]['codigo'] == -1 ){
    //             this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
    //         }else{
    //           this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
    //           this.dialogRef.close()
    //         }
    //     }else{
    //       this.toast.mensajeError(String(res?.errors),"Error")
    //     }
    //   }
    // )
}

actualizar(){
  let url    = 'transporte/ActCamiones';
  let params = {
    idCamion           : this.data['idCamion'],
    tipoUnidad         : this.modalForm.value.tipoUnidad,
    placa              : this.modalForm.value.placa,
    idTransportista    : this.modalForm.value.transporte,
    gps                : this.modalForm.value.gps,
    rampa              : this.modalForm.value.rampa,
    refrigerado        : this.modalForm.value.refrigerado,
    sede               : this.modalForm.value.sede,
    usuario            : this.auth.dataUsuario['id_usuario'], 
    modelo             : this.modalForm.value.modelo,
    tonelada           : this.modalForm.value.tonelada,
    metraje            : this.modalForm.value.metraje,
    anio               : this.modalForm.value.anio,
    color               : this.modalForm.value.color,
  } 
  this.transporteService.put( url,params ).subscribe(
    res=>{
      if(!res.hasError){
          if ( res?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
            this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
            this.dialogRef.close()
          }
      }else{
        this.toast.mensajeError(String(res?.errors),"Error")
      }
    }
  )
}

submit(){
    if( this.data['bandera'] == 2 ){
      this.insertar()
    }
    if( this.data['bandera'] == 3 ){
      this.actualizar()
    }
}

close(){
  this.dialogRef.close()
}

}


interface Transportes {
idTransportista     ?: number, 
nombreEmpresa       ?: string, 
RTNEmpresa          ?: string, 
direccionEmpresa    ?: string, 
telefonoEmpresa     ?: string, 
nombrePropietario   ?: string, 
celularPropietario  ?: string, 
estado              ?: string, 
idSede              ?: string, 
CODIGO              ?: string, 
}