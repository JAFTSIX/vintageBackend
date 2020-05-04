import {
  Count,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import { TbReceta } from '../models';
import { TbRecetaRepository } from '../repositories';
import {
  TbRecetaResponses,
  TbRecetaRequest
} from '../bodies/tb-receta.responses';
const Responses: TbRecetaResponses = new TbRecetaResponses();
const Request: TbRecetaRequest = new TbRecetaRequest();
export class TbRecetaController {
  constructor(
    @repository(TbRecetaRepository)
    public tbRecetaRepository: TbRecetaRepository,
  ) { }

  @post('/Receta', Responses.create)
  async create(
    @requestBody(Request.create)
    tbReceta: Omit<TbReceta, '_id'>,
  ): Promise<TbReceta> {
    return this.tbRecetaRepository.create(tbReceta);
  }

  @get('/Receta/count', Responses.count)
  async count(
    @param.query.object('where', getWhereSchemaFor(TbReceta)) where?: Where<TbReceta>,
  ): Promise<Count> {
    return this.tbRecetaRepository.count(where);
  }

  @get('/Receta', Responses.find)
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbReceta)) filter?: Filter<TbReceta>,
  ): Promise<TbReceta[]> {
    return this.tbRecetaRepository.find(filter);
  }

  @patch('/Receta', Responses.updateAll)
  async updateAll(
    @requestBody(Request.updateAll)
    tbReceta: TbReceta,
    @param.query.object('where', getWhereSchemaFor(TbReceta)) where?: Where<TbReceta>,
  ): Promise<Count> {
    return this.tbRecetaRepository.updateAll(tbReceta, where);
  }

  @get('/Receta/{id}', Responses.findById)
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbReceta)) filter?: Filter<TbReceta>
  ): Promise<TbReceta> {
    return this.tbRecetaRepository.findById(id, filter);
  }

  @patch('/Receta/{id}', Responses.updateById)
  async updateById(
    @param.path.string('id') id: string,
    @requestBody(Request.updateById)
    tbReceta: TbReceta,
  ): Promise<void> {
    await this.tbRecetaRepository.updateById(id, tbReceta);
  }

  @put('/Receta/{id}', Responses.replaceById)
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tbReceta: TbReceta,
  ): Promise<void> {
    await this.tbRecetaRepository.replaceById(id, tbReceta);
  }

  @del('/Receta/{id}', Responses.deleteById)
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tbRecetaRepository.deleteById(id);
  }
}
