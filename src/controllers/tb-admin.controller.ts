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
import {TbAdmin} from '../models';
import {TbAdminRepository} from '../repositories';

export class TbAdminController {
  constructor(
    @repository(TbAdminRepository)
    public tbAdminRepository : TbAdminRepository,
  ) {}

  @post('/Admin', {
    responses: {
      '200': {
        description: 'TbAdmin model instance',
        content: {'application/json': {schema: getModelSchemaRef(TbAdmin)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbAdmin, {
            title: 'NewTbAdmin',
            exclude: ['_id'],
          }),
        },
      },
    })
    tbAdmin: Omit<TbAdmin, '_id'>,
  ): Promise<TbAdmin> {
    return this.tbAdminRepository.create(tbAdmin);
  }

  @get('/Admin/count', {
    responses: {
      '200': {
        description: 'TbAdmin model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TbAdmin)) where?: Where<TbAdmin>,
  ): Promise<Count> {
    return this.tbAdminRepository.count(where);
  }

  @get('/Admin', {
    responses: {
      '200': {
        description: 'Array of TbAdmin model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbAdmin, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbAdmin)) filter?: Filter<TbAdmin>,
  ): Promise<TbAdmin[]> {
    return this.tbAdminRepository.find(filter);
  }

  @patch('/Admin', {
    responses: {
      '200': {
        description: 'TbAdmin PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbAdmin, {partial: true}),
        },
      },
    })
    tbAdmin: TbAdmin,
    @param.query.object('where', getWhereSchemaFor(TbAdmin)) where?: Where<TbAdmin>,
  ): Promise<Count> {
    return this.tbAdminRepository.updateAll(tbAdmin, where);
  }

  @get('/Admin/{id}', {
    responses: {
      '200': {
        description: 'TbAdmin model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbAdmin, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbAdmin)) filter?: Filter<TbAdmin>
  ): Promise<TbAdmin> {
    return this.tbAdminRepository.findById(id, filter);
  }

  @patch('/Admin/{id}', {
    responses: {
      '204': {
        description: 'TbAdmin PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbAdmin, {partial: true}),
        },
      },
    })
    tbAdmin: TbAdmin,
  ): Promise<void> {
    await this.tbAdminRepository.updateById(id, tbAdmin);
  }

  @put('/Admin/{id}', {
    responses: {
      '204': {
        description: 'TbAdmin PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tbAdmin: TbAdmin,
  ): Promise<void> {
    await this.tbAdminRepository.replaceById(id, tbAdmin);
  }

  @del('/Admin/{id}', {
    responses: {
      '204': {
        description: 'TbAdmin DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tbAdminRepository.deleteById(id);
  }
}
