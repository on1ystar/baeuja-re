export default class Qna {
  constructor(
    readonly qnaId?: number,
    readonly userId?: number, // 질문자
    readonly qnaTypeId?: number, // 사용법, 서비스 개선사항, 오류/신고, 기타
    readonly title?: string,
    readonly content?: string,
    readonly answer?: string,
    readonly createdAt?: string,
    readonly answeredAt?: string
  ) {}
}
