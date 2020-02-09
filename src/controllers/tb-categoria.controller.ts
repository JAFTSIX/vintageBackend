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
import {TbCategoria} from '../models';
import {TbCategoriaRepository} from '../repositories';

export class TbCategoriaController {
  constructor(
    @repository(TbCategoriaRepository)
    public tbCategoriaRepository : TbCategoriaRepository,
  ) {}

  @post('/Categoria', {
    responses: {
      '200': {
        description: 'TbCategoria model instance',
        content: {'application/json': {schema: getModelSchemaRef(TbCategoria)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbCategoria, {
            title: 'NewTbCategoria',
            exclude: ['_id'],
          }),
        },
      },
    })
    tbCategoria: Omit<TbCategoria, '_id'>,
  ): Promise<TbCategoria> {
    return this.tbCategoriaRepository.create(tbCategoria);
  }

  @get('/Categoria/count', {
    responses: {
      '200': {
        description: 'TbCategoria model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TbCategoria)) where?: Where<TbCategoria>,
  ): Promise<Count> {
    return this.tbCategoriaRepository.count(where);
  }

  @get('/Categoria', {
    responses: {
      '200': {
        description: 'Array of TbCategoria model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbCategoria, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbCategoria)) filter?: Filter<TbCategoria>,
  ): Promise<TbCategoria[]> {
    return this.tbCategoriaRepository.find(filter);
  }

  @patch('/Categoria', {
    responses: {
      '200': {
        description: 'TbCategoria PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbCategoria, {partial: true}),
        },
      },
    })
    tbCategoria: TbCategoria,
    @param.query.object('where', getWhereSchemaFor(TbCategoria)) where?: Where<TbCategoria>,
  ): Promise<Count> {
    return this.tbCategoriaRepository.updateAll(tbCategoria, where);
  }

  @get('/Categoria/{id}', {
    responses: {
      '200': {
        description: 'TbCategoria model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbCategoria, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbCategoria)) filter?: Filter<TbCategoria>
  ): Promise<TbCategoria> {
    return this.tbCategoriaRepository.findById(id, filter);
  }

  @patch('/Categoria/{id}', {
    responses: {
      '204': {
        description: 'TbCategoria PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbCategoria, {partial: true}),
        },
      },
    })
    tbCategoria: TbCategoria,
  ): Promise<void> {
    await this.tbCategoriaRepository.updateById(id, tbCategoria);
  }

  @put('/Categoria/{id}', {
    responses: {
      '204': {
        description: 'TbCategoria PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tbCategoria: TbCategoria,
  ): Promise<void> {
    await this.tbCategoriaRepository.replaceById(id, tbCategoria);
  }

  @del('/Categoria/{id}', {
    responses: {
      '204': {
        description: 'TbCategoria DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tbCategoriaRepository.deleteById(id);
  }
}
