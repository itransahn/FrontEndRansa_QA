import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { SsmoaService } from '../../ssmoa.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { DataApi } from 'src/app/interfaces/dataApi';

@Component({
  selector: 'app-ver-imagenes-cargadas',
  templateUrl: './ver-imagenes-cargadas.component.html',
  styleUrls: ['./ver-imagenes-cargadas.component.scss']
})
export class VerImagenesCargadasComponent implements OnInit {
  public filtro: FormGroup;
  public images : any[] = [];
  public Tipos = [
    {   idTipo : 1,
        Tipo   : 'Incidencia'},
    {   idTipo : 2,
        Tipo   : 'Auditoria'}
  ]
  public meses  = [
    {  idMes : 1, mes :'Enero'},
    {  idMes : 2, mes :'Febrero'},
    {  idMes : 3, mes :'Marzo'},
    {  idMes : 4, mes :'Abril'},
    {  idMes : 5, mes :'Mayo'},
    {  idMes : 6, mes :'Junio'},
    {  idMes : 7, mes :'Julio'},
    {  idMes : 8, mes :'Agosto'},
    {  idMes : 9, mes :'Septiembre'},
    {  idMes : 10, mes :'Octubre'},
    {  idMes : 11, mes :'Noviembre'},
    {  idMes : 12, mes :'Diciembre'}

  ];
  public Sedes = [
    {   idSede : 1,
        Sede   : 'Sauce'},
    {   idSede : 2,
        Sede   : 'Almahsa'},
    {   idSede : 3,
        Sede   : 'Archivo'}  ,
    {   idSede : 14,
        Sede   : 'Archivo SPS'},
    {   idSede : 15,
        Sede   : 'FRIO'}    
  ]

  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl,  
    public dialog : MatDialog, 
    private service : SsmoaService, 
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal 
  ) { }

  ngOnInit(): void {
    this.Formulario();
  }


  Formulario(){
    this.filtro = new FormGroup({
      Tipo: new FormControl({ value:'',disabled: false}, Validators.required),
      Mes : new FormControl({ value:'',disabled: false}, Validators.required),
      Anio: new FormControl({ value:'',disabled: false}, Validators.required),
      Sede: new FormControl({ value:'',disabled: false}, Validators.required)
    })
  }


  CargarImages(){
    let url = '/ssmoa/Imagenes';
    let dataV = this.filtro.value;
    let params = {
      Tipo : dataV?.Tipo, 
      Mes  : dataV?.Mes, 
      Anio : dataV?.Anio, 
      Sede : dataV?.Sede
    }  
    this.service.get(url,params).subscribe(
      (res:DataApi | any )=>{
        if(!res.hasError){
          this.images = res?.data?.Table0;
        }
      }
    )
  }

returnLocal( path : string){
  let image    : string   = `http://localhost:3000${path}`;
  return image
}

returnServer( path : string){
  let image : string  = `http://10.130.65.223:3000${path}`;
  return image
}



}
