import numpy as np
import librosa, librosa.display
import sys
import dtw
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
	:return: np.ndarray
	"""
	signal, sample_rate = librosa.load(wav_file)
	f0, _, _ = librosa.pyin(signal, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
	removed_nan_f0 = [x for x in f0 if np.isnan(x) == False]
	return getNormalized(removed_nan_f0)


# need to update
# need to set standard of score 
def getDTWScore(perfect_pitch: list, user_pitch: list) -> int:
	"""
	:compare voice, get score user voice
	:param: perfect_voice: str, path of perfect voice file
	:param: user_voice: str, path of user voice file
	:return: dtw score
	"""
	dtw_distance = dtw.dtw(perfect_pitch, user_pitch, keep_internals=True).distance
	return 10

# must update standard of score, getResult
