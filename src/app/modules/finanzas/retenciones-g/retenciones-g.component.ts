import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { SharedService } from '../../shared/shared.service';
import { FacturacionService } from '../facturacion.service';

@Component({
  selector: 'app-retenciones-g',
  templateUrl: './retenciones-g.component.html',
  styleUrls: ['./retenciones-g.component.scss']
})
export class RetencionesGComponent implements OnInit {

  constructor(
    public sharedS      : SharedService,
    public facturacionS : FacturacionService,
    public ruta         : ActivatedRoute,
    public dialog       : MatDialog,
    public toast        : ToastServiceLocal,
    public auth         : AuthService
  ) { }

  ngOnInit(): void {
  }

}
