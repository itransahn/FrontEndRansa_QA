import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//buttons
import {MatButtonModule} from '@angular/material/button';
//Bottom Sheet
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
//AutoComplete
import {MatAutocompleteModule} from '@angular/material/autocomplete';
//Card
import {MatCardModule} from '@angular/material/card';
//datePicket
import {MatDatepickerModule} from '@angular/material/datepicker';
//Divider
import {MatDividerModule} from '@angular/material/divider';
//formField
import {MatFormFieldModule} from '@angular/material/form-field';
//Icon
import {MatIconModule} from '@angular/material/icon';
//Input
import {MatInputModule} from '@angular/material/input';
//List
import {MatListModule} from '@angular/material/list';
//Menu
import {MatMenuModule} from '@angular/material/menu';
//Paginator
import {MatPaginatorModule} from '@angular/material/paginator';
//Sidenav
import {MatSidenavModule} from '@angular/material/sidenav';
//Select
import {MatSelectModule} from '@angular/material/select';
//Stepper o formulario por partes
import {MatStepperModule} from '@angular/material/stepper';
//Table 
import {MatTableModule} from '@angular/material/table';
//Tabs
import {MatTabsModule} from '@angular/material/tabs';
//ToolTip
import {MatTooltipModule} from '@angular/material/tooltip';
//Toolbar
import {MatToolbarModule} from '@angular/material/toolbar';
// Accordion
import {MatExpansionModule} from '@angular/material/expansion';
// Radio Button
import {MatRadioModule} from '@angular/material/radio';
//Check Box
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatSelectModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatToolbarModule,
    MatExpansionModule,
    MatRadioModule,
    MatCheckboxModule
  ],
  exports : [
    MatButtonModule,
    MatBottomSheetModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatSelectModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatToolbarModule,
    MatExpansionModule,
    MatRadioModule,
    MatCheckboxModule
  ]
})
export class AngularMaterialModule { }
