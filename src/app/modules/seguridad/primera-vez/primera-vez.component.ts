import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-primera-vez',
  templateUrl: './primera-vez.component.html',
  styleUrls: ['./primera-vez.component.scss']
})
export class PrimeraVezComponent implements OnInit {
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
    public toast:ToastServiceLocal
    ) { }

 ngOnInit() {
     this.FormContra();
     this.validacion()
   }


   validacion(){
     if ( this.ruta.snapshot.params['id'] != '') {
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
             idUsuario    : this.ruta.snapshot.params['usuario'],
             contraAnterior : this.contraForm.value.codigo,
             contraActual  : this.contraForm.value.contraNueva,
           }
           this.auth.cambioContraUsuario( url, params ).subscribe(
             res=>{
              if(!res.hasError){
                if ( res?.data.Table0[0]['codigo'] == -1 ){
                    this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.error)
                }else{
                  this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                  this.auth.redirecToLogin()
                  // this.matDialog.close()
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
     codigo       : new FormControl('', [Validators.required,]),
     contraNueva  : new FormControl('', [Validators.required, Validators.pattern(this.pattern)]),
     contraNuevaC : new FormControl('', [Validators.required, Validators.pattern(this.pattern)])
   })
}

patternValidator( controlf : FormControl) {
 const regex  = new RegExp(this.pattern);
 const valid  = regex.test(controlf.value);
 return valid ;
}


}
