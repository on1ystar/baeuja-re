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
from src import evaluation
from src import korean

import subprocess
import os
import json

app = Flask(__name__)

# set path from config file
def setConfig():
	with open('./configs/conf.json') as f:
		config = json.load(f)

	return config['MODEL_DIR'], config['FLASK_DIR'], config['SCRIPT_DIR'], config['TMP_DIR'], config['SCRIPT_DIR'] + "run.sh"

# download wav file
# url: download link
# fileName: saved file name 
def downloadWavFile(url: str) -> str:
	"""
	:download wav file from url
	:param url: download wav file from url
	:return downloaded file name
	"""
	fileName = url.split('/')[-1]

	with open(tmp_path + fileName, "wb") as file:
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
		model_path, flask_path, script_path, tmp_path, runPath = setConfig()
		# request.json['path']
		# request.json['user_id']
		# request.json['origin']
		# make command call to subprocess

#user_voice = downloadWavFile("https://" + request.json['path']))
		user_voice_path = tmp_path + "hello.wav"
		print('runPath is ', runPath)
		command = runPath + ' ' + user_voice_path + " 1" # ID
		print('command is ', command)
		# wave file to text
		worker = subprocess.Popen([command], shell=True)
		
#perfect_pitch = evaluation.getPitch(perfect_voice_path) # normalized pitch
		user_pitch = evaluation.getPitch(user_voice_path)
		perfect_pitch = user_pitch															#### need to modify
		dtw_score = evaluation.getDTWScore(perfect_pitch, user_pitch)

		# wait worker 10 sec, if over 10sec then raise subprocess.TimeoutExpired
		try:
			worker.wait(timeout=10)
			result_stt = korean.getKoreanText(tmp_path + "1.log")
			origin = "안녕하세요"
			print('origin is ', origin)
			print('result is ', result_stt)
			stt_score = korean.levenshtein(origin, result_stt, debug=True) # levenshtein, how get i origin?

		except subprocess.TimeoutExpired:
			return jsonify({
					"success":False,
				})

		# read speech to text output from file

		# calculate score
		result_score = dtw_score + stt_score
		perfect_pitch_dumps = json.dumps(perfect_pitch)
		user_pitch_dumps = json.dumps(user_pitch)
		# return successed, score and stt result
		return jsonify({
				"success":True,
				"data":{
					"translatedSentence": result_stt,
					"score": result_score,
					"perfectVoice":{
						"time": [],
						"hz": perfect_pitch_dumps
					},
					"userVoice":{
						"time": [],
						"hz": user_pitch_dumps
					}
				}
			}
		)
	else:
		print("not post")
		return "<h1>NOT POST</h1>"

if __name__ == "__main__":
	setConfig()
	app.run(host='0.0.0.0', port=8080)
