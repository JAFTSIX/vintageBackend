//
import {
  CountSchema,
} from '@loopback/repository';
import {
  getModelSchemaRef,
} from '@loopback/rest';
import { TbHistorial } from '../models';

export class TbHistorialResponses {

  create = {
    responses: {
      '200': {
        description: 'TbHistorial model instance',
        content: { 'application/json': { schema: getModelSchemaRef(TbHistorial, { includeRelations: true }), } },

      },
    },
  }

  count = {
    responses: {
      '200': {
        description: 'TbHistorial model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  };


  find = {
    responses: {
      '200': {
        description: 'Array of TbHistorial model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbHistorial, { includeRelations: true }),
            },
          },
        },
      },
    },
  }

  updateAll = {
    responses: {
      '200': {
        description: 'TbHistorial PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  }
  findById = {
    responses: {
      '200': {
        description: 'TbHistorial model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbHistorial, { includeRelations: true }),
          },
        },
      },
    },
  }
  updateById = {
    responses: {
      '204': {
        description: 'TbHistorial PATCH success',
      },
    },
  }
  replaceById = {
    responses: {
      '204': {
        description: 'TbHistorial PUT success',
      },
    },
  }
  deleteById = {
    responses: {
      '204': {
        description: 'TbHistorial DELETE success',
      },
    },
  }

}


export class TbHistorialRequest {

  create = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbHistorial, {
          title: 'NewTbHistorial',
          exclude: ['_id'],
        }),
      },
    },
  }
  updateAll = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbHistorial, { partial: true }),
      },
    },
  }
  updateById = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbHistorial, { partial: true }),
      },
    },
  }

}
