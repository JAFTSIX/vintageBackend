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
import {TbHistorial} from '../models';
import {TbHistorialRepository} from '../repositories';

export class TbHistorialController {
  constructor(
    @repository(TbHistorialRepository)
    public tbHistorialRepository : TbHistorialRepository,
  ) {}

  @post('/Historial', {
    responses: {
      '200': {
        description: 'TbHistorial model instance',
        content: {'application/json': {schema: getModelSchemaRef(TbHistorial)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbHistorial, {
            title: 'NewTbHistorial',
            exclude: ['_id'],
          }),
        },
      },
    })
    tbHistorial: Omit<TbHistorial, '_id'>,
  ): Promise<TbHistorial> {
    return this.tbHistorialRepository.create(tbHistorial);
  }

  @get('/Historial/count', {
    responses: {
      '200': {
        description: 'TbHistorial model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TbHistorial)) where?: Where<TbHistorial>,
  ): Promise<Count> {
    return this.tbHistorialRepository.count(where);
  }

  @get('/Historial', {
    responses: {
      '200': {
        description: 'Array of TbHistorial model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbHistorial, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbHistorial)) filter?: Filter<TbHistorial>,
  ): Promise<TbHistorial[]> {
    return this.tbHistorialRepository.find(filter);
  }

  @patch('/Historial', {
    responses: {
      '200': {
        description: 'TbHistorial PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbHistorial, {partial: true}),
        },
      },
    })
    tbHistorial: TbHistorial,
    @param.query.object('where', getWhereSchemaFor(TbHistorial)) where?: Where<TbHistorial>,
  ): Promise<Count> {
    return this.tbHistorialRepository.updateAll(tbHistorial, where);
  }

  @get('/Historial/{id}', {
    responses: {
      '200': {
        description: 'TbHistorial model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbHistorial, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbHistorial)) filter?: Filter<TbHistorial>
  ): Promise<TbHistorial> {
    return this.tbHistorialRepository.findById(id, filter);
  }

  @patch('/Historial/{id}', {
    responses: {
      '204': {
        description: 'TbHistorial PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbHistorial, {partial: true}),
        },
      },
    })
    tbHistorial: TbHistorial,
  ): Promise<void> {
    await this.tbHistorialRepository.updateById(id, tbHistorial);
  }

  @put('/Historial/{id}', {
    responses: {
      '204': {
        description: 'TbHistorial PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tbHistorial: TbHistorial,
  ): Promise<void> {
    await this.tbHistorialRepository.replaceById(id, tbHistorial);
  }

  @del('/Historial/{id}', {
    responses: {
      '204': {
        description: 'TbHistorial DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tbHistorialRepository.deleteById(id);
  }
}
