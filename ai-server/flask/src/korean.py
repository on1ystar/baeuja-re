# -*- coding: utf-8 -*-
# Author: Park Yeong Jun
# Email: qkrdudwns98@naver.com
# Description: process STT score
# Modified: 2021.09.01
# Version: 0.3

import re
import sys
import io
import hgtk
import datetime

def getKoreanText(log_file: str) -> str:
	"""
	:extract only korean text from log_file
	:param: log file path
	:return: korean str
	"""

	# open log file
    reader = io.open(log_file, 'r', encoding='utf8')

	# korean regex
	regex_korean = re.compile('[^가-힣]+') 
	regex_filter = re.compile('[가-힣]+')

	# read all line
	fileLines = reader.readlines() 
	result = ""

	for line in fileLines:
		# if only one korean in line
		if regex_filter.findall(line): 
			# get line
			result+=str(line)

	# extract korean and space
	result = regex_korean.sub('', result)
	
	return result

def levenshtein(s1: str, s2: str) -> int:
    """
    :compare string with levenshtein
    :param: s1, correct string
    :param: s2, input string
    :return: evaluation score
    """

    # divide korean text to consonant and vowel
    s1 = hgtk.text.decompose(s1)
    s2 = hgtk.text.decompose(s2)

    if len(s1) < len(s2):
        return levenshtein(s2, s1)

    if len(s2) == 0:
        return 0

    # compare s1 and s2 by using levenshtein
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))

        previous_row = current_row	
    levenshtein_score = previous_row[-1]

    # calculate real score
    score = (len(s1) - levenshtein_score) / len(s1)

    return int(score * 95)
