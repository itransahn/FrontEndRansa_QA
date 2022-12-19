import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';

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
  
  constructor(
    private dialogRef:MatDialogRef<ModalCaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth : AuthService,
    public toast: ToastServiceLocal, 
    public transporteService : TransporteService
  ) { }

  
  ngOnInit() {
    this.catalogo  = this.auth.returnCatalogo();
    this.catalogoT = this.transporteService.returnCatalogo();
    this.validacion();
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
        camion      : new FormControl({ value: '', disabled : this.enable },  [] ),
        tipoUnidad  : new FormControl({ value: '', disabled : this.enable },  [] ),
        placa       : new FormControl({ value: '', disabled : this.enable },  [] ),
        transporte  : new FormControl({ value: '', disabled : this.enable },  [] ),
        dimenciones  : new FormControl({ value: '', disabled : this.enable }, [] ),
        gps     : new FormControl({ value: '', disabled : this.enable }, [] ),
        rampa   : new FormControl({ value: '', disabled : this.enable }, [] ),
        refrigerado    : new FormControl({ value: '', disabled : true }, [] ),
        sede  : new FormControl({ value: '', disabled : true }, [] ),
      })
  }

  cargarFormPost(){
    this.modalForm = new FormGroup({
      camion       : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      tipoUnidad   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      placa        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      transporte   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      dimenciones  : new FormControl({ value: '', disabled : this.enable }, [] ),
      gps          : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      rampa        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      refrigerado  : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      sede         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    })
}

cargarFormPut(){
  this.modalForm = new FormGroup({
    camion       : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    tipoUnidad   : new FormControl ({ value: '', disabled : this.enable }, [Validators.required] ),
    placa        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    transporte   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    dimenciones  : new FormControl({ value: '', disabled : this.enable }, [] ),
    gps          : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    rampa        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    refrigerado  : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    sede         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
  })
}

SetForm(){
this.modalForm.setValue({
  camion       :  this.data['camion'], 
  tipoUnidad   :  this.data['idUnidad'], 
  placa        :  this.data['placa'], 
  transporte   :  this.data['idTransportista'], 
  dimenciones  :  this.data['dimensiones'], 
  gps          :  this.data['GPS'], 
  rampa        :  this.data['Rampa'], 
  refrigerado  :  this.data['Refrigerado'], 
  sede         :  this.data['idSede'], 
  })
}


  insertar(){
    let url    = 'transporte/InsCamiones';
    let params = {
      descripcionCamion  : this.modalForm.value.camion,
      tipoUnidad         : this.modalForm.value.tipoUnidad,
      placa              : this.modalForm.value.placa,
      idTransportista    : this.modalForm.value.transporte,
      dimenciones        : this.modalForm.value.dimenciones,
      gps                : this.modalForm.value.gps,
      rampa              : this.modalForm.value.rampa,
      refrigerado        : this.modalForm.value.refrigerado,
      sede               : this.modalForm.value.sede,
      usuario            :  this.auth.dataUsuario['id_usuario'], 
    } 
    this.transporteService.put(url,params).subscribe(
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

actualizar(){
  let url    = 'transporte/ActCamiones';
  let params = {
    idCamion           : this.data['idCamion'],
    descripcionCamion  : this.modalForm.value.camion,
    tipoUnidad         : this.modalForm.value.tipoUnidad,
    placa              : this.modalForm.value.placa,
    idTransportista    : this.modalForm.value.idTransportista,
    dimenciones        : this.modalForm.value.dimenciones,
    gps                : this.modalForm.value.gps,
    rampa              : this.modalForm.value.rampa,
    refrigerado        : this.modalForm.value.refrigerado,
    sede               : this.modalForm.value.sede,
    usuario            : this.auth.dataUsuario['id_usuario'], 
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
