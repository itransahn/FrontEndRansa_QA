import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { FacturacionService } from '../../../facturacion.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vale',
  templateUrl: './vale.component.html',
  styleUrls: ['./vale.component.scss']
})
export class ValeComponent implements OnInit {
  public data: any[]=[];
  public viaje: any[]=[];
  public multiparadas: any[]=[];

  constructor(
    public sharedS:SharedService,
    public auth: AuthService,
    public service : FacturacionService,
    public router : ActivatedRoute
  ) { }

  ngOnInit(): void {
      this.cargarViajes( this.router.snapshot.params['idViaje']);
  }

  cargarViajes(viaje){
    let url = '/finanzas/viajeEspecifico';
    let params = {
      idViaje : viaje
    }
  this.service.get(url,params).subscribe(
    res=>{
      if(res){
        this.viaje = res?.data?.Table0;
        this.validacion()
        }
    }
  )
  }
  GenerarPdf(){
    this.sharedS.downloadPDF('vale',  `${this.viaje[0]?.['Solicitante']}`,'Vale de transporte', `Seguro de generar Vale de transporte`);
    }


  validacion(){
    if( this.viaje[0]?.idtipoViaje == 3){
        this.multiparadas = JSON.parse(this.viaje[0]?.multipleDestinto);
    }
  }
}
