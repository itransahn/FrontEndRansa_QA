import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { RrhhService } from '../../rrhh.service';

@Component({
  selector: 'app-credito',
  templateUrl: './credito.component.html',
  styleUrls: ['./credito.component.scss']
})
export class CreditoComponent implements OnInit {
  public creditoForm : FormGroup;
  public flat  : boolean = false;
  public filtro: FormGroup;
  public parametrosBusqueda = ['Usuario', 'Colaborador'];
  public canjeos : any[] = [];

 public  patter = "\d*(\.\d{0,2})?$";
    //Paginacion
    public page = 0;
    public pageEvent : PageEvent;
    public pageIndex : number = 0;
    public desde = 0;
    public hasta = 50;
    public fecha = new Date()

    nextPageLabel     = 'Página Siguiente';
    previousPageLabel = 'Página Anterior';
    public pageSize   = 50;
  constructor(
    private paginator : MatPaginatorIntl, 
    public  rrhhS : RrhhService,
    public  dialog : MatDialog, 
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal,
    public  auth : AuthService,
    private ruta : ActivatedRoute
  ) { }


  ngOnInit(){
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'])
    this.incializarForm();
    this.cargarCreditos();
    this.rrhhS.refresh$.subscribe(
      res=>{
        this.cargarCreditos()
      }
    )
  }

  incializarForm(){
    this.creditoForm   = new FormGroup({
      codigoEmpleado : new FormControl( '', [ Validators.required] ),
      nombreEmpleado : new FormControl( '', [ Validators.required] ),
      monto          : new FormControl( '', [ Validators.required] ),
    })

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })
}

onKeypressEvent(event: any){
  // this.creditoForm.patchValue({
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
  let url = 'rrhh/validarUsuario';
  let params = {
    usuario : codigo
  }
  this.rrhhS.post( url, params ).subscribe (
    res=>{
      if ( res?.data.Table0[0]['codigo'] == -1 ){
        this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
    }else{
      this.creditoForm.patchValue({
        nombreEmpleado : res?.data.Table0[0]['Colaborador']
      })
    }
    }
  )

}

cargarCreditos(){
  let url = 'rrhh/credito';
  let params = { }
  this.rrhhS.get( url, params ).subscribe(
    (data : DataApi | any) =>{
      if( !data.hasError ){
        this.canjeos = data?.data?.Table0;
      }
    }
  )
}


ingresarCredito( ){
  this.sweel.mensajeConConfirmacion(`¿Seguro del crédito al empleado ${ this.creditoForm.value.nombreEmpleado } ?`, `Crédito Cafetería`,"warning").then(
    res=>{
        if ( res ){
          let url = 'rrhh/insertarCredito';
          let params = {
            idEmpleado : this.creditoForm.value.codigoEmpleado,
            monto      : this.creditoForm.value.monto
          }
          this.rrhhS.post( url, params ).subscribe(
            res=>{
              if(!res.hasError){
                if ( res?.data.Table0[0]['codigo'] == -1 ){
                    this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                }else{
                  this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
                  this.cargarCreditos()
                  this.creditoForm.setValue({
                    codigoEmpleado : '',
                    nombreEmpleado : '',
                    monto          : ''
                  })
                }
            }else{
              this.toast.mensajeError(String(res?.errors),"Error")
          }
                 }
          )
        }else{ }
    }
  )




}



}
