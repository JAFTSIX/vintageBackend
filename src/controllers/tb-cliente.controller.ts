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
import {TbCliente} from '../models';
import {TbClienteRepository} from '../repositories';

export class TbClienteController {
  constructor(
    @repository(TbClienteRepository)
    public tbClienteRepository : TbClienteRepository,
  ) {}

  @post('/Cliente', {
    responses: {
      '200': {
        description: 'TbCliente model instance',
        content: {'application/json': {schema: getModelSchemaRef(TbCliente)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbCliente, {
            title: 'NewTbCliente',
            exclude: ['_id'],
          }),
        },
      },
    })
    tbCliente: Omit<TbCliente, '_id'>,
  ): Promise<TbCliente> {
    return this.tbClienteRepository.create(tbCliente);
  }

  @get('/Cliente/count', {
    responses: {
      '200': {
        description: 'TbCliente model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TbCliente)) where?: Where<TbCliente>,
  ): Promise<Count> {
    return this.tbClienteRepository.count(where);
  }

  @get('/Cliente', {
    responses: {
      '200': {
        description: 'Array of TbCliente model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbCliente, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbCliente)) filter?: Filter<TbCliente>,
  ): Promise<TbCliente[]> {
    return this.tbClienteRepository.find(filter);
  }

  @patch('/Cliente', {
    responses: {
      '200': {
        description: 'TbCliente PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbCliente, {partial: true}),
        },
      },
    })
    tbCliente: TbCliente,
    @param.query.object('where', getWhereSchemaFor(TbCliente)) where?: Where<TbCliente>,
  ): Promise<Count> {
    return this.tbClienteRepository.updateAll(tbCliente, where);
  }

  @get('/Cliente/{id}', {
    responses: {
      '200': {
        description: 'TbCliente model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbCliente, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbCliente)) filter?: Filter<TbCliente>
  ): Promise<TbCliente> {
    return this.tbClienteRepository.findById(id, filter);
  }

  @patch('/Cliente/{id}', {
    responses: {
      '204': {
        description: 'TbCliente PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbCliente, {partial: true}),
        },
      },
    })
    tbCliente: TbCliente,
  ): Promise<void> {
    await this.tbClienteRepository.updateById(id, tbCliente);
  }

  @put('/Cliente/{id}', {
    responses: {
      '204': {
        description: 'TbCliente PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tbCliente: TbCliente,
  ): Promise<void> {
    await this.tbClienteRepository.replaceById(id, tbCliente);
  }

  @del('/Cliente/{id}', {
    responses: {
      '204': {
        description: 'TbCliente DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tbClienteRepository.deleteById(id);
  }
}
