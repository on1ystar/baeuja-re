#! /bin/bash
# -*- coding: utf-8 -*-
# author: Park Yeong Jun
# email: qkrdudwns98@naver.com
# description: convert sound file to flac
# modified: 2021.10.12
# version: 0.4.3

# bit=16, sample_rate=16kHz, channel=1, format=flac

input=$1
output=$2

ffmpeg -y -i $input -af aformat=s16:16000 -ac 1 $output > /dev/null 2>&1
