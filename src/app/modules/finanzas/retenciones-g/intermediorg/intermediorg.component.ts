import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ModalrgComponent } from '../modalrg/modalrg.component';

@Component({
  selector: 'app-intermediorg',
  templateUrl: './intermediorg.component.html',
  styleUrls: ['./intermediorg.component.scss']
})
export class IntermediorgComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public ruta : ActivatedRoute
  ) { }

  ngOnInit(){
  }


  
  modal(  ){
    const dialogReg = this.dialog.open( ModalrgComponent,{
      width  :   '500px',
      height :   'auto',
      maxWidth:  'auto',
      data    :  {},
      disableClose : true
    })
  }

}
