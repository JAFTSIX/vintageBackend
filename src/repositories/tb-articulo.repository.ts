import { DefaultCrudRepository } from '@loopback/repository';
import { TbArticulo, TbArticuloRelations } from '../models';
import { DbVintageDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class TbArticuloRepository extends DefaultCrudRepository<
  TbArticulo,
  typeof TbArticulo.prototype._id,
  TbArticuloRelations
  > {
  constructor(
    @inject('datasources.DBVintage') dataSource: DbVintageDataSource,
  ) {
    super(TbArticulo, dataSource);
  }
}
