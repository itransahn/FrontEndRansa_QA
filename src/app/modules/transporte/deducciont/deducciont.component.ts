import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment       from 'moment';
import * as _rollupMoment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from '../../shared/shared.service';
import { map, Observable, startWith } from 'rxjs';
import { TransporteService } from '../transporte.service';
import { Acumulador } from 'src/app/interfaces/generales';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastServiceLocal } from 'src/app/services/toast.service';


const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-deducciont',
  templateUrl: './deducciont.component.html',
  styleUrls: ['./deducciont.component.scss'],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
   ]
})

export class DeducciontComponent implements OnInit {
  public  form : FormGroup;
  public  catalogo   : any;
  public  catalogoF  : any;
  public espaciosBlancos = [];
  public  dataRec    : any[] =[];
  public loading1    : boolean = false;
  public idSede : number;
  public subtotal  : number;
  public gaanancia : number;
  public total     : number;
  filteredOptions: Observable<string[]>;
  public idValor  : number;
public ccos = [
  {
    id_cco : 3,
    cco    : 'DISTRIBUCION'
  },
  {
    id_cco : 8,
    cco    : 'TRANSPORTE INTERNACIONAL'
  }
]
constructor( public auth     : AuthService,
             public sharedS  : SharedService,
             public transporteService : TransporteService,
             public sweel : SweetAlertService,
             public toast : ToastServiceLocal
    ) {
    }
    ngOnInit() {
      this.idSede    = this.auth.dataUsuario['sede'];
      this.cargarForm();
          }

cargarForm(){
this.form = new FormGroup({
cco        : new FormControl('', [ Validators.required]),
transporte : new FormControl('', [ Validators.required]),
fecha      : new FormControl('', [ Validators.required]) })
  }

  setearValor( data ?: any){
    this.idValor = data?.idTransportista;
      }

cargarData(){
  this.catalogoF = this.transporteService.returnCatalogo();
  console.log(this.catalogoF)
  this.filteredOptions =  this.form.get('transporte').valueChanges.pipe(
    startWith(''),
    map(value => {
    const  proveedor = typeof value === 'string' ? value : value?.proveedor;
    return  this.sharedS._filter(this.catalogoF?.['transportes'],proveedor, 'nombreEmpresa')
    }),
  );
}

cambiarEstadoRecibo(){
  let url    = '/transporte/estadoRecibo';
for (let i = 0 ; i < this.dataRec.length; i++ ){
    let params = {
    idRecibo  : this.dataRec[i]?.idRecibo
  } 
this.transporteService.put(url,params).subscribe( ) 
}
// this.auth.redirecTo('/ransa/transporte/Deducciones');

}

cargarDeducciones(){
  this.espaciosBlancos = [];
  let url = 'transporte/deducciones';
  let params = {
cco           : this.form.value.cco,
transportista : this.idValor,
sede          : this.idSede,
fecha         : this.form.value.fecha
  }
this.transporteService.post(url,params).subscribe(
  res=>{
    if(res){
      this.dataRec = res?.data?.Table0;
      console.log(this.dataRec);
      this.subtotal = Acumulador(this.dataRec,'valorFacturaa')
      this.loading1 = true;
      if ( this.dataRec.length < 20 ){
        for(let j = this.dataRec.length; j<(40-this.dataRec.length); j++){
          this.espaciosBlancos.push(j)
        }
      }else{
        
      }
    }
  }
)
}

GenerarPdf(){
  this.pdfRetencion('Deduccion',  `${this.dataRec[0]?.Transporte}_Recibo`,'Recibo Ransa', `Seguro de generar PDF de Recibo del Transportista
${this.dataRec[0]?.Transporte}`,{
  numeroFactura: `_${this.dataRec[0]?.Transporte}`,
  factura : 'Recibo Ransa',
  titulo : ''
})



}

pdfRetencion( id?:string, NombreFinal ?: string, detalle?: string, titulo ?: string, data?:any) :boolean {

  this.sweel.mensajeConConfirmacion(`¿${titulo}?`, `${detalle}`,"warning").then(
        res=>{
            if ( res ){
               // Extraemos el
    const DATA = document.getElementById(id);
    const doc = new jsPDF('p', 'pt', 'Letter');
    const options = {
                 background: 'transparent',
                 scale: 3,
                 format: [4, 2]
                    };
  html2canvas(DATA, options).then((canvas) => {
    const img = canvas.toDataURL('image/PNG');
    // Add image Canvas to PDF
    const bufferX = 15;
    const bufferY = 15;
    const imgProps = (doc as any).getImageProperties(img);
    const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    return doc;
    }).then( (docResult) => {
      docResult.save(`${NombreFinal}.pdf`);
  
      // this.sharedS.pdfFacturaD('Retencion2', data['numeroFactura'] +'_RETCCPROVEEDOR', 'Seguro','PDF' )
      // this.pdfFacturaD('archivo',data['numeroFactura']+'FACArchivo', 'Seguro','PDF' )
  
      this.toast.mensajeSuccess("Documento generado correctamente","Generación de PDF");
      // this.guardarData();
      // this.cambiarEstadoRetencion();
this.cambiarEstadoRecibo();
      this.cargarDeducciones();
      return true;
    });
                return true
            }else{
                return false
             }
        }
      )
      return false
  }

}
