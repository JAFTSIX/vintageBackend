import {Entity, model, property} from '@loopback/repository';

@model()
export class TbReceta extends Entity {
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
    type: 'array',
    itemType: 'string',
    required: true,
  })
  aEtiqueta: string[];

  @property({
    type: 'date',
    required: true,
  })
  dFechaPublicacion: string;

  @property({
    type: 'string',
    required: true,
  })
  sTexto: string;

  @property({
    type: 'number',
    required: true,
  })
  iPrecio: number;

  @property({
    type: 'string',
    required: true,
  })
  sUrlVideo: string;

  @property({
    type: 'string',
    required: true,
  })
  sUrlImagen: string;

  @property({
    type: 'boolean',
    required: true,
    default: true,
  })
  bActivo: boolean;


  constructor(data?: Partial<TbReceta>) {
    super(data);
  }
}

export interface TbRecetaRelations {
  // describe navigational properties here
}

export type TbRecetaWithRelations = TbReceta & TbRecetaRelations;
