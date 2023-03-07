import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { mensajes } from 'src/app/interfaces/generales';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';

@Component({
  selector: 'app-modal-pro',
  templateUrl: './modal-pro.component.html',
  styleUrls: ['./modal-pro.component.scss']
})
export class ModalProComponent implements OnInit {
  public  modalForm   : FormGroup;
  public  visible   : boolean = false; 
  public  enable    : boolean = false;
  public  botton     : boolean = false;
  public  catalogo  : any;
  public  titulo    : string;
  public  subtitulo : string;
  public  idValor    : number;
  filteredOptions : Observable<any[]>;
  constructor(
    private dialogRef:MatDialogRef<ModalProComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth        :AuthService,
    public toast       :ToastServiceLocal,
    public transporteS : TransporteService,
    public sharedS : SharedService
  ) { }

  ngOnInit(){
    this.catalogo = this.transporteS.returnCatalogo()
    this.validacion();

    this.filteredOptions =  this.modalForm.get('transporte').valueChanges.pipe(
      startWith(''),
      map(value => {
      const  proveedor = typeof value === 'string' ? value : value?.proveedor;
      return  this.sharedS._filter(this.catalogo?.['transportes'],proveedor, 'nombreEmpresa')
      }),
    );
  }

  setearValor( data ?: any){
    this.idValor = data?.idTransportista;
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
    let url    = 'transporte/proveedorTransporte';
    let params = {
      transporte : this.modalForm.value.transporte,
      proveedor    : array[i]
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
