import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-page-found',
  templateUrl: './no-page-found.component.html',
  styleUrls: ['./no-page-found.component.scss']
})
export class NoPageFoundComponent implements OnInit {

    public Empresa : string;
  constructor( private _router: Router) {
    this.Empresa = 'Ransa Honduras'
   }

  ngOnInit(): void {
  }

  year = new Date().getFullYear();


  RetornarInicio(){
    if ( localStorage.getItem("dataUsuario")) {
      this._router.navigateByUrl("/modulos");
    }else{
      this._router.navigateByUrl("/login");
      localStorage.removeItem("idUser");
    }
  }

}
