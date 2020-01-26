import {Entity, model, property} from '@loopback/repository';

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
    required: true,
  })
  bMinTest: boolean;

  @property({
    type: 'number',
    required: true,
  })
  iDuracion: number;

  @property({
    type: 'string',
    required: true,
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
