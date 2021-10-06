# -*- coding: utf-8 -*-
# Author: Park Yeong Jun
# Email: qkrdudwns98@naver.com
# Modified: 2021.10.06
# Version: 0.4.2

import os
import sys
from requests import get
from . import path

def downloadSoundFile(url: str, save_path: str) -> str:
	"""
	:description:		download sound file from url
	:param url:			str, download sound file from url
	:return:			str, downloaded file name
	"""

	# extract filename from url
	file_name = url.split('/')[-1]

	# save file
	with open(save_path + file_name, "wb") as file:
		# download file
		response = get(url)

		# save to local
		file.write(response.content) 
	
	return file_name

def getCommand(file_path: str, file_id: str, option: str) -> str:
	"""
	:description:		make command for subprocess
	:param file_path:	str, input sound file path 
	:param file_id:		str, user_id
	:param option:		str, "word-convert" or "sentence-convert" or "decode"
							option:
								word-convert:		file convert to flac and save in sounds/words 
								sentence-convert:	file convert to flac and save in sounds/sentences
								decode:				extract	korean text from flac file
	:return:			str,  maked command
	"""

	# get execute script
	execute_script = path.getExecuteScript()

	# make command
	return execute_script + ' ' + file_path + ' ' + file_id + ' ' + option

def getFileName(file_path: str) -> str:
	"""
	:description:		get only filename from filepath
	:param file_path:	str, path of file saved in local
	:return:			str, splited filename from filepath
	"""
	splited = file_path.split('/')
	return str(splited[-1]).split('.')[0]


def makeLog(data):
	log_data = {
		'function': sys._getframe(1).f_code.co_name + "()",
		'data': data
	}
	print(log_data)
