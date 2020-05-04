//
import {
  CountSchema,
} from '@loopback/repository';
import {
  getModelSchemaRef,
} from '@loopback/rest';
import { TbFactura, Payment } from '../models';

export class TbFacturaResponses {

  create = {
    responses: {
      '200': {
        description: 'TbFactura model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbFactura)
          }
        },
      },
    },
  }

  count = {
    responses: {
      '200': {
        description: 'TbFactura model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  };

  BraintreeTokenGenerator = {
    responses: {
      '200': {
        description: 'TbFactura model instance',
        content: {
          'application/json': {

          },
        },
      },
    },
  };

  find = {
    responses: {
      '200': {
        description: 'Array of TbFactura model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbFactura, { includeRelations: true }),
            },
          },
        },
      },
    },
  };

  updateAll = {
    responses: {
      '200': {
        description: 'TbFactura PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  };
  findById = {
    responses: {
      '200': {
        description: 'TbFactura model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbFactura, { includeRelations: true }),
          },
        },
      },
    },
  };
  updateById = {
    responses: {
      '204': {
        description: 'TbFactura PATCH success',
      },
    },
  };
  replaceById = {
    responses: {
      '204': {
        description: 'TbFactura PUT success',
      },
    },
  };
  deleteById = {
    responses: {
      '204': {
        description: 'TbFactura DELETE success',
      },
    },
  };

}


export class TbFacturaRequest {

  create = {
    content: {
      'application/json': {

        schema: getModelSchemaRef(Payment, {
          title: 'pago',

        }),
      },
    },
  }
  updateAll = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbFactura, { partial: true }),
      },
    },
  }
  updateById = {
    content: {
      'application/json': {
        schema: getModelSchemaRef(TbFactura, { partial: true }),
      },
    },
  }

}
