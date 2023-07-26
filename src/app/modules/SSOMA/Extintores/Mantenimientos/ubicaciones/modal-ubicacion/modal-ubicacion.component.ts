import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { catalogoExt } from 'src/app/interfaces/ssmoa';
import { SsmoaService } from 'src/app/modules/SSOMA/ssmoa.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-modal-ubicacion',
  templateUrl: './modal-ubicacion.component.html',
  styleUrls: ['./modal-ubicacion.component.scss']
})
export class ModalUbicacionComponent implements OnInit {

  public  FormModule   : FormGroup;
  public  dataCatalogo : catalogoExt[]= [];
  public  visible   : boolean = false; 
  public  enable    : boolean = false;
  public  botton     : boolean = false;
  public  catalogo  : any;
  public  titulo    : string;
  public  subtitulo : string;

  constructor( 
  private dialogRef:MatDialogRef<ModalUbicacionComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any, 
  public auth:AuthService,
  public toast:ToastServiceLocal, 
  public service : SsmoaService
  ) {   }

  ngOnInit() {
    this.catalogo = this.auth.returnCatalogo()
    this.validacion();
    this.cargarCatalogo();
  }

validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = this.data?.['Pantalla']
      this.subtitulo  = String(this.data['Descripcion']); 
      this.cargarFormGet(),
      this.SetForm()
    }

    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Creación`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }

    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `Actualizacion` 
      this.subtitulo  = String(this.data['Descripcion']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

cargarFormGet(){
      this.FormModule = new FormGroup({
        ubicacion    : new FormControl({ value: '', disabled : this.enable }, [] ),
        sede         : new FormControl({ value: '', disabled : this.enable }, [] )
      })

}

cargarFormPost(){
    this.FormModule = new FormGroup({
      ubicacion    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      sede         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] )
    })
}

cargarFormPut(){
  this.FormModule = new FormGroup({
    ubicacion    : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
    sede         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] )
  })
}

SetForm(){
  this.FormModule.setValue({
    ubicacion     : this.data?.data['ubicacion'],
    sede          : this.data?.data['idSede']
  })
}

insertar(){
    let url    = '/ssmoa/Ubicaciones';
    let params = {
      ubicacion        : this.FormModule.value.ubicacion,
      sede             : this.FormModule.value.sede,
    } 
    this.service.post(url,params).subscribe(
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
  let url    = 'seguridad/actualizarRol';
  let params = {
    idRol   : this.data['idRol'],
    rol     : this.FormModule.value.rol,
    estado  : this.FormModule.value.estado,
  } 
  this.service.put( url,params ).subscribe(
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

cargarCatalogo(  ){
  let params = {
    Sede  : 1
  }
  this.service.get('/ssmoa/catalogoExt', params).subscribe(
    (res: catalogoExt | any) =>{
       this.dataCatalogo = res;
    }
  )
}

}
