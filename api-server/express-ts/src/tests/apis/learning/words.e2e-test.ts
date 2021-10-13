import TestSetup from '../../e2eTestSetup';

const userId = 1;
const testSetup = new TestSetup();
let token: string;

beforeAll(async () => {
  await testSetup.initializeTestDB();
  token = testSetup.getToken();
});
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe('e2e Testing learning/words app', () => {
  // 학습 단어
  describe('GET /learning/words/:wordId', () => {
    it.todo('should valid response a word and create a learning history');
    it.todo('should increase the user_word_history counts column');
    it.todo('should return 400 if not found wordId in word table');
  });
  // 학습 단어의 예시 문장들
  describe('GET /learning/words/:wordId/sentences', () => {
    it.todo('should valid response example sentences');
    it.todo('should return 400 if not found wordId in word table');
  });
  // 단어 학습 기록
  describe('POST /learning/words/:wordId/userWordHistory', () => {
    it.todo(
      'should increase perfectVoiceCounts if the column query is perfectVoiceCounts'
    );
    it.todo(
      'should increase userVoiceCounts if the column query is userVoiceCounts'
    );
    it.todo('should return 400 if the column query not found');
    it.todo(
      'should return 400 if the column query is not perfectVoiceCounts or userVoiceCounts'
    );
    it.todo('should return 400 if not found wordId in word table');
  });
  // 단어 발화 평가
  describe('POST /learning/words/:wordId/userWordEvaluation', () => {
    it.todo('should valid response the result of word speech evaluation');
    it.todo('should increase the counts of word speech evaluation');
    it.todo('should return 400 if not found wordId in word table');
  });
});
