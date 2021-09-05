/**
 * @description 쿼리 문자열 조합을 위한 모듈
 * @version feature/api/PEAC-38-learning-list-api
 */

import { snakeCase } from 'snake-case';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getSelectColumns = (_columns: string[]) => {
  // JOIN시 \.을 기준으로 테이블 명과 컬럼 명을 분리
  const columns = _columns.map(column => {
    const temp = column.split('.');
    if (temp.length == 2) {
      return {
        tableName: `${snakeCase(temp[0])}.`,
        columnName: temp[1]
      };
    } else {
      return { tableName: '', columnName: temp[0] };
    }
  });
  let SELECT_COLUMNS = `${columns[0].tableName}${snakeCase(
    columns[0].columnName
  )} as "${columns[0].columnName}"`;
  columns.slice(1).forEach(column => {
    SELECT_COLUMNS =
      SELECT_COLUMNS +
      `, ${column.tableName}${snakeCase(column.columnName)} as "${
        column.columnName
      }"`;
  });
  return SELECT_COLUMNS;
};
