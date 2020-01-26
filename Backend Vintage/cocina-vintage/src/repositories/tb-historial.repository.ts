import {DefaultCrudRepository} from '@loopback/repository';
import {TbHistorial, TbHistorialRelations} from '../models';
import {DbVintageDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TbHistorialRepository extends DefaultCrudRepository<
  TbHistorial,
  typeof TbHistorial.prototype._id,
  TbHistorialRelations
> {
  constructor(
    @inject('datasources.DBVintage') dataSource: DbVintageDataSource,
  ) {
    super(TbHistorial, dataSource);
  }
}
