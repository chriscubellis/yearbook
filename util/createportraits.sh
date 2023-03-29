#!/bin/bash

input_dir="Source"
output_dir="Exports"

# Set the size and aspect ratio variables
SIZE=400
ASPECT=1/1

mkdir -p $output_dir

for folder in $input_dir/*/; do
  folder_name="$(basename "$folder")"
  
  new_folder="$output_dir/$folder_name"
  mkdir -p "$new_folder"

  counter=1
  # Convert all files in the current folder to png and save them in the new subdirectory
  for file in "$folder"/*; do
	filename=$(basename "$file")
	# Convert the file to png and rename it to the standardized sequence
	convert "$file" -resize "${SIZE}x>" -gravity center -crop "$SIZE"x"$SIZE"+0+0 -filter Triangle -define filter:support=2 -unsharp 0.25x0.25+8+0.065 -dither None -posterize 136 -quality 82 -define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -define png:exclude-chunk=all -interlace none -colorspace sRGB -strip "$new_folder/${folder_name}_$(printf "%02d" $counter).png"
	counter=$((counter+1))
  done
  
done

terminal-notifier -message "Staff standardized and sorted." -title "1/2"

# Set the output video dimension
dimension=400

input_dir="Exports"
output_dir="Exports/Videos"
mkdir -p $output_dir

for folder in $input_dir/*/; do
	# Get the name of the current folder
	folder_name="$(basename "$folder")"
	if [ "$folder_name" != "Exports" ] && [ "$folder_name" != "Videos" ]
	then
	# Create the 2 frame video with 1:1 aspect ratio and 2 fps
	ffmpeg -y -framerate 1 -pattern_type glob -i "$folder/*.png" -c:v libx264 -r 3 -pix_fmt yuv420p "$output_dir/${folder_name}.mp4"
	
	fi
done

terminal-notifier -message "All videos exported." -title "2/2"