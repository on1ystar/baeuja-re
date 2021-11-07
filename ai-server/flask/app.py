# -*- coding: utf-8 -*-
# Author: Park Yeong Jun
# Email: qkrdudwns98@naver.com
# Description: baeuja ai server
# Modified: 2021.11.07
# Version: 1.0.0

from flask import Flask
from flask import request
from flask import jsonify
from requests import get

from src import evaluation
from src import korean
from src import utils
from src import path

from src.data import VoiceInfo
from src.data import Command

import subprocess
import os
import json

app = Flask(__name__)

@app.route('/evaluation/word', methods = ['GET', 'POST'])
def evaluationWord():
	"""
	:description:	evaluation user's speech compare with voice_actor speech by using Pitch and STT
	:return:		int, evaluation score
	"""
	if request.method == 'POST':
		# get data from request.json
		user = VoiceInfo(id = str(request.json['userId']),
				uri = request.json['userVoiceUri']
			)

		perfect = VoiceInfo(id = str(request.json['word']['wordId']),
				uri = request.json['word']['perfectVoiceUri'],
				text = request.json['word']['korean']
			)

		# log about request
		utils.makeLog({'user': user, 'perfect': perfect})

		# download user_voice and perfect_voice
		user_file_name = utils.downloadSoundFile(user.uri, path.getUserWordDir())
		user.path = path.getUserWordDir() + user_file_name

		# make shell command
		user_command = Command(
				convert = utils.getCommand(user.path, user.id, "word-convert"),
				decode = utils.getCommand(user.path, user.id, "word-decode")
			)
		# voice file to flac, 16bit 16kHz with ffmpeg
		try:
			user_convert_worker = subprocess.call([user_command.convert], shell=True)

		except subprocess.TimeoutExpired:
			return jsonify({
					"success": False,
					"error": "convert timeout in word-user"
				})

		# stt
		user_decoder_worker = subprocess.Popen([user_command.decode], shell=True)
		stt_weight = 100
		extension_ctm = ".ctm"

		# speech to text and get stt score
		try:
			user_decoder_worker.wait(timeout=10)
			# get
			user.text = korean.getKoreanText(path.getLatDir() + user.id + extension_ctm)
			stt_score = korean.levenshtein(perfect.text, user.text, stt_weight)

		except subprocess.TimeoutExpired:
			return jsonify({
					"success": False,
					"error": "decode timeout in word"
				})

		# calculate real score
		result_score = stt_score

		# log
		utils.makeLog({'result_stt': user.text, 'result_score': result_score})

		empty_list = list()
		return jsonify({
				"success":True,
				"evaluatedWord":{
					"score": result_score,
					"sttResult": user.text
					},
				"pitchData":{
					"perfectVoice":{
						"time": json.dumps(empty_list),
						"hz": json.dumps(empty_list)
						},
					"userVoice":{
						"time": json.dumps(empty_list),
						"hz": json.dumps(empty_list)
						}
					}
				})

@app.route('/evaluation/sentence', methods = ['GET', 'POST'])
def evaluationSentence():
	"""
	:description:	evaluation user's speech compare with voice_actor speech by using Pitch and STT
	:return:		int, evaluation score
	"""
	if request.method == 'POST':
		# get data from request.json
		user = VoiceInfo(id = str(request.json['userId']),
				uri = request.json['userVoiceUri']
			)

		tmp_id = str(request.json['sentence']['sentenceId'])
		perfect = VoiceInfo(id = tmp_id),
				text = korean.getKoreanText(path.getPerfectSentenceCtmDir() + tmp_id  + ".ctm")
			)

		# log about request
		utils.makeLog({'user': user, 'perfect': perfect})

		# download user_voice and perfect_voice
		user_file_name = utils.downloadSoundFile(user.uri, path.getUserSentenceDir())
		user.path = path.getUserSentenceDir() + user_file_name

		# make shell command
		user_command = Command(
				convert = utils.getCommand(user.path, user.id, "sentence-convert"),
				decode = utils.getCommand(user.path, user.id, "sentence-decode")
			)
	
		# voice file to flac, 16bit 16kHz with ffmpeg
		try:
			user_convert_worker = subprocess.call([user_command.convert], shell=True)

		except subprocess.TimeoutExpired:
			return jsonify({
					"success":False,
					"error": "convert timeout in sentence-user"
				})

		# stt
		user_decoder_worker = subprocess.Popen([user_command.decode], shell=True)

		# get pitch and from flac
		extension_flac = ".flac"
		perfect.path = path.getPerfectSentenceDir() + perfect.id + extension_flac
		perfect.pitch, perfect.time, perfect.duration = evaluation.getPitch(perfect.path, sample_rate=16000) # normalized pitch

		user.path = path.getUserSentenceDir() + user.id + extension_flac
		user.pitch, user.time, user.duration = evaluation.getPitch(user.path, sample_rate=16000)
		
		if perfect.pitch is None:
			return jsonify({
					"success": False,
					"error": "cannot found pitch from perfect"
				})

		if user.pitch is None:
			return jsonify({
					"success": False,
					"error": "cannot found pitch from user"
				})

		# get dtw score from pitch
		pitch_score = evaluation.getPitchScore(perfect, user)
		
		extension_ctm = ".ctm"
		stt_weight = 80
		# speech to text and get stt score
		try:
			user_decoder_worker.wait(timeout=10)
			user.text = korean.getKoreanText(path.getLatDir() + user.id + extension_ctm)
			stt_score = korean.levenshtein(perfect.text, user.text, stt_weight)

		except subprocess.TimeoutExpired:
			return jsonify({
					"success": False,
					"error": "decode timeout in sentence"
				})

		# calculate real score
		result_score = pitch_score + stt_score

		# log
		utils.makeLog({'result_stt': user.text, 'result_score': result_score})


		return jsonify({
				"success":True,
				"evaluatedSentence":{
					"score": result_score,
					"sttResult": user.text
					},
				"pitchData":{
					"perfectVoice":{
						"time": json.dumps(perfect.time),
						"hz": json.dumps(perfect.pitch)
						},
					"userVoice":{
						"time": json.dumps(user.time),
						"hz": json.dumps(user.pitch)
						}
					}
				})
	else:
		print('GET')
if __name__ == "__main__":
	app.run(host='0.0.0.0', port=8080)
