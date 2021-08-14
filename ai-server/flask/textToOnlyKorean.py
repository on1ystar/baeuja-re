# -*- coding: utf-8 -*-
# author: Park Yeong Jun
# email: qkrdudwns98@naver.com
# description: get only korean text line from log
# modified: 2021.08.14
# version: 0.2

import re
import sys
import io

# log file name
srcFileName = sys.argv[1]
# result file name
dstFileName = sys.argv[2] 

# file descriptor
srcFileDs = io.open(srcFileName, 'r', encoding='utf8')
dstFileDs = io.open(dstFileName, 'w', encoding='utf8')

# korean regex
regex_korean = re.compile('[^ 가-힣]+') 
regex_filter = re.compile('[가-힣]+')

# get all line
fileLines = srcFileDs.readlines() 
result = ""

for line in fileLines:
	# if only one korean in line
	if regex_filter.findall(line): 
		# get line
		result+=str(line)

# extract korean and space
result = regex_korean.sub('', result)

# save to file
dstFileDs.write(result)
srcFileDs.close()
dstFileDs.close()

