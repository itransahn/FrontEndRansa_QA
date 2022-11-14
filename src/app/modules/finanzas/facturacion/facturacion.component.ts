import { Component, OnInit } from '@angular/core';
import { DataApi } from 'src/app/interfaces/dataApi';
import { SharedService } from '../../shared/shared.service';
import { FacturacionService } from '../facturacion.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent implements OnInit {
  public dolares = [];
  public parametros = [];
  public fecha = new Date()
  public espaciosBlancos = [1,2,3,4,5,6,7,8,9]
  constructor( 
    public sharedS      : SharedService,
    public facturacionS : FacturacionService
    ) { }

  ngOnInit(){
    this.cargarParametrosF()
  }

  cargarParametrosF(){
    let url='seguridad/parametrosF';
    let params = {
      sede : 1
    }
  this.facturacionS.post(url,params).subscribe(
    (res:DataApi | any )=>{
      console.log(res)
        if( !res?.hasError ){
            this.parametros = res.data.Table0;
            console.log( this.parametros )
        }
    }
  )

  }


}
