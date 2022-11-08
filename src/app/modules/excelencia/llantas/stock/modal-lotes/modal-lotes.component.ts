import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catalogo, mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ExcelenciaService } from '../../../excelencia.service';

@Component({
  selector: 'app-modal-lotes',
  templateUrl: './modal-lotes.component.html',
  styleUrls: ['./modal-lotes.component.scss']
})
export class ModalLotesComponent implements OnInit {
  public estados     : any;
  public lotesForm   : FormGroup;
  public tiposLlanta : any[] = [];
  public catalogo    : any[]=[];

  constructor(
    private dialogRef: MatDialogRef <ModalLotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public auth      : AuthService,
    public seguridad : SeguridadService,
    public toast     : ToastServiceLocal,
    public excelenciaS : ExcelenciaService
  ) { }

  ngOnInit() {
    this.Cargarcatalogo();
    this.formCambios();
    this.setForm();
  }

  private formCambios(){
    this.lotesForm = new FormGroup({
      lote      : new FormControl({ value :'', disabled : true },  [ Validators.required ] ),
      precio    : new FormControl({ value :'', disabled : false }, [ Validators.required ] ),
      proveedor : new FormControl({ value :'', disabled : false }, [ Validators.required ] ),
    })
}

public setForm(){
    this.lotesForm.patchValue({
     lote    : this.data.data['Lote'],    
     precio  : this.data.data['Valor'],
     proveedor : this.data.data['idProveedor']
    })
}

submit(){
let url = 'excelencia/updLote';
let params = {
  tipoLlanta : this.data.tipoLlanta,
  lote       : this.data.data['Lote'],
  proveedor  : this.lotesForm.value?.proveedor ,
  precioAnterior : this.data.data['Valor'],
  precioNuevo :  this.lotesForm.value.precio,
  usuario     :  this.auth.dataUsuario['id_usuario']
}
this.excelenciaS.post(url,params).subscribe( res=>{
if ( !res.hasError){
  if ( res?.data.Table0[0]['codigo'] == -1 ){
    this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
}else{
    this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
  this.dialogRef.close();
}
}else{
this.toast.mensajeError(String(res?.errors),"Error")
}
})
}

Cargarcatalogo (){
  this.auth.returnCatalogoData().subscribe(
   (res : catalogo | any) =>{ 
    if ( res['areasRansa'] ){
      this.catalogo = res;
    }  }
  ) 
}

close(){
  this.dialogRef.close()
}

}
