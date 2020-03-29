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
  HttpErrors,
} from '@loopback/rest';
import { TbReceta } from '../models';
import { TbRecetaRepository } from '../repositories';

export class TbRecetaController {
  constructor(
    @repository(TbRecetaRepository)
    public tbRecetaRepository: TbRecetaRepository,
  ) { }

  @post('/Receta', {
    responses: {
      '200': {
        description: 'TbReceta model instance',
        content: { 'application/json': { schema: getModelSchemaRef(TbReceta) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbReceta, {
            title: 'NewTbReceta',
            exclude: ['_id'],
          }),
        },
      },
    })
    tbReceta: Omit<TbReceta, '_id'>,
  ): Promise<TbReceta> {
    return this.tbRecetaRepository.create(tbReceta);
  }

  @get('/Receta/count', {
    responses: {
      '200': {
        description: 'TbReceta model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TbReceta)) where?: Where<TbReceta>,
  ): Promise<Count> {
    return this.tbRecetaRepository.count(where);
  }

  @get('/Receta', {
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
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbReceta)) filter?: Filter<TbReceta>,
  ): Promise<TbReceta[]> {
    return this.tbRecetaRepository.find(filter);
  }

  @patch('/Receta', {
    responses: {
      '200': {
        description: 'TbReceta PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbReceta, { partial: true }),
        },
      },
    })
    tbReceta: TbReceta,
    @param.query.object('where', getWhereSchemaFor(TbReceta)) where?: Where<TbReceta>,
  ): Promise<Count> {
    return this.tbRecetaRepository.updateAll(tbReceta, where);
  }

  @get('/Receta/{id}', {
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
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbReceta)) filter?: Filter<TbReceta>
  ): Promise<TbReceta> {
    return this.tbRecetaRepository.findById(id, filter);
  }

  @patch('/Receta/{id}', {
    responses: {
      '204': {
        description: 'TbReceta PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbReceta, { partial: true }),
        },
      },
    })
    tbReceta: TbReceta,
  ): Promise<void> {
    await this.tbRecetaRepository.updateById(id, tbReceta);
  }

  @put('/Receta/{id}', {
    responses: {
      '204': {
        description: 'TbReceta PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tbReceta: TbReceta,
  ): Promise<void> {
    await this.tbRecetaRepository.replaceById(id, tbReceta);
  }

  @del('/Receta/{id}', {
    responses: {
      '204': {
        description: 'TbReceta DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tbRecetaRepository.deleteById(id);
  }








}
