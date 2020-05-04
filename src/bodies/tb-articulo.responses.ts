//
import {
  CountSchema,
} from '@loopback/repository';
import {
  getModelSchemaRef,
} from '@loopback/rest';
import { TbArticulo } from '../models';

export class TbArticuloResponses {

  create = {
    responses: {
      '200': {
        description: 'TbArticulo model instance',
        content: { 'application/json': { schema: getModelSchemaRef(TbArticulo, { includeRelations: true }), } },

      },
    },
  }

  count = {
    responses: {
      '200': {
        description: 'TbArticulo model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  };


  find = {
    responses: {
      '200': {
        description: 'Array of TbArticulo model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbArticulo, { includeRelations: true }),
            },
          },
        },
      },
    },
  }

  updateAll = {
    responses: {
      '200': {
        description: 'TbArticulo PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  }
  findById = {
    responses: {
      '200': {
        description: 'TbArticulo model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbArticulo, { includeRelations: true }),
          },
        },
      },
    },
  }
  updateById = {
    responses: {
      '204': {
        description: 'TbArticulo PATCH success',
      },
    },
  }
  replaceById = {
    responses: {
      '204': {
        description: 'TbArticulo PUT success',
      },
    },
  }
  deleteById = {
    responses: {
      '204': {
        description: 'TbArticulo DELETE success',
      },
    },
  }

}


export class TbArticuloRequest {

  create = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbArticulo, {
          title: 'NewTbArticulo',
          exclude: ['_id'],
        }),
      },
    },
  }
  updateAll = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbArticulo, { partial: true }),
      },
    },
  }
  updateById = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbArticulo, { partial: true }),
      },
    },
  }

}
