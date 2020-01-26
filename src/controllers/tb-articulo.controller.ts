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
import {TbArticulo} from '../models';
import {TbArticuloRepository} from '../repositories';

export class TbArticuloController {
  constructor(
    @repository(TbArticuloRepository)
    public tbArticuloRepository : TbArticuloRepository,
  ) {}

  @post('/Articulo', {
    responses: {
      '200': {
        description: 'TbArticulo model instance',
        content: {'application/json': {schema: getModelSchemaRef(TbArticulo)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbArticulo, {
            title: 'NewTbArticulo',
            exclude: ['_id'],
          }),
        },
      },
    })
    tbArticulo: Omit<TbArticulo, '_id'>,
  ): Promise<TbArticulo> {
    return this.tbArticuloRepository.create(tbArticulo);
  }

  @get('/Articulo/count', {
    responses: {
      '200': {
        description: 'TbArticulo model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TbArticulo)) where?: Where<TbArticulo>,
  ): Promise<Count> {
    return this.tbArticuloRepository.count(where);
  }

  @get('/Articulo', {
    responses: {
      '200': {
        description: 'Array of TbArticulo model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbArticulo, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbArticulo)) filter?: Filter<TbArticulo>,
  ): Promise<TbArticulo[]> {
    return this.tbArticuloRepository.find(filter);
  }

  @patch('/Articulo', {
    responses: {
      '200': {
        description: 'TbArticulo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbArticulo, {partial: true}),
        },
      },
    })
    tbArticulo: TbArticulo,
    @param.query.object('where', getWhereSchemaFor(TbArticulo)) where?: Where<TbArticulo>,
  ): Promise<Count> {
    return this.tbArticuloRepository.updateAll(tbArticulo, where);
  }

  @get('/Articulo/{id}', {
    responses: {
      '200': {
        description: 'TbArticulo model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbArticulo, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbArticulo)) filter?: Filter<TbArticulo>
  ): Promise<TbArticulo> {
    return this.tbArticuloRepository.findById(id, filter);
  }

  @patch('/Articulo/{id}', {
    responses: {
      '204': {
        description: 'TbArticulo PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbArticulo, {partial: true}),
        },
      },
    })
    tbArticulo: TbArticulo,
  ): Promise<void> {
    await this.tbArticuloRepository.updateById(id, tbArticulo);
  }

  @put('/Articulo/{id}', {
    responses: {
      '204': {
        description: 'TbArticulo PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tbArticulo: TbArticulo,
  ): Promise<void> {
    await this.tbArticuloRepository.replaceById(id, tbArticulo);
  }

  @del('/Articulo/{id}', {
    responses: {
      '204': {
        description: 'TbArticulo DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tbArticuloRepository.deleteById(id);
  }
}
