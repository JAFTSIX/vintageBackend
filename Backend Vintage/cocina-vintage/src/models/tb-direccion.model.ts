import {Entity, model, property} from '@loopback/repository';

@model()
export class TbDireccion extends Entity {
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
  sCiudad: string;

  @property({
    type: 'string',
    required: true,
  })
  sDireccion1: string;

  @property({
    type: 'string',
    required: true,
  })
  sDireccion2: string;

  @property({
    type: 'number',
    required: true,
  })
  iCodPostal: number;

  @property({
    type: 'string',
    required: true,
  })
  sTelefono: string;

  @property({
    type: 'string',
    required: true,
  })
  sNombre: string;

  @property({
    type: 'string',
    required: true,
  })
  sApellido: string;


  constructor(data?: Partial<TbDireccion>) {
    super(data);
  }
}

export interface TbDireccionRelations {
  // describe navigational properties here
}

export type TbDireccionWithRelations = TbDireccion & TbDireccionRelations;
