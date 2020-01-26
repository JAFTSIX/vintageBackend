import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {TbFactura} from '../models';
import {TbFacturaRepository} from '../repositories';

export class TbFacturaController {
  constructor(
    @repository(TbFacturaRepository)
    public tbFacturaRepository : TbFacturaRepository,
  ) {}

  @post('/Factura', {
    responses: {
      '200': {
        description: 'TbFactura model instance',
        content: {'application/json': {schema: getModelSchemaRef(TbFactura)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbFactura, {
            title: 'NewTbFactura',
            exclude: ['_id'],
          }),
        },
      },
    })
    tbFactura: Omit<TbFactura, '_id'>,
  ): Promise<TbFactura> {
    return this.tbFacturaRepository.create(tbFactura);
  }

  @get('/Factura/count', {
    responses: {
      '200': {
        description: 'TbFactura model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TbFactura)) where?: Where<TbFactura>,
  ): Promise<Count> {
    return this.tbFacturaRepository.count(where);
  }

  @get('/Factura', {
    responses: {
      '200': {
        description: 'Array of TbFactura model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbFactura, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbFactura)) filter?: Filter<TbFactura>,
  ): Promise<TbFactura[]> {
    return this.tbFacturaRepository.find(filter);
  }

  @patch('/Factura', {
    responses: {
      '200': {
        description: 'TbFactura PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbFactura, {partial: true}),
        },
      },
    })
    tbFactura: TbFactura,
    @param.query.object('where', getWhereSchemaFor(TbFactura)) where?: Where<TbFactura>,
  ): Promise<Count> {
    return this.tbFacturaRepository.updateAll(tbFactura, where);
  }

  @get('/Factura/{id}', {
    responses: {
      '200': {
        description: 'TbFactura model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbFactura, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbFactura)) filter?: Filter<TbFactura>
  ): Promise<TbFactura> {
    return this.tbFacturaRepository.findById(id, filter);
  }

  @patch('/Factura/{id}', {
    responses: {
      '204': {
        description: 'TbFactura PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbFactura, {partial: true}),
        },
      },
    })
    tbFactura: TbFactura,
  ): Promise<void> {
    await this.tbFacturaRepository.updateById(id, tbFactura);
  }

  @put('/Factura/{id}', {
    responses: {
      '204': {
        description: 'TbFactura PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tbFactura: TbFactura,
  ): Promise<void> {
    await this.tbFacturaRepository.replaceById(id, tbFactura);
  }

  @del('/Factura/{id}', {
    responses: {
      '204': {
        description: 'TbFactura DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tbFacturaRepository.deleteById(id);
  }
}
