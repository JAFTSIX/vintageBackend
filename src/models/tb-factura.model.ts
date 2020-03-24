import { Entity, model, property } from '@loopback/repository';

@model()
export class TbFactura extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  sCliente: string;

  @property({
    type: 'date',
    required: true,
  })
  dFecha: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  aCompras: object[];

  @property({
    type: 'number',
    required: true,
  })
  iSubtotal: number;

  @property({
    type: 'number',
    required: true,
  })
  iTotal: number;

  @property({
    type: 'object',
    required: true,
  })
  oDireccion: object;


  constructor(data?: Partial<TbFactura>) {
    super(data);
  }
}

export interface TbFacturaRelations {
  // describe navigational properties here
}

export type TbFacturaWithRelations = TbFactura & TbFacturaRelations;


