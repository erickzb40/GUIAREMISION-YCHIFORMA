import { ListaFacturacionElectronicaService } from './../../services/lista-facturacion-electronica.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FacturaElectronicaInterface } from 'src/app/interfaces/FacturaElectronicaInterface';
import { ListaGuiaremisionService } from 'src/app/services/lista-guiaremision.service';
import { CuotasInterface } from 'src/app/interfaces/CuotasInterface';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent {
  facturaElectronica: FacturaElectronicaInterface =
  {ORDENCOMPRA:"",SERIENUMERO:"",FORMAPAGO:"0",TIPODOCUMENTO:"",TIPOMONEDA:"PEN" } as FacturaElectronicaInterface;
  //series select
  series = [];
  empresa:any={};
  //clientes select
  clientes=[];
  cliente:any=null;
  //detraccion
  detraccion:any="";
  //modal Empaque
  filterEmpaque = '';
  ndoc = '';
  tablaEmpaque = [];
  tablaEmpaqueSeleccionados = [];
  empaqueFactura = [];
  pageEmpaque = 0;
  desde = this.DateTimeActual();
  hasta = this.DateTimeActual();
  //guias
  serieGuiasRemision=[];
  //cuotas modal
  fecha_cuota = this.DateActual();
  monto_cuota = 0;
  cuotas = [];
  id_cuota=1;
  //modal array
  tablaSeries = [];
  tipodocEmp = '01';
  tipodocAfecto = '01';
  correlativo = 0;
  //-------------
  //tabla totales
  totalGrabada=0;
  totalIgv=0;
  totalVenta=0;
  totalDetraccion=0;
  totalPendientePago=0;


  modalRef: NgbModalRef;
  constructor(private modalService: NgbModal,
    private listasService: ListaFacturacionElectronicaService,
    public rout: Router,
    private api: ListaGuiaremisionService) {
    this.obtenerInfo();
    this.asignarCampos();

  }

  cerrarModal() {
    this.modalRef.close();
  }
  abrirModal(modal, tamaño: string) {
    this.modalRef = this.modalService.open(modal, { size: tamaño, centered: true, });
  }
  obtenerInfo() {
    Swal.showLoading();
    this.listasService.getInfo().subscribe((res: any) => {
      this.empresa = res.empresa;
      this.clientes = res.clientes;
    },err=>{},()=>{
      Swal.close();
    });
  }
  listarSerie(serie) {
    Swal.showLoading()
    this.listasService.getSerie().subscribe((res: any) => {
      Swal.close();
      this.abrirModal(serie, 'xl');
      this.tablaSeries = res;
    });
  }
  TraerSerie(){
   if(this.facturaElectronica.TIPODOCUMENTO!=""){
    this.listasService.getSerieTipoDoc(this.facturaElectronica.TIPODOCUMENTO).subscribe((res:any)=>{
      this.facturaElectronica.SERIENUMERO="";
      this.series = res;
    })
   }
  }
  crearSerie(form) {
    if (form.invalid) { return }
    if (form.submitted) {
      Swal.showLoading();
      form.value.SERIE = form.value.SERIE.toUpperCase();
      this.api.CrearSerie(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
        this.api.getSerie().subscribe((res: any) => {
          this.tablaSeries = res;
        });
        this.facturaElectronica.RAZONSOCIALEMISOR = '';
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }
  }
  borrarSerie(numDoc, serie) {
    Swal.showLoading();
    Swal.fire({
      icon: 'warning',
      title: 'Estás seguro?',
      text: 'La serie ' + serie + ' con el N° Doc ' + numDoc + ' se eliminará',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: 'red',
      cancelButtonText: 'Salir'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.api.BorrarSerie(numDoc, serie).subscribe((res: any) => {
          this.api.getSerie().subscribe((res: any) => {
            Swal.close();
            this.tablaSeries = res;
          });
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
        })
      }
    })
  }
  salir() {
    this.modalRef.close();
  }
  CerrarSesion() {
    localStorage.removeItem('token');
    this.rout.navigateByUrl('login');
  }
  DateTimeActual() {
    const now = new Date();
    const isoString = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 5, now.getMinutes()).toISOString().slice(0, -8);
    return (isoString);
  }
  DateActual() {
    const now = new Date();
    const isoString = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 5, now.getMinutes()).toISOString().slice(0, 10);
    return (isoString);
  }
  asignarCampos() {
    this.facturaElectronica.FECHAEMISION = this.DateTimeActual();
    this.facturaElectronica.FECHAVENCIMIENTO = this.DateTimeActual();
    this.fecha_cuota = this.DateActual();
  }
  importarDatos() {
    this.listasService.importarDatos(this.cliente.numerodocumentoadquiriente, this.desde, this.hasta).subscribe((res: any) => {
      this.tablaEmpaque = this.calcularTotal(res);

    });
  }
  calcularTotal(arreglo) {
    arreglo.forEach((objeto: any) => {
      var total = 0;
      objeto.SPE_DESPATCH_ITEM.forEach(detalle => {
        var importe = detalle.ImporteUnitarioSinImpuesto;
        var cantidad = detalle.cantidad;
        if (!isNaN(importe) && importe !== null && importe !== '' && !isNaN(cantidad) && cantidad !== null && cantidad !== '') {
          total += importe * cantidad;
        }
      });
      objeto.total = total.toFixed(2);
    })
    return arreglo
  }
  selections(item) {
    const index = this.tablaEmpaqueSeleccionados.indexOf(item);
    if (index === -1) {
      this.tablaEmpaqueSeleccionados.push(item);
    } else {
      this.tablaEmpaqueSeleccionados.splice(index, 1);
    }
  }
  limpiarEmpaque() {
    this.tablaEmpaqueSeleccionados = [];
  }
  asginarEmpaquesFactura() {
    this.empaqueFactura = [];
    this.serieGuiasRemision = [];
    for (const objeto of this.tablaEmpaque) {
      for (const numero of this.tablaEmpaqueSeleccionados) {
        if (objeto.serieNumeroGuia === numero) {
          this.serieGuiasRemision.push(objeto.serieNumeroGuia);
          objeto.SPE_DESPATCH_ITEM.forEach(element => {
            element.ordenEmpaqueDetalle=element.numeroOrdenItem;
            element.serieGuia=objeto.serieNumeroGuia;
            this.empaqueFactura.push(element);
          });
          break;
        }
      }
    }
    this.calcularTabla();
    this.cerrarModal();
  }
  agregarCuota() {
    var cuotas = {
      id:this.id_cuota,
      MontoPagoCuota: this.monto_cuota,
      FechaPagoCuota: this.fecha_cuota,
    }
    if(this.cuotas.length==12){
      return Swal.fire('Ya se asignó el maximo permitido de cuotas');
    }
    this.cuotas.push(cuotas);
    this.id_cuota++;
    this.limpiarCuotas();
  }
  limpiarCuotas() {
    this.monto_cuota = 0;
    this.fecha_cuota = this.DateActual();
  }
  eliminarCuota(id: number) {
    const index = this.cuotas.findIndex(c => c.id === id);
    if (index !== -1) {
      this.cuotas.splice(index, 1);
    }
  }
  declararFactura(){
    if(this.empresa.numerodocumentoemisor.length<1){
      return Swal.fire('Faltan campos!','El campo numerodocumentoemisor no contiene datos!','warning')
    }
    if(this.facturaElectronica.SERIENUMERO.length<1){
      return Swal.fire('Faltan campos!','El campo SERIE Y NUMERO no contiene datos!','warning')
    }
    if(this.facturaElectronica.TIPODOCUMENTO.length<1){
      return Swal.fire('El campo tipoDocumento no contiene datos!','','warning')
    }
    if(this.empresa.tipodocumentoemisor.length<1){
      return Swal.fire('El campo tipodocumento emisor no contiene datos!','','warning')
    }
    if(this.cliente==null){
      return Swal.fire('No ha sido asignado el cliente!','','warning')
    }
    if(this.empaqueFactura.length==0){
      return Swal.fire('No hay guias asignadas!','','warning')
    }
    if(!isNaN(this.detraccion.porcentaje)&&(this.empresa.numeroCtaBancoNacion==null||this.empresa.numeroCtaBancoNacion=="")){
      return Swal.fire('No hay un número de cuenta bancaria asignado a la empresa!','','warning')
    }
      var factura=this.llenarFactura();
      this.listasService.declararFactura(factura).subscribe((res:any)=>{
        Swal.fire('Se Declaró con Éxito!','','success').finally(()=>{
          location.reload();
        });
      },err=>{
        Swal.fire('Hubo un problema al Declarar la Factura!','<p>'+err.error.detail+'</p>','error');
      });
  }
  llenarFactura(){
    var einvoicedeails=[];
    var ordenItem=1;
    var cuotas=this.llenarCuotas();
     this.empaqueFactura.forEach(element => {
      var itotal=element.ImporteUnitarioSinImpuesto*Number.parseFloat(element.cantidad);
      var igv=(element.ImporteUnitarioSinImpuesto*element.cantidad)*0.18;
      var einvoicedetail={
        "numeroDocumentoEmisor": this.empresa.numerodocumentoemisor,
        "serieNumero": this.facturaElectronica.SERIENUMERO,
        "tipoDocumento":this.facturaElectronica.TIPODOCUMENTO,
        "tipoDocumentoEmisor":this.empresa.tipodocumentoemisor,
        "cantidad":element.cantidad,
        "numeroOrdenItem":ordenItem.toString(),
        "codigoProducto":element.codigo,
        "descripcion":element.descripcion,
        "ImporteUnitarioSinImpuesto":element.ImporteUnitarioSinImpuesto.toString(),
        "importeTotalSinImpuesto":itotal.toString(),
        "codigoRazonExoneracion":"10",
        "importeUnitarioConImpuesto":(element.ImporteUnitarioSinImpuesto*1.18).toFixed(2),
        "ImporteReferencial":"",
        "UnidadMedida":element.unidadMedida,
        "importeBaseDescuento":"",
        "factorDescuento":"",
        "importeIgv":igv.toString(),
        "importeIsc":"",
        "importeCargo":"",
        "codigoProductoSUNAT":"",
        "MontoBaseIgv":itotal.toFixed(2),
        "tasaIGV":"18.00",
        "importeTotalImpuestos":igv.toString(),
        "ordenEmpaqueDetalle":element.ordenEmpaqueDetalle,
        "serieGuia":element.serieGuia
      };
      einvoicedeails.push(einvoicedetail);
      ordenItem++;
     });
     var AAA_ADQUIRIENTE={
      "direccionAdquiriente":this.cliente.direccionadquiriente,
      "ubigeoAdquiriente":this.cliente.ubigeoadquiriente,
      "urbanizacionAdquiriente":"",
      "provinciaAdquiriente":this.cliente.provinciaadquiriente,
      "departamentoAdquiriente":this.cliente.departamentoadquiriente,
      "distritoAdquiriente":this.cliente.distritoadquiriente,
      "paisAdquiriente":this.cliente.paisadquiriente,
      "formaPagoNegociable":this.facturaElectronica.FORMAPAGO
     }
    var factura={
      "numeroDocumentoEmisor": this.empresa.numerodocumentoemisor,
      "serieNumero": this.facturaElectronica.SERIENUMERO,
      "tipoDocumento": this.facturaElectronica.TIPODOCUMENTO,
      "tipoDocumentoEmisor": this.empresa.tipodocumentoemisor,
      "baseImponiblePercepcion": "",
      "codigoAuxiliar100_1": "",
      "codigoAuxiliar100_10": "",
      "codigoAuxiliar100_2": "",
      "codigoAuxiliar100_3": "",
      "codigoAuxiliar100_4": "",
      "codigoAuxiliar100_5": "",
      "codigoAuxiliar100_6": "",
      "codigoAuxiliar100_7": "",
      "codigoAuxiliar100_8": "",
      "codigoAuxiliar100_9": "",
      "codigoAuxiliar250_1": "",
      "codigoAuxiliar250_10": "",
      "codigoAuxiliar250_11": "",
      "codigoAuxiliar250_12": "",
      "codigoAuxiliar250_13": "",
      "codigoAuxiliar250_14": "",
      "codigoAuxiliar250_15": "",
      "codigoAuxiliar250_16": "",
      "codigoAuxiliar250_17": "",
      "codigoAuxiliar250_18": "",
      "codigoAuxiliar250_19": "",
      "codigoAuxiliar250_2": "",
      "codigoAuxiliar250_20": "",
      "codigoAuxiliar250_21": "",
      "codigoAuxiliar250_22": "",
      "codigoAuxiliar250_23": "",
      "codigoAuxiliar250_24": "",
      "codigoAuxiliar250_25": "",
      "codigoAuxiliar250_3": "",
      "codigoAuxiliar250_4": "",
      "codigoAuxiliar250_5": "",
      "codigoAuxiliar250_6": "",
      "codigoAuxiliar250_7": "",
      "codigoAuxiliar250_8": "",
      "codigoAuxiliar250_9": "",
      "codigoAuxiliar40_1": "9011",
      "codigoAuxiliar40_10": "",
      "codigoAuxiliar40_11": "",
      "codigoAuxiliar40_12": "",
      "codigoAuxiliar40_13": "",
      "codigoAuxiliar40_14": "",
      "codigoAuxiliar40_15": "",
      "codigoAuxiliar40_16": "",
      "codigoAuxiliar40_17": "",
      "codigoAuxiliar40_18": "",
      "codigoAuxiliar40_19": "",
      "codigoAuxiliar40_2": "",
      "codigoAuxiliar40_20": "",
      "codigoAuxiliar40_3": "",
      "codigoAuxiliar40_4": "",
      "codigoAuxiliar40_5": "",
      "codigoAuxiliar40_6": "",
      "codigoAuxiliar40_7": "",
      "codigoAuxiliar40_8": "",
      "codigoAuxiliar40_9": "",
      "codigoAuxiliar500_1": "",
      "codigoAuxiliar500_2": "",
      "codigoAuxiliar500_3": "",
      "codigoAuxiliar500_4": "",
      "codigoAuxiliar500_5": "",
      "codigoLeyenda_1": "1000",
      "codigoLeyenda_10": "",
      "codigoLeyenda_11": "",
      "codigoLeyenda_12": "",
      "codigoLeyenda_13": "",
      "codigoLeyenda_14": "",
      "codigoLeyenda_15": "",
      "codigoLeyenda_16": "",
      "codigoLeyenda_17": "",
      "codigoLeyenda_18": "",
      "codigoLeyenda_19": "",
      "codigoLeyenda_2": "",
      "codigoLeyenda_20": "",
      "codigoLeyenda_3": "",
      "codigoLeyenda_4": "",
      "codigoLeyenda_5": "",
      "codigoLeyenda_6": "",
      "codigoLeyenda_7": "",
      "codigoLeyenda_8": "",
      "codigoLeyenda_9": "",
      "codigoSerieNumeroAfectado": "",
      "correoAdquiriente": "-",
      "correoEmisor": "-",
      "departamentoEmisor": this.empresa.departamentoemisor,
      "descuentosGlobales": "",
      "direccionEmisor": this.empresa.direccionemisor,
      "distritoEmisor": this.empresa.distritoemisor,
      "fechaEmision": new Date(this.facturaElectronica.FECHAEMISION).toISOString().slice(0, 10),
      "inHabilitado": "",
      "lugarDestino": "",
      "motivoDocumento": "",
      "nombreComercialEmisor": "",
      "numeroDocumentoAdquiriente": this.cliente.numerodocumentoadquiriente,
      "numeroDocumentoRefeAdicional_1": "",
      "numeroDocumentoRefeAdicional_2": "",
      "numeroDocumentoRefeAdicional_3": "",
      "numeroDocumentoRefeAdicional_4": "",
      "numeroDocumentoRefeAdicional_5": "",
      "numeroDocumentoReferenciaPrinc": "",
      "numeroDocumentoReferenciaAdicional": "",
      "numeroDocumentoReferencia_1": "",
      "numeroDocumentoReferencia_2": "",
      "numeroDocumentoReferencia_3": "",
      "numeroDocumentoReferencia_4": "",
      "numeroDocumentoReferencia_5": "",
      "paisEmisor": this.empresa.paisemisor,
      "porcentajeDetraccion": isNaN(this.detraccion.porcentaje)?"":(this.detraccion.porcentaje/100).toString(),
      "porcentajePercepcion": "",
      "provinciaEmisor": this.empresa.provinciaemisor,
      "razonSocialAdquiriente": this.cliente.razonsocialadquiriente,
      "razonSocialEmisor": this.empresa.razonsocialemisor,
      "subTotal": "",
      "textoAdicionalLeyenda_1": "",
      "textoAdicionalLeyenda_10": "",
      "textoAdicionalLeyenda_11": "",
      "textoAdicionalLeyenda_12": "",
      "textoAdicionalLeyenda_13": "",
      "textoAdicionalLeyenda_14": "",
      "textoAdicionalLeyenda_15": "",
      "textoAdicionalLeyenda_16": "",
      "textoAdicionalLeyenda_17": "",
      "textoAdicionalLeyenda_18": "",
      "textoAdicionalLeyenda_19": "",
      "textoAdicionalLeyenda_2": "",
      "textoAdicionalLeyenda_20": "",
      "textoAdicionalLeyenda_3": "",
      "textoAdicionalLeyenda_4": "",
      "textoAdicionalLeyenda_5": "",
      "textoAdicionalLeyenda_6": "",
      "textoAdicionalLeyenda_7": "",
      "textoAdicionalLeyenda_8": "",
      "textoAdicionalLeyenda_9": "",
      "textoAuxiliar100_1": "",
      "textoAuxiliar100_10": "",
      "textoAuxiliar100_2": "",
      "textoAuxiliar100_3": "",
      "textoAuxiliar100_4": "",
      "textoAuxiliar100_5": "",
      "textoAuxiliar100_6": "",
      "textoAuxiliar100_7": "",
      "textoAuxiliar100_8": "",
      "textoAuxiliar100_9": "",
      "textoAuxiliar250_1": "",
      "textoAuxiliar250_10": "",
      "textoAuxiliar250_11": "",
      "textoAuxiliar250_12": "",
      "textoAuxiliar250_13": "",
      "textoAuxiliar250_14": "",
      "textoAuxiliar250_15": "",
      "textoAuxiliar250_16": "",
      "textoAuxiliar250_17": "",
      "textoAuxiliar250_18": "",
      "textoAuxiliar250_19": "",
      "textoAuxiliar250_2": "",
      "textoAuxiliar250_20": "",
      "textoAuxiliar250_21": "",
      "textoAuxiliar250_22": "",
      "textoAuxiliar250_23": "",
      "textoAuxiliar250_24": "",
      "textoAuxiliar250_25": "",
      "textoAuxiliar250_3": "",
      "textoAuxiliar250_4": "",
      "textoAuxiliar250_5": "",
      "textoAuxiliar250_6": "",
      "textoAuxiliar250_7": "",
      "textoAuxiliar250_8": "",
      "textoAuxiliar250_9": "",
      "textoAuxiliar40_1": "18%",
      "textoAuxiliar40_10": "",
      "textoAuxiliar40_11": "",
      "textoAuxiliar40_12": "",
      "textoAuxiliar40_13": "",
      "textoAuxiliar40_14": "",
      "textoAuxiliar40_15": "",
      "textoAuxiliar40_16": "",
      "textoAuxiliar40_17": "",
      "textoAuxiliar40_18": "",
      "textoAuxiliar40_19": "",
      "textoAuxiliar40_2": "",
      "textoAuxiliar40_20": "",
      "textoAuxiliar40_3": "",
      "textoAuxiliar40_4": "",
      "textoAuxiliar40_5": "",
      "textoAuxiliar40_6": "",
      "textoAuxiliar40_7": "",
      "textoAuxiliar40_8": "",
      "textoAuxiliar40_9": "",
      "textoAuxiliar500_1": "",
      "textoAuxiliar500_2": "",
      "textoAuxiliar500_3": "",
      "textoAuxiliar500_4": "",
      "textoAuxiliar500_5": "",
      "textoLeyenda_1": "",
      "textoLeyenda_10": "",
      "textoLeyenda_11": "",
      "textoLeyenda_12": "",
      "textoLeyenda_13": "",
      "textoLeyenda_14": "",
      "textoLeyenda_15": "",
      "textoLeyenda_16": "",
      "textoLeyenda_17": "",
      "textoLeyenda_18": "",
      "textoLeyenda_19": "",
      "textoLeyenda_2": "",
      "textoLeyenda_20": "",
      "textoLeyenda_3": "",
      "textoLeyenda_4": "",
      "textoLeyenda_5": "",
      "textoLeyenda_6": "",
      "textoLeyenda_7": "",
      "textoLeyenda_8": "",
      "textoLeyenda_9": "",
      "tipoDocumentoAdquiriente": this.cliente.tipodocumentoadquiriente,
      "tipoDocumentoReferenciaPrincip": "",
      "tipoMoneda": this.facturaElectronica.TIPOMONEDA,
      "tipoOperacion": "0101",
      "tipoReferenciaAdicional": "",
      "tipoReferenciaAdicional_1": "",
      "tipoReferenciaAdicional_2": "",
      "tipoReferenciaAdicional_3": "",
      "tipoReferenciaAdicional_4": "",
      "tipoReferenciaAdicional_5": "",
      "tipoReferencia_1": "",
      "tipoReferencia_2": "",
      "tipoReferencia_3": "",
      "tipoReferencia_4": "",
      "tipoReferencia_5": "",
      "totalDescuentos": "",
      "totalDetraccion": this.detraccion==""?"":this.totalDetraccion.toString(),
      "totalDocumentoAnticipo": "",
      "totalIgv": this.totalIgv.toString(),
      "totalIsc": "",
      "totalOtrosCargos": "",
      "totalOtrosTributos": "",
      "totalPercepcion": "",
      "totalValorVentaNetoOpExonerada": "",
      "totalValorVentaNetoOpGratuitas": "",
      "totalValorVentaNetoOpGravadas": this.totalGrabada.toFixed(2),
      "totalValorVentaNetoOpNoGravada": "",
      "totalVenta": this.totalVenta.toFixed(2),
      "totalVentaConPercepcion": "",
      "ubigeoEmisor": this.empresa.ubigeoemisor,
      "urbanizacion": "",
      "bl_ReintentoJob": 0,
      "bl_SourceFile": "",
      "regimenPercepcion": "",
      "horaEmision": new Date(this.facturaElectronica.FECHAEMISION).toLocaleTimeString('en-US', { hour12: false }),
      "totalImpuestos": "",
      "totalValorVentaNetoOpExporta": "",
      "montoBaseIsc": "",
      "montoBaseOtrosTributos": "",
      "porcentajeDsctoGlobal": "",
      "montoBaseDescuentoGlobal": "",
      "porcentajeDsctoGlobalNoAfecto": "",
      "totalDsctoGlobalesNoAfecto": "",
      "montoBaseDsctoGlobalNoAfecto": "",
      "porcentajeDsctoGlobalAnticipo": "",
      "totalDsctoGlobalesAnticipo": "",
      "montoBaseDsctoGlobalAnticipo": "",
      "porcentajeCargoGlobal": "",
      "montoBaseCargoGlobal": "",
      "cargosGlobales": "",
      "porcentajeCargoGlobalNoAfecto": "",
      "totalCargoGlobalNoAfecto": "",
      "montoBaseCargoGlobalNoAfecto": "",
      "porcentajeRecarConsumoPropina": "",
      "totalRecarConsumoPropina": "",
      "montoBaseRecarConsumoPropina": "",
      "totalValorVenta": this.totalGrabada.toFixed(2),
      "totalPrecioVenta": this.totalVenta.toFixed(2),
      "montoRedondeoTotalVenta": "",
      "codigoDetraccion": this.detraccion==""?"":this.detraccion.codigo,
      "ventaArrozPilado": "",
      "numeroDocumentoComprador": "",
      "tipoDocumentoComprador": "",
      "numeroCtaBancoNacion": this.empresa.numeroctabanconacion==null?"":this.empresa.numeroctabanconacion,
      "contingencia": "",
      "montoBaseICBPER": "",
      "totalMontoICBPER": "",
      "numeroDocumentoReferenciaAdic": "",
      "einvoicedeails":einvoicedeails,
      "ordencompra": this.facturaElectronica.ORDENCOMPRA,
      "CUOTAS": cuotas,
      "AAA_ADQUIRIENTE":AAA_ADQUIRIENTE,
      "serieGuias":this.serieGuiasRemision,
      "fechaVencimiento":new Date(this.facturaElectronica.FECHAVENCIMIENTO).toISOString().slice(0, 10)
    }
    return factura
  }

  llenarCuotas(){
    const obj = {
      MontoPagoCuota1: "",
      MontoPagoCuota2: "",
      MontoPagoCuota3: "",
      MontoPagoCuota4: "",
      MontoPagoCuota5: "",
      MontoPagoCuota6: "",
      MontoPagoCuota7: "",
      MontoPagoCuota8: "",
      MontoPagoCuota9: "",
      MontoPagoCuota10: "",
      MontoPagoCuota11: "",
      MontoPagoCuota12: "",
      FechaPagoCuota1: "",
      FechaPagoCuota2: "",
      FechaPagoCuota3: "",
      FechaPagoCuota4: "",
      FechaPagoCuota5: "",
      FechaPagoCuota6: "",
      FechaPagoCuota7: "",
      FechaPagoCuota8: "",
      FechaPagoCuota9: "",
      FechaPagoCuota10: "",
      FechaPagoCuota11: "",
      FechaPagoCuota12: "",
    };
    const cuotas=this.cuotas;
    for (let i = 0; i < cuotas.length; i++) {
      const cuota = cuotas[i];
      obj[`MontoPagoCuota${i + 1}`] = cuota.MontoPagoCuota.toString();
      obj[`FechaPagoCuota${i + 1}`] = cuota.FechaPagoCuota;
    }
    return obj
  }
  calcularTabla(){
    let totalGrabada = 0;
    this.empaqueFactura.forEach(element => {
      const importe = parseFloat(element.ImporteUnitarioSinImpuesto);
      const cantidad = parseFloat(element.cantidad);
      totalGrabada += importe * cantidad;
    });
    this.totalGrabada = parseFloat(totalGrabada.toFixed(2));
    this.totalIgv = parseFloat((0.18*totalGrabada).toFixed(2));
    this.totalVenta = parseFloat((totalGrabada+this.totalIgv).toFixed(2));
    if(!isNaN(this.detraccion.porcentaje)){
      this.totalDetraccion=Number.parseFloat((this.totalVenta*(this.detraccion.porcentaje/100)).toFixed(2));
      this.totalPendientePago=Number.parseFloat((this.totalVenta-this.totalDetraccion).toFixed(2));
    }else{
      this.totalDetraccion=0;
      this.totalPendientePago=this.totalVenta;
    }
  }
}
