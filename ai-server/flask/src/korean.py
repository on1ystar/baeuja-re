# -*- coding: utf-8 -*-
# Author: Park Yeong Jun
# Email: qkrdudwns98@naver.com
# Description: process STT score
# Modified: 2021.10.05
# Version: 0.4.1

import re
import sys
import io
import hgtk
from hanspell import spell_checker

def getKoreanText(decoded_file: str) -> str:
	"""
	:description:			extract only korean text from decoded_file
	:param decoded_file:	str, log file path
	:return:				str, grammer korean text
	"""

	# open log file
	reader = io.open(decoded_file, 'r', encoding='utf8')

	# korean regex
	regex_korean = re.compile('[^가-힣]+') 
	regex_filter = re.compile('[가-힣]+')

	# read all line
	fileLines = reader.readlines() 
	origin_result = ""

	for line in fileLines:
		# if only one korean in line
		if regex_filter.findall(line): 
			# get line
			origin_result+=str(line)

	# remove space
	non_space_result = regex_korean.sub('', origin_result)

	# add space with grammer
	grammer_result = spell_checker.check(non_space_result).checked

	return grammer_result

def levenshtein(perfect_str: str, user_str: str) -> int:
    """
    :description:				compare string with levenshtein
    :param perfect_str:			str, original string
    :param user_str:			str, user's string extracted from speech to text
    :return:					int, evaluation score
    """

    # divide korean text to consonant and vowel
    perfect_str = hgtk.text.decompose(perfect_str)
    user_str = hgtk.text.decompose(user_str)

    if len(perfect_str) < len(user_str):
        return levenshtein(user_str, perfect_str)

    if len(user_str) == 0:
        return 0

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

    return int(score * 80)
