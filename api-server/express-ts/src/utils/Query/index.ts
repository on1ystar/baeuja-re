/**
 * @description 쿼리 문자열 조합을 위한 모듈
 * @version feature/api/PEAC-38-learning-list-api
 */

import { snakeCase } from 'snake-case';

/**
 * @param _columns - 조회할 컬럼 문자열 리스트로 테이블이 1개면 ['column', 'column'] 형식으로 넣고 |
 * 테이블이 2개 이상(JOIN)이면 [ tableName: ['column, column'] }, { tableName: ['column', 'column'] }]
 */
export const getSelectColumns = (_columns: any[]): string => {
  let columnObjs;
  if (typeof _columns[0] === 'string') {
    columnObjs = [{ tableName: '', columns: _columns }];
  } else {
    columnObjs = _columns.map(row => ({
      tableName: `${snakeCase(Object.keys(row)[0])}.`,
      columns: Object.values(row)[0] as Array<string>
    }));
  }
  let SELECT_COLUMNS = '';

  columnObjs.forEach(columnObj => {
    columnObj.columns.forEach(column => {
      SELECT_COLUMNS =
        SELECT_COLUMNS +
        `,${columnObj.tableName}${snakeCase(String(column))} as "${column}"`;
    });
  });
  return SELECT_COLUMNS.slice(1);
};
