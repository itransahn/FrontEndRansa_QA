import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catalogo, mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { OperatoriaService } from '../operatoria.service';

@Component({
  selector: 'app-asignacion-maquina',
  templateUrl: './asignacion-maquina.component.html',
  styleUrls: ['./asignacion-maquina.component.scss']
})
export class AsignacionMaquinaComponent implements OnInit {
  public asignacionForm  : FormGroup;
  public catalogo     : any[] = []; 
  constructor(
    public  auth        : AuthService,
    public  operatoriaS : OperatoriaService,
    private toast       : ToastServiceLocal,
    private ruta        : ActivatedRoute
  ) { }

  ngOnInit(){
    this.CargarCatalogo()
    this.incializarForm();
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] )
  }

  CargarCatalogo (){
    this.auth.returnCatalogoData().subscribe(
     (res : catalogo | any) =>{ 
      if ( res['areasRansa'] ){
        this.catalogo = res;
      }  }
    ) 
  }

  incializarForm(){
    this.asignacionForm   = new FormGroup({
      tipoMaquina : new FormControl( '', [ Validators.required] ),
      maquina  : new FormControl( '', [ Validators.required] ),
      areas    : new FormControl( '', [ Validators.required] ),
      empleado : new FormControl( '', [ Validators.required] ),
      Observaciones : new FormControl( '', [ Validators.required] ),
    })
}

  post(){
  let url = 'operaciones/asignarMaquina';
  let params = { 
    tipoMaquina : this.asignacionForm.value.tipoMaquina,
    area : this.asignacionForm.value.areas,
    maquina :  this.asignacionForm.value.maquina,
    supervisor : this.auth.dataUsuario['id_usuario'],
    empleado : this.asignacionForm.value.empleado,
    observaciones : this.asignacionForm.value.Observaciones
  }
this.operatoriaS.post(url,params).subscribe( res=>{
  if ( !res.hasError){
    if ( res?.data.Table0[0]['codigo'] == -1 ){
    this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']),mensajes.warning)
  }else{
    this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),mensajes.success)
    this.asignacionForm.reset()
  }
}else{
    this.toast.mensajeError(String(res?.errors),"Error")
}
})
}

}
