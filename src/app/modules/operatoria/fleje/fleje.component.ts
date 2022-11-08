import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catalogo, mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { OperatoriaService } from '../operatoria.service';

@Component({
  selector: 'app-fleje',
  templateUrl: './fleje.component.html',
  styleUrls: ['./fleje.component.scss']
})
export class FlejeComponent implements OnInit {
  public catalogoData : catalogo | any[] = [];
  public flejeForm  : FormGroup;
  public pattern    = /^[0-9]+$/;
  public maxLength    = 5;
  constructor(
    public  auth : AuthService,
    private operatorioS : OperatoriaService,
    private toast : ToastServiceLocal,
    private ruta  : ActivatedRoute
  ) { }

  ngOnInit() {
    this.catalogo();
    this.cargarForm();
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] )
  }

catalogo(){
    this.auth.returnCatalogoData().subscribe(
     (res : catalogo | any) =>{ 
      if ( res['areasRansa'] ){
        this.catalogoData = res;
      }  }
    ) 
  }

  cargarForm(){
    this.flejeForm  = new FormGroup({
        columna : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        cajas : new FormControl( { value : '', disabled : false }, [ Validators.required, Validators.pattern(this.pattern),Validators.maxLength(4)]),
        Observaciones : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        proveedor :  new FormControl( { value : '', disabled : false }, [ Validators.required] ),
    })
  }

  ingresarFlete(){
    let url = "operaciones/movimientoFleje";
    let params = {
      columna       : this.flejeForm.value.columna,
      cajas         : this.flejeForm.value.cajas,
      usuario       : this.auth.dataUsuario['id_usuario'], 
      Observaciones : this.flejeForm.value.Observaciones,
      proveedor     : this.flejeForm.value.proveedor,
      movimiento    : 1,
    }
  this.operatorioS.post( url, params ).subscribe(
    res=>{
      if(!res.hasError){
        if ( res?.data.Table0[0]['codigo'] == -1 ){
            this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
        }else{
          this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
          this.flejeForm.setValue({  
            columna :      '',
            cajas :        '',
            Observaciones :'',
            proveedor :  '',
                         })
        }
    }else{
      this.toast.mensajeError(String(res?.errors),"Error")
  }
    }
  )
  
  }

  validateFormat(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
     if (!regex.test(key)) {
      event.returnValue = false;
       if (event.preventDefault) {
        event.preventDefault();
       }
     }
    }
  

}
