import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { FacturacionService } from '../../../facturacion.service';

@Component({
  selector: 'app-modalproveedorf',
  templateUrl: './modalproveedorf.component.html',
  styleUrls: ['./modalproveedorf.component.scss']
})
export class ModalproveedorfComponent implements OnInit {

  
  public  modalF   : FormGroup;

  public  visible   : boolean = false; 
  public  enable    : boolean = false;
  public  botton     : boolean = false;


  public  catalogo  : any;
  public  titulo    : string;
  public  subtitulo : string;


  public sedes = [
    {
      idSede : 1,
      sede   : 'CD SAUCE'
    },
    {
      idSede : 2,
      sede   : 'ALMAHSA'
    },

  ]
  
  constructor(
    private dialogRef:MatDialogRef<ModalproveedorfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth:AuthService,
    public toast:ToastServiceLocal, 
    public servicio : FacturacionService
  ) { }

  ngOnInit(){
    this.catalogo = this.auth.returnCatalogo();
    this.validacion()
  }


  validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `Proveedor` 
      this.subtitulo  = String(this.data['data']?.proveedor); 
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
      this.titulo     = `Proveedor` 
      this.subtitulo  = String(this.data['data']?.proveedor); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

  cargarFormGet(){
      this.modalF = new FormGroup({
        proveedor    : new FormControl({ value: '', disabled : this.enable }, [] ),
        rtn    : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
        sede    : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
      })

  }

cargarFormPost(){
    this.modalF = new FormGroup({
      proveedor : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      rtn       : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
      sede       : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
    })
}

cargarFormPut(){
  this.modalF = new FormGroup({
    proveedor : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
    rtn       : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
    sede       : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
  })
}

SetForm(){
  this.modalF.setValue({
    proveedor     : this.data['data']?.proveedor,
    rtn     : this.data['data']?.RTN,
    sede     : this.data['data']?.idSede,
  })
}


  insert(){
    let url    = 'finanzas/Iproveedores';
    let params = {
      proveedor   : this.modalF.value.proveedor,
      rtn         : this.modalF.value.rtn,
      sede        : this.modalF.value.sede
    }
    this.servicio.put(url,params).subscribe(
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
  let url    = 'finanzas/Aproveedores';
  let params = {
    idProveedor   : this.data['data']?.idProveedor,
    proveedor     : this.modalF.value.proveedor,
    rtn           : this.modalF.value.rtn,
    sede          : this.modalF.value.sede
  } 
  this.servicio.put( url,params ).subscribe(
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
      this.insert()
    }

    if( this.data['bandera'] == 3 ){
      this.actualizar()
    }
}

close(){
  this.dialogRef.close()
}

}
