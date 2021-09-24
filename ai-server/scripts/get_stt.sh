#!/bin/bash

dir=$1

for entry in $dir/*
do
	if [ ${entry##*.} == "flac" ]; then
		echo $entry
		./decode.sh $entry &>> result_008.txt
	fi
done
