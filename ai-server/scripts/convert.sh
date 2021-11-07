#! /bin/bash
# -*- coding: utf-8 -*-
# author: Park Yeong Jun
# email: qkrdudwns98@naver.com
# description: convert sound file to flac
# modified: 2021.11.07
# version: 1.0.0

# bit=16, sample_rate=16kHz, channel=1, format=flac

input=$1
output=$2

ffmpeg -y -i $input -af aformat=s16:16000 -ac 1 $output > /dev/null 2>&1
