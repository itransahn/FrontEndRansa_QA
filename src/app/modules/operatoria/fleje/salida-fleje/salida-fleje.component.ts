import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catalogo } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { OperatoriaService } from '../../operatoria.service';

@Component({
  selector: 'app-salida-fleje',
  templateUrl: './salida-fleje.component.html',
  styleUrls: ['./salida-fleje.component.scss']
})
export class SalidaFlejeComponent implements OnInit {
  public catalogoData : catalogo | any[] = [];
  public flejeForm  : FormGroup;
  public pattern    = /^[0-9]+$/;
  public maxLength    = 5;

  constructor(
    public  auth  : AuthService,
    private operatorioS : OperatoriaService,
    private toast : ToastServiceLocal,
    private ruta  : ActivatedRoute
  ) { }

  ngOnInit() {
    this.catalogo();
    this.cargarForm();
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] )
  }

  catalogo(){
    this.auth.returnCatalogoData().subscribe(
     (res : catalogo | any) =>{ 
      if ( res['areasRansa'] ){
        this.catalogoData = res;
      }  }
    ) 
  }

  cargarForm(){
    this.flejeForm  = new FormGroup({
        columna    : new FormControl( { value : '', disabled : false },       [ Validators.required] ),
        disponible : new FormControl( { value : '', disabled : false },       [ Validators.required] ),
        cajas : new FormControl( { value : '', disabled : false },         [ Validators.required, Validators.pattern(this.pattern),Validators.maxLength(4)]),
        Observaciones : new FormControl( { value : '', disabled : false }, [ Validators.required] ),
        proveedor :  new FormControl( { value : '', disabled : false },    [ Validators.required] ),
    })
  }

}
