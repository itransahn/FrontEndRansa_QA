import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as $ from 'jquery';
import { CambioContraUComponent } from 'src/app/modules/seguridad/cambio-contra-u/cambio-contra-u.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public dataMenu : any[] = [];
  public flatImagen : boolean = false;
  constructor(
  public auth : AuthService,
  public dialog : MatDialog ) { }

  ngOnInit(): void {
        //Toggle Click Function
        $("#menu-toggle").click(function(e) {
          e.preventDefault();
          $("#wrapper").toggleClass("toggled");
          
        });
        this.llenarArregloMenu()

        if ( this.auth.dataUsuario.imgPerfil) {
            this.flatImagen = true
        }
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
}
