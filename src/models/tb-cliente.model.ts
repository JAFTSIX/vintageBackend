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
  })
  aFavoritos?: string[];

  @property({
    type: 'object',
  })
  oDireccion?: object;

  @property({
    type: 'boolean',
    required: true,
    default: 1,
  })
  bActivo: boolean;

  @property({
    type: 'boolean',
    required: true,
    default: 0,
  })
  bAdmin: boolean;

  @property({
    type: 'array',
    itemType: 'string',
  })
  aPermisos?: string[];


  constructor(data?: Partial<TbCliente>) {
    super(data);
  }
}

export interface TbClienteRelations {
  // describe navigational properties here
}

export type TbClienteWithRelations = TbCliente & TbClienteRelations;
