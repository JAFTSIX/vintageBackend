import {DefaultCrudRepository} from '@loopback/repository';
import {TbDireccion, TbDireccionRelations} from '../models';
import {DbVintageDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TbDireccionRepository extends DefaultCrudRepository<
  TbDireccion,
  typeof TbDireccion.prototype._id,
  TbDireccionRelations
> {
  constructor(
    @inject('datasources.DBVintage') dataSource: DbVintageDataSource,
  ) {
    super(TbDireccion, dataSource);
  }
}
