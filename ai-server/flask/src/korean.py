# -*- coding: utf-8 -*-
# Author: Park Yeong Jun
# Email: qkrdudwns98@naver.com
# Description: process STT score
# Modified: 2021.11.07
# Version: 1.0.0

import re
import sys
import io
import hgtk

def getKoreanText(file_path: str) -> str:
	"""
	:description:			extract space and korean text from ctm file
	:param file_path:		str, ctm file path
	:return:				str, korean text
	"""

	# open log file
	reader = io.open(file_path, 'r', encoding='utf8')

	# read all line
	lines = reader.readlines()
	silence = "<eps>"
	korean_index = 4
	result = ""

	for line in lines:
		splited = line.split(' ')
		if splited[korean_index] == silence: 
			result += ' '
		else:
			result += splited[korean_index]

	return result.strip()

def levenshtein(perfect_str: str, user_str: str, weight: int) -> int:
    """
    :description:				compare string with levenshtein
    :param perfect_str:			str, original string
    :param user_str:			str, user's string extracted from speech to text
    :return:					int, evaluation score
    """

    if len(perfect_str) < len(user_str):
        return levenshtein(user_str, perfect_str, weight)

    if len(user_str) == 0:
        return 0

    # divide korean text to consonant and vowel
    perfect_str = perfect_str.replace(' ', '')
    user_str = user_str.replace(' ', '')
    perfect_str = hgtk.text.decompose(perfect_str)
    user_str = hgtk.text.decompose(user_str)

    # compare perfect_str and user_str by using levenshtein
    previous_row = range(len(user_str) + 1)
    for i, c1 in enumerate(perfect_str):
        current_row = [i + 1]
        for j, c2 in enumerate(user_str):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))

        previous_row = current_row	
    levenshtein_score = previous_row[-1]

    # calculate real score
    score = (len(perfect_str) - levenshtein_score) / len(perfect_str)

    return int(score * weight)
