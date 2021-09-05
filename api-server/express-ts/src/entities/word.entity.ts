export class Word {
  constructor(
    readonly wordId: number,
    readonly sentenceId: number,
    readonly prevKoreanText: string,
    readonly prevTranslatedText: string,
    readonly originalKoreanText: string,
    readonly originalTranslatedText: string,
    readonly perfectVoiceUri: string,
    readonly importance: string,
    readonly createdAt?: string,
    readonly modifiedAt?: string
  ) {}

  // // 문장에 포함된 단어 리스트
  // // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // static left = async (
  //   unitIndex: number,
  //   contentId: number,
  //   ..._columns: string[]
  // ) => {
  //   try {
  //     // SELECT할 컬럼이 최소 1개 이상 있어야 함
  //     if (_columns.length === 0)
  //       throw new Error('At least 1 column in _column is required');

  //     // SELECT 쿼리에 들어갈 컬럼 문자열 조합
  //     const SELECT_COLUMNS = getSelectColumns(_columns);

  //     const queryResult = await pool.query(
  //       `SELECT ${SELECT_COLUMNS} FROM sentence WHERE unit_index = $1 AND content_id = $2`,
  //       [unitIndex, contentId]
  //     );
  //     if (!queryResult.rowCount)
  //       throw new Error('unitIndex or contentId does not exist');

  //     return queryResult.rows;
  //   } catch (error) {
  //     console.log('Error: sentence.entity.ts findByUnit function ');
  //     throw error;
  //   }
  // };
}
