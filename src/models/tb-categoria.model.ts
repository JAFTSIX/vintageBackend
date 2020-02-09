import {Entity, model, property} from '@loopback/repository';

@model()
export class TbCategoria extends Entity {
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


  constructor(data?: Partial<TbCategoria>) {
    super(data);
  }
}

export interface TbCategoriaRelations {
  // describe navigational properties here
}

export type TbCategoriaWithRelations = TbCategoria & TbCategoriaRelations;
