# -*- coding: utf-8 -*-
# Author: Park Yeong Jun
# Email: qkrdudwns98@naver.com
# Description: baeuja ai server
# Modified: 2021.09.01
# Version: 0.3

from flask import Flask
from flask import request
from flask import jsonify

from requests import get
from src import evaluation
from src import korean

import subprocess
import os
import json
import datetime

app = Flask(__name__)

def setConfig():
	"""
	:set path from config file
	"""
	# read config file
	with open('./configs/conf.json') as f:
		config = json.load(f)

	return config['MODEL_DIR'], config['FLASK_DIR'], config['SCRIPT_DIR'], config['TMP_DIR'], config['SCRIPT_DIR'] + "run.sh"

def downloadWavFile(url: str, tmp_path: str) -> str:
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

@app.route('/evaluation', methods = ['GET', 'POST'])
def evaluationUserSpeech():
	"""
	:from wav file extract korean and evaluation
	:with stt, dtw
	:return: evaluatuon score, speech to text result, pitch(f0)
	"""
	if request.method == 'POST':
		# set path
		model_path, flask_path, script_path, tmp_path, runPath = setConfig()

		# read request json
		user_id = str(request.json['userId'])
		user_voice_uri = request.json['userVoiceUri']
		perfect_voice_uri = request.json['sentence']['perfectVoiceUri']
		sentence_id = str(request.json['sentence']['sentenceId'])
		korean_text = request.json['sentence']['koreanText']
		
		# download user_voice and perfect_voice
		user_voice = downloadWavFile(user_voice_uri, tmp_path)
		user_voice_path = tmp_path + user_voice
		perfect_voice = downloadWavFile(perfect_voice_uri, tmp_path)
		perfect_voice_path = tmp_path + perfect_voice

		# write shell command
		command = runPath + ' ' + user_voice_path + ' ' + user_id

		# wave file to text
		worker = subprocess.Popen([command], shell=True)

		# get pitch and calculate dtw score
		perfect_pitch, perfect_times, perfect_duration = evaluation.getPitch(perfect_voice_path) # normalized pitch
		user_pitch, user_times, _ = evaluation.getPitch(user_voice_path)
		dtw_score = evaluation.getDTWScore(perfect_pitch, user_pitch, perfect_duration)
		
		# speech to text and get stt score
		try:
			worker.wait(timeout=10)
			result_stt = korean.getKoreanText(tmp_path + user_id + ".log")
			stt_score = korean.levenshtein(korean_text, result_stt) # levenshtein, how get i origin?

		except subprocess.TimeoutExpired:
			return jsonify({
					"success":False,
				})

		# calculate real score
		result_score = dtw_score + stt_score

		# make json dumps to return 
		perfect_pitch_dumps = json.dumps(perfect_pitch)
		perfect_times_dumps = json.dumps(perfect_times)
		user_pitch_dumps = json.dumps(user_pitch)
		user_times_dumps = json.dumps(user_times)

		return jsonify({
				"success":True,
				"evaluatedSentence":{
					"score": result_score,
					"sttResult": result_stt
					},
				"pitchData":{
					"perfectVoice":{
						"time": perfect_times_dumps,
						"hz": perfect_pitch_dumps
						},
					"userVoice":{
						"time": user_times_dumps,
						"hz": user_pitch_dumps
						}
					}
				})
	else:
		print("not post")
		return "<h1>NOT POST</h1>"

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=8080)
