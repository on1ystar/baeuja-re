#! /bin/bash
# -*- coding: utf-8 -*-
# author: Park Yeong Jun
# email: qkrdudwns98@naver.com
# description: convert sound file to flac
# modified: 2021.09.06
# version: 0.3


ffmpeg -y -i $1 -af aformat=s16:16000 $2 > /dev/null 2>&1
