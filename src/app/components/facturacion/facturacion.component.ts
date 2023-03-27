import { ListaFacturacionElectronicaService } from './../../services/lista-facturacion-electronica.service';
import { FormaPagoInterface } from './../../interfaces/FormaPagoInterface';
import { TipoNcNdInterface } from './../../interfaces/TipoNcNdInterface';
import { DetraccionInterface } from './../../interfaces/DetraccionInterface';
import { EmpresaInterface } from './../../interfaces/EmpresaInterface';
import { DocumentosPreview } from './../../interfaces/DocumentosPreview';
import { TipoCambioSunatInterface } from './../../interfaces/TipoCambioSunatInterface';
import { TiposDoumentoInterface } from './../../interfaces/TiposDocumentoInterface';
import { DocumentoCompletoInterface } from './../../interfaces/DocumentoCompletoInterface';
import { CuotasInterface } from './../../interfaces/CuotasInterface';
import { FacturaElectronicaInterface } from './../../interfaces/FacturaElectronicaInterface';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent {
  listaFormaPago: FormaPagoInterface[] = [
    {value:1,descripcion:'Credito'},
    {value:2,descripcion:'Contado'}
  ];
  listaTipoNcNd: TipoNcNdInterface[] = [
    {value:1, descripcion:'Nota de credito'},
    {value:2, descripcion:'Nota de debito'}
  ]
  listaEmpresas: EmpresaInterface[] = [];
  listaTiposDocumento: TiposDoumentoInterface[] = [];
  listaDetraccion: DetraccionInterface[] = [];
  fechaToday : string;

  facturaElectronica: FacturaElectronicaInterface ={
    numerInvoiceImport: null,
    empresa: null,
    empresaName: null,
    tipoDocumento: null,
    tipoDocumentoSelect: null,
    serieNumero: null,
    formaPago: null,
    formaPagoName: null,
    observaciones: null,
    fechaEmision: null,
    fechaVencimiento: null,
    clienteName: null,
    moneda: null,
    ticket: null,
    ticketNum: null,
    ordenCompra: null,
    detraccion: null,
    detraccionName: null,
    estado: null,
    tipoNcNd: null,
    tipoNcNdName: null,
    motivoNcNd: null,
    cuotasFactura: [],
    detalleFactura: [],
    gravada: null,
    inafecta: null,
    exonerada: null,
    gratuita: null,
    exportacion: null,
    totalIgv: null,
    totalVenta: null,
    montoDetraccion: null,
    tipoCambio: null
  }

  tipoCambioSunat: TipoCambioSunatInterface={
    venta : null
  };

  listaImportarDatosPreview : DocumentosPreview[] = []
  filtroFechaSub1 : string;
  fechaNuevaCuota: string ;
  cantidadNuevaCuota: number = 0;
  fechaFiltroImportarDatos: string;
  montoDetraccionString: string = '';
  constructor(private modalService: NgbModal,
              private listasService: ListaFacturacionElectronicaService,
              public rout:Router){
    var dia = String(new Date().getDate()).padStart(2,'0');
    var mes = String(new Date().getMonth() + 1).padStart(2,'0');
    var año = String(new Date().getFullYear());
    this.fechaToday = `${año}-${mes}-${dia}`
    this.obtenerListas();
    this.facturaElectronica.fechaEmision = this.fechaToday;
    this.facturaElectronica.fechaVencimiento = this.fechaToday;
    this.fechaFiltroImportarDatos = this.fechaToday;
  }
  obtenerListas(){
    this.listasService.listarAllListas().subscribe((data) => {
      this.tipoCambioSunat = data.tipoCambioSunat;
      this.listaDetraccion = data.listaDetraccion;
      this.listaTiposDocumento = data.listaTiposDocumento;
      this.listaEmpresas = data.listaEmpresas;
    });
  }
  modalRef: NgbModalRef;
  cerrarModal() {
    this.modalRef.close();
  }
  abrirModal(modal, tamaño: string, modalref?: string){
    if(modalref == 'cuotas'){
      this.getFechaCuota();
    }
    this.modalRef = this.modalService.open(modal, { size: tamaño, centered: true, });
  }
  getNumeroSerie() {
    if(this.facturaElectronica.tipoDocumentoSelect){
      let valores = String(this.facturaElectronica.tipoDocumentoSelect).split('-');

      var tipoDocvalores = valores[0]
      var docAfectado = valores[1]
      var tipoDoc: TiposDoumentoInterface = this.listaTiposDocumento.find(x=> x.tipodocumento==tipoDocvalores && x.tipodocumentoafecto==docAfectado)

      var numero = String(tipoDoc?.correlativo + 1).padStart(8,'0')
      this.facturaElectronica.serieNumero = `${tipoDoc?.serie}-${numero}`;
      return this.facturaElectronica.serieNumero
    }else{
      this.facturaElectronica.serieNumero = null;
      return this.facturaElectronica.serieNumero
    }
  }
  DeclararDocumento(){
    // console.log(this.facturaElectronica);
    this.getTypeMoneyDolar(1234560);
  }
  agregarCuota(){
    if(!(this.facturaElectronica.totalVenta > 0)){
      Swal.fire(
        '',
        'Primero importe un documento',
        'warning'
      )
      return
    }
    if(this.validarCuotas()){
      if(this.facturaElectronica.cuotasFactura.length > 0){
        var NumCuota = this.facturaElectronica.cuotasFactura[this.facturaElectronica.cuotasFactura.length-1].nroCuota + 1
        this.facturaElectronica.cuotasFactura.push({nroCuota:NumCuota,fechaCuota:this.convertirFormatoFecha(this.fechaNuevaCuota),cantidad:this.cantidadNuevaCuota});
      }else{
        this.facturaElectronica.cuotasFactura.push({nroCuota:1,fechaCuota:this.convertirFormatoFecha(this.fechaNuevaCuota),cantidad:this.cantidadNuevaCuota});
      }
      this.fechaNuevaCuota = this.fechaToday;
      this.cantidadNuevaCuota = 0;
      this.cerrarModal();
    }
  }
  validarCuotas(){
    var cantidad = this.cantidadNuevaCuota;
    if(this.facturaElectronica.cuotasFactura.length > 0){
      var arr = this.facturaElectronica.cuotasFactura;
      var sumall = arr.map(item => item.cantidad).reduce((prev, curr) => prev + curr, 0);
      sumall += cantidad
      if(sumall > this.facturaElectronica.totalVenta){
        Swal.fire(
          '',
          'La suma de las cuotas no debe ser mayor al total de venta',
          'warning'
        )
        return false;
      }else{
        return true;
      }
    }else{
      // return cantidad <= this.facturaElectronica.
      if(cantidad > this.facturaElectronica.totalVenta){
        Swal.fire(
          '',
          'La cantidad no debe ser mayor al total de venta',
          'warning'
        )
        return false;
      }else{
        return true;
      }
    }
  }
  eliminarCuota(item: CuotasInterface, nroCuota: Number){
    Swal.fire({
      title: `Desea eliminar la cuota ${nroCuota}?`,
      html: `<p>Fecha: ${item.fechaCuota}</p><p>Cantidad:${item.cantidad}</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      focusCancel:true
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaElectronica.cuotasFactura.pop()
        Swal.fire(
          'Eliminado!',
          '',
          'success'
        )

      }
    })

  }

  importarDocumentoPreview(fecha: string){
    var fechaConsulta: string = fecha;
    if(this.filtroFechaSub1?.length == 10){
      fechaConsulta = this.filtroFechaSub1;
    }
    this.listasService.listarDocumentoPreview(fechaConsulta.replaceAll('-','/')).subscribe((data) => {
      this.listaImportarDatosPreview = data;
    });
  }
  convertirFormatoFecha(fecha : string){
    var dia = fecha.substring(8,10)
    var mes = fecha.substring(5,7)
    var año = fecha.substring(0,4)
    return `${dia}-${mes}-${año}`
  }

  importarDocumentoCompleto(codDoc: number){
    this.listasService.listarDocumentoCompleto(codDoc).subscribe(
    (data) => {
      if(data?.number == null || data?.number == 0){
        this.limpiarDoc();
        Swal.fire({
          icon: 'warning',
          title: '',
          text: 'No se encontró documento',
        })
      }else{
        this.asignarDatosByDocumentoImportado(data)
      }
    });
    if(this.modalRef){
      this.cerrarModal();
    }
  }
  asignarDatosByDocumentoImportado(doc: DocumentoCompletoInterface){
    this.limpiarDoc();
    this.facturaElectronica.detalleFactura = doc.invoiceDetalle
    this.facturaElectronica.clienteName = doc.customername
    this.calculoTotales(doc);
    this.facturaElectronica.moneda = doc.currencY_ID == '1' ? 'Dolares' : 'Soles';
    this.facturaElectronica.ticketNum = doc.ticketnum
    this.facturaElectronica.estado = doc.ticket.ticketstatus
    this.facturaElectronica.numerInvoiceImport = doc.number
  }
  calculoTotales(doc: DocumentoCompletoInterface){
    var totalVenta : number = Number((doc.total).replace(',','.'))

    var baseImponible = Number((totalVenta / 1.18).toFixed(2))

    var totalIgv = Number((baseImponible*0.18).toFixed(2))

    var totalGravada = Number((totalVenta - totalIgv).toFixed(2))

    this.facturaElectronica.totalVenta = totalVenta;
    this.facturaElectronica.totalIgv = totalIgv;
    this.facturaElectronica.gravada =  totalGravada;
  }
  isNCND(){
    var tipoDoc = this.facturaElectronica.tipoDocumentoSelect?.substring(0,2)
    if(tipoDoc == '07' || tipoDoc == '08'){
      return false;
    }else{
      return true
    }
  }
  isFactura(){}
  getFechaCuota(){
    if(this.facturaElectronica.cuotasFactura.length < 1){
      this.fechaNuevaCuota = this.fechaToday;
    }else{
      this.fechaNuevaCuota = this.convertirFormatoFecha2(this.facturaElectronica.cuotasFactura[this.facturaElectronica.cuotasFactura.length-1].fechaCuota)
    }
  }
  convertirFormatoFecha2(fecha : string){
    var dia = fecha.substring(0,2)
    var mes = fecha.substring(3,5)
    var año = fecha.substring(6,10)
    return `${año}-${mes}-${dia}`
  }
  limpiarDoc(){
    this.facturaElectronica = {
      numerInvoiceImport: null,
      empresa: null,
      empresaName: null,
      tipoDocumento: null,
      tipoDocumentoSelect: null,
      serieNumero: null,
      formaPago: null,
      formaPagoName: null,
      observaciones: null,
      fechaEmision: this.fechaToday,
      fechaVencimiento: this.fechaToday,
      clienteName: null,
      moneda: null,
      ticket: null,
      ticketNum: null,
      ordenCompra: null,
      detraccion: null,
      detraccionName: null,
      estado: null,
      tipoNcNd: null,
      tipoNcNdName: null,
      motivoNcNd: null,
      cuotasFactura: [],
      detalleFactura: [],
      gravada: null,
      inafecta: null,
      exonerada: null,
      gratuita: null,
      exportacion: null,
      totalIgv: null,
      totalVenta: null,
      montoDetraccion: null,
    }
    this.montoDetraccionString = '';
  }
  getMoney(value: any){
    if(value == null){
      return null
    }
    if(this.facturaElectronica.moneda){
      if(this.facturaElectronica?.moneda == 'Dolares'){
        return this.getTypeMoneyDolar(value)
      }
    }
    return this.getTypeMoneyPen(value)
  }
  getDetraccion(totalVenta: number){
    if(totalVenta && this.facturaElectronica.detraccion?.porcentajedetraccion != undefined){
      var porcentajeDetraccion = this.facturaElectronica.detraccion?.porcentajedetraccion! / 100;
      var value: number = Number((this.facturaElectronica.totalVenta * porcentajeDetraccion).toFixed(2))
      if(this.facturaElectronica.moneda == "Dolares"){
        var tipoCambio = this.facturaElectronica.tipoCambio == undefined ? 1 : this.facturaElectronica.tipoCambio
        value = value * tipoCambio
      }
      this.facturaElectronica.montoDetraccion = value;


      return this.getTypeMoneyPen(this.facturaElectronica.montoDetraccion)
    }
  }
  getTypeMoneyDolar(value: any){
    const formatToParts = new Intl.NumberFormat('en-US', {
      currency: 'USD',
      style: 'currency',
      minimumFractionDigits: 2
    }).formatToParts(value)

    var textoMoney = ''
    for (let index = 1; index < formatToParts.length; index++) {
      textoMoney += formatToParts[index].value
    }
    var stringDolar = `${formatToParts[0].value} ${textoMoney}`
    return stringDolar
  }
  getTypeMoneyPen(value: any){
    const formatterPen = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      minimumFractionDigits: 2,
      currency: 'PEN'
    })
    return formatterPen.format(value)
  }
  CerrarSesion(){
    localStorage.removeItem('token');
    this.rout.navigateByUrl('login');
  }
}
