import {DefaultCrudRepository} from '@loopback/repository';
import {TbReceta, TbRecetaRelations} from '../models';
import {DbVintageDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TbRecetaRepository extends DefaultCrudRepository<
  TbReceta,
  typeof TbReceta.prototype._id,
  TbRecetaRelations
> {
  constructor(
    @inject('datasources.DBVintage') dataSource: DbVintageDataSource,
  ) {
    super(TbReceta, dataSource);
  }
}
