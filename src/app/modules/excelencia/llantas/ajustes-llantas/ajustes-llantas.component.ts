import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catalogo, mask, mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ExcelenciaService } from '../../excelencia.service';

@Component({
  selector: 'app-ajustes-llantas',
  templateUrl: './ajustes-llantas.component.html',
  styleUrls: ['./ajustes-llantas.component.scss']
})
export class AjustesLlantasComponent implements OnInit {
  public ajustesForm  : FormGroup;
  public catalogo     : any[] = [];
  public mask = mask;
  public  patter = "\d*(\.\d{0,2})?$";
  public tiposAjustes : any[] = [ 
    {
      idTipo : 1,
      ajuste : 'Positivo'
    },
    {
      idTipo : 2,
      ajuste : 'Negativo'
    }
]
  constructor(
    public  auth        : AuthService,
    private excelenciaS : ExcelenciaService,
    private toast       : ToastServiceLocal,
    private ruta        : ActivatedRoute
  ) { }

  ngOnInit(){
    this.CargarCatalogo()
    this.incializarForm();
    this.auth.CargarMenuActual( this.ruta.snapshot.params['idMenu'] )
  }

  CargarCatalogo (){
    this.auth.returnCatalogoData().subscribe(
     (res : catalogo | any) =>{ 
      if ( res['areasRansa'] ){
        this.catalogo = res;
      }  }
    ) 
  }

  incializarForm(){
    this.ajustesForm   = new FormGroup({
      ajuste      : new FormControl( '', [ Validators.required] ),
      lote        : new FormControl( '', [ Validators.required] ),
      tipoLlanta  : new FormControl( '', [ Validators.required] ),
      Cantidad    : new FormControl( '', [ Validators.required] ),
      Comentario  : new FormControl( '', [ Validators.required] )
    })
}

  post(){
  let url = 'excelencia/insertAjuste';
  let params = { 
    tipoAjuste : this.ajustesForm.value.ajuste,
    lote       : this.ajustesForm.value.lote,
    tipoLlanta : this.ajustesForm.value.tipoLlanta,
    cantidad   : this.ajustesForm.value.Cantidad,
    comentario : this.ajustesForm.value.Comentario,
    idUsuario  : this.auth.dataUsuario['id_usuario']
  }
this.excelenciaS.post(url,params).subscribe( res=>{
  if ( !res.hasError){
    if ( res?.data.Table0[0]['codigo'] == -1 ){
    this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
  }else{
    this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
    this.ajustesForm.reset()
  }
}else{
    this.toast.mensajeError(String(res?.errors),"Error")
}
})
}

}
