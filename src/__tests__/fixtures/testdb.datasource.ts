import {PgDataSource} from '../../datasources';

export const testdb: PgDataSource = new PgDataSource({
  name: 'pg',
  dataSourceName: 'pg',
  connector: 'memory',
});