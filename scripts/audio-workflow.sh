#!/usr/bin/env zsh
# Complete Audio Workflow Script for SOAR Feedback System
# Generates and polishes audio files in one go

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎵 Complete Audio Workflow for SOAR Feedback System${NC}"
echo -e "${YELLOW}🔄 This script will generate and polish all audio files${NC}"
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
