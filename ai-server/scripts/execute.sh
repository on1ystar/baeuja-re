#!/bin/bash

# Author: Park Yeong Jun
# Email: qkrdudwns98@naver.com
# Description: baeuja ai server
# Modified: 2021.10.14
# Version: 0.4.3

# get script path
SHELL_DIR="$( cd "$( dirname "$0" )" && pwd -P )"
. $SHELL_DIR/config.sh

WORD_DECODE="word-decode"
SENTENCE_DECODE="sentence-decode"
WORD_CONVERT="word-convert"
SENTENCE_CONVERT="sentence-convert"

INPUT_FILE=$1
FILE_ID=$2
EXECUTE_OPTION=$3

EXTENSION_FLAC=".flac"
EXTENSION_LOG=".log"

LOG_FILE="$LOG_DIR/$FILE_ID$EXTENSION_LOG"

# word convert
if [ "$WORD_CONVERT" == "$EXECUTE_OPTION" ]; then
	FLAC_FILE="$USER_WORD_DIR/$FILE_ID$EXTENSION_FLAC"
	$SCRIPT_DIR/convert.sh $INPUT_FILE $FLAC_FILE 
fi

# sentence convert
if [ "$SENTENCE_CONVERT" == "$EXECUTE_OPTION" ]; then
	FLAC_FILE="$USER_SENTENCE_DIR/$FILE_ID$EXTENSION_FLAC"
	$SCRIPT_DIR/convert.sh $INPUT_FILE $FLAC_FILE 
fi 

# word stt
if [ "$WORD_DECODE" == "$EXECUTE_OPTION" ]; then
	FLAC_FILE="$USER_WORD_DIR/$FILE_ID$EXTENSION_FLAC"
	$SCRIPT_DIR/decode.sh $FLAC_FILE >& $LOG_FILE
fi

# sentence stt
if [ "$SENTENCE_DECODE" == "$EXECUTE_OPTION" ]; then
	FLAC_FILE="$USER_SENTENCE_DIR/$FILE_ID$EXTENSION_FLAC"
	$SCRIPT_DIR/decode.sh $FLAC_FILE >& $LOG_FILE
fi
