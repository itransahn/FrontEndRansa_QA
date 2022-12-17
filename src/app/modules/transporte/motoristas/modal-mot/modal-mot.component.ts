import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';

@Component({
  selector: 'app-modal-mot',
  templateUrl: './modal-mot.component.html',
  styleUrls: ['./modal-mot.component.scss']
})
export class ModalMotComponent implements OnInit {
  public  modalForm  : FormGroup;
  public  visible    : boolean = false; 
  public  enable     : boolean = false;
  public  botton     : boolean = false;
  public  catalogo   : any;
  public  catalogoT  : any;
  public  titulo     : string;
  public  subtitulo  : string;

  constructor(
    private dialogRef:MatDialogRef<ModalMotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth : AuthService,
    public toast: ToastServiceLocal, 
    public transporteService : TransporteService
  ) { }


  ngOnInit() {
    console.log(this.data)
    this.catalogo = this.auth.returnCatalogo();
    this.catalogoT = this.transporteService.returnCatalogo();
    this.validacion();
  }

  validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `` 
      this.subtitulo  = String(this.data['Nombre']); 
      this.cargarFormGet(),
      this.SetForm()
    }

    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nuevo Motorista`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }

    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `` 
      this.subtitulo  = String(this.data['Nombre']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

  cargarFormGet(){
      this.modalForm = new FormGroup({  
        nombre    : new FormControl({ value: '', disabled : this.enable },   [] ),
        celular   : new FormControl({ value: '', disabled : this.enable },   [] ),
        identidad : new FormControl({ value: '', disabled : this.enable },   [] ),
        vencimientoLicencia : new FormControl({ value: '', disabled : this.enable },   [] ),
        transportista : new FormControl({ value: '', disabled : this.enable },   [] )
      })

  }

  cargarFormPost(){
    this.modalForm = new FormGroup({
      nombre    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      celular   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      identidad : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      vencimientoLicencia : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      transportista : new FormControl({ value: '', disabled : this.enable }, [Validators.required] )
    })
}

cargarFormPut(){
  this.modalForm = new FormGroup({
    nombre    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    celular   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    identidad : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    vencimientoLicencia : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    transportista : new FormControl({ value: '', disabled : this.enable }, [Validators.required] )
  })
}

SetForm(){
this.modalForm.setValue({
nombre     : this.data['Nombre'],
celular    : this.data['celular'],
identidad  : this.data['identidad'],
vencimientoLicencia : this.data['FechaVencimientoLicencia'],
transportista   : this.data['idTransportista']
  })
}

  insertar(){
    let url    = 'transporte/InsCamiones';
    let params = {
      nombre  :   this.modalForm.value.nombre , 
      celular :   this.modalForm.value.celular , 
      licencia  : this.modalForm.value.identidad, 
      vencimientoLicencia   : this.modalForm.value.vencimientoLicencia , 
      identidad   :   this.modalForm.value.identidad , 
      transportista  :   this.modalForm.value.transportista , 
      usuario :  this.auth.dataUsuario['id_usuario'], 
    } 
    this.transporteService.post(url,params).subscribe(
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
    idMotorista : this.data['idMotorista'],
    nombre  :   this.modalForm.value.nombre , 
    celular :   this.modalForm.value.celular , 
    licencia  : this.modalForm.value.identidad, 
    vencimientoLicencia   : this.modalForm.value.vencimientoLicencia , 
    identidad   :   this.modalForm.value.identidad , 
    transportista  :   this.modalForm.value.transportista , 
    usuario :  this.auth.dataUsuario['id_usuario'], 
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
