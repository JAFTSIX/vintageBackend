import {DefaultCrudRepository} from '@loopback/repository';
import {TbCliente, TbClienteRelations} from '../models';
import {DbVintageDataSource} from '../datasources';
import {inject} from '@loopback/core';

export type Credentials = {
  email: string;
  password: string;
};

export class TbClienteRepository extends DefaultCrudRepository<
  TbCliente,
  typeof TbCliente.prototype._id,
  TbClienteRelations
> {
  constructor(
    @inject('datasources.DBVintage') dataSource: DbVintageDataSource,
  ) {
    super(TbCliente, dataSource);
  }
}
