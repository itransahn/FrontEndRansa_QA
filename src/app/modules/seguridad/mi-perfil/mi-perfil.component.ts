import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneraRandomPassword, mask, mensajes } from 'src/app/interfaces/generales';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { RolesService } from '../roles/roles.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../usuarios/usuario.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})
export class MiPerfilComponent implements OnInit {
  public usuarioForm : FormGroup;
  public mask = mask;
  file: any;
  photoSelected: any;
  prueba : any;
  UrlImagenDefault = "../../../../../assets/images/user.png";
  catalogo : any[];
  public bandera     : boolean = false;
  public banderaRuta : boolean = false;
  public dataUsuario : any;
  constructor(
    private auth  : AuthService,    
    private seguridadS : SeguridadService,
    private ruta  : ActivatedRoute, 
    private usuarioS : UsuarioService,
    private toast : ToastServiceLocal,
  
  ) { }

  ngOnInit(){
    this.cargarForm();
    // this.cargarUsuario( this.ruta.snapshot.params['idUsuario'] )
    // this.cargarFormulario();
  }

  cargarForm(){
    this.usuarioForm = new FormGroup({
        nombre       : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        telefono     : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        direccion    : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        nacimiento   : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        tipoId       : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        identidad    : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        correo       : new FormControl( { value : '', disabled : false }, [ Validators.required, Validators.email] ),
        id_sexo      : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        departamento : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        idCiudad     : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        tipoSangre   : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        usuarioRansa : new FormControl( { value : '', disabled : true  }, [ Validators.required] ),
        fechaIngreso : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        deptoFisico  : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        idPuesto     : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        url_imagen   : new FormControl( { value : '', disabled : false }, [ ] ),
        usuario      : new FormControl( { value : '', disabled : true  }, [ Validators.required] ),
        rol          : new FormControl( { value : '', disabled : true  }, [ Validators.required] ),
        cco          : new FormControl( { value : '', disabled : true  }, [ Validators.required] ),
        idSede       : new FormControl( { value : '', disabled : true  }, [ Validators.required] ),
    })
  }
  
  cargarCatalogo(){
    let url = 'seguridad/catalogo';
    this.seguridadS.get(url).subscribe(
      res =>{
         if ( !res.hasError){
            this.catalogo = res
           this.bandera = true;
         }
      }
    );
  }

  cargarUsuario( idUsuario ){
    let url = '/seguridad/usuarioEspecifico';
    let params = {
      idUsuario :  idUsuario
    }
    this.usuarioS.post(url,params).subscribe(
      res=>{
          this.dataUsuario = res?.data.Table0[0];
          console.log(this.dataUsuario)
          this.cargarFormulario()
      }
    )
  }

  cargarFormulario(){
    this.usuarioForm.setValue({
      nombre        : this.dataUsuario?.Nombre,
      telefono      : this.dataUsuario?.telefono,
      direccion     : this.dataUsuario?.direccion,
      nacimiento    : this.dataUsuario?.fechaNacimiento,
      tipoId        : this.dataUsuario?.id_tipoIdentificacion,
      identidad     : this.dataUsuario?.identidad,
      correo        : this.dataUsuario?.correo,
      id_sexo       : this.dataUsuario?.id_sexo,
      departamento  : this.dataUsuario?.IdDepartamento,
      idCiudad      : this.dataUsuario?.id_ciudad,
      tipoSangre    : this.dataUsuario?.id_tipoSangre,
      usuarioRansa  : this.dataUsuario?.id_usuarioRansa,
      fechaIngreso  : this.dataUsuario?.FechaIngreso,
      deptoFisico   : this.dataUsuario?.id_departamentoFisico,
      idPuesto      : this.dataUsuario?.id_puesto,
      url_imagen    : this.dataUsuario?.IMAGEN,
      usuario       : this.dataUsuario?.Usuario,
      rol           : this.dataUsuario?.id_rol,
      cco           : this.dataUsuario?.id_cco,
      idSede        : this.dataUsuario?.id_sede
    })
  }
}
