let sentence = '한 잔과 백두산이 마르고 닳도록';
const words = ['동해', '두산', '한 잔'];
const result = [];

words.forEach((word) => {
  result.push(sentence.split(word)[0]); // result = ['', <Text>동해</Text>, '물과 ']
  result.push(`<text>${word}</text>`); // result = ['', <Text>동해</Text>, '물과 ', <Text>백두산</Text>]
  sentence = sentence.split(word)[1]; // sentence = '이 마르고 닳도록'
});
result.push(sentence);

const resultSentence = result.join('');

console.log(resultSentence);
