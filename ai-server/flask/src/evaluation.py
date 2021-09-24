# -*- coding: utf-8 -*-
# Author: Park Yeong Jun
# Email: qkrdudwns98@naver.com
# Description: process pitch score
# Modified: 2021.09.01
# Version: 0.3

import numpy as np
import librosa, librosa.display
import sys
import dtw
import datetime

def getNormalized(data: list) -> list:
	"""
	:process min-max normalization
	:param data: list
	:return : normalized data
	"""
	normalized_data = list()
	max_value = max(data)
	min_value = min(data)
	print('max_value is ', max_value)
	print('min_value is ', min_value)
	print('max - min is ', max_value - min_value)
	# min - max normalization
	for i in range(0, len(data)):
		normalized_data.append((data[i] - min_value) / (max_value - min_value))
	return normalized_data

def getPitch(wav_file: str, sample_rate=16000) -> list:
	"""
	:get pitch from wav file
	:param wavFile: str, wave file path
	:param sr : sample_rate, int
	:return: list
	"""
	# wav file load
	print('wav file is ', wav_file)
	signal, _ = librosa.load(wav_file, sr=sample_rate)

	# remove silence
	signal_trimed, _ = librosa.effects.trim(signal, top_db=20)

	# get pitch (f0)
	f0, _, _ = librosa.pyin(signal_trimed, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C5'))

	# remove NaN from pitch(f0)
	removed_nan_f0 = [x for x in f0 if np.isnan(x) == False]

	# get normalized pitch
	normalized_pitch = getNormalized(removed_nan_f0)

	# get duration of wav file
	duration = librosa.get_duration(signal_trimed, sr=sample_rate)

	# get time list from pitch
	time_of_pitch = getTimes(len(signal_trimed), len(removed_nan_f0))

	return normalized_pitch, time_of_pitch, duration


def getTimes(pitch_len: int, removed_nan_pitch_len: int, sample_rate=16000) -> list:
	"""
	:get times for pitch graph
	:param pitch_len: len(pitch)
	:param removed_nan_pitch_len: len(removed_nan_pitch)
	:param sample_rate: sample_rate of wav file, default is 16000
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
		times.append(times[i-1] + gap)
		times[i] = round(times[i], 2)
	return times

def getDTWScore(perfect_pitch: list, user_pitch: list, duration: float) -> int:
	"""
	:compare voice, get score user voice
	:param perfect_pitch: list, extracted pitch from voice actor
	:param user_pitch: list, extracted pitch from user
	:param duration: perfect_voice duration
	:return: dtw score
	"""

	# get dtw distance between perfect_pitch and user_pitch
	dtw_distance = dtw.dtw(perfect_pitch, user_pitch, keep_internals=True).distance
	
	# return score depending on the duration
	if dtw_distance < duration * 2:
		return 5
	elif dtw_distance < duration * 3:
		return 4
	elif dtw_distance < duration * 5:
		return 3
	elif dtw_distance < duration * 10:
		return 2
	else:
		return 1
