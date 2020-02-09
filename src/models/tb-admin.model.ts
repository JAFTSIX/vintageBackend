import {Entity, model, property} from '@loopback/repository';

@model()
export class TbAdmin extends Entity {
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
  sCorreo: string;

  @property({
    type: 'string',
    required: true,
  })
  sContrasena: string;


  constructor(data?: Partial<TbAdmin>) {
    super(data);
  }
}

export interface TbAdminRelations {
  // describe navigational properties here
}

export type TbAdminWithRelations = TbAdmin & TbAdminRelations;
