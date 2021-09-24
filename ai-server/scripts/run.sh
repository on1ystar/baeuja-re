#! /bin/bash
# -*- coding: utf-8 -*-
# author: Park Yeong Jun
# email: qkrdudwns98@naver.com
# description: speech to text from file(wav of flac)
# modified: 2021.08.14
# version: 0.2

if [ "$#" -ne 2 ]; then
	echo "Usage $0 <wav_or_flac_file> <ID>"
	exit 1
fi

# input file name
inputFile=$1

# flac file name
flacFile=$2.flac

# decode log file
logFile=$2.log

# extracted korean result fime name
resultFile=$2.txt
# model directory

### need to change, how to read config file in sh_script
modelDir=/home/ubuntu/aiServer/1412s-peach/ai-server/model
scriptDir=/home/ubuntu/aiServer/1412s-peach/ai-server/scripts
tmpDir=/home/ubuntu/aiServer/1412s-peach/ai-server/tmp

inputFileExtension=${inputFile##*.}
EXTENSION_FLAC=flac

# wav file
ffmpeg -y -i $inputFile -af aformat=s16:16000 $tmpDir/$flacFile > /dev/null 2>&1

if [ "${EXTENSION_FLAC}" == "${inputFileExtension}" ]; then
	${scriptDir}/decode.sh $tmpDir/$flacFile >& $tmpDir/$logFile
fi

