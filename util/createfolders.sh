#!/bin/bash

for file in *.*; do
  ext=${file##*.}
  ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

  if [ "$ext" != "sh" ]; then
	base=${file%.*}
	first_name=$(echo "$base" | awk -F'[_-]' '{print $1}')
	last_name=$(echo "$base" | awk -F'[_-]' '{print $2}')
	number=$(echo "$base" | awk -F'[_-]' '{print $3}')

	dir_name="$first_name"_"$last_name"

	if [ ! -d "$dir_name" ]; then
	  mkdir "$dir_name"
	fi

	mv "$file" "$dir_name"
  fi
done