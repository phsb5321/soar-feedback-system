#!/usr/bin/env zsh
# Complete Audio Workflow Script for SOAR Feedback System
# Generates and polishes audio files in one go

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎵 Complete Audio Workflow for SOAR Feedback System${NC}"
echo -e "${YELLOW}� This script will generate and polish all audio files${NC}"
echo ""

# Step 1: Generate audio files
echo -e "${BLUE}Step 1: Generating premium audio files...${NC}"
npm run audio:generate

if [ $? -ne 0 ]; then
    echo -e "❌ Audio generation failed. Exiting."
    exit 1
fi

echo ""

# Step 2: Polish audio files
echo -e "${BLUE}Step 2: Polishing audio files...${NC}"
npm run audio:polish

if [ $? -ne 0 ]; then
    echo -e "❌ Audio polishing failed. Exiting."
    exit 1
fi

echo ""

# Step 3: Test audio files
echo -e "${BLUE}Step 3: Testing audio files...${NC}"
npm run audio:test

if [ $? -ne 0 ]; then
    echo -e "❌ Audio testing failed. Check the files."
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Complete audio workflow finished successfully!${NC}"
echo -e "${BLUE}📁 All audio files are ready in public/audio/${NC}"
echo -e "${YELLOW}💾 Original files backed up to public/audio/backup/${NC}"
        -y "$temp_file" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        # Replace original with processed version
        mv "$temp_file" "$input_file"
        
        local size_after=$(ls -lh "$input_file" | awk '{print $5}')
        local duration_after=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$input_file")
        
        echo -e "   ${GREEN}✅ Processed: ${size_after}, Duration: $(printf "%.1f" $duration_after)s${NC}"
        echo -e "   🎯 Applied: silence removal, normalization, frequency filtering, 320kbps encoding"
        echo ""
        return 0
    else
        echo -e "   ${RED}❌ Failed to process $filename.mp3${NC}"
        rm -f "$temp_file"
        echo ""
        return 1
    fi
}

# Process all audio files
audio_files=("$AUDIO_DIR"/*.mp3)
total_files=${#audio_files[@]}
processed=0
failed=0

echo -e "${BLUE}📁 Found $total_files audio files to process${NC}"
echo ""

for file in "${audio_files[@]}"; do
    if [[ -f "$file" ]] && [[ "$file" != *"/backup/"* ]]; then
        if polish_audio "$file"; then
            ((processed++))
        else
            ((failed++))
        fi
    fi
done

echo -e "${BLUE}📈 Processing Summary:${NC}"
echo -e "   Total files: $total_files"
echo -e "   Successfully processed: ${GREEN}$processed${NC}"
echo -e "   Failed: ${RED}$failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 All audio files have been professionally polished!${NC}"
    echo -e "${PURPLE}🎯 Applied processing:${NC}"
    echo -e "   • Silence removal (beginning and end)"
    echo -e "   • Audio normalization (loudness standards)"
    echo -e "   • Frequency filtering (80Hz-15kHz)"
    echo -e "   • High-quality encoding (320kbps MP3)"
    echo -e "   • Stereo optimization"
    echo ""
    echo -e "${BLUE}💾 Original files backed up to: $BACKUP_DIR${NC}"
else
    echo -e "${YELLOW}⚠️  Some files failed to process. Check the logs above.${NC}"
fi
