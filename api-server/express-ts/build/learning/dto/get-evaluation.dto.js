"use strict";
// /*
//   발음 평가 요청을 위한 DTO
//   version: PEAC-161 get learning unit with sentences for main learning UI
// */
// /*
// 사용자 음성 경로 s3 (db에 저장되기 전)
// 성우 음성 경로 sentence
// 성우 원본 sentence
// 사용자 아이디
// */
// import { QueryResult } from 'pg';
// import { pool } from '../../db';
// export class GetEvaluationDTO {
//   //   readonly userId: number;
//   //   readonly userVoiceUrl: string;
//   //   readonly sentenceId: number;
//   //   readonly koreanText: string;
//   //   readonly perfectVoiceUri: string;
//   constructor(
//     readonly userId: number,
//     readonly userVoiceUrl: string,
//     readonly sentenceId: number,
//     readonly koreanText: string,
//     readonly perfectVoiceUri: string
//   ) {}
//   static getSentence = async (sentenceId: number) => {
//     try {
//       const queryResult: QueryResult<any> = (
//         await pool.query(
//           'SELECT  korean_text as "koreanText" perfect_voice_uri as "perfectVoiceUri" FROM sentence WHERE sentence_id = $1',
//           [sentenceId]
//         )
//       ).rows[0];
//       if (!queryResult.rowCount) {
//         throw new DatabaseError(
//           'unitIndex or contentsId does not exist',
//           0,
//           'noData'
//         );
//       }
//       const sentences: SentenceType[] = queryResult.rows;
//     } catch (error) {}
//   };
// }
//# sourceMappingURL=get-evaluation.dto.js.map