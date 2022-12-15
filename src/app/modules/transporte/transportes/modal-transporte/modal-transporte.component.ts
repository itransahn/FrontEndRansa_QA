import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { RolesService } from 'src/app/modules/seguridad/roles/roles.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-modal-transporte',
  templateUrl: './modal-transporte.component.html',
  styleUrls: ['./modal-transporte.component.scss']
})
export class ModalTransporteComponent implements OnInit {
  public  modalForm  : FormGroup;
  public  visible    : boolean = false; 
  public  enable     : boolean = false;
  public  botton     : boolean = false;
  public  catalogo   : any;
  public  titulo     : string;
  public  subtitulo  : string;

  constructor(
    private dialogRef:MatDialogRef<ModalTransporteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth : AuthService,
    public toast: ToastServiceLocal, 
    public rolService : RolesService
  ) { 

  }

  ngOnInit() {
    console.log(this.data)
    this.catalogo = this.auth.returnCatalogo()
    this.validacion();
  }

  validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `Transporte` 
      this.subtitulo  = String(this.data['nombreEmpresa']); 
      this.cargarFormGet(),
      this.SetForm()
    }

    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nuevo Transporte`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }

    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `Actualizacion` 
      this.subtitulo  = String(this.data['nombreEmpresa']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

  cargarFormGet(){
      this.modalForm = new FormGroup({
        empresa    : new FormControl({ value: '', disabled : this.enable },   [] ),
        direccion  : new FormControl({ value: '', disabled : this.enable },   [] ),
        propietario  : new FormControl({ value: '', disabled : this.enable }, [] ),
        RTN        : new FormControl({ value: '', disabled : this.enable },   [] ),
        telefonoE  : new FormControl({ value: '', disabled : this.enable },   [] ),
        sede     : new FormControl({ value: '', disabled : this.enable },   [] ),
        celularP   : new FormControl({ value: '', disabled : this.enable },   [] ),
        camiones    : new FormControl({ value: '', disabled : true }, [] ),
        Motoristas  : new FormControl({ value: '', disabled : true }, [] ),
      })

  }

  cargarFormPost(){
    this.modalForm = new FormGroup({
      empresa    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      direccion : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      propietario  : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      RTN        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      telefonoE  : new FormControl({ value: '', disabled : this.enable }, [] ),
      sede     : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      celularP   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      camiones    : new FormControl({ value: '', disabled : true }, [Validators.required] ),
      Motoristas  : new FormControl({ value: '', disabled : true }, [Validators.required] ),
    })
}

cargarFormPut(){
  this.modalForm = new FormGroup({
    empresa     : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    direccion   : new FormControl ({ value: '', disabled : this.enable }, [Validators.required] ),
    propietario  : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    RTN         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    telefonoE   : new FormControl({ value: '', disabled : this.enable }, [] ),
    sede      : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    celularP    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    camiones    : new FormControl({ value: '', disabled : true }, [Validators.required] ),
    Motoristas  : new FormControl({ value: '', disabled : true }, [Validators.required] ),
  })
}

SetForm(){
this.modalForm.setValue({
empresa     : this.data['nombreEmpresa'],
direccion   : this.data['direccionEmpresa'],
propietario : this.data['nombrePropietario'],
RTN         : this.data['RTNEmpresa'],
telefonoE   : this.data['telefonoEmpresa'],
sede      : this.data['idSede'],
celularP    : this.data['celularPropietario'],
camiones    : this.data['Camiones'],
Motoristas  : this.data['Motoristas']
  })
}


  insertarMenu(){
    let url    = 'transporte/Instransportes';
    let params = {
      nombreEmpresa  :   this.modalForm.value.empresa , 
      rtnEmpresa     :   this.modalForm.value.RTN , 
      direccion      :   this.modalForm.value.direccion , 
      telefono       :   this.modalForm.value.telefonoE , 
      nombrePropietario   :   this.modalForm.value.propietario , 
      celularPropietario  :   this.modalForm.value.celularP , 
      sede    :   this.modalForm.value.sede , 
      usuario :  this.auth.dataUsuario['id_usuario'], 
    } 
    this.rolService.post(url,params).subscribe(
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

actualizarMenu(){
  let url    = 'transporte/ActTransportes';
  let params = {
    idTransporte   :   this.data['idTransportista'],
    nombreEmpresa  :   this.modalForm.value.empresa , 
    rtnEmpresa     :   this.modalForm.value.RTN , 
    direccion      :   this.modalForm.value.direccion , 
    telefono       :   this.modalForm.value.telefonoE , 
    nombrePropietario   :   this.modalForm.value.propietario , 
    celularPropietario  :   this.modalForm.value.celularP , 
    sede    :   this.modalForm.value.sede , 
    usuario :  this.auth.dataUsuario['id_usuario'], 
  } 
  this.rolService.put( url,params ).subscribe(
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
      this.insertarMenu()
    }

    if( this.data['bandera'] == 3 ){
      this.actualizarMenu()
    }
}

close(){
  this.dialogRef.close()
}
}
