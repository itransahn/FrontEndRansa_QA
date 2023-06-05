import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service'
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { InforService } from '../infor.service';
import { catalogo, mensajes } from 'src/app/interfaces/generales';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-mascaras-infor',
  templateUrl: './mascaras-infor.component.html',
  styleUrls: ['./mascaras-infor.component.scss']
})
export class MascarasInforComponent implements OnInit {
  public catalogo :  any[] = [];
  public Mascaras : any [] = [];
  public TipoOperacion = [
    {
      idTipoOperacion : 1,
      TipoOperacion   : 'R'
    },
    {
      idTipoOperacion : 2,
      TipoOperacion   : 'P'
    }
  ]
  public form  : FormGroup;
  constructor(
    public auth   : AuthService,
    private toast : ToastServiceLocal,
    private ruta  : ActivatedRoute,
    private service : InforService,
    private sweet  : SweetAlertService
  ) { }

  ngOnInit(): void {
    this.catalogo = this.auth.returnCatalogo()
    this.cargarForm();
    this.cargarMascaras();

    this.service.refresh$.subscribe(
      res=>{
        this.cargarMascaras()
      }
    )
  } 

  cargarForm(){
    this.form  = new FormGroup({
        Propietario      : new FormControl( { value : '', disabled : false }, [ Validators.required, Validators.maxLength(2)] ),
        idPropietario    : new FormControl( { value : '', disabled : false }, [ Validators.required,]),
        tipoOperacion    : new FormControl( { value : '', disabled : false }, [ Validators.required] )
    })
  }

cargarMascaras(){
    let url = "administracion/mascaras";
    let params = {
    }
  this.service.get( url, params ).subscribe(
    res=>{
      if(!res.hasError){
        this.Mascaras = res.data.Table0;
    }else{
      this.toast.mensajeError(String(res?.errors),"Error")
  }
    }
  )  }


  insertarMascara(){
    let Operacion : string;
    if ( this.form.value.tipoOperacion == 1){
      Operacion = "R"
    }else{
      Operacion = "P"
    }
    this.sweet.mensajeConConfirmacion("¿Seguro de Crear Mascara?", "Nueva Mascara INFOR", "question").then(
      res=>{
        if ( res ){
          let url = "administracion/Mascara";
          let params = {
          Propietario      : this.form.value.Propietario,
          idPropietario    : this.form.value.idPropietario,
          tipoOperacion    : Operacion,
          idtipoOperacion  : this.form.value.tipoOperacion,
          usuario          : this.auth.dataUsuario['id_usuario']
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
