from dataclasses import dataclass

@dataclass
class VoiceInfo:
	id: str
	uri: str
	text: str = None
	path: str = None
	pitch: list = None
	time: list = None
	duration: str = None

@dataclass
class Command:
	convert: str
	decode: str


if __name__== "__main__":
	user = User(id=1, uri="/home/arong/1.flac", text="안녕하세요")
	print('user id is ', user.id)
	print('user uri is ', user.uri)
	print('user text is ', user.text)
	test = list()
	for i in range(0, 100):
		test.append(i)
	user.pitch = test

	print(user.pitch)
