import { empaque_detalle } from './../../interfaces/empaque';
import { ListaGuiaremisionService } from './../../services/lista-guiaremision.service';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { adquiriente } from 'src/app/interfaces/adquiriente';

@Component({
  selector: 'app-guiaremision',
  templateUrl: './guiaremision.component.html',
  styleUrls: ['./guiaremision.component.scss']
})
export class GuiaremisionComponent {
item: any;
  getSpe_despatch(desde: any, hasta: any) {
    throw new Error('Method not implemented.');
  }
  tipoDocumentoDocRel='01';
  tipoDocumentoEmisorDocRel='6';
  empaques=[];
  empaquesSeleccionadosCss=[];
  empaquesSeleccionadosTabla=[];
  documentosReferenciados=[];
  pageEmpaque=0;
  empaque_desde=this.fechaManual(-1);
  empaque_hasta=this.fechaActual();
  //input filter table
  filterTransportista='';
  filterOrigen='';
  filterDestinatario='';
  filterProducto='';
  filterEmpaque='';
  //---------------------
  pais = 'PE';
  tipodocEmp = '6';
  ubigeoDestinoUpdate = '';
  codigoPtollegadaUpdate='';
  direccionDestinoUpdate = '';
  destinatarioObject: adquiriente;
  tablaEmpresas = [];
  tablaOrigenes = [];
  tablaSeries = [];
  arraySerie = [];
  // variable para formulario crud destinatario select tipo doc
  tipodocForm = '1';
  tipodocTrans = '6';
  tipodocChofer = '1';
  correlativo = 0;
  //-------------------------------------------------------------
  pageProduct = 0;
  vmotivo = '';
  vmodalidad = '02';
  fecha_emision = this.fechaActual();
  horaEmision = new Date(this.fecha_emision).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  fecha_traslado = this.fechaActual().substring(0, 10);
  empresas = [];
  empresa = '';
  modalidad = [{ id: '01', text: 'PUBLICO', }, { id: '02', text: 'PRIVADO' }];
  medidas = [{ id: 'KGM', text: 'KGM' }, { id: 'NIU', text: 'NIU' }]
  medida = 'KGM';
  medidaProductoCrud = 'KGM';
  motivos = [];
  destinatarios = [];
  transportistas = [];
  chofer = [];
  destino = [];
  origen = [];
  modalRef: NgbModalRef;
  //producto modal -----------------------------------------
  selectedRow: number;
  objetoProducto: any = {};
  //destino modal-------------------------------------------
  destinos = [];
  ubigeoDestino = '';
  codigoPtollegada='';
  direccionDestino = '';
  contador = 0;
  //select destino------------------------------------------
  vdestino = '';
  //select origen-------------------------------------------
  vorigen = '';
  //producto modal------------------------------------------
  descripcion = '';
  //Guia de remision----------------------------------------
  empresaid = '';
  destinatario_input = '';
  chofer_input = '';
  transportista_input = '';
  productos = [];//todos los productos del modal
  listadoProductoDetalles = [];//todos los detalles de la guia de remision
  cantidad = '1';
  placaChofer = '';
  brevete = '';
  serieNumero = '';
  observaciones = '';
  correoDestinatario = '';
  numeroDocDestinatario = '';
  tipodocumentoadquiriente = '';
  pesoBruto = '';
  medidaGRE = 'KGM';
  numeroRucTransportista = '';
  mtcTransportista = '';
  tipoDocumentoTransportista = '';
  razonSocialTransportista = '';
  numeroDocumentoConductor: '';
  tipoDocumentoConductor: '';
  nombreConductor: '';
  apellidoConductor: '';
  Nrobultos = '';

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  constructor(public api: ListaGuiaremisionService, private modalService: NgbModal, public rout: Router) {
    this.obtenerInfo();
  }
  EditarDestinatario(modal, contenido) {
    this.destinatarioObject = contenido;
    this.abrirModal(modal);
  }
  obtenerInfo() {
    Swal.showLoading();
    this.api.getInfo().subscribe((res: any) => {
      Swal.close();
      this.empresa = res['EMPRESAS'].id
      this.motivos = res['MOTIVOS'];
      this.chofer = res['CHOFER'];
      this.transportistas = res['TRANSPORTISTA'];
      this.destinatarios = res['ADQUIRIENTE'];
      this.arraySerie = res['SERIE'];
      this.origen= res['ORIGEN'];
      this.vorigen= res['ORIGEN'][0].id;
    },err=>{
      this.mostrarMensaje('error','Error en la conexión','Hubo un error en la conexión, vuelva a cargar la pagina');
    });

  }
  fechaActual() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hours = now.getHours() - 5;
    const minutes = now.getMinutes();
    const isoString = new Date(year, month, day, hours, minutes).toISOString().slice(0, -8);
    return (isoString);
  }
  fechaManual(dias) {
    const now = new Date();
    now.setDate(now.getDate()+dias);
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hours = now.getHours() - 5;
    const minutes = now.getMinutes();
    const isoString = new Date(year, month, day, hours, minutes).toISOString().slice(0, -8);
    return (isoString);
  }
  validarNumero(event: KeyboardEvent) {
    if (event.charCode !== 0) {
      const pattern = /[0-9]/;
      const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }
  validarDecimal(event: KeyboardEvent) {
    if (event.charCode !== 0) {
      const pattern = /[0-9.]/;
      const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }
  abrirModal(ModalTemplate) {
    this.modalRef = this.modalService.open(ModalTemplate, { size: 'lg' });
  }
  crearAdquiriente(form: NgForm) {
    if (form.invalid) {
      return
    }
    if (form.submitted) {
      Swal.showLoading();
      form.value.destino = this.destinos;
      this.api.crearAdquiriente(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.destinos = [];
        this.modalRef.close();
        this.obtenerInfo();
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }
  }
  updateAdquiriente(form: NgForm) {
    if (form.invalid) { return }
    if (form.submitted) {
      Swal.showLoading();
      form.value.DESTINO = this.destinatarioObject.DESTINO;
      this.api.updateAdquiriente(form.value).subscribe((res: any) => {
        this.modalRef.close();
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.destinatarioObject.DESTINO = [];
        this.obtenerInfo();
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }
  }
  crearTransportista(form: NgForm) {
    if (form.invalid) {
      return
    }
    if (form.submitted) {
      Swal.showLoading();
      this.api.crearTransportista(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
        this.obtenerInfo();
      }, error => {
        Swal.fire({ icon: 'error', title: 'Hubo un error en crear el registro' })
      })
    }
  }
  crearChofer(form: NgForm) {
    if (form.invalid) {
      return
    }
    if (form.submitted) {
      Swal.showLoading();
      this.api.crearChofer(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
        this.obtenerInfo();
      }, error => {
        Swal.fire({ icon: 'error', title: 'Hubo un error en crear el registro' })
      })
    }
  }
  crearFilas() {
    if (this.ubigeoDestino == '' || this.direccionDestino == '') {
      return Swal.fire({ icon: 'error', title: 'Complete los campos' });
    }
    var obj = {
      id: this.contador,
      ubigeodestino: this.ubigeoDestino,
      direcciondestino: this.direccionDestino,
      codigolocalanexo:this.codigoPtollegada
    }
    this.destinos.push(obj);
    this.ubigeoDestino = '';
    this.direccionDestino = '';
    this.contador++;
  }
  crearFilasUpdate() {
    if (this.ubigeoDestinoUpdate == '' || this.direccionDestinoUpdate == '') {
      return Swal.fire({ icon: 'error', title: 'Complete los campos' });
    }
    var obj = {
      id: this.contador,
      UBIGEODESTINO: this.ubigeoDestinoUpdate,
      DIRECCIONDESTINO: this.direccionDestinoUpdate ,
      CODIGOLOCALANEXO: this.codigoPtollegadaUpdate
    }
    this.destinatarioObject.DESTINO.push(obj);
    this.ubigeoDestinoUpdate = '';
    this.direccionDestinoUpdate = '';
    this.codigoPtollegadaUpdate='';
    this.contador++;
  }
  borrarDestinoArray(id) {
    const indice = this.destinos.findIndex((elemento) => elemento.id === id);
    this.destinos.splice(indice, 1);
  }
  borrarDestinoArrayUpdate(id) {
    const indice = this.destinatarioObject.DESTINO.findIndex((elemento) => elemento.id === id);
    this.destinatarioObject.DESTINO.splice(indice, 1);
  }
  limpiarDestinatario(){
    this.destinatario_input = '';
    this.correoDestinatario = '';
    this.numeroDocDestinatario = '';
    this.tipodocumentoadquiriente = '';
    this.empaques=[];
    this.empaquesSeleccionadosCss=[];
    this.empaquesSeleccionadosTabla=[];
  }

  asignarChofer(ndoc, nombre, apellido, placa, tipoDoc, brevete) {
    this.limpiarChofer();
    this.chofer_input = nombre + ' ' + apellido;
    this.tipoDocumentoConductor = tipoDoc;
    this.numeroDocumentoConductor = ndoc;
    this.nombreConductor = nombre;
    this.apellidoConductor = apellido;
    this.brevete = brevete;
    this.modalService.dismissAll();
    this.placaChofer = placa;
  }
  limpiarChofer(){
    this.chofer_input = '';
    this.tipoDocumentoConductor = '';
    this.numeroDocumentoConductor = '';
    this.brevete = '';
    this.placaChofer = '';
    this.nombreConductor = '';
    this.apellidoConductor = '';
  }
  asignarTransportista(ndoc, nombre, tipoDoc, mtc) {
   this.limpiarTransportista();
    this.transportista_input = nombre;
    this.numeroRucTransportista = ndoc;
    this.razonSocialTransportista = nombre;
    this.tipoDocumentoTransportista = tipoDoc;
    this.mtcTransportista = mtc;
    this.modalService.dismissAll();
  }
  salir() {
    this.destinos = []
    this.modalRef.close();
  }
  seleccionarProducto(codigo, descripcion, unidadmedida, row: number) {
    this.selectedRow = row;
    this.objetoProducto = { codigo: codigo, descripcion: descripcion, unidadmedida: unidadmedida }
  }
  asignarProducto() {
    this.objetoProducto.cantidad = this.cantidad.toString();
    this.objetoProducto.descripcion = this.descripcion != '' ? this.objetoProducto.descripcion + ' ' + this.descripcion : this.objetoProducto.descripcion;
    var found = this.listadoProductoDetalles.find(object => object.codigo == this.objetoProducto.codigo && object.descripcion == this.objetoProducto.descripcion && object.unidadmedida == this.objetoProducto.unidadmedida);
    if (this.objetoProducto.codigo == null) {
      return Swal.fire({ icon: 'error', title: 'Seleccione un producto' });
    }
    if (found) {
      return Swal.fire({ icon: 'error', title: 'El producto ya ha sido insertado' });
    }
    this.listadoProductoDetalles.push(this.objetoProducto);
    this.salirProducto();
  }

  salirProducto() {
    this.objetoProducto = {};
    this.descripcion = '';
    this.cantidad = '1';
    this.selectedRow = null;
    this.modalService.dismissAll();
  }
  obtenerProductos(modal) {
    Swal.showLoading();
    this.api.getProductos().subscribe((res: any) => {
      Swal.close();
      this.productos = res;
      this.abrirModal(modal);

    }, error => {
      Swal.close();
      this.abrirModal(modal);
    });
  }
  borrarListadoProductoDetalles(codigo, descripcion, cantidad, unidadmedida) {
    const indice = this.listadoProductoDetalles.findIndex((elemento) => elemento.codigo == codigo && elemento.descripcion == descripcion && elemento.cantidad == cantidad && elemento.unidadmedida == unidadmedida);
    this.listadoProductoDetalles.splice(indice, 1);
  }
  declararGuia() {
    if (this.serieNumero == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'El campo serie y numero esta vacio!' });
    }
    if (this.serieNumero.length != 13) {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'El campo serie y numero debe tener un ancho de 13 letras!' });
    }
    if (this.empresa == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione una empresa!' });
    }
    if (this.destinatario_input == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un destinatario!' });
    }
    if (this.vdestino == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un destino!' });
    }
    if (this.vorigen == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un origen!' });
    }
    if (this.vmotivo == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un motivo!' });
    }
    if (this.medida == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione una medida!' });
    }
    if (this.pesoBruto == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'El campo peso bruto es requerido!' });
    }
    if(this.validarDecimales(parseFloat(this.pesoBruto))){
      return Swal.fire({ icon: 'warning', title: 'Corregir Campo', text: 'El campo peso bruto solo se admite hasta 3 decimales!' });
    }
    if (this.transportista_input == '' && this.vmodalidad == '01') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un transportista!' });
    }
    if (this.chofer_input == '' && this.vmodalidad == '02') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un chofer!' });
    }
    if (this.Nrobultos != '' && Number.isNaN(this.Nrobultos)) {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'El campo N° Bultos debe ser numerico!' });
    }
    if (this.listadoProductoDetalles.length == 0) {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Esta guia no tiene Detalles!' });
    }
    var destino = this.vdestino.split('-');
    if (destino[1].length!=6){
      return Swal.fire({ icon: 'warning', title: 'Error campo ubigeoPtoLLegada', text: `Mensaje de error cuando el ubigeo no tenga el formato requerido:
      "El dato "ubigeo" no contiene el formato requerido. Por favor modificar el dato en este formulario y en el Labeltraxx`});
    }
    var origen = this.vorigen.split('-');
    if (origen[1].length!=6){
      return Swal.fire({ icon: 'warning', title: 'Error campo ubigeoPtoPartida', text: `Mensaje de error cuando el ubigeo no tenga el formato requerido:
      "El dato "ubigeo" no contiene el formato requerido. Por favor modificar el dato en este formulario y en el Labeltraxx`});
    }
    var motivo=this.vmotivo.split('-');
    if (origen[3]==''&&(motivo[0]=='04'||motivo[0]=='08'||motivo[0]=='09')){
      return Swal.fire({ icon: 'warning', title: 'Error campo codigoPtoPartida', text: `El código local anexo del emisor esta vacío o nulo, actualice la información`});
    }
    if (destino[3]==''&&(motivo[0]=='04'||motivo[0]=='08'||motivo[0]=='09')){
      return Swal.fire({ icon: 'warning', title: 'Error campo codigoPtollegada', text: `El código local anexo del cliente está vacío o nulo, actualice la información`});
    }
    var obj = this.llenarGuia();
    Swal.showLoading();
    this.api.declararGuia(obj).subscribe((res: any) => {
      Swal.fire({ icon: 'success', title: 'Se creó con éxito' }).then(res => {
        window.location.reload();
      })
    }, err => {
      if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
      else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
    })
  }
  limpiarPantalla() {
  }
  llenarGuia() {
    if(this.vmodalidad=='01'){
      this.limpiarChofer();
    }else{
      this.limpiarTransportista();
    }
    var arrayRem = this.empresa.split('-');
    var tipoDocRem = arrayRem[1];
    var numeroDocRem = arrayRem[0];
    var razonsocialemisorRem = arrayRem[2];
    var motivo = this.vmotivo.split('-');
    var destino = this.vdestino.split('-');
    var origen = this.vorigen.split('-');
    var obj = {
      tipoDocumentoRemitente: tipoDocRem,
      numeroDocumentoRemitente: numeroDocRem,
      serieNumeroGuia: this.serieNumero,
      tipoDocumentoGuia: '09',
      bl_estadoRegistro: 'N',
      bl_reintento: 0,
      bl_origen: 'W',
      bl_hasFileResponse: 0,
      fechaEmisionGuia: this.fecha_emision.substring(0, 10), //solo date yyyy-mm-dd
      observaciones: this.observaciones,
      razonSocialRemitente: razonsocialemisorRem, //razonsocialemisor empresa
      correoRemitente: '-',
      correoDestinatario: this.correoDestinatario,
      serieGuiaBaja: '',
      codigoGuiaBaja: '',
      tipoGuiaBaja: '',
      numeroDocumentoRelacionado: '',
      codigoDocumentoRelacionado: '',
      numeroDocumentoDestinatario: destino[0],
      tipoDocumentoDestinatario: this.tipodocumentoadquiriente,
      razonSocialDestinatario: this.destinatario_input,
      numeroDocumentoEstablecimiento: '',
      tipoDocumentoEstablecimiento: '',
      razonSocialEstablecimiento: '',
      motivoTraslado: motivo[0],
      descripcionMotivoTraslado: motivo[1],
      indTransbordoProgramado: '',
      pesoBrutoTotalBienes: parseFloat(this.pesoBruto).toString(),
      unidadMedidaPesoBruto: this.medidaGRE,
      modalidadTraslado: this.vmodalidad, //01 publico 02 privado
      fechaInicioTraslado: this.fecha_traslado,
      numeroRucTransportista: this.numeroRucTransportista,
      tipoDocumentoTransportista: this.tipoDocumentoTransportista,
      razonSocialTransportista: this.razonSocialTransportista,
      numeroDocumentoConductor: this.numeroDocumentoConductor == null ? '' : this.numeroDocumentoConductor,
      tipoDocumentoConductor: this.tipoDocumentoConductor == null ? '' : this.tipoDocumentoConductor,
      numeroPlacaVehiculoPrin: this.placaChofer, //conductor chofer
      numeroBultos: this.Nrobultos,
      numeroContenedor1: '',
      ubigeoPtoLLegada: destino[1], //destino
      direccionPtoLLegada: destino[2], //destino
      ubigeoPtoPartida: origen[1], //origen
      direccionPtoPartida: origen[2], //origen
      codigoPuerto: '',
      idEntrega: '',
      horaEmisionGuia: this.horaEmision, //solo hora!! hh:mm:ss
      numeroPlacaVehiculoSec1: '',
      bL_SOURCEFILE: '',
      bl_createdAt: null,
      numeroAutorizacionRem: '',
      codigoAutorizadoRem: '',
      tipoDocumentoComprador: '',
      numeroDocumentoComprador: '',
      razonSocialComprador: '',
      pesoBrutoTotalItem: '',
      unidadMedidaPesoBrutoItem: '',
      sustentoPesoBrutoTotal: '',
      numeroPrecinto1: '',
      numeroContenedor2: '',
      numeroPrecinto2: '',
      fechaEntregaBienes: this.fecha_traslado, //fecha de entrega solo DATE
      indRetornoVehiculoEnvaseVacio: '',
      indTrasVehiculoCatM1L: '',
      indRegVehiculoyCond: '',
      indRetornoVehiculoVacio: '',
      indTrasladoTotalDAMoDS: '',
      tipoEvento: '',
      numeroRegistroMTC: this.mtcTransportista,//puede estar en blanco
      numeroAutorizacionTrans: '',
      codigoAutorizadoTrans: '',
      tarjetaUnicaCirculacionPrin: '',
      numeroAutorizacionVehPrin: '',
      codigoAutorizadoVehPrin: '',
      numeroPlacaVehiculoSec2: '',
      tarjetaUnicaCirculacionSec1: '',
      tarjetaUnicaCirculacionSec2: '',
      numeroAutorizacionVehSec1: '',
      numeroAutorizacionVehSec2: '',
      codigoAutorizadoVehSec1: '',
      codigoAutorizadoVehSec2: '',
      nombreConductor: this.nombreConductor,
      apellidoConductor: this.apellidoConductor,
      numeroLicencia: this.brevete, //chofer
      numeroDocumentoConductorSec1: '',
      tipoDocumentoConductorSec1: '',
      nombreConductorSec1: '',
      apellidoConductorSec1: '',
      numeroLicenciaSec1: '',
      numeroDocumentoConductorSec2: '',
      tipoDocumentoConductorSec2: '',
      nombreConductorSec2: '',
      apellidoConductorSec2: '',
      numeroLicenciaSec2: '',
      numeroDocumentoPtoLlegada: '',
      codigoPtollegada: destino[3],
      ptoLlegadaLongitud: '',
      ptoLlegadaLatitud: '',
      numeroDocumentoPtoPartida: '',
      codigoPtoPartida: origen[3],
      ptoPartidaLongitud: '',
      ptoPartidaLatitud: '',
      tipoLocacion: '',
      codigoAeropuerto: '',
      nombrePuertoAeropuerto: '',
      spE_DESPATCH_ITEM: this.listadoProductoDetalles,
      SPE_DESPATCH_DOCRELACIONADO:this.documentosReferenciados
    }
    return obj;
  }
  crearProducto(producto: NgForm) {
    if (producto.invalid) {
      return
    }
    if (producto.submitted) {
      Swal.showLoading();
      this.api.crearProducto(producto.value).subscribe((res: any) => {
        this.modalRef.close();
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.cargarProductos();
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
      })
    }
  }
  cargarProductos() {
    this.api.getProductos().subscribe((res: any) => {
      if (res && res.length > 0) {
        this.productos = res;
      } else {
        this.productos = [];
      }
    }, error => {
      Swal.fire({ icon: 'error', title: 'Hubo un error en la conexión' });
    });
  }
  borrarProducto(id) {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'El Producto con codigo ' + id + ' se eliminará',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Salir'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.api.borrarProducto(id).subscribe((res: any) => {
          this.cargarProductos();
          Swal.fire({ icon: 'success', title: 'Se Eliminó con éxito' })
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
        });
      }
    })

  }
  listarOrigen(origen) {
    this.api.getOrigen().subscribe((res: any) => {
      this.abrirModal(origen);
      this.tablaOrigenes = res;
    });
  }
  crearOrigen(form) {
    if (form.invalid) { return }
    if (form.submitted) {
      Swal.showLoading();
      this.api.CrearOrigen(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
        this.api.getOrigen().subscribe((res: any) => {
          this.tablaOrigenes = res;
        });
        this.empresa = '';
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }

  }
  listarSerie(serie) {
    Swal.showLoading()
    this.api.getSerie().subscribe((res: any) => {
      Swal.close();
      this.abrirModal(serie);
      this.tablaSeries = res;
    });
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
        this.empresa = '';
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }
  }
  borrarSerie(numDoc, serie) {
    Swal.showLoading();
    Swal.fire({
      icon:'warning',
      title: 'Estás seguro?',
      text: 'La serie '+serie+' con el N° Doc ' + numDoc + ' se eliminará',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor:'red',
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
  borrarEmpresa(ndoc) {
    Swal.showLoading();
    Swal.fire({
      icon:'warning',
      title: 'Estás seguro?',
      text: 'La empresa con el N° Doc ' + ndoc + ' se eliminará',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor:'red',
      cancelButtonText: 'Salir'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.api.BorrarEmpresa(ndoc).subscribe((res: any) => {
          this.api.getEmpresas().subscribe((res: any) => {
            Swal.close();
            this.tablaEmpresas = res;
          });
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
        })
      }
    })

  }
  borrarOrigen(ndoc, ubigeo, direccion) {
    Swal.showLoading();
    Swal.fire({
      icon:'warning',
      title: 'Estás seguro?',
      text: 'El Origen con el N° Doc ' + ndoc + ' y ubigeo '+ubigeo+' se eliminará',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor:'red',
      cancelButtonText: 'Salir'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var obj = { numerodocumentoemisor: ndoc, ubigeoorigen: ubigeo, direccionorigen: direccion }
        this.api.BorrarOrigen(obj).subscribe((res: any) => {
          this.api.getOrigen().subscribe((res: any) => {
            Swal.close();
            this.tablaOrigenes = res;
          });
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
        })
      }
    })

  }
  borrarTransportista(ndoc) {
    Swal.showLoading();
    Swal.fire({
      icon:'warning',
      title: 'Estás seguro?',
      text: 'El Transportista con el N° Doc ' + ndoc + ' se eliminará',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor:'red',
      cancelButtonText: 'Salir'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.api.BorrarTransportista(ndoc).subscribe((res: any) => {
          this.api.getTransportista().subscribe((res: any) => {
            Swal.close();
            this.transportistas = res;
          });
          this.limpiarTransportista();
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
        })
      }
    })
  }
  borrarChofer(ndoc){
    Swal.showLoading();
    Swal.fire({
      icon:'warning',
      title: 'Estás seguro?',
      text: 'El Chofer con el N° Doc ' + ndoc + ' se eliminará',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor:'red',
      cancelButtonText: 'Salir'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.api.BorrarChofer(ndoc).subscribe((res: any) => {
           this.obtenerInfo();
           this.limpiarChofer();
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
        })
      }
    })
  }
  limpiarTransportista(){
    this.transportista_input = '';
    this.numeroRucTransportista = '';
    this.razonSocialTransportista = '';
    this.tipoDocumentoTransportista = '';
    this.mtcTransportista = '';
  }
  validarDecimales(num:Number){
    const numString = num.toString();
    const match = numString.match(/\.(\d{4,})/);
    return match !== null && match[1].length > 3;
  }

  abrirEmpaques(empaque){
    this.modalRef = this.modalService.open(empaque, { size: 'lg' });
  }
  cerrarModal(){
    this.modalService.dismissAll();
  }
  buscarEmpaque(){
    Swal.showLoading();
    this.api.getEmpaque(this.numeroDocDestinatario,this.empaque_desde,this.empaque_hasta).subscribe((a:any)=>{
      this.empaques=a;
      this.empaquesSeleccionadosTabla=[];
      this.empaquesSeleccionadosCss=[];
      Swal.close();
    },
    err => {
      if (err.error.detail) { this.Toast.fire({ icon: 'warning', text: err.error.detail }); }
      else { this.Toast.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
    });
  }
  seleccionarEmpaque(detalle:any,cliente:any){
    detalle.id=detalle.codigoEmpaque+detalle.codigoProducto;
    detalle.unidadmedida=detalle.unidadMedida;
    detalle.codigo=detalle.codigoProducto.toString();
    detalle.cantidad=detalle.cantidad.toString();
    detalle.cliente=cliente.toString();
    if(!this.empaquesSeleccionadosCss.includes(detalle.id)){
      this.empaquesSeleccionadosCss.push(detalle.id);
      this.empaquesSeleccionadosTabla.push(detalle)
    }else{
      this.empaquesSeleccionadosCss=this.empaquesSeleccionadosCss.filter(object=>object!=detalle.id);
      this.empaquesSeleccionadosTabla.forEach((element: any, index: number) => {
        if (element.id === detalle.id) {
        this.empaquesSeleccionadosTabla.splice(index, 1);
        }
      });
    }
  }
  asignarDestinatario(nombre, ndoc, correo, tipoDoc) {
    this.limpiarDestinatario();
    this.llenarDestinatario(nombre, ndoc, correo, tipoDoc);
    this.modalService.dismissAll();
    this.cargarDestinos(ndoc);
  }
  llenarDestinatario(nombre, ndoc, correo, tipoDoc){
    this.destinatario_input = nombre;
    this.correoDestinatario = correo;
    this.numeroDocDestinatario = ndoc;
    this.tipodocumentoadquiriente = tipoDoc;
  }
  cargarDestinos(ndoc){
    Swal.showLoading();
    this.api.getDestinos({ NUMERODOCUMENTOADQUIRIENTE: ndoc }).subscribe((res: any) => {
      this.destino = res;
      Swal.close();
    });
  }
  asignarEmpaque(){
    try {
      this.asignarDetalleProductoEmpaque();
    } catch (error) {
     return Swal.fire({icon:'error',title:'Multiples clientes!',text:error});
    }

    this.cerrarModal();
  }
  asignarDetalleProductoEmpaque(){

    const cliente = this.empaquesSeleccionadosTabla[0].cliente;
    if (!this.empaquesSeleccionadosTabla.every(elemento => elemento.cliente === cliente)) {
      throw 'No se puede asignar empaques de distintos clientes';
    }
    if (this.listadoProductoDetalles.some(detalle => detalle.cliente !== cliente)) {
      throw 'No se puede asignar empaques de distintos clientes';
    }
      this.empaquesSeleccionadosTabla.forEach(element => {
        if (!this.listadoProductoDetalles.some(detalle => detalle.codigo === element.codigo )) {
          this.listadoProductoDetalles.push(element);
        }
      });
  }
  editarUbigeo() {
    Swal.fire({
      title: 'Destino',
      input: 'text',
      inputLabel: 'N° Documento-Ubigeo-Dirección',
      inputPlaceholder: 'Escribe aquí...',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      confirmButtonColor:'blue',
      cancelButtonText: 'Cancelar',
      cancelButtonColor:'red',
      reverseButtons:true,
      inputValue:this.vdestino
    }).then((result) => {
      if (result.isConfirmed) {
        this.destino=[{id:result.value,text:result.value}]
        this.vdestino = result.value;
      }
    });
  }
  crearRef(ref: NgForm) {
    if (ref.valid) {
      const codigoDocumentoDocRel = ref.value.codigoDocumentoDocRel;
      const tipoDocumentoDocRel = ref.value.tipoDocumentoDocRel;
      const numeroDocumentoDocRel = ref.value.numeroDocumentoDocRel;
      const numeroDocumentoEmisorDocRel = ref.value.numeroDocumentoEmisorDocRel;
      const tipoDocumentoEmisorDocRel = ref.value.tipoDocumentoEmisorDocRel;

      if (!this.existeDocumentoReferenciado(codigoDocumentoDocRel, tipoDocumentoDocRel, numeroDocumentoDocRel, numeroDocumentoEmisorDocRel, tipoDocumentoEmisorDocRel)) {
        // El elemento no existe, se agrega a la matriz
        this.documentosReferenciados.push(ref.value);
        this.salir();
      } else {
        // El elemento ya existe
        // Aquí puedes agregar el código que desees si el elemento ya existe
        Swal.fire({icon:'warning',title:'Ya existe el documento!',text:'El docuemnto con el codigo: '+codigoDocumentoDocRel+' ya existe'})
      }
    }
  }
  existeDocumentoReferenciado(codigoDocumentoDocRel, tipoDocumentoDocRel, numeroDocumentoDocRel, numeroDocumentoEmisorDocRel, tipoDocumentoEmisorDocRel) {
    return this.documentosReferenciados.some((elemento) =>
      elemento.codigoDocumentoDocRel == codigoDocumentoDocRel &&
      elemento.tipoDocumentoDocRel == tipoDocumentoDocRel &&
      elemento.numeroDocumentoDocRel == numeroDocumentoDocRel &&
      elemento.numeroDocumentoEmisorDocRel == numeroDocumentoEmisorDocRel &&
      elemento.tipoDocumentoEmisorDocRel == tipoDocumentoEmisorDocRel
    );
  }
  borrarRef(codigoDocumentoDocRel, tipoDocumentoDocRel, numeroDocumentoDocRel, numeroDocumentoEmisorDocRel, tipoDocumentoEmisorDocRel) {
    const existe = this.existeDocumentoReferenciado(codigoDocumentoDocRel, tipoDocumentoDocRel, numeroDocumentoDocRel, numeroDocumentoEmisorDocRel, tipoDocumentoEmisorDocRel);
    if (existe) {
      const indice = this.documentosReferenciados.findIndex((elemento) =>
        elemento.codigoDocumentoDocRel == codigoDocumentoDocRel &&
        elemento.tipoDocumentoDocRel == tipoDocumentoDocRel &&
        elemento.numeroDocumentoDocRel == numeroDocumentoDocRel &&
        elemento.numeroDocumentoEmisorDocRel == numeroDocumentoEmisorDocRel &&
        elemento.tipoDocumentoEmisorDocRel == tipoDocumentoEmisorDocRel
      );
      this.documentosReferenciados.splice(indice, 1);
    } else {
      // El elemento no existe
      // Aquí puedes agregar el código que desees si el elemento no existe
      console.log('El elemento no existe');
    }
  }
  UpdateAdquirienteEmpaque(){
    Swal.showLoading();
   this.api.getExtraerEmpaque(300).subscribe(res=>{
      return this.mostrarMensaje('success','Actualizado!');
   },err=>{
      return this.mostrarMensaje('warning',err.error.detail?err.error.detail:'Hubo un error al actualizar los clientes');
   })
  }
  mostrarMensaje(icon,title,text?){
    return Swal.fire({
      icon:icon,
      title:title,
      text:text
    });
  }
}
