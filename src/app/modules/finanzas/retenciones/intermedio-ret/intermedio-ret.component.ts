import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from '../../facturacion/modal/modal.component';
import { ModalRComponent } from '../modal-r/modal-r.component';

@Component({
  selector: 'app-intermedio-ret',
  templateUrl: './intermedio-ret.component.html',
  styleUrls: ['./intermedio-ret.component.scss']
})
export class IntermedioRetComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public ruta : ActivatedRoute
  ) { }

  ngOnInit() {
    this.modal()
  }

  modal(  ){
    const dialogReg = this.dialog.open( ModalRComponent,{
      width  :   '1000px',
      height :   'auto',
      maxWidth:  'auto',
      data    :  {
        // sede : this.ruta.snapshot.params['sede']
      },
      disableClose : true
    })
  }

}
