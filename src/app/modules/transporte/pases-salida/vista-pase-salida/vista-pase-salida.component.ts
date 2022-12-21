import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/modules/shared/shared.service';

@Component({
  selector: 'app-vista-pase-salida',
  templateUrl: './vista-pase-salida.component.html',
  styleUrls: ['./vista-pase-salida.component.scss']
})
export class VistaPaseSalidaComponent implements OnInit {

  constructor(
    public sharedS:SharedService
  ) { }

  ngOnInit(): void {
  }

  GenerarPdf(){
    this.sharedS.downloadPDF('pase',  `Pase de Salida`,'Pase de Salida', `Seguro de generar pase de salida`)

    // this.sharedS.pdfFacturaD('cliente', `${this.retornarCorrelativoPDF()}_${this.cabeceraF[0]['TCMPCL']}Cliente`,'Factura Ransa', `Seguro de generar PDF de FACTURA ${this.cabeceraF[0]['NDCCTC']} del CLIENTE
    // ${this.cabeceraF[0]['TCMPCL']}`)

    // this.sharedS.pdfFacturaD('archivo', `${this.retornarCorrelativoPDF()}_${this.cabeceraF[0]['TCMPCL']}Archivo`,'Factura Ransa', `Seguro de generar PDF de FACTURA ${this.cabeceraF[0]['NDCCTC']} del CLIENTE
    // ${this.cabeceraF[0]['TCMPCL']}`)
    }

}
