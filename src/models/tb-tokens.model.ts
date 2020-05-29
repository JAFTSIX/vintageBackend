import { Entity, model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class TbTokens extends Entity {

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
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'number',
    required: true,
  })
  iTipo: number;
  /*0=login
  1=recuperar
  2=activar*/
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TbTokens>) {
    super(data);
  }
}

export interface TbTokensRelations {
  // describe navigational properties here
}

export type TbTokensWithRelations = TbTokens & TbTokensRelations;
