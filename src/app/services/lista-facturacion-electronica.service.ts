import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetraccionInterface } from 'src/app/interfaces/DetraccionInterface';
import { DocumentosPreview } from 'src/app/interfaces/DocumentosPreview';
import { EmpresaInterface } from 'src/app/interfaces/EmpresaInterface';
import { DocumentoCompletoInterface } from 'src/app/interfaces/DocumentoCompletoInterface';
import { TiposDoumentoInterface } from 'src/app/interfaces/TiposDocumentoInterface';
import { environment } from 'src/environments/environment';
import { AllListasInterface } from 'src/app/interfaces/AllListasInterface';

@Injectable({
  providedIn: 'root'
})
export class ListaFacturacionElectronicaService {

  constructor(public http:HttpClient) { }

  // url='https://localhost:7224/api/';
  listas: string  = environment.API_URL+'Listas/';
  api: string  = environment.API_URL+'api/';

  httpOptions = {
    headers: new HttpHeaders({
      // 'token': localStorage.getItem('token'),
      'Content-Type': 'application/json'
    })
  };

  listarAllListas(): Observable<AllListasInterface>{
    return this.http.get<AllListasInterface>(this.listas+'allListas',this.httpOptions);
  }
  listarDocumentoPreview(fecha: string): Observable<DocumentosPreview[]>{
    let parametro = new HttpParams().set('fecha',fecha)
    return this.http.get<DocumentosPreview[]>(this.api+'ImportarDatos/ImportarByFecha',{headers: this.httpOptions.headers,params:parametro});
  }
  listarDocumentoCompleto(invoiceNumber: number): Observable<DocumentoCompletoInterface>{
    return this.http.get<DocumentoCompletoInterface>(this.api+'ImportarDatos/obtenerInvoice/'+invoiceNumber,{headers: this.httpOptions.headers});
  }
}
