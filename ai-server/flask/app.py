# -*- coding: utf-8 -*-
# Author: Park Yeong Jun
# Email: qkrdudwns98@naver.com
# Description: baeuja ai server
# Modified: 2021.10.03
# Version: 0.4

from flask import Flask
from flask import request
from flask import jsonify
from requests import get

from src import evaluation
from src import korean
from src import utils
from src import path

import subprocess
import os
import json
import datetime

app = Flask(__name__)

@app.route('/evaluation', methods = ['GET', 'POST'])
def evaluationUserSpeech():
	"""
	:from wav file extract korean and evaluation with stt, pitch
	:return: evaluatuon score, speech to text result, pitch(f0)
	"""
	if request.method == 'POST':

		perfect_dir = path.getPerfectSentenceDir()
		user_dir = path.getUserSentenceDir()

		# read request json
		user_id = str(request.json['userId'])
		user_voice_uri = request.json['userVoiceUri']
		perfect_voice_uri = request.json['sentence']['perfectVoiceUri']
		perfect_id = utils.getFileName(perfect_voice_uri)
		sentence_id = str(request.json['sentence']['sentenceId'])
		korean_text = request.json['sentence']['koreanText']

		# log
		print('user_id: ', user_id)
		print('user_voice_uri: ', user_voice_uri)
		print('perfect_id: ', perfect_id)
		print('perfect_voice_uri: ', perfect_voice_uri)
		print('sentence_id: ', sentence_id)
		print('korean_text: ', korean_text)

		# download user_voice and perfect_voice
		user_voice_file_name = utils.downloadSoundFile(user_voice_uri, user_dir)
		user_voice_path = user_dir + user_voice_file_name

		# make shell command
		user_convert_command = utils.getCommand(user_voice_path, user_id, "sentence-convert")
		decode_command = utils.getCommand(user_voice_path, user_id, "decode")

		# voice file to flac, 16bit 16khz with ffmpeg
		try:
			user_convert_worker = subprocess.call([user_convert_command], shell=True)

		except subprocess.TimeoutExpired:
			return jsonify({
					"success":False,
				})
		
		decoder_worker = subprocess.Popen([decode_command], shell=True)

		# get pitch and from flac
		perfect_flac_path = perfect_dir + perfect_id + ".flac"
		perfect_pitch, perfect_times, perfect_duration = evaluation.getPitch(perfect_flac_path, sample_rate=16000) # normalized pitch

		user_flac_path = user_dir + user_id + ".flac"
		user_pitch, user_times, _ = evaluation.getPitch(user_flac_path, sample_rate=16000)

		# get dtw score from pitch
		dtw_score = evaluation.getDTWScore(perfect_pitch, user_pitch, perfect_duration)
		
		# speech to text and get stt score
		try:
			decoder_worker.wait(timeout=10)
			result_stt = korean.getKoreanText(path.getLogDir() + user_id + ".log")
			stt_score = korean.levenshtein(korean_text, result_stt)

		except subprocess.TimeoutExpired:
			return jsonify({
					"success":False,
				})

		# calculate real score
		result_score = dtw_score + stt_score

		print('result_stt is ', result_stt)
		print('result_score is ', result_score)
		# make json dumps to return 
		perfect_pitch_dumps = json.dumps(perfect_pitch)
		perfect_times_dumps = json.dumps(perfect_times)
		user_pitch_dumps = json.dumps(user_pitch)
		user_times_dumps = json.dumps(user_times)
		print('return success')

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
		print("GET")
		return("GET")

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=8080)
