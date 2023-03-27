import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { GuiaremisionComponent } from './components/guiaremision/guiaremision.component';
import { ReporteComponent } from './components/reporte/reporte.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FilterPipe,
    FacturacionComponent,
    GuiaremisionComponent,
    ReporteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
