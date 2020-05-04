//
import {
  CountSchema,
} from '@loopback/repository';
import {
  getModelSchemaRef,
} from '@loopback/rest';
import { TbCliente } from '../models';

export class TbClienteResponses {

  create = {
    responses: {
      '200': {
        description: 'TbCliente model instance',
        content: { 'application/json': { schema: getModelSchemaRef(TbCliente) } },
      },
    },
  };
  count = {
    responses: {
      '200': {
        description: 'TbCliente model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  };


  find = {
    responses: {
      '200': {
        description: 'Array of TbCliente model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbCliente, { includeRelations: true }),
            },
          },
        },
      },
    },
  }

  updateAll = {
    responses: {
      '200': {
        description: 'TbCliente PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  }
  findById = {
    responses: {
      '200': {
        description: 'TbCliente model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbCliente, { includeRelations: true }),
          },
        },
      },
    },
  }
  updateById = {
    responses: {
      '204': {
        description: 'TbCliente PATCH success',
      },
    },
  }
  replaceById = {
    responses: {
      '204': {
        description: 'TbCliente PUT success',
      },
    },
  }
  deleteById = {
    responses: {
      '204': {
        description: 'TbCliente DELETE success',
      },
    },
  }


  login = {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
                TbCliente: getModelSchemaRef(TbCliente, { includeRelations: true }),
              },
            },
          },
        },
      },
    },
  }

}


export class TbClienteRequest {

  create = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbCliente, {
          title: 'NewTbCliente',
          exclude: ['_id'],
        }),
      },
    },
  }
  updateAll = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbCliente, { partial: true }),
      },
    },
  }
  updateById = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbCliente, { partial: true }),
      },
    },
  }

}
