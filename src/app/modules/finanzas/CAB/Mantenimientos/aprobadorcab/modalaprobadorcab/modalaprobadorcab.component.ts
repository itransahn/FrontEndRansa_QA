import { Component, OnInit, Inject} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { FacturacionService } from 'src/app/modules/finanzas/facturacion.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';


@Component({
  selector: 'app-modalaprobadorcab',
  templateUrl: './modalaprobadorcab.component.html',
  styleUrls: ['./modalaprobadorcab.component.scss']
})
export class ModalaprobadorcabComponent implements OnInit {

  public  FormModule   : FormGroup;

  public  visible   : boolean = false; 
  public  enable    : boolean = false;
  public  botton     : boolean = false;

  public  catalogo  : any;
  public  titulo    : string;
  public  subtitulo : string;

  public tipo = [
    {
      idTipo : 0,
      tipo   : 'Por área'
    },
    {
      idTipo : 1,
      tipo   : 'Todos'
    },
  ]

  constructor(
    private dialogRef:MatDialogRef<ModalaprobadorcabComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth:AuthService,
    public toast:ToastServiceLocal, 
    public service : FacturacionService
  ) { }

  ngOnInit() {
    this.catalogo = this.auth.returnCatalogo()
    this.validacion();
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
      this.visible    = true;
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
      this.subtitulo  = String( this.data?.data['Nombre']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

cargarFormGet(){
      this.FormModule = new FormGroup({
        idUsuario      : new FormControl({ value: '', disabled : this.enable }, [] ),
        idSede         : new FormControl({ value: '', disabled : this.enable }, [] ),
        idArea         : new FormControl({ value: '', disabled : this.enable }, [] ),
        tipoAprobacion : new FormControl({ value: '', disabled : this.enable }, [] )
      })

  }

cargarFormPost(){
    this.FormModule = new FormGroup({
      idUsuario : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      idSede       : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      idArea         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      tipoAprobacion          : new FormControl({ value: '', disabled : this.enable }, [Validators.required] )
    })
}

cargarFormPut(){
  this.FormModule = new FormGroup({
    idUsuario      : new FormControl({ value: '', disabled : true }, [Validators.required] ),
      idSede       : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      idArea         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      tipoAprobacion          : new FormControl({ value: '', disabled : this.enable }, [Validators.required] )
  })
}

SetForm(){
  this.FormModule.setValue({
    idUsuario : this.data?.data['idUsuario'],
    idSede       : this.data?.data['idSede'],
    idArea         : this.data?.data['idArea'],
    tipoAprobacion          : this.data?.data['idTipoAprobacion']
  })
}

insertar(){
    let url    = 'finanzas/aprobadorCab';
    let params = {
      idUsuario : this.FormModule.value.idUsuario,
      area       : this.FormModule.value.idArea,
      sede         : this.FormModule.value.idSede,
      tipo          : this.FormModule.value.tipoAprobacion
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
  let url    = 'finanzas/aprobadorCab';
  let params = {
    idAprobador  : this.data?.data['idAprobador'],
    idUsuario    : this.data?.data['idUsuario'],
    area         : this.FormModule.value.idArea,
    sede         : this.FormModule.value.idSede,
    tipo         : this.FormModule.value.tipoAprobacion,
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

}
