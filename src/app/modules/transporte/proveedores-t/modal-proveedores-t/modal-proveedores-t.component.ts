import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';

@Component({
  selector: 'app-modal-proveedores-t',
  templateUrl: './modal-proveedores-t.component.html',
  styleUrls: ['./modal-proveedores-t.component.scss']
})
export class ModalProveedoresTComponent implements OnInit {
  public  modalForm  : FormGroup;
  public  visible    : boolean = false; 
  public  enable     : boolean = false;
  public  botton     : boolean = false;
  public  catalogo   : any;
  public  catalogoT  : any;
  public  titulo     : string;
  public  subtitulo  : string;
  constructor(
    private dialogRef:MatDialogRef<ModalProveedoresTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth : AuthService,
    public toast: ToastServiceLocal, 
    public transporteService : TransporteService
  ) { }

  ngOnInit() {
    this.catalogo  = this.auth.returnCatalogo();
    this.validacion();
  }

  validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `` 
      this.subtitulo  = String(this.data['Proveedor']); 
      this.cargarFormGet(),
      this.SetForm()
    }

    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nuevo Proveedor`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }

    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `` 
      this.subtitulo  = String(this.data['Proveedor']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

  cargarFormGet(){
      this.modalForm = new FormGroup({
        Proveedor      : new FormControl({ value: '', disabled : this.enable },  [] ),
        corto  : new FormControl({ value: '', disabled : this.enable },  [] ),
        direccion       : new FormControl({ value: '', disabled : this.enable },  [] ),
        rtnProveedor  : new FormControl({ value: '', disabled : this.enable },  [] ),
        sede  : new FormControl({ value: '', disabled : this.enable }, [] )
      })
  }

  cargarFormPost(){
    this.modalForm = new FormGroup({
      Proveedor     : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      corto   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      direccion  : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      rtnProveedor : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      sede  : new FormControl({ value: '', disabled : this.enable }, [Validators.required] )
    })
}

cargarFormPut(){
  this.modalForm = new FormGroup({
    Proveedor     : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    corto   : new FormControl ({ value: '', disabled : this.enable }, [Validators.required] ),
    direccion  : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    rtnProveedor       : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    sede        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] )
  })
}

SetForm(){
this.modalForm.setValue({
  Proveedor       :  this.data['Proveedor'], 
  corto   :  this.data['Corto'], 
  direccion        :  this.data['direccion'], 
  rtnProveedor   :  this.data['rtnProveedor'], 
  sede  :  this.data['idSede']
  })
}

insertar(){
    let url    = 'transporte/insertProveedorT';
    let params = {
      nombreProveedor : this.modalForm.value.Proveedor,
      direccion     :   this.modalForm.value.direccion,
      rtnProveedor  : this.modalForm.value.rtnProveedor,
      nombreCorto : this.modalForm.value.corto,
      sede        : this.modalForm.value.sede,
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
  let url    = 'transporte/AproveedorT';
  let params = {
    idProveedor      : this.data['ID'],
    nombreProveedor  : this.modalForm.value.Proveedor,
    direccion   : this.modalForm.value.direccion,
    rtnProveedor  : this.modalForm.value.rtnProveedor,
    nombreCorto : this.modalForm.value.corto,
    sede        : this.modalForm.value.sede,
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
