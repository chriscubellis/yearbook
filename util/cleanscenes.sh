#!/bin/bash

# Set the name of the folder where the renamed scene.splinecode files will be copied
all_scenes_folder="./all-scenes"

# Create the "all-scenes" folder if it doesn't exist
if [ ! -d "$all_scenes_folder" ]; then
	mkdir "$all_scenes_folder"
fi

# Loop through each subfolder in the current directory
for folder in */; do
	# Check that the item is a directory and not a file
	if [[ -d "$folder" ]]; then
		# Loop through each file in the subfolder
		for file in "$folder"/*; do
			# Check that the item is a file and not a directory
			if [[ -f "$file" ]]; then
				# Check if the file is not named "scene.splinecode"
				if [[ "$file" != "$folder/scene.splinecode" ]]; then
					# Delete the file
					rm "$file"
				else
					# Rename the file to match the folder name
					new_name=$(basename "$folder" | tr '_' '-' ).splinecode
					mv "$file" "$folder/$new_name"
					# Copy the renamed file to the "all-scenes" folder
					cp "$folder/$new_name" "$all_scenes_folder"
				fi
			fi
		done
	fi
done