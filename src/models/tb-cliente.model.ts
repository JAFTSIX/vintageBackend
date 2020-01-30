import {Entity, model, property} from '@loopback/repository';

@model()
export class TbCliente extends Entity {
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
    type: 'string',
    required: true,
  })
  sApellido: string;

  @property({
    type: 'string',
    required: true,
  })
  sContrasena: string;

  @property({
    type: 'string',
    required: true,
  })
  sCorreo: string;

  @property({
    type: 'date',
    required: true,
  })
  dNacimiento: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  aRecetas?: string[];

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  aFavoritos: string[];

  @property({
    type: 'string',
    required: true,
  })
  sPermisos: string;

  @property({
    type: 'string',
  })
  sDireccion?: string;


  constructor(data?: Partial<TbCliente>) {
    super(data);
  }
}

export interface TbClienteRelations {
  // describe navigational properties here
}

export type TbClienteWithRelations = TbCliente & TbClienteRelations;
