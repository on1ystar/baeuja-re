# -*- coding: utf-8 -*-
# Author: Park Yeong Jun
# Email: qkrdudwns98@naver.com
# Description: define data class
# Modified: 2021.11.07
# Version: 1.0.0

from dataclasses import dataclass

@dataclass
class VoiceInfo:
	id: str
	uri: str = None
	text: str = None
	path: str = None
	pitch: list = None
	time: list = None
	duration: str = None

@dataclass
class Command:
	convert: str
	decode: str
	lat: str = None
