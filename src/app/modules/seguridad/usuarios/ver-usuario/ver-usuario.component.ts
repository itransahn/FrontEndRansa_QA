import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { usuarioEspecifico } from 'src/app/interfaces/generales';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-ver-usuario',
  templateUrl: './ver-usuario.component.html',
  styleUrls: ['./ver-usuario.component.scss']
})
export class VerUsuarioComponent implements OnInit {
  public dataUsuario : usuarioEspecifico[] = [];
  public usuarioForm : FormGroup;
  UrlImagenDefault = "../../../../../assets/images/user.png";

  constructor( private usuarioS : UsuarioService, 
    private dialogRef:MatDialogRef<VerUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit() {
    this.cargarUsuario( this.data['idUsuario']);
    this.cargarForm();
  }

  cargarUsuario( idUsuario ){
    let url = '/seguridad/usuarioEspecifico';
    let params = {
      idUsuario :  idUsuario
    }
    this.usuarioS.post(url,params).subscribe(
      res=>{
          this.dataUsuario = res?.data.Table0[0];
          this.cargarFormulario();
      }
    )
  }

  close(){
    this.dialogRef.close()
  }

  cargarForm(){
    this.usuarioForm = new FormGroup({
        nombre        : new FormControl( { value : '', disabled : false }, [ ] ),
        telefono      : new FormControl( { value : '', disabled : false }, [ ] ),
        direccion     : new FormControl( { value : '', disabled : false }, [ ] ),
        nacimiento    : new FormControl( { value : '', disabled : false }, [ ] ),
        edad          : new FormControl( { value : '', disabled : false }, [ ] ),
        identidad     : new FormControl( { value : '', disabled : false }, [ ] ),
        correo        : new FormControl( { value : '', disabled : false }, [ ] ),
        sexo          : new FormControl( { value : '', disabled : false }, [ ] ),
        departamento  : new FormControl( { value : '', disabled : false }, [ ] ),
        ciudad        : new FormControl( { value : '', disabled : false }, [ ] ),
        tipoSangre    : new FormControl( { value : '', disabled : false }, [ ] ),
        usuarioRansa  : new FormControl( { value : '', disabled : false }, [ ] ),
        fechaIngreso  : new FormControl( { value : '', disabled : false }, [ ] ),
        deptoFisico   : new FormControl( { value : '', disabled : false }, [ ] ),
        puesto        : new FormControl( { value : '', disabled : false }, [ ] ),
        usuario       : new FormControl( { value : '', disabled : false }, [ ] ),
        rol           : new FormControl( { value : '', disabled : false }, [ ] ),
        CCO           : new FormControl( { value : '', disabled : false }, [ ] ),
        sede          : new FormControl( { value : '', disabled : false }, [ ] ),
    })
  }


cargarFormulario(){
this.usuarioForm.setValue({
nombre       : this.dataUsuario['Nombre'],
telefono     : this.dataUsuario['telefono'],
direccion    : this.dataUsuario['direccion'],
nacimiento   : this.dataUsuario['fechaNacimiento'],
edad         : this.dataUsuario['edad'],
identidad    : this.dataUsuario['identidad'],
correo       : this.dataUsuario['correo'],
sexo         : this.dataUsuario['sexo'],
departamento : this.dataUsuario['departamento'],
ciudad       : this.dataUsuario['ciudad'],
tipoSangre   : this.dataUsuario['TipoSangre'],
usuarioRansa : this.dataUsuario['id_usuarioRansa'],
fechaIngreso : this.dataUsuario['FechaIngreso'],
deptoFisico  : this.dataUsuario['departamentoFisico'],
puesto       : this.dataUsuario['Puesto'],
usuario      : this.dataUsuario['Usuario'],
rol          : this.dataUsuario['rol'],
CCO          : this.dataUsuario['CentroCosto'],
sede         : this.dataUsuario['Sede']
    })
  }
  
// cargarFormulario(){
//   this.usuarioForm.setValue({
//   nombre       :  "MARIO",
//   telefono     :  "MARIO",
//   direccion    :  "MARIO",
//   nacimiento   :  "MARIO",
//   edad         :  "MARIO",
//   identidad    : "MARIO",
//   correo       :  "MARIO",
//   sexo         :  "MARIO",
//   departamento :  "MARIO",
//   ciudad       :  "MARIO",
//   tipoSangre   :  "MARIO",
//   usuarioRansa :  "MARIO",
//   fechaIngreso :  "MARIO",
//   deptoFisico  : "MARIO",
//   puesto       :  "MARIO",
//   usuario      :  "MARIO",
//   rol          : "MARIO",
//   CCO          :  "MARIO",
//   sede         : "MARIO",
//       })
//     }
}
