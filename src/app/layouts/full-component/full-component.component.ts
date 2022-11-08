import {ChangeDetectorRef, Component,OnDestroy,AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-full-component',
  templateUrl: './full-component.component.html',
  styleUrls: ['./full-component.component.scss']
})
export class FullComponentComponent implements OnDestroy, AfterViewInit  {

  public mobileQuery: MediaQueryList;
  public opened:boolean = true;
  public nombreEmpresa = environment.nombreEmpresa;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher ) {
      
      this.mobileQuery = media.matchMedia('(min-width: 768px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);

     }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() {
  }
}
