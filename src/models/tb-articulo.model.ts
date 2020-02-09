import {Entity, model, property} from '@loopback/repository';

@model()
export class TbArticulo extends Entity {
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
  sNombre: string;

  @property({
    type: 'number',
    required: true,
    default: 0,
  })
  iCant: number;

  @property({
    type: 'number',
    required: true,
  })
  iPrecio: number;

  @property({
    type: 'string',
    required: true,
  })
  sDescripcion: string;

  @property({
    type: 'string',
    required: true,
  })
  sUrlImagen: string;

  @property({
    type: 'boolean',
    required: true,
    default: 0,
  })
  bActivo: boolean;


  constructor(data?: Partial<TbArticulo>) {
    super(data);
  }
}

export interface TbArticuloRelations {
  // describe navigational properties here
}

export type TbArticuloWithRelations = TbArticulo & TbArticuloRelations;
