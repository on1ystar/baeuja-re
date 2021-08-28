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

# set path from config file
def setConfig():
	with open('./configs/conf.json') as f:
		config = json.load(f)
	runPath = config['MODEL_DIR'] + "run.sh"
	outputFileName = config['outputFileName']
	currentPath = config['currentPath']

# download wav file
# url: download link
# fileName: saved file name 
def downloadWavFile(url, fileName = None):
	if not fileName:
		# extract file name from url
		fileName = url.split('/')[-1]

	with open(fileName, "wb") as file:
		# download from url
		response = get(url)
		# save to local
		file.write(response.content) 
	
	return fileName

# read stt output from file
# filename: decode log file
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
		print("POST!!")
		# get wav file
		downloadedFileName = 
#downloadedFileName = downloadWavFile("https://" + request.json['path']))

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

		# return successed, score and stt result
		return jsonify({
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
