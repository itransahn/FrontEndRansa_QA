import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service'
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { InforService } from '../infor.service';
import { catalogo, mensajes } from 'src/app/interfaces/generales';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';


@Component({
  selector: 'app-propietarios-infor',
  templateUrl: './propietarios-infor.component.html',
  styleUrls: ['./propietarios-infor.component.scss']
})
export class PropietariosInforComponent implements OnInit {
  public catalogo :  any[] = [];
  public propietarios : any [] = [];
  public form  : FormGroup;
  constructor(
    public auth   : AuthService,
    private toast : ToastServiceLocal,
    private ruta  : ActivatedRoute,
    private service : InforService,
    private sweet  : SweetAlertService
  ) { }

  ngOnInit()  {
    this.catalogo = this.auth.returnCatalogo()
    this.cargarForm();
    this.cargarPropietarios();

    this.service.refresh$.subscribe(
      res=>{
        this.cargarPropietarios()
      }
    )
  }

  cargarForm(){
    this.form  = new FormGroup({
        idPropietario  : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        Propietario    : new FormControl( { value : '', disabled : false }, [ Validators.required,]),
        Sede           : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
    })
  }


cargarPropietarios(){
    let url = "administracion/propietarios";
    let params = {
    }
  this.service.get( url, params ).subscribe(
    res=>{
      if(!res.hasError){
        this.propietarios = res.data.Table0;
    }else{
      this.toast.mensajeError(String(res?.errors),"Error")
  }
    }
  )  }

  insertarPropietario(){
    this.sweet.mensajeConConfirmacion("¿Seguro de Crear propietario?", "Nuevo Propietario INFOR", "question").then(
      res=>{
        if ( res ){
          let url = "administracion/propietario";
          let params = {
            idPropietario : this.form.value.idPropietario,
            Propietario   : this.form.value.Propietario,
            sede          : this.form.value.Sede, 
            usuario       : this.auth.dataUsuario['id_usuario'],
          }
        this.service.put( url, params ).subscribe(
          res=>{
            if(!res.hasError){
              if ( res?.data.Table0[0]['codigo'] == -1 ){
                  this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
              }else{
                this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
                this.form.setValue({  
                     idPropietario : '',
                     Propietario   : '',
                     Sede     : '',
                })
              }
          }else{
            this.toast.mensajeError(String(res?.errors),"Error")
        }
          }
        )
        }
      }

    )

  }
}
