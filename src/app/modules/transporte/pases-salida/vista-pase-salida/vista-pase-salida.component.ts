import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-vista-pase-salida',
  templateUrl: './vista-pase-salida.component.html',
  styleUrls: ['./vista-pase-salida.component.scss']
})
export class VistaPaseSalidaComponent implements OnInit {
    public data: any[]=[];
  constructor(
    public sharedS:SharedService,
    public auth: AuthService
  ) { }

  ngOnInit(){
    this.validarData()
  }
  validarData(){
   if ( localStorage.getItem('PaseSalida')){
    this.data = JSON.parse(localStorage.getItem('PaseSalida') );
   } else{
    this.auth.redirecTo('/ransa/transporte/salidas')
   }
  }

  GenerarPdf(){
    this.sharedS.downloadPDF('pase',  `Pase de Salida`,'Pase de Salida', `Seguro de generar pase de salida`)

    // this.sharedS.pdfFacturaD('cliente', `${this.retornarCorrelativoPDF()}_${this.cabeceraF[0]['TCMPCL']}Cliente`,'Factura Ransa', `Seguro de generar PDF de FACTURA ${this.cabeceraF[0]['NDCCTC']} del CLIENTE
    // ${this.cabeceraF[0]['TCMPCL']}`)

    // this.sharedS.pdfFacturaD('archivo', `${this.retornarCorrelativoPDF()}_${this.cabeceraF[0]['TCMPCL']}Archivo`,'Factura Ransa', `Seguro de generar PDF de FACTURA ${this.cabeceraF[0]['NDCCTC']} del CLIENTE
    // ${this.cabeceraF[0]['TCMPCL']}`)
    }

  ValidacionHora( hora:string ){
    if ( Number(hora.substring(0,2)) >=0 && Number(hora.substring(0,2))<= 12 ){
        return 'AM'
    }else{
      return 'PM'
    }
  }

  retornarHora( hora:string ){
    return hora.substring(0,5)
  }

}
