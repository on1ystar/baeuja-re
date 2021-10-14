# -*- coding: utf-8 -*-
# Author: Park Yeong Jun
# Email: qkrdudwns98@naver.com
# Description: baeuja ai server
# Modified: 2021.10.12
# Version: 0.4.3

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
def evalutaionWord():
	if request.method == 'POST':

		# get wave file path
		perfect_dir = path.getPerfectWordDir()
		user_dir = path.getUserWordDir()

		# get data from request.json
		user_id = str(request.json['userId'])
		user_voice_uri = request.json['userVoiceUri']
		perfect_voice_uri = request.json['word']['perfectVoiceUri']
		perfect_id = utils.getFileName(perfect_voice_uri)
		word_id = str(request.json['word']['wordId'])
		korean_text = request.json['word']['korean']

		# log about request
		log_data = {
			'method': 'evaluationWord()',
			'user_id': user_id,
			'user_voide_uri': user_voice_uri,
			'korean_text': korean_text
		}
		utils.makeLog(log_data)

		# download user_voice and perfect_voice
		user_voice_file_name = utils.downloadSoundFile(user_voice_uri, user_dir)
		user_voice_path = user_dir + user_voice_file_name

		# make shell command
		user_convert_command = utils.getCommand(user_voice_path, user_id, "word-convert")

		# voice file to flac, 16bit 16khz with ffmpeg
		try:
			user_convert_worker = subprocess.call([user_convert_command], shell=True)

		except subprocess.TimeoutExpired:
			return jsonify({
					"success":False,
					"error": "file convert to flac timeout"
				})

		decoder_worker = subprocess.Popen([decode_command], shell=True)

		# get perfect pitch from flac

		if perfect_pitch is None:
			return jsonify({
					"success": False,
					"error": "cannot found pitch"
				})
		
		# speech to text and get stt score
		try:
			decoder_worker.wait(timeout=10)
			result_stt = korean.getKoreanText(path.getLogDir() + user_id + ".log")
			stt_score = korean.levenshtein(korean_text, result_stt)
		
		except subprocess.TimeoutExpired:
			return jsonify({
					"success":False,
					"error": "decode timeout"
				})


		# calculate real score
		result_score = stt_score

		# log
		log_data = {
			'result_stt': result_stt,
			'result_score': result_score
		}
		utils.makeLog(log_data)

		return jsonify({
				"success":True,
				"evaluatedWord":{
					"score": result_score,
					"sttResult": result_stt
					},
				"pitchData":{
					"perfectVoice":{
						"time": [],
						"hz": []
						},
					"userVoice":{
						"time": [],
						"hz": []
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

		perfect = VoiceInfo(id = str(request.json['sentence']['sentenceId']),
				uri = request.json['sentence']['perfectVoiceUri'],
				text = request.json['sentence']['koreanText']
			)

		# log about request
		utils.makeLog({'user': user, 'perfect': perfect})

		# download user_voice and perfect_voice
		user_file_name = utils.downloadSoundFile(user.uri, path.getUserSentenceDir())
		user.path = path.getUserSentenceDir() + user_file_name

		# make shell command
		user_command = Command(
				convert = utils.getCommand(user.path, user.id, "sentence-convert"),
				decode = utils.getCommand(user.path, user.id, "decode")
			)
	
		# voice file to flac, 16bit 16kHz with ffmpeg
		try:
			user_convert_worker = subprocess.call([user_command.convert], shell=True)

		except subprocess.TimeoutExpired:
			return jsonify({
					"success":False,
				})

		# stt
		user_decoder_worker = subprocess.Popen([user_command.decode], shell=True)

		# get pitch and from flac
		perfect.path = path.getPerfectSentenceDir() + perfect.id + ".flac"
		perfect.pitch, perfect.time, perfect.duration = evaluation.getPitch(perfect.path, sample_rate=16000) # normalized pitch

		if perfect.pitch is None:
			return jsonify({
					"success": False,
					"error": "cannot found pitch"
				})

		user.path = path.getUserSentenceDir() + user.id + ".flac"
		user.pitch, user.time, user.duration = evaluation.getPitch(user.path, sample_rate=16000)

		# get dtw score from pitch
		pitch_score = evaluation.getPitchScore(perfect, user)
		
		# speech to text and get stt score
		try:
			user_decoder_worker.wait(timeout=10)
			user.text = korean.getKoreanText(path.getLogDir() + user.id + ".log")
			stt_score = korean.levenshtein(perfect.text, user.text)

		except subprocess.TimeoutExpired:
			return jsonify({
					"success": False,
					"error": "decode timeout"
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

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=8080)
