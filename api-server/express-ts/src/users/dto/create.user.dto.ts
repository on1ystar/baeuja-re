/*
  /dev/user, create user DTO, 사용자가 Request.body로 전송할 데이터
*/
export interface CreateUserDTO {
  email: string;
  nickname: string;
  country: string;
  deviceOs: string;
}
