import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  public  modalForm   : FormGroup;
  public  visible   : boolean = false; 
  public  enable    : boolean = false;
  public  botton     : boolean = false;
  public  catalogo  : any;
  public  titulo    : string;
  public  subtitulo : string;

  constructor(
    private dialogRef:MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth        :AuthService,
    public toast       :ToastServiceLocal,
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
      transporte : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
      cliente    : new FormControl({ value: '', disabled : this.enable }, [] )
    })
}

submit(){
  let array : any[] = [];
  array = this.modalForm.value.cliente;
   for( let i=0 ; i < array.length; i++) {
    let url    = 'transporte/clienteTransporte';
    let params = {
      transporte : this.modalForm.value.transporte,
      cliente    : array[i]
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
