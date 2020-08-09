import { Entity, model, property } from '@loopback/repository';

@model()
export class TbHistorial extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'date',
    required: true,
  })
  dFecha: string;

  @property({
    type: 'boolean',

  })
  bMinTest: boolean;

  @property({
    type: 'number',

  })
  iDuracion: number;

  @property({
    type: 'string',

  })
  sCliente: string;

  @property({
    type: 'string',
    required: true,
  })
  sReceta: string;


  constructor(data?: Partial<TbHistorial>) {
    super(data);
  }
}

export interface TbHistorialRelations {
  // describe navigational properties here
}

export type TbHistorialWithRelations = TbHistorial & TbHistorialRelations;
