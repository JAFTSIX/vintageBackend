import {DefaultCrudRepository} from '@loopback/repository';
import {TbTokens, TbTokensRelations} from '../models';
import {DbVintageDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TbTokensRepository extends DefaultCrudRepository<
  TbTokens,
  typeof TbTokens.prototype._id,
  TbTokensRelations
> {
  constructor(
    @inject('datasources.DBVintage') dataSource: DbVintageDataSource,
  ) {
    super(TbTokens, dataSource);
  }
}
