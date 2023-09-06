import { Component, OnInit, Inject} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { FacturacionService } from 'src/app/modules/finanzas/facturacion.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-modalempleadocab',
  templateUrl: './modalempleadocab.component.html',
  styleUrls: ['./modalempleadocab.component.scss']
})
export class ModalempleadocabComponent implements OnInit {

  public  FormModule   : FormGroup;

  public  visible   : boolean = false; 
  public  enable    : boolean = false;
  public  botton     : boolean = false;


  public  catalogo  : any;
  public  titulo    : string;
  public  subtitulo : string;

  constructor(
    private dialogRef:MatDialogRef<ModalempleadocabComponent>,
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
      this.subtitulo  = String(this.data['Descripcion']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

cargarFormGet(){
      this.FormModule = new FormGroup({
        cod_empleado  : new FormControl({ value: '', disabled : this.enable }, [] ),
        nombre        : new FormControl({ value: '', disabled : this.enable }, [] ),
        area          : new FormControl({ value: '', disabled : this.enable }, [] ),
        cco           : new FormControl({ value: '', disabled : this.enable }, [] ),
        sede          : new FormControl({ value: '', disabled : this.enable }, [] ),
      })

  }

cargarFormPost(){
    this.FormModule = new FormGroup({
      cod_empleado : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      nombre       : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      area         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      cco          : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      sede         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    })
}

cargarFormPut(){
  this.FormModule = new FormGroup({
    cod_empleado : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    nombre       : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    area         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    cco          : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    sede         : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
  })
}

SetForm(){
  this.FormModule.setValue({
    cod_empleado : this.data?.data['cod_empleado'],
    nombre       : this.data?.data['nombre'],
    area         : this.data?.data['idArea'],
    cco          : this.data?.data['idCco'],
    sede         : this.data?.data['idSede'],
  })
}

insertar(){
    let url    = 'finanzas/empleadoCab';
    let params = {
      cod_empleado : this.FormModule.value.cod_empleado,
      nombre       : this.FormModule.value.nombre,
      area         : this.FormModule.value.area,
      cco          : this.FormModule.value.cco,
      sede         : this.FormModule.value.sede,
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
  let url    = 'finanzas/empleadoCab';
  let params = {
    id           : this.data?.data['id'],
    cod_empleado : this.FormModule.value.cod_empleado,
    nombre       : this.FormModule.value.nombre,
    area         : this.FormModule.value.area,
    cco          : this.FormModule.value.cco,
    sede         : this.FormModule.value.sede,
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
