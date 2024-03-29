#!/bin/bash

# Set input directory as current directory
input_dir="."

# Set output directory as a new folder within the current directory called "exports"
output_dir="./exports"

# Create the "exports" directory if it doesn't exist
mkdir -p "$output_dir"

# Loop through each mp4 file in the input directory
for file in "$input_dir"/*.mp4; do
  # Get the filename without the extension and replace spaces with underscores
  filename=$(basename -- "${file// /_}")
  filename="${filename%.*}"
  
  # Set the output filename
  output_file="$output_dir/$filename.webp"
  
  # Reverse the mp4 file using FFmpeg
  reversed_file="$output_dir/reversed_$filename.mp4"
  ffmpeg -i "$file" -vf reverse -af areverse "$reversed_file"
  
  # Convert the reversed mp4 to a webp animation using FFmpeg
  ffmpeg -i "$reversed_file" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -loop 0 -lossless 1 "$output_file"
  
  # Remove the reversed mp4 file
  rm "$reversed_file"
done
