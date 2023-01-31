import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ssomaRoutingModule } from './ssoma-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SalidaPortonComponent } from './salida-porton/salida-porton.component';

@NgModule({
  declarations: [
    SalidaPortonComponent
  ],
  imports: [
    CommonModule,
    ssomaRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule

  ]
})
export class ssomaModule { }
