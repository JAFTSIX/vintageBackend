//
import {
  CountSchema,
} from '@loopback/repository';
import {
  getModelSchemaRef,
} from '@loopback/rest';
import { TbCategoria } from '../models';

export class TbCategoriaResponses {

  create = {
    responses: {
      '200': {
        description: 'TbCategoria model instance',
        content: { 'application/json': { schema: getModelSchemaRef(TbCategoria, { includeRelations: true }), } },

      },
    },
  }

  count = {
    responses: {
      '200': {
        description: 'TbCategoria model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  };


  find = {
    responses: {
      '200': {
        description: 'Array of TbCategoria model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbCategoria, { includeRelations: true }),
            },
          },
        },
      },
    },
  }

  updateAll = {
    responses: {
      '200': {
        description: 'TbCategoria PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  }
  findById = {
    responses: {
      '200': {
        description: 'TbCategoria model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbCategoria, { includeRelations: true }),
          },
        },
      },
    },
  }
  updateById = {
    responses: {
      '204': {
        description: 'TbCategoria PATCH success',
      },
    },
  }
  replaceById = {
    responses: {
      '204': {
        description: 'TbCategoria PUT success',
      },
    },
  }
  deleteById = {
    responses: {
      '204': {
        description: 'TbCategoria DELETE success',
      },
    },
  }

}


export class TbCategoriaRequest {

  create = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbCategoria, {
          title: 'NewTbCategoria',
          exclude: ['_id'],
        }),
      },
    },
  }
  updateAll = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbCategoria, { partial: true }),
      },
    },
  }
  updateById = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbCategoria, { partial: true }),
      },
    },
  }

}
