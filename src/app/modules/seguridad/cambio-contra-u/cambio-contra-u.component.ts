import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';




@Component({
  selector: 'app-cambio-contra-u',
  templateUrl: './cambio-contra-u.component.html',
  styleUrls: ['./cambio-contra-u.component.scss']
})
export class CambioContraUComponent implements OnInit {
  public contraForm: FormGroup;
  public hide: boolean = true;
  public hide2: boolean = true;
  public hide3: boolean = true;
  public MensajeError : string = "Contraseña mayor a 8 caracteres, al menos 1 Mayúscula, al menos 1 Minúscula, al menos 1 número y un carácter no numérico"
  public pattern : any = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}$/;
  public idUsuario : number;

  constructor(
    private ruta : ActivatedRoute,
    private auth : AuthService,
    public toast : ToastServiceLocal,
    public matDialog : MatDialogRef<CambioContraUComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(){
    this.FormContra();
    this.validacion()
  }

  validacion(){
    if ( this.ruta.snapshot.params['id'] != '0') {
      this.idUsuario = this.ruta.snapshot.params['id'];
    }else{
      this.auth.redirecTo(`http://${environment.env}:4200/#/`)
    }
  }

  CambioContra(){
    if ( this.contraForm.value.contraNueva != this.contraForm.value.contraNuevaC ){
      this.toast.mensajeWarning("Contraseñas deben de coincidir","Advertencia")
    }else { 

          let url = 'seguridad/contraUsuarioSis';
          let params = {
            idUsuario    :   this.auth.dataUsuario['id_usuario'],
            contraAnterior : this.contraForm.value.contraAnterior,
            contraActual  :  this.contraForm.value.contraNueva
          }
          this.auth.cambioContraUsuario( url, params ).subscribe(
            res=>{
              if(!res.hasError){
                if ( res?.data.Table0[0]['codigo'] == -1 ){
                    this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.error)
                }else{
                  this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                  // this.auth.redirecTo('http://localhost:4200/#/')
                  this.matDialog.close()
                }
            }else{
              this.toast.mensajeError(String(res?.data.Table0[0]['Mensaje']),"Error")
            }
            } 
          )
    }
  }

private FormContra(){
  this.contraForm = new FormGroup({
    contraAnterior : new FormControl('', [Validators.required,]),
    contraNueva    : new FormControl('', [Validators.required, Validators.pattern(this.pattern)]),
    contraNuevaC   : new FormControl('', [Validators.required, Validators.pattern(this.pattern)])
  })
}

close(){
  this.matDialog.close()
}

patternValidator( controlf : FormControl) {
// return ( controlf): { [key: string]: any } => {
//   if (!controlf.value) {
//     return null;
//   }
//   const regex = new RegExp(this.pattern);
//   const valid = regex.test(controlf.value);
//   return valid ? null : { invalidPassword: true };

// };

const regex  = new RegExp(this.pattern);
const valid  = regex.test(controlf.value);
return valid ;
}

}



