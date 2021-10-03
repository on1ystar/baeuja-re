# -*- coding: utf-8 -*-
# Author: Park Yeong Jun
# Email: qkrdudwns98@naver.com
# Modified: 2021.10.03
# Version: 0.4

from requests import get
from . import path

def downloadSoundFile(url: str, save_path: str) -> str:
	"""
	:download sound file from url
	:param url: download sound file from url
	:return downloaded file name
	"""
	file_name = url.split('/')[-1]

	with open(save_path + file_name, "wb") as file:
		# download from url
		response = get(url)

		# save to local
		file.write(response.content) 
	
	return file_name

def getCommand(file_path: str, file_id: str, option: str) -> str:
	"""
	:make command for subprocess
	:param file_path: input sound file path 
	:param file_id: user_id
	:param option: "word-convert" or "sentence-convert" or "decode"
	:return make command
	"""
	execute_script = conf.getExecuteScript()
	return execute_script + ' ' + file_path + ' ' + file_id + ' ' + option

def getFileName(file_path: str) -> str:
	"""
	:get only filename from filepath
	:param file_path: path of file saved in local
	"""
	splited = file_path.split('/')
	return str(splited[-1]).split('.')[0]
