import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { RrhhService } from '../rrhh.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-registro-dolar-sps',
  templateUrl: './registro-dolar-sps.component.html',
  styleUrls: ['./registro-dolar-sps.component.scss']
})
export class RegistroDolarSpsComponent implements OnInit {

  public dolarForm : FormGroup;
  public flat  : boolean = false;
  public filtro: FormGroup;

  public parametrosBusqueda = ['USUARIO', 'Nombre', 'Departamento'];
  public canjeos : any[] = [];

    //Paginacion
    public page = 0;
    public pageEvent : PageEvent;
    public pageIndex : number = 0;
    public desde = 0;
    public hasta = 50;
    public fecha = new Date()

    nextPageLabel     = 'Página Siguiente';
    previousPageLabel = 'Página Anterior';
    public pageSize = 50;
  constructor(
    private paginator : MatPaginatorIntl, 
    public  rrhhS  : RrhhService, 
    public  dialog : MatDialog, 
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal,
    public  auth  : AuthService 
  ) { }

  ngOnInit(): void {
    this.incializarForm()
    this.cargarCanjeos()
  }

  incializarForm(){
      this.dolarForm   = new FormGroup({
        codigoEmpleado : new FormControl( '', [ Validators.required, Validators.minLength(9)] ),
        nombreEmpleado : new FormControl( '', [ Validators.required] ),
      })

      this.filtro = new FormGroup({
        filtrar: new FormControl({ value:'',disabled: false})
      })
  }

  onKeypressEvent(event: any){
    // this.dolarForm.patchValue({
    //   nombreEmpleado : ''
    // })

    if(event.keyCode===13){
      this.CargarUsuario( event?.target?.value );
    }
   
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
    
  CargarUsuario( codigo?:any ){
    this.dolarForm.patchValue({
      nombreEmpleado: ''
    })
    let url = 'rrhh/validarUsuario';
    let params = {
      usuario : codigo
    }
    this.rrhhS.post( url, params ).subscribe (
      res=>{
        if ( res?.data.Table0[0]['codigo'] == -1 ){
          this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
      }else{
        this.dolarForm.patchValue({
          nombreEmpleado : res?.data.Table0[0]['Colaborador']
        })
        // this.cargarRoles()
      }
      }
    )

  }

  cargarCanjeos(){
    let url = 'rrhh/canjeoDolarSps';
    let params = { }
    this.rrhhS.get( url, params ).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.canjeos = data?.data?.Table0;
        }
      }
    )
  }


  ingresarDolar(){
    this.sweel.mensajeConConfirmacion(`¿Desea canjear el dolar del empleado ${ this.dolarForm.value.nombreEmpleado} ?`, `Dolar Cafetería`,"warning").then(
      res=>{
        if ( res ) {
          let url = 'rrhh/insertarDolar';
          let params = {
            usuario : this.dolarForm.value.codigoEmpleado
          }
          this.rrhhS.post( url, params ).subscribe(
            res=>{
              if(!res.hasError){
                if ( res?.data.Table0[0]['codigo'] == -1 ){
                    this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                }else{
                    this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
                  this.cargarCanjeos()
                  this.dolarForm.setValue({
                    codigoEmpleado : '',
                    nombreEmpleado : ''
                  })
                }
            }else{
              this.toast.mensajeError(String(res?.errors),"Error")
          }
                 }
          )
        } 
      })
  }

}
