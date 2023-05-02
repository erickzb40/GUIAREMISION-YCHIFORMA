import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListaGuiaremisionService {

  constructor(public http:HttpClient) { }
   url='http://192.168.1.6:92/api/';
   //url='https://localhost:7224/api/';
   //url='https://jk-smart.com:201/api/';
  httpOptions = {
    headers: new HttpHeaders({
      'token': localStorage.getItem('token'),
      'Content-Type': 'application/json'
    })
  };
  public login(form:any){
    return this.http.post(this.url+'USUARIO_/login',form);
  }
  public getInfo(){
    return this.http.get(this.url+'AAA_',this.httpOptions);
  }
  public crearAdquiriente(form){
    return this.http.post(this.url+'AAA_',form,this.httpOptions)
  }
  public updateAdquiriente(form){
    return this.http.post(this.url+'AAA_/UpdateAdquiriente',form,this.httpOptions)
  }
  public crearTransportista(form){
    return this.http.post(this.url+'AAA_/transportista',form,this.httpOptions)
  }
  public crearChofer(form){
    return this.http.post(this.url+'AAA_/chofer',form,this.httpOptions)
  }
  public getDestinos(form){
    return this.http.post(this.url+'AAA_/GetDestino',form,this.httpOptions);
  }
  public getProductos(){
    return this.http.get(this.url+'Producto',this.httpOptions);
  }
  public declararGuia(form){
    return this.http.post(this.url+'SPE_DESPATCH/declarar',form,this.httpOptions);
  }
  public getSpe_despatch(desde,hasta){
    return this.http.get(this.url+'SPE_DESPATCH/SPE_DESPATCH?desde='+desde+'&hasta='+hasta,this.httpOptions);
  }
  public getSpe_despatch_item(serie){
    return this.http.get(this.url+'SPE_DESPATCH/SPE_DESPATCH_ITEM?serie='+serie,this.httpOptions)
  }
  public crearProducto(producto){
    return this.http.post(this.url+'AAA_/Producto',producto,this.httpOptions)
  }
  public borrarProducto(codigo:string){
    return this.http.get(this.url+'AAA_/BorrarProducto?codigo='+codigo,this.httpOptions);
  }
  public crearEmpresa(empresa){
    return this.http.post(this.url+'AAA_/Empresa',empresa,this.httpOptions);
  }
  public getEmpresas(){
    return this.http.get(this.url+'AAA_/GetEmpresas',this.httpOptions);
  }
  //obtener origenes para mostrar en la tabla
  public getOrigen(){
    return this.http.get(this.url+'AAA_/GetOrigenes',this.httpOptions);
  }
  public CrearOrigen(form){
    return this.http.post(this.url+'AAA_/CrearOrigen',form,this.httpOptions);
  }
  public getSerie(){
    return this.http.get(this.url+'AAA_/getSerie',this.httpOptions);
  }
  public CrearSerie(form){
    return this.http.post(this.url+'AAA_/CrearSerie',form,this.httpOptions);
  }
  public BorrarSerie(numdoc,serie){
    return this.http.get(this.url+'AAA_/BorrarSerie?numdoc='+numdoc+'&serie='+serie,this.httpOptions);
  }
  public BorrarEmpresa(numdoc){
    return this.http.get(this.url+'AAA_/BorrarEmpresa?numdoc='+numdoc,this.httpOptions);
  }
  public BorrarOrigen(form){
    return this.http.post(this.url+'AAA_/BorrarOrigen',form,this.httpOptions);
  }
  public BorrarTransportista(ndoc){
    return this.http.get(this.url+'AAA_/BorrarTransportista?numdoc='+ndoc,this.httpOptions);
  }
  public getTransportista(){
    return this.http.get(this.url+'AAA_/getTransportista',this.httpOptions);
  }
  public BorrarChofer(ndoc){
    return this.http.get(this.url+'AAA_/BorrarChofer?numdoc='+ndoc,this.httpOptions);
  }
  public getEmpaque(codigo,desde,hasta){
      if(codigo==null||codigo==''){
      return this.http.get(this.url+'EMPAQUE?desde='+desde+'&hasta='+hasta,this.httpOptions);
    }else{
      return this.http.get(this.url+'EMPAQUE?codigo='+codigo,this.httpOptions);
    }
  }
  public getExtraerEmpaque(dias){
    return this.http.get(this.url+'EMPAQUE/actualizarEmpaque?dias='+dias,this.httpOptions);
  }
}
