import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ssomaRoutingModule } from './ssoma-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SalidaPortonComponent } from './salida-porton/salida-porton.component';
import { VerExtintoresComponent } from './Extintores/ver-extintores/ver-extintores.component';
import { ExtintoresComponent } from './Extintores/extintores/extintores.component';
import { ExtintoresALComponent } from './Extintores/extintores-al/extintores-al.component';
import { ExtintoresARComponent } from './Extintores/extintores-ar/extintores-ar.component';
import { CrearExtintorComponent } from './Extintores/crear-extintor/crear-extintor.component';
import { AgenteComponent } from './Extintores/Mantenimientos/agente/agente.component';
import { TipoextintorComponent } from './Extintores/Mantenimientos/tipoextintor/tipoextintor.component';
import { UbicacionesComponent } from './Extintores/Mantenimientos/ubicaciones/ubicaciones.component';
import { CapacidadesComponent } from './Extintores/Mantenimientos/capacidades/capacidades.component';
import { ModalAgenteComponent } from './Extintores/Mantenimientos/agente/modal-agente/modal-agente.component';
import { ModaltipoExtintorComponent } from './Extintores/Mantenimientos/tipoextintor/modaltipo-extintor/modaltipo-extintor.component';
import { ModalCapacidadComponent } from './Extintores/Mantenimientos/capacidades/modal-capacidad/modal-capacidad.component';
import { ModalUbicacionComponent } from './Extintores/Mantenimientos/ubicaciones/modal-ubicacion/modal-ubicacion.component';
import { AuditoriaComponent } from './Extintores/auditoria/auditoria.component';
import { AuditoriasComponent } from './Extintores/auditorias/auditorias.component';
import { AuditoriasRealizadasComponent } from './Extintores/auditorias-realizadas/auditorias-realizadas.component';

@NgModule({
  declarations: [
    SalidaPortonComponent,
    VerExtintoresComponent,
    ExtintoresComponent,
    ExtintoresALComponent,
    ExtintoresARComponent,
    CrearExtintorComponent,
    AgenteComponent,
    TipoextintorComponent,
    UbicacionesComponent,
    CapacidadesComponent,
    ModalAgenteComponent,
    ModaltipoExtintorComponent,
    ModalCapacidadComponent,
    ModalUbicacionComponent,
    AuditoriaComponent,
    AuditoriasComponent,
    AuditoriasRealizadasComponent
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
