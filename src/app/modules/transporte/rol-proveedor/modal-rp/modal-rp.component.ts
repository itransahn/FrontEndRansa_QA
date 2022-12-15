import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';

@Component({
  selector: 'app-modal-rp',
  templateUrl: './modal-rp.component.html',
  styleUrls: ['./modal-rp.component.scss']
})
export class ModalRPComponent implements OnInit {
  public  modalForm   : FormGroup;
  public  visible   : boolean = false; 
  public  enable    : boolean = false;
  public  botton     : boolean = false;
  public  catalogo  : any;
  public  titulo    : string;
  public  subtitulo : string;
  constructor(
    private dialogRef:MatDialogRef<ModalRPComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth        : AuthService,
    public toast       : ToastServiceLocal,
    public transporteS : TransporteService
  ) { }

  ngOnInit(){
    this.catalogo = this.transporteS.returnCatalogo()
    this.validacion();
  }

  
  validacion(){

    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true;
      this.visible = true;
      this.titulo     = `Nuevo Permiso`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }

  }
  
  cargarFormPost(){
    this.modalForm = new FormGroup({
      rol     : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      proveedor : new FormControl({ value: '', disabled : this.enable }, [] )
    })
}

submit(){
  let array : any[] = [];
  array = this.modalForm.value.proveedor;
   for( let i=0 ; i < array.length; i++) {
    let url    = 'transporte/rolProveedor';
    let params = {
      rol        : this.modalForm.value.rol ,
      proveedor  : array[i]
    };
    this.transporteS.put(url,params).subscribe(
      res=>{
        if(!res.hasError){
            if ( res?.data.Table0[0]['codigo'] == -1 ){
                this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning);
            }else{
              // this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success);
              // this.dialogRef.close();
            }
              }else{
          this.toast.mensajeError(String(res?.errors),"Error")
        }
      }
    ) 
   }
    this.toast.mensajeSuccess(String('Permisos Agregados Correctamente'), mensajes.success);
    this.dialogRef.close(); 
  
}

  close(){
    this.dialogRef.close()
  }
  

}
