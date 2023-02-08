import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mask, mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';

@Component({
  selector: 'app-modal-clientes-t',
  templateUrl: './modal-clientes-t.component.html',
  styleUrls: ['./modal-clientes-t.component.scss']
})
export class ModalClientesTComponent implements OnInit {
  public  modalForm  : FormGroup;
  public  visible    : boolean = false; 
  public  enable     : boolean = false;
  public  botton     : boolean = false;
  public  catalogo   : any;
  public  catalogoT  : any;
  public  titulo     : string;
  public  subtitulo  : string;
  public mask = mask
  constructor(
    private dialogRef:MatDialogRef<ModalClientesTComponent>,
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
      this.subtitulo  = String(this.data['Cliente']); 
      this.cargarFormGet(),
      this.SetForm()
    }

    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nuevo Cliente`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }

    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `` 
      this.subtitulo  = String(this.data['Cliente']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

  cargarFormGet(){
      this.modalForm = new FormGroup({
        nombreC      : new FormControl({ value: '', disabled : this.enable },  [] ),
        direccion  : new FormControl({ value: '', disabled : this.enable },  [] ),
        rtnCliente       : new FormControl({ value: '', disabled : this.enable },  [] ),
        corto  : new FormControl({ value: '', disabled : this.enable },  [] ),
        sede  : new FormControl({ value: '', disabled : this.enable }, [] ),
        cco     : new FormControl({ value: '', disabled : this.enable }, [] )
      })
  }

  cargarFormPost(){
    this.modalForm = new FormGroup({
      nombreC     : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      direccion   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      rtnCliente  : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      corto : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      sede  : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      cco   : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    })
}

cargarFormPut(){
  this.modalForm = new FormGroup({
    nombreC     : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    direccion   : new FormControl ({ value: '', disabled : this.enable }, [Validators.required] ),
    rtnCliente  : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    corto       : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    sede        : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    cco         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] )
  })
}

SetForm(){
this.modalForm.setValue({
  nombreC       :  this.data['Cliente'], 
  direccion   :  this.data['direccion'], 
  rtnCliente        :  this.data['rtnCliente'], 
  corto   :  this.data['Corto'], 
  sede  :  this.data['idSede'], 
  cco          :  this.data['idCeco']
  })
}

  insertar(){
    let url    = 'transporte/insertClienteT';
    let params = {
      nombreCliente  : this.modalForm.value.nombreC,
      direccion   : this.modalForm.value.direccion,
      rtnCliente  : this.modalForm.value.rtnCliente,
      nombreCorto : this.modalForm.value.corto,
      sede        : this.modalForm.value.sede,
      cco         : this.modalForm.value.cco,
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
  let url    = 'transporte/AclienteT';
  let params = {
    idCliente      : this.data['ID'],
    nombreCliente  : this.modalForm.value.nombreC,
    direccion   : this.modalForm.value.direccion,
    rtnCliente  : this.modalForm.value.rtnCliente,
    nombreCorto : this.modalForm.value.corto,
    sede        : this.modalForm.value.sede,
    cco         : this.modalForm.value.cco,
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
