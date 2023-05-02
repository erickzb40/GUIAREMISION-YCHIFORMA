import { CuotasInterface } from './CuotasInterface';
import { FormaPagoInterface } from "./FormaPagoInterface";

export interface FacturaElectronicaInterface{
  NUMERODOCUMENTOEMISOR: string; // Aquí pones tu número de RUC
  SERIENUMERO: string; // Es el número del documento ejem: F001-00000001, no olvidar que debe comenzar con F o B en la serie igual al ejemplo
  TIPODOCUMENTO: string; // 01 para factura, 03 para boleta, 07 para NC, 08 para ND
  TIPODOCUMENTOEMISOR: string; // Ahí envía el texto “6” (seis)
  BL_ESTADOREGISTRO: string; // poner la letra “N” en @NUMERODOCUMENTOREFERENCIA_1
  BL_REINTENTO: number; // poner el numero 0 (cero)
  BL_ORIGEN: string; // poner la letra “W”
  BL_HASFILERESPONSE: number; //poner el numero 0 (cero)
  CORREOADQUIRIENTE: string; //correo electrónico para enviar la notificación del documento electrónico
  CORREOEMISOR: string; // un correo emisor puedes poner “-“ (guion) si no deseas usar ninguno
  DEPARTAMENTOEMISOR: string; //El departamento “LIMA” por ejemplo
  DIRECCIONEMISOR: string; //Dirección del Emisor
  DISTRITOEMISOR: string; // Distrito del Emisor
  FECHAEMISION: string; //Fecha de emisión del documento en formato “YYYY-MM-DD”
  FECHAVENCIMIENTO: string; //Fecha de emisión del documento en formato “YYYY-MM-DD”
  NOMBRECOMERCIALEMISOR: string; // Nombre comercial
  NUMERODOCUMENTOADQUIRIENTE: string; // Numero de documento del adquiriente, RUC o DNI según sea necesario
  NUMERODOCUMENTOREFERENCIA_1?: string | null; // Numero de GUIA si corresponde, sino poner NULL
  PAISEMISOR: string; // Poner “PE”
  PORCENTAJEDETRACCION: string | null; // Porcentaje de detracción en 2 decimales , sino aplica poner NULL
  PROVINCIAEMISOR: string; // Provincia del emisor
  RAZONSOCIALADQUIRIENTE: string; //Razón social o nombre del adquiriente
  RAZONSOCIALEMISOR: string; // Razón social del emisor
  serieNumeroAfectado?: string; // Número del documento afectado en el caso de NC o ND
  codigoLeyenda_1: string; // poner el número “1000”
  textoLeyenda_1: string; // poner en texto el monto del documento debe incluir el texto “Son:” y luego el monto
  tipoDocumentoAdquiriente: string; // si es empresa va “6” si es persona natural va “1” si es exportación va “0” (cero)
  TIPOMONEDA: string; //“PEN” o “USD”
  TOTALDETRACCION: string | null; // Total de la detracción en 2 decimales
  totalValorVentaNetoOpGravadas: string; //total ventas neta de operaciones gravadas
  totalVenta: string; // Total de la venta
  ubigeoEmisor: string; //codigo ubigeo (ver códigos de ubigeo sunat 150101 es lima centro ejem)
  urbanizacion: string, // poner "-" si no aplica
  tipoDocumentoAfectado: string, // si es NC o ND se indica 01 si afecta una factura, 03 si afecta una boleta
  motivoNCND?: string, // si es NC o ND va aquí el motivo
  tipoNCND?: string, // Tipo según tabla Excel de la NC o ND
  tipoCambio?: string, // tipo de cambio, mandatorio si es boleta en dólares
  direccionAdquiriente: string,
  totalIGV: string, // Total de IGV
  totalImpuestos: string, // Total de Impuestos
  codigoAuxiliar40_1: string, // Poner 9011
  textoAuxiliar40_1: string, // Poner 18%
  tipoOperacion: string, // Poner 0101, Catalogo 51
  horaEmision: string, // formato hh:mm:ss
  codigoLocalAnexoEmisor: string, // Codigo SUNAT del local, en su defecto poner 0000
  FORMAPAGO:string,
  ORDENCOMPRA:string,
  OBSERVACIONES:string
  CUOTAS:CuotasInterface
}
