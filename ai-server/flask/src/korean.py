# -*- coding: utf-8 -*-
# author: Park Yeong Jun
# email: qkrdudwns98@naver.com
# description: get only korean text line from log
# modified: 2021.08.26
# version: 0.3

import re
import sys
import io
import hgtk

def getKoreanText(log_file: str) -> str:
	"""
	:extract only korean text
	:param: log file path
	:return: korean str
	"""

	# file descriptor
	print('log file is ', log_file)
	reader = io.open(log_file, 'r', encoding='utf8')

	# korean regex
	regex_korean = re.compile('[^가-힣]+') 
	regex_filter = re.compile('[가-힣]+')

	# get all line
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

def levenshtein(s1, s2, debug=False):
    s1 = hgtk.text.decompose(s1)
    s2 = hgtk.text.decompose(s2)
    print('s1 is ', s1)
    print('s2 is ', s2)

    if len(s1) < len(s2):
        return levenshtein(s2, s1, debug)

    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))

        if debug:
            print(current_row[1:])

        previous_row = current_row	
    
    levenshtein_score = previous_row[-1]
    print('lev score is ', levenshtein_score)
    a = (len(s1) - levenshtein_score) / len(s1)
    print('a is ', a)
    return a * 90
