import {DefaultCrudRepository} from '@loopback/repository';
import {TbFactura, TbFacturaRelations} from '../models';
import {DbVintageDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TbFacturaRepository extends DefaultCrudRepository<
  TbFactura,
  typeof TbFactura.prototype._id,
  TbFacturaRelations
> {
  constructor(
    @inject('datasources.DBVintage') dataSource: DbVintageDataSource,
  ) {
    super(TbFactura, dataSource);
  }
}
