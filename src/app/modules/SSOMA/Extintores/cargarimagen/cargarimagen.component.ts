import { Component, OnInit, Inject } from '@angular/core';
import { SsmoaService } from '../../ssmoa.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-cargarimagen',
  templateUrl: './cargarimagen.component.html',
  styleUrls: ['./cargarimagen.component.scss']
})
export class CargarimagenComponent implements OnInit {
  file: any[]=[];
  photoSelected: any;
  formBuilder: any;
  public form: FormGroup;
  private arregloFotos:any[]=[];

  constructor(   
    private dialogRef:MatDialogRef<CargarimagenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth:AuthService,
    public toast:ToastServiceLocal, 
    public service : SsmoaService,
    private sweel : SweetAlertService
    ) { }

  ngOnInit( ): void {
    this.buildform();
    
   }

  private buildform(){
    this.form = new FormGroup({
      foto :     new FormControl('',[Validators.required])
    })
  }

  close(){
    this.dialogRef.close()
  }

  subirFoto(){
    this.sweel.mensajeConConfirmacion("Carga de Imagenes","¿Seguro de cargar imagenes?","warning").then(
      res=>{
          if (res){
            let url1= '/carga/CargarItem';
            let params = {
              item : this.data?.item,
              tipo : this.data?.tipo
            }
            this.service.post( url1 , params ).subscribe ( data =>{
              if ( !data.hasError){
              }
            })
            let url2= '/carga/upload';
            for( let i = 0; i<this.file.length; i++ ){
              this.service.CargarArchivos( url2 , this.file[i]).subscribe(res=>{
              });
            }
         if( this.file.length > 1){
          this.toast.mensajeInfo("Imagenes Cargadas Exitosamente","Carga de imagenes");
          this.dialogRef.close();
         }else{
          this.toast.mensajeInfo("Imagen Cargada Exitosamente","Carga de imagenes")
          this.dialogRef.close();
        }
          }
      }
    ) }
   
  imprimir(File){
    return File?.name
  }

FotoSeleccionada(evento: any ) {
this.file = evento.target.files;
this.arregloFotos.push(evento.target.files);
  // 
// if ( evento.target.files && evento.target.files) {
  const reader = new FileReader();
  reader.onload = e => this.photoSelected = reader.result;
  reader.readAsDataURL(this.file[0]);
    // }
  }

  mostrarFoto(File: any){
    
    let photoSelected;
    const reader = new FileReader();
    reader.onprogress = e => this.photoSelected = reader.result;
    reader.readAsDataURL(File);
  }

}
