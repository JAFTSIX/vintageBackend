import {DefaultCrudRepository} from '@loopback/repository';
import {TbAdmin, TbAdminRelations} from '../models';
import {DbVintageDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TbAdminRepository extends DefaultCrudRepository<
  TbAdmin,
  typeof TbAdmin.prototype._id,
  TbAdminRelations
> {
  constructor(
    @inject('datasources.DBVintage') dataSource: DbVintageDataSource,
  ) {
    super(TbAdmin, dataSource);
  }
}
