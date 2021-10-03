#! /bin/bash
# -*- coding: utf-8 -*-
# author: Park Yeong Jun
# email: qkrdudwns98@naver.com
# description: convert sound file to flac
# modified: 2021.10.03
# version: 0.4

# bit=16, sample_rate=16kHz, channel=1, format=flac
ffmpeg -y -i $1 -af aformat=s16:16000 -ac 1 $2 > /dev/null 2>&1
