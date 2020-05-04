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
import { TbHistorial } from '../models';
import { TbHistorialRepository } from '../repositories';
import {
  TbHistorialResponses,
  TbHistorialRequest
} from '../bodies/tb-historial.responses';
const Responses: TbHistorialResponses = new TbHistorialResponses();
const Request: TbHistorialRequest = new TbHistorialRequest();

export class TbHistorialController {
  constructor(
    @repository(TbHistorialRepository)
    public tbHistorialRepository: TbHistorialRepository,
  ) { }

  @post('/Historial', Responses.create)
  async create(
    @requestBody(Request.create)
    tbHistorial: Omit<TbHistorial, '_id'>,
  ): Promise<TbHistorial> {
    return this.tbHistorialRepository.create(tbHistorial);
  }

  @get('/Historial/count', Responses.count)
  async count(
    @param.query.object('where', getWhereSchemaFor(TbHistorial)) where?: Where<TbHistorial>,
  ): Promise<Count> {
    return this.tbHistorialRepository.count(where);
  }

  @get('/Historial', Responses.find)
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbHistorial)) filter?: Filter<TbHistorial>,
  ): Promise<TbHistorial[]> {

    return this.tbHistorialRepository.find(filter);
  }


  @get('/Historial/{id}', Responses.findById)
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbHistorial)) filter?: Filter<TbHistorial>
  ): Promise<TbHistorial> {
    return this.tbHistorialRepository.findById(id, filter);
  }



  @del('/Historial/{id}', Responses.deleteById)
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tbHistorialRepository.deleteById(id);
  }
}
