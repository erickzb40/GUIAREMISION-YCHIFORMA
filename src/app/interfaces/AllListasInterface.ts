import { DetraccionInterface } from "./DetraccionInterface";
import { EmpresaInterface } from "./EmpresaInterface";
import { TipoCambioSunatInterface } from "./TipoCambioSunatInterface";
import { TiposDoumentoInterface } from "./TiposDocumentoInterface";

export interface AllListasInterface{
  tipoCambioSunat?: TipoCambioSunatInterface;
  listaEmpresas?: EmpresaInterface[];
  listaDetraccion?: DetraccionInterface[];
  listaTiposDocumento?: TiposDoumentoInterface[];
}
