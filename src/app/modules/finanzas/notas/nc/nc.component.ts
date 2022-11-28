import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nc',
  templateUrl: './nc.component.html',
  styleUrls: ['./nc.component.scss']
})
export class NcComponent implements OnInit {
  public DcabeceraF : any[] = [
    {
      descripcion : 'Otros-EXP',
      Subtotal    : 189496.98,
      Impuesto    : 0.00,
      MTotal      : 189496.98
    } 
  ];

  public espaciosBlancos = [1,2,3,4];
  public anulacion = true;
  public devolcion = false;
  public descuento = false;
  public disabled  = true;

  public leyendaInterna = ' BL No.  CONTENEDORES MEDUX5035795  MEDU9423500,FFAU3016235, MSMU4209438, MSMU4722250, FACTURA No. MSMU4209438,MSMU4722250, MINB4944 MSMU8235780, CAIU4870715, CAIU7574086, MSMU4715780 '
  constructor() { }

  ngOnInit(): void {
  }

}
