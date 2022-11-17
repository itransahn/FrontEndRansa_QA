import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-intemedio',
  templateUrl: './intemedio.component.html',
  styleUrls: ['./intemedio.component.scss']
})
export class IntemedioComponent implements OnInit {
  constructor(
  public dialog: MatDialog
  ) { }

  ngOnInit(){ this.modal() }

  modal( ){
    const dialogReg = this.dialog.open( ModalComponent,{
      width  :   '500px',
      height :   'auto',
      maxWidth:  'auto',
      data    :  { },
      disableClose : true
    })
  }
}
