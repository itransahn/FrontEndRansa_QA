import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ScrollTopComponent } from 'src/app/shared/scroll-top/scroll-top.component';
import { Loading2Component } from 'src/app/shared/loading2/loading2.component';


const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    SearchPipe,
    LoadingComponent,
    Loading2Component,
    ScrollTopComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    NgxMaskModule.forRoot(),
  ],
  exports : [
    SearchPipe,
    AngularMaterialModule,
    LoadingComponent,
    Loading2Component,
    NgxMaskModule,
    ScrollTopComponent
  ]
})
export class SharedModule { }
