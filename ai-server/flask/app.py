# -*- coding: utf-8 -*-
# author: Park Yeong Jun
# email: qkrdudwns98@naver.com
# description: get only korean text line from log
# modified: 2021.08.14
# version: 0.2

from flask import Flask
from flask import request
from flask import jsonify

from requests import get

import subprocess
import os
import json

app = Flask(__name__)
runPath = ""
outputFileName = ""
currentPath = ""

# set path
def setConfig():
	with open('./configs/conf.json') as f:
		config = json.load(f)
	runPath = config['MODEL_DIR'] + "run.sh"
	outputFileName = config['outputFileName']
	currentPath = config['currentPath']

# download wav file
def downloadWavFile(url, fileName = None):
	if not fileName:
		fileName = url.split('/')[-1] # url에서 파일의 이름만을 추출

	with open(fileName, "wb") as file:
		response = get(url) # url로부터 파일 다운로드
		file.write(response.content) # 로컬에 저장
	
	return fileName

# read stt output from file
def getSTTResult(fileName):
	resultFile = open(fileName, 'r')
	result = resultFile.read()
	resultFile.close()
	return result

# calculate score 
### need original text
def calculateScore():
	ret = 100
	return ret

# return korean text created from wavefile
@app.route('/evaluation', methods = ['GET', 'POST'])
def evaluationUserSpeech():
	if request.method == 'POST':

		# get wav file
		downloadedFileName = downloadWavFile("https://" + request.json['path']))

		# make command call to subprocess
		command = runPath + ' ' + currentPath + downloadedFileName

		# wave file to text
		worker = subprocess.Popen([command], shell=True)
		
		# wait worker 10sec, if over 10sec then raise subprocess.TimeoutExpired
		try:
			worker.wait(timeout=10)

		except subprocess.TimeoutExpired:
			return jsonify({
					"success":False,
					"data":{
						"translatedSentence": "",
						"score": 0
					}
				})

		# read speech to text output from file
		sttResult = getSttResult(outputFileName)

		# calculate score
		sttScore = calculateScore()

		return jsonify({ # 점수 및 STT 결과 리턴
				"success":True,
				"data":{
					"translatedSentence": sttResult,
					"score": sttScore
				}
			}
		)

	else:
		print("not post")
		return "<h1>NOT POST</h1>"

if __name__ == "__main__":
	setConfig()
	app.run(host='0.0.0.0', port=8080)
