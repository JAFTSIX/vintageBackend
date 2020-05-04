//
import {
  CountSchema,
} from '@loopback/repository';
import {
  getModelSchemaRef,
} from '@loopback/rest';
import { TbReceta } from '../models';

export class TbRecetaResponses {

  create = {
    responses: {
      '200': {
        description: 'TbReceta model instance',
        content: { 'application/json': { schema: getModelSchemaRef(TbReceta, { includeRelations: true }), } },

      },
    },
  }

  count = {
    responses: {
      '200': {
        description: 'TbReceta model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  };


  find = {
    responses: {
      '200': {
        description: 'Array of TbReceta model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbReceta, { includeRelations: true }),
            },
          },
        },
      },
    },
  }

  updateAll = {
    responses: {
      '200': {
        description: 'TbReceta PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  }
  findById = {
    responses: {
      '200': {
        description: 'TbReceta model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbReceta, { includeRelations: true }),
          },
        },
      },
    },
  }
  updateById = {
    responses: {
      '204': {
        description: 'TbReceta PATCH success',
      },
    },
  }
  replaceById = {
    responses: {
      '204': {
        description: 'TbReceta PUT success',
      },
    },
  }
  deleteById = {
    responses: {
      '204': {
        description: 'TbReceta DELETE success',
      },
    },
  }

}


export class TbRecetaRequest {

  create = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbReceta, {
          title: 'NewTbReceta',
          exclude: ['_id'],
        }),
      },
    },
  }
  updateAll = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbReceta, { partial: true }),
      },
    },
  }
  updateById = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbReceta, { partial: true }),
      },
    },
  }

}
