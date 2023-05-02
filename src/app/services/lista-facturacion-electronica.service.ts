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

   url='http://192.168.1.6:92/api/';
   //url='https://localhost:7224/api/';
   //url='https://jk-smart.com:201/api/';;

  httpOptions = {
    headers: new HttpHeaders({
      'token': localStorage.getItem('token'),
      'Content-Type': 'application/json'
    })
  };

  public getInfo(){
    return this.http.get(this.url+'Facturacion',this.httpOptions);
  }
  public getSerie(){
    return this.http.get(this.url+'Facturacion/serie',this.httpOptions);
  }
  public importarDatos(ndoc,desde,hasta){
    return this.http.get(this.url+'Facturacion/importarDatos'+'?ndoc='+ndoc+'&desde='+desde+'&hasta='+hasta,this.httpOptions);
  }
  public getClientes(){
    return this.http.get(this.url+'Facturacion/clientes',this.httpOptions);
  }
  public declararFactura(factura){
    return this.http.post(this.url+'Facturacion/declararFactura',factura,this.httpOptions);
  }
  public getSerieTipoDoc(tipodoc){
    return this.http.get(this.url+'Facturacion/getSerieTipoDoc?tipodoc='+tipodoc,this.httpOptions);
  }
}
