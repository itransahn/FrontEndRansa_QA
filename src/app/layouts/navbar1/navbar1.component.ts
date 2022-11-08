import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { dataUsuario } from 'src/app/interfaces/generales';
import { CambioContraUComponent } from 'src/app/modules/seguridad/cambio-contra-u/cambio-contra-u.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar1',
  templateUrl: './navbar1.component.html',
  styleUrls: ['./navbar1.component.scss']
})
export class Navbar1Component implements OnInit {
  public dataUsuario : dataUsuario;
  public dataMenu : any[]= [];
  public flatImagen : boolean = false
  constructor( 
    private auth : AuthService,
    public dialog : MatDialog 
    ) { 
  this.llenarArregloMenu()
  }

  ngOnInit(): void {
    this.dataUsuario = this.auth.extraerData();
    this.validarImagen();
  }

  llenarArregloMenu(){
    this.dataMenu = [
      {
        titulo : 'Perfil',
        icon   : 'person',
        accion : 1
      },
      {
        titulo : 'Cambiar Contraseña',
        icon   : 'lock',
        accion : 2
      },
      {
        titulo : 'Cerrar Sesión',
        icon   : 'exit_to_app',
        accion : 3
      }
    ]
  }

  accion ( accion ?: number ){
    if( accion == 1 ){
      this.auth.redirecTo( `/miPerfil/${this.auth.dataUsuario['id_usuario']}`)
    }
    if( accion == 2 ){
      this.Modal()
    }
    if( accion == 3 ){
      this.auth.redirecToLogin()
      this.auth.limpiarDataLoca()

    }

  }



  Modal(  ){
    const dialogReg = this.dialog.open( CambioContraUComponent,{
      width :   '500px',
      height:   'auto',
      maxWidth: 'auto',
      data:  {  },
      disableClose : true
    })
  }
  validarImagen(){
      if ( this.dataUsuario.imgPerfil ) {
          this.flatImagen = true
      }else{
        this.flatImagen = false
      }
  }

  redireccionar(url:string){  
      if ( url = '/login') {
      }
    this.auth.redirecTo( url )
  }
}
