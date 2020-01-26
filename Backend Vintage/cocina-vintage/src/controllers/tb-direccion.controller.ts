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
import {TbDireccion} from '../models';
import {TbDireccionRepository} from '../repositories';

export class TbDireccionController {
  constructor(
    @repository(TbDireccionRepository)
    public tbDireccionRepository : TbDireccionRepository,
  ) {}

  @post('/Direccion', {
    responses: {
      '200': {
        description: 'TbDireccion model instance',
        content: {'application/json': {schema: getModelSchemaRef(TbDireccion)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbDireccion, {
            title: 'NewTbDireccion',
            exclude: ['_id'],
          }),
        },
      },
    })
    tbDireccion: Omit<TbDireccion, '_id'>,
  ): Promise<TbDireccion> {
    return this.tbDireccionRepository.create(tbDireccion);
  }

  @get('/Direccion/count', {
    responses: {
      '200': {
        description: 'TbDireccion model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TbDireccion)) where?: Where<TbDireccion>,
  ): Promise<Count> {
    return this.tbDireccionRepository.count(where);
  }

  @get('/Direccion', {
    responses: {
      '200': {
        description: 'Array of TbDireccion model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbDireccion, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbDireccion)) filter?: Filter<TbDireccion>,
  ): Promise<TbDireccion[]> {
    return this.tbDireccionRepository.find(filter);
  }

  @patch('/Direccion', {
    responses: {
      '200': {
        description: 'TbDireccion PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbDireccion, {partial: true}),
        },
      },
    })
    tbDireccion: TbDireccion,
    @param.query.object('where', getWhereSchemaFor(TbDireccion)) where?: Where<TbDireccion>,
  ): Promise<Count> {
    return this.tbDireccionRepository.updateAll(tbDireccion, where);
  }

  @get('/Direccion/{id}', {
    responses: {
      '200': {
        description: 'TbDireccion model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbDireccion, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbDireccion)) filter?: Filter<TbDireccion>
  ): Promise<TbDireccion> {
    return this.tbDireccionRepository.findById(id, filter);
  }

  @patch('/Direccion/{id}', {
    responses: {
      '204': {
        description: 'TbDireccion PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbDireccion, {partial: true}),
        },
      },
    })
    tbDireccion: TbDireccion,
  ): Promise<void> {
    await this.tbDireccionRepository.updateById(id, tbDireccion);
  }

  @put('/Direccion/{id}', {
    responses: {
      '204': {
        description: 'TbDireccion PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tbDireccion: TbDireccion,
  ): Promise<void> {
    await this.tbDireccionRepository.replaceById(id, tbDireccion);
  }

  @del('/Direccion/{id}', {
    responses: {
      '204': {
        description: 'TbDireccion DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tbDireccionRepository.deleteById(id);
  }
}
