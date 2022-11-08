import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { ExcelenciaService } from 'src/app/modules/excelencia/excelencia.service';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-modal-ajustes',
  templateUrl: './modal-ajustes.component.html',
  styleUrls: ['./modal-ajustes.component.scss']
})
export class ModalAjustesComponent implements OnInit {
  public  ajusteForm : FormGroup;
  public  catalogo  : any;
  public  titulo    : string;
  public  subtitulo : string;
  constructor(
    private dialogRef:MatDialogRef<ModalAjustesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public  auth:AuthService,
    public  toast:ToastServiceLocal, 
    private excelenciaS : ExcelenciaService
  ) { }

  ngOnInit() {
    this.cargarForm();
    this.setForm();
    }

  cargarForm(){
    this.ajusteForm = new FormGroup({
      Fecha      : new FormControl({ value: '', disabled : true }, [Validators.required] ),
      TipoAjuste : new FormControl({ value: '', disabled : true }, [Validators.required] ),
      tipoLlanta : new FormControl({ value: '', disabled : true }, [Validators.required] ),
      lote       : new FormControl({ value: '', disabled : true }, [Validators.required] ),
      cantidad   : new FormControl({ value: '', disabled : false }, [Validators.required] ),
      comentario : new FormControl({ value: '', disabled : false }, [Validators.required] ),
    })
}

setForm(){
  this.ajusteForm.setValue({
    Fecha      : this.data['Fecha'],
    TipoAjuste : this.data['Ajuste'],
    tipoLlanta : this.data['DetalleAjuste'],
    lote       : this.data['lote'],
    cantidad   : this.data['Cantidad'],
    comentario : this.data['comentario'],
  })
}

actualizarAjuste(){
  let url    = 'excelencia/updateAjustes';
  let params = {
    idAjuste   : this.data['ID'],
    idUsuario  : this.auth.dataUsuario['id_usuario'],
    cantidad   : this.ajusteForm.value.cantidad,
    comentario : this.ajusteForm.value.comentario,
  } 
  this.excelenciaS.post(url,params).subscribe(
    res=>{
      if(!res.hasError){
          if ( res?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
            this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje'])  , mensajes.success)
            this.dialogRef.close()
          }
      }else{
        this.toast.mensajeError(String(res?.errors),"Error")
      }
    }
  )
}

close(){
  this.dialogRef.close()
}


}
