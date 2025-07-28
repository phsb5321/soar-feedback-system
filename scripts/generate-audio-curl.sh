#!/usr/bin/env zsh
# Premium Brazilian Portuguese TTS Generation Script
# Uses curl to call OpenAI TTS API directly with optimal settings

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Check if API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${RED}❌ Error: OPENAI_API_KEY environment variable is not set${NC}"
    echo "Please set your OpenAI API key in .env.local file"
    exit 1
fi

# Create audio directory
AUDIO_DIR="public/audio"
mkdir -p "$AUDIO_DIR"

echo -e "${BLUE}🚀 Starting premium Brazilian Portuguese audio generation${NC}"
echo -e "${PURPLE}🎯 Using OpenAI TTS-1-HD with curl for maximum quality${NC}"
echo ""

# Function to generate audio file
generate_audio() {
    local key="$1"
    local text="$2"
    local voice="$3"
    local speed="$4"
    local description="$5"
    
    echo -e "${YELLOW}🎵 Generating: $key${NC}"
    echo -e "   Voice: $voice | Speed: $speed | $description"
    
    # Delete existing file
    if [ -f "$AUDIO_DIR/$key.mp3" ]; then
        rm "$AUDIO_DIR/$key.mp3"
        echo -e "   🗑️ Deleted existing $key.mp3"
    fi
    
    # Generate new audio file using curl
    local response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Bearer $OPENAI_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"model\": \"tts-1-hd\",
            \"input\": \"$text\",
            \"voice\": \"$voice\",
            \"speed\": $speed,
            \"response_format\": \"mp3\"
        }" \
        --output "$AUDIO_DIR/$key.mp3" \
    "https://api.openai.com/v1/audio/speech")
    
    local http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        local file_size=$(ls -lah "$AUDIO_DIR/$key.mp3" | awk '{print $5}')
        echo -e "   ${GREEN}✅ Generated: $key.mp3 ($file_size)${NC}"
        return 0
    else
        echo -e "   ${RED}❌ Failed to generate $key.mp3 (HTTP: $http_code)${NC}"
        return 1
    fi
}

# Premium Brazilian Portuguese messages with optimal settings
declare -A MESSAGES
declare -A VOICES
declare -A SPEEDS
declare -A DESCRIPTIONS

# Welcome message
MESSAGES["welcome"]="Bem-vindos ao Sistema de Avaliação SOAR! Este sistema permite que vocês compartilhem suas experiências através de gravação de voz. É simples e fácil de usar."
VOICES["welcome"]="nova"
SPEEDS["welcome"]="0.9"
DESCRIPTIONS["welcome"]="Warm welcome message"

# Recording instructions
MESSAGES["recordingInstructions"]="Olá pessoal! Para começar, cliquem no botão abaixo para gravar o feedback de vocês. É só falar naturalmente."
VOICES["recordingInstructions"]="nova"
SPEEDS["recordingInstructions"]="0.95"
DESCRIPTIONS["recordingInstructions"]="Friendly recording instructions"

# Start recording
MESSAGES["startRecording"]="Perfeito! Agora podem falar tudo o que desejam compartilhar conosco. Fiquem à vontade para expressarem suas opiniões."
VOICES["startRecording"]="shimmer"
SPEEDS["startRecording"]="0.9"
DESCRIPTIONS["startRecording"]="Encouraging start recording"

# Stop recording
MESSAGES["stopRecording"]="Ótimo! A gravação foi finalizada com sucesso. Por favor, aguardem alguns momentos enquanto processamos e transcrevemos o áudio de vocês."
VOICES["stopRecording"]="alloy"
SPEEDS["stopRecording"]="1.0"
DESCRIPTIONS["stopRecording"]="Professional recording completion"

# CSAT welcome
MESSAGES["csatWelcome"]="Agora vamos avaliar a experiência de vocês! Usando nosso sistema de feedback, escolham uma nota de zero a dez. Zero sendo muito ruim e dez sendo excelente."
VOICES["csatWelcome"]="nova"
SPEEDS["csatWelcome"]="0.85"
DESCRIPTIONS["csatWelcome"]="Inviting evaluation request"

# Submit success
MESSAGES["submitSuccess"]="Muito obrigado mesmo! A avaliação de vocês foi enviada com sucesso. Sua opinião é muito importante para nós."
VOICES["submitSuccess"]="shimmer"
SPEEDS["submitSuccess"]="0.9"
DESCRIPTIONS["submitSuccess"]="Grateful success message"

# Submit error
MESSAGES["submitError"]="Ops! Infelizmente ocorreu um erro ao enviar o feedback. Por favor, tentem novamente em alguns instantes."
VOICES["submitError"]="alloy"
SPEEDS["submitError"]="0.95"
DESCRIPTIONS["submitError"]="Clear error message"

# Success message
MESSAGES["successMessage"]="Parabéns e muito obrigado! O feedback de vocês foi enviado com sucesso. Agradecemos muito pela participação e contribuição valiosa!"
VOICES["successMessage"]="shimmer"
SPEEDS["successMessage"]="0.85"
DESCRIPTIONS["successMessage"]="Celebratory final message"

# Generate all audio files
successful=0
total=0

for key in welcome recordingInstructions startRecording stopRecording csatWelcome submitSuccess submitError successMessage; do
    total=$((total + 1))
    
    if generate_audio "$key" "${MESSAGES[$key]}" "${VOICES[$key]}" "${SPEEDS[$key]}" "${DESCRIPTIONS[$key]}"; then
        successful=$((successful + 1))
    fi
    
    echo -e "${BLUE}📊 Progress: $successful/$total files generated${NC}"
    echo ""
    
    # Rate limiting delay
    if [ $total -lt 8 ]; then
        sleep 1
    fi
done

echo -e "${GREEN}🎉 Premium audio generation complete!${NC}"
echo -e "${PURPLE}🔊 All files generated with optimal Brazilian Portuguese pronunciation${NC}"
echo -e "${BLUE}📈 Summary: $successful/$total files generated successfully${NC}"

if [ $successful -eq $total ]; then
    echo -e "${GREEN}✅ All audio files generated successfully!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some files failed to generate. Check the logs above.${NC}"
    exit 1
fi
