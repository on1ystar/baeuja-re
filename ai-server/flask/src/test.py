# -*- coding: utf-8 -*-
# Author: Park Yeong Jun
# Email: qkrdudwns98@naver.com
# Description: process pitch score
# Modified: 2021.08.28
# Version: 0.1

import numpy as np
import librosa, librosa.display
import sys
import dtw
import datetime
import matplotlib.pyplot as plt

def getNormalized(data: list) -> list:
	"""
	:process min-max normalization
	:param data: list
	:return : normalized data
	"""
	normalized_data = list()
	max_value = max(data)
	min_value = min(data)
	for i in range(0, len(data)):
		normalized_data.append((data[i] - min_value) / (max_value - min_value))
	return normalized_data

def getPitch(wav_file: str) -> list:
	"""
	:get pitch from wav file
	:param wavFile: str
	:return: list
	"""
	sr=16000
	signal, sample_rate = librosa.load(wav_file, sr=sr)
	print('len signal is ', len(signal))
	signal_trimed, _ = librosa.effects.trim(signal, top_db=20)

	f0, _, _ = librosa.pyin(signal_trimed, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C5'))
	removed_nan_f0 = [x for x in f0 if np.isnan(x) == False]
	return getNormalized(removed_nan_f0), getTimes(len(signal_trimed), len(removed_nan_f0))


def getTimes(pitch_len: int, removed_nan_pitch_len: int, sample_rate=16000) -> list:
	"""
	:get times for pitch graph
	:param pitch_len: len(pitch)
	:param removed_nan_pitch_len: len(removed_nan_pitch)
	:param sample_rate: sample_rate of wav file, default is 16000
	"""
	unit = pitch_len / sample_rate
	print('unit is ', unit)
	a = unit / removed_nan_pitch_len
	print('a is ', a)
	a = round(a, 2)
	times = list()
	times.append(0)
	for i in range(1, removed_nan_pitch_len):
		times.append(times[i-1] + a)
		times[i] = round(times[i], 2)
	return times

# need to update
# need to set standard of score 
def getDTWScore(perfect_pitch: list, user_pitch: list) -> int:
	"""
	:compare voice, get score user voice
	:param perfect_pitch: list, extracted pitch from voice actor
	:param user_pitch: list, extracted pitch from user
	:return: dtw score
	"""
	dtw_distance = dtw.dtw(perfect_pitch, user_pitch, keep_internals=True).distance
	return 10


if __name__ == "__main__":
	w1 = sys.argv[1]
	w2 = sys.argv[2]
	p1, t1 = getPitch(w1)
	p2, t2 = getPitch(w2)
