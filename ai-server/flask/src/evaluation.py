# -*- coding: utf-8 -*-
# Author: Park Yeong Jun
# Email: qkrdudwns98@naver.com
# Description: process pitch score
# Modified: 2021.10.05
# Version: 0.4.1

import numpy as np
import librosa, librosa.display
import sys
from fastdtw import fastdtw
import dtw
import datetime

def getNormalized(data: list) -> list:
	"""
	:description:			process min-max normalization
	:param data:			list, target data
	:return:				list, normalized data
	"""

	normalized_data_list = list()
	max_value, min_value = max(data), min(data)

	# min - max normalization
	for i in range(0, len(data)):
		normalized_data = (data[i] - min_value) / (max_value - min_value)
		normalized_data_list.append(normalized_data)

	return normalized_data_list

def getPitch(wav_file: str, sample_rate=16000) -> list:
	"""
	:description:			get pitch from wav file
	:param wavFile:			str, wave file path
	:param sample_rate:		int, sample rate of wave file
	:return:				list, extracted pitch of wave file
	"""

	# wav file load
	signal, _ = librosa.load(wav_file, sr=sample_rate)

	# remove silence
	signal_trimed, _ = librosa.effects.trim(signal, top_db=20)

	# get pitch (f0), limited pitch value C2 ~ C5
	f0, _, _ = librosa.pyin(signal_trimed, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C5'))

	# remove NaN from pitch(f0)
	removed_nan_f0 = [x for x in f0 if np.isnan(x) == False]

	# get normalized pitch
	# need to update when if len(removed_nan_f0) == 0
	normalized_pitch = getNormalized(removed_nan_f0)

	# get duration of wav file
	duration = librosa.get_duration(signal_trimed, sr=sample_rate)

	# get time list from pitch
	time_of_pitch = getTimes(len(signal_trimed), len(removed_nan_f0))

	return normalized_pitch, time_of_pitch, duration


def getTimes(pitch_len: int, removed_nan_pitch_len: int, sample_rate=16000) -> list:
	"""
	:description:					get times for pitch graph
	:param pitch_len:				int, length of extracted pitch
	:param removed_nan_pitch_len:	int, len(removed_nan_pitch)
	:param sample_rate: 			int, sample_rate of wav file, default is 16000
	:return:						list, time data about pitch
	"""
	
	# the number of sample per second
	unit = pitch_len / sample_rate

	# the gap of per index
	gap = unit / removed_nan_pitch_len
	gap = round(gap, 2)

	# makes time list for every index
	times = list()
	times.append(0)
	for i in range(1, removed_nan_pitch_len):
		time = times[i-1] + gap
		times.append(time)
		times[i] = round(times[i], 2)
	return times

def _getScore(data_1: float, data_2: float) -> float:
	"""
	:description:			calculate score about data of pitch_len, duration
	:param data_1:			float, something data
	:param data_2:			float, something data
	:return:				float, calculation result
	"""
	return abs(data_1 - data_2) / max(data_1, data_2)

def getPitchScore(perfect_pitch: list, user_pitch: list, perfect_time: list, user_time: list, perfect_duration: float, user_duration: float) -> int:
	"""
	:description:,				get score about pitch, duration, dtw
	:param perfect_pitch:		list, extracted pitch from voice actor
	:param user_pitch:			list, extracted pitch from user
	:param perfect_time:		list, time value about perfect_pitch
	:param user_time:			list, time value about user_pitch
	:param perfect_duration:	float, perfect_voice duration
	:param user_duration:		float, user_voice duration
	:return:					float, calculated score about pitch, duration, dtw
	"""

	# get pitch length
	perfect_pitch_len = len(perfect_pitch)
	user_pitch_len = len(user_pitch)
	
	# set weight about score, sum is 20
	# pitch:	7
	# duration: 7
	# dtw:		6
	pitch_score_weight= 7
	duration_score_weight = 7
	dtw_score_weight = 6

	# get score about pitch, duration
	pitch_score = _getScore(float(perfect_pitch_len), float(user_pitch_len)) * pitch_score_weight
	duration_score = _getScore(perfect_duration, user_duration) * duration_score_weight

	# prepare to use fastdtw
	perfect_data = list(zip(perfect_time, perfect_pitch))
	user_data = list(zip(user_time, user_pitch))

	# get dtw distance using fastdtw
	dtw_distance, _ = fastdtw(perfect_data, user_data) # need to add radius, euclide.. scipy is so heavy, must get euclidean value

	# calculate dtw score with pitch, duration
	dtw_evaluation_score = abs((float(user_pitch_len) / user_duration) - dtw_distance)

	if dtw_evaluaton_score <= 0.1 * user_pitch_len:
		dtw_score = dtw_score_weight
	elif dtw_evaluation_score <= 0.2 * user_pitch_len:
		dtw_score = dtw_score_weight - 1
	elif dtw_evaluation_score <= 0.4 * user_pitch_len:
		dtw_score = dtw_score_weight - 2
	elif dtw_evaluation_score <= 0.6 * user_pitch_len:
		dtw_score = dtw_score_weight - 3
	elif dtw_evaluation_score <= 0.8 * user_pitch_len:
		dtw_score = dtw_score_weight - 4
	elif dtw_score <= user_pitch_len:
		dtw_score = dtw_score_weight - 5
	else:
		dtw_score = 0

	# calculate final score
	final_score = dtw_score + pitch_score + duration_score
	return final_score
