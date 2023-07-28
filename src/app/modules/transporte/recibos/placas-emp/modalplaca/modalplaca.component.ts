import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../../transporte.service';
import {mask} from '../../../../../interfaces/generales';
import { map, Observable, startWith } from 'rxjs';
import { SharedService } from 'src/app/modules/shared/shared.service';

@Component({
  selector: 'app-modalplaca',
  templateUrl: './modalplaca.component.html',
  styleUrls: ['./modalplaca.component.scss']
})
export class ModalplacaComponent implements OnInit {

  public  Form   : FormGroup;
  public  visible   : boolean = false; 
  public  enable    : boolean = false;
  public  enableP   : boolean = false;
  public  botton     : boolean = false;
  public  catalogo  : any;
  public  titulo    : string;
  public  subtitulo : string;
  public mask       =  mask;
  public idUsuario : number;
  filteredOptions:  Observable<string[]>;

  
  constructor(
    private dialogRef:MatDialogRef<ModalplacaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth:AuthService,
    public toast:ToastServiceLocal, 
    public service : TransporteService,
    public sharedS : SharedService
  ) { }

  ngOnInit() {
    this.catalogo = this.auth.returnCatalogo();
this.validacion()
  }

  validacion(){
    if ( this.data?.['bandera'] == 1 ){
      this.enable     = true;
      this.enableP    = true;
      this.visible    = true;
      this.botton     = false;
      this.idUsuario  =  this.data?.['data']['idUsuario'];
      this.titulo     = `Placa` 
      this.subtitulo  = String(this.data?.['data']['usuario']); 
      this.cargarFormGet(),
      this.SetForm()
    }

    if ( this.data?.['bandera'] == 2 ){
      this.enableP    = false;
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nueva Placa Empleado`;
      this.subtitulo  = ''; 
      this.cargarFormPost();
      this.precargarData()
    }

    if ( this.data?.['bandera'] == 3 ){
      this.enable     = true;
      this.enableP     = false;
      this.visible    = true;
      this.botton     = true;
      this.idUsuario  =  this.data?.['data']['idUsuario'];
      this.titulo     = `Actualización de Placa` 
      this.subtitulo  = String(this.data?.['data']['usuario']); 
      this.cargarFormPut()
      this.SetForm()
    }
}

precargarData(){
  this.filteredOptions =  this.Form.get('usuario').valueChanges.pipe(
    startWith(''),
    map(value => {
    const  proveedor = typeof value === 'string' ? value : value?.cliente;
    return  this.sharedS._filter(this.catalogo?.['usuarios'],proveedor, 'usuario')
    }),
  );
}

cargarFormGet(){
  this.Form = new FormGroup({
    usuario    : new FormControl({ value: '', disabled : this.enable }, [] ),
    placa      : new FormControl({ value: '', disabled : this.enableP }, [] )
  })

}

cargarFormPost(){
this.Form = new FormGroup({
  usuario  : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
  placa    : new FormControl({ value: '', disabled : this.enableP }, [] )
})
}

cargarFormPut(){
this.Form = new FormGroup({
usuario    : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
placa      : new FormControl( { value: '', disabled : this.enableP }, [Validators.required] )
})
}

SetForm(){
this.Form.setValue({
usuario  : this.data?.['data']['idUsuario'],
placa    : this.data?.['data']['placa']
})
}

setearID( option ?: any   ){
  this.idUsuario = option?.ID
  }


insertarPlaca(){
let url    = 'transporte/IplacaEmpleado';
let params = {
placa     : this.Form.value.placa,
usuario   : this.idUsuario,
} 
this.service.put(url,params).subscribe(
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

actualizarPlaca(){
let url    = 'transporte/UplacaEmpleado';
let params = {
placa   : this.Form.value.placa,
usuario   : this.idUsuario,
idRegistro : this.data?.['data']?.['registro']
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
  this.insertarPlaca()
}
if( this.data['bandera'] == 3 ){
  this.actualizarPlaca()
}
}

close(){
this.dialogRef.close()
}
  

}
