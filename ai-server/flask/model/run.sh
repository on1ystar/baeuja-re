#! /bin/bash
# -*- coding: utf-8 -*-
# author: Park Yeong Jun
# email: qkrdudwns98@naver.com
# description: speech to text from file(wav of flac)
# modified: 2021.08.14
# version: 0.2

if [ "$#" -ne 1 ]; then
	echo "Usage $0 <wav_or_flac_file>"
	exit 1
fi

# input file name
inputFile=$1

# flac file name
flacFile=output.flac

# decode log file
logFile=stt_with_log.txt

# extracted korean result fime name
resultFile=stt_result.txt

# model directory
modelDir=/home/ubuntu/aiServer/1412s-peach/ai-server/flask/model


inputFileExtension=${inputFile##*.}
WAV=wav
FLAC=flac

# wav file
if [ "${WAV}" == "${inputFileExtension}" ]; then
	# wav to flac, 16bit, 16kHz
	ffmpeg -y -i ${inputFile} -af aformat=s16:16000 ${modelDir}/$flacFile

	# speech to text from .flac
	${modelDir}/decode.sh ${modelDir}/${flacFile} >& ${modelDir}/${logFile}
fi

# flac file
if [ "${FLAC}" == "${inputFileExtension}" ]; then
	# speech to text from .flac
	${modelDir}/decode.sh ${inputFile} >& ${modelDir}/${logFile}
fi

# extract only korean from log
python3 textToOnlyKorean.py ${modelDir}/${logFile} ${modelDir}/${resultFile}

# remove log file
#rm ${modelDir}/${logFile}
# remove donwload file
#rm ${inputFile}
