export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const testMatch = ['**/tests/*.test.(ts|tsx)']; //js 파일은 dist에서도 감지가 될 수 있으니 폴더를 조정해서 test이 있는 위치로 잡아준다.
