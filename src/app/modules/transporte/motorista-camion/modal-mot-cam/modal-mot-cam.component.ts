import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { mensajes } from 'src/app/interfaces/generales';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { TransporteService } from '../../transporte.service';

@Component({
  selector: 'app-modal-mot-cam',
  templateUrl: './modal-mot-cam.component.html',
  styleUrls: ['./modal-mot-cam.component.scss']
})
export class ModalMotCamComponent implements OnInit {
  public  modalForm  : FormGroup;
  public  catalogo   : any;
  public  catalogoT  : any;
  public  idValor    : number;
  filteredOptions : Observable<any[]>;

  constructor(
    private dialogRef:MatDialogRef<ModalMotCamComponent>,
    public auth : AuthService,
    public toast: ToastServiceLocal, 
    public transporteService : TransporteService,
    public sharedS : SharedService

  ) { }

  ngOnInit() {
    this.catalogo  = this.transporteService.returnCatalogo();
    this.cargarForm();
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

  cargarForm(){
    this.modalForm = new FormGroup({
      transporte : new FormControl({ value: '', disabled : false }, [Validators.required] ),
      motorista : new FormControl({ value: '', disabled : false }, [Validators.required] ),
      camion    : new FormControl({ value: '', disabled : false }, [Validators.required] ),
    })
}

submit(){
  let array : any[] = [];
  array = this.modalForm.value.camion;
  for( let i=0 ; i < array.length; i++) {
    let url    = 'transporte/camionMotorista';
    let params = {
      motorista  : this.modalForm.value.motorista,
      camion     : array[i],
    } 
    this.transporteService.put(url,params).subscribe(
      res=>{
        if(!res.hasError){
          if ( res?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning);
          }else{
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
