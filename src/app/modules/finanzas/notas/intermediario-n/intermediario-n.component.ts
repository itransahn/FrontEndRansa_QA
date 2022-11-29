import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ModalNComponent } from '../intermediarioN/modal-n/modal-n.component';

@Component({
  selector: 'app-intermediario-n',
  templateUrl: './intermediario-n.component.html',
  styleUrls: ['./intermediario-n.component.scss']
})
export class IntermediarioNComponent implements OnInit {

  constructor( public dialog: MatDialog,  public ruta : ActivatedRoute ) { }

  ngOnInit(){
      this.modal()
  }

  modal(  ){
    const dialogReg = this.dialog.open( ModalNComponent,{
      width  :   '500px',
      height :   'auto',
      maxWidth:  'auto',
      data    :  { 
        tipo:  this.ruta.snapshot.params['tipo']
      },
      disableClose : true
    })
  }

}
