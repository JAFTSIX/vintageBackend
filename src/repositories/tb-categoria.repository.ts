import { DefaultCrudRepository } from '@loopback/repository';
import { TbCategoria, TbCategoriaRelations } from '../models';
import { DbVintageDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class TbCategoriaRepository extends DefaultCrudRepository<
  TbCategoria,
  typeof TbCategoria.prototype.sNombre,
  TbCategoriaRelations
  > {
  constructor(
    @inject('datasources.DBVintage') dataSource: DbVintageDataSource,
  ) {
    super(TbCategoria, dataSource);
  }
}
