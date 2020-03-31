import { Model, model, property } from '@loopback/repository';
import { TbFactura } from './tb-factura.model';

@model({ settings: { strict: false } })
export class Pago extends Model {
  @property({
    type: 'object',
    required: true,
  })
  Factura: object;

  @property({
    type: "string",
    required: true,
  })
  paymentMethodNonce: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Pago>) {
    super(data);
  }
}

export interface PagoRelations {
  // describe navigational properties here
}

export type PagoWithRelations = Pago & PagoRelations;
