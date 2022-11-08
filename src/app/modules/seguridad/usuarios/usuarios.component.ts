import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DataApi } from 'src/app/interfaces/dataApi';
import { GeneraRandomPassword, mensajes, usuario } from 'src/app/interfaces/generales';
import { AdministracionService } from 'src/app/services/administracion.service';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { UsuarioService } from './usuario.service';
import { VerUsuarioComponent } from './ver-usuario/ver-usuario.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  //Paginacion
  public page = 0;
  public pageEvent : PageEvent;
  public pageIndex : number = 0;
  public desde = 0;
  public hasta = 10;
  nextPageLabel     = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';
  public pageSize = 10;
  public filter :string  = '';
  public filtro: FormGroup;
  public parametrosBusqueda = ['usuarioRansa','usuario', 'Nombre', 'rol'];
  constructor( 
    private paginator      : MatPaginatorIntl, 
    public  administracion : AdministracionService,
    public  auth           : AuthService, 
    public  usuarioS       : UsuarioService,
    public  sweel          : SweetAlertService,
    private toast          : ToastServiceLocal, 
    private dialog         : MatDialog ) {   }

  public usuarios : usuario[] = [];

  ngOnInit() {
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
    this.cargarUsuarios();
 }
  
  cargarUsuarios(){
    let url = 'seguridad/usuarios';
    let params = {};  
    this.administracion.usuarios(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.usuarios = data?.data?.Table0;
        }    
      }
    )
  }

     //Paginación de la tabla
        next(event: PageEvent) {

          if (event.pageIndex === this.pageIndex + 1) {
            this.desde = this.desde + this.pageSize;
            this.hasta = this.hasta + this.pageSize;
          }
          else if (event.pageIndex === this.pageIndex - 1) {
            this.desde = this.desde - this.pageSize;
            this.hasta = this.hasta - this.pageSize;
          }
          this.pageIndex = event.pageIndex;
        }

 redireccionar( idUsuario?: number ){
    this.auth.redirecTo(`ransa/administracion/usuario/${idUsuario}`)
 }
  
 CambiarEstado(IdUsuario ?: number, estado?: number){
  let url = 'seguridad/actualizarEUsuario';
  let params = {
    idUsuario: IdUsuario,
    estado   : estado
  };
  this.usuarioS.put(url, params).subscribe( data =>{
    if( !data.hasError ){
            this.cargarUsuarios()
    }
  })
}

EnvioCorreoContra( IdUsuario ?: number, nombreUsuario ?: string){
  this.sweel.mensajeConConfirmacion("Reenvío de contraseña", `¿Seguro de envíar contraseña generica a ${nombreUsuario}?`, "question").then(
    res=>{
      if( res ){
        let url = 'seguridad/updateContraAdmin';
        let params = {
          idUsuario:     IdUsuario,
          contra : GeneraRandomPassword
        };
        this.usuarioS.put(url, params).subscribe( data =>{
          if( !data.hasError ){
            if ( data?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(data?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
            this.toast.mensajeSuccess(String(data?.data.Table0[0]['Mensaje']),   mensajes.success)
            // this.auth.redirecTo('/ransa/administracion/usuarios')
          }
      }else{
        this.toast.mensajeError(String(data?.errors),"Error")
      }
        })
      }
    }
  )

}

ModalUsuario ( idUsuario ?: number ){
  const dialogReg = this.dialog.open( VerUsuarioComponent,{
    width :     'auto',
    height:     'auto',
    maxWidth:   '750px',
    maxHeight : '750px',
    data: { 
    idUsuario : idUsuario
    },
    disableClose : true
  })
}

}
