# SOAR Feedback System - Audio Texts for TTS Generation

## Brazilian Portuguese Audio Messages

### 1. welcome.mp3

**Voice**: nova  
**Speed**: 0.9  
**Category**: Welcome  
**Text**:

```
Bem-vindos ao Sistema de Avaliação SOAR! Este sistema permite que vocês compartilhem suas experiências através de gravação de voz. É simples e fácil de usar.
```

### 2. recordingInstructions.mp3

**Voice**: nova  
**Speed**: 0.95  
**Category**: Instruction  
**Text**:

```
Olá pessoal! Para começar, cliquem no botão abaixo para gravar o feedback de vocês. É só falar naturalmente.
```

### 3. startRecording.mp3

**Voice**: shimmer  
**Speed**: 0.9  
**Category**: Action  
**Text**:

```
Perfeito! Agora podem falar tudo o que desejam compartilhar conosco. Fiquem à vontade para expressarem suas opiniões.
```

### 4. stopRecording.mp3

**Voice**: alloy  
**Speed**: 1.0  
**Category**: Action  
**Text**:

```
Ótimo! A gravação foi finalizada com sucesso. Por favor, aguardem alguns momentos enquanto processamos e transcrevemos o áudio de vocês.
```

### 5. csatWelcome.mp3

**Voice**: nova  
**Speed**: 0.85  
**Category**: Feedback  
**Text**:

```
Agora vamos avaliar a experiência de vocês! Usando nosso sistema de feedback, escolham uma nota de zero a dez. Zero sendo muito ruim e dez sendo excelente.
```

### 6. submitSuccess.mp3

**Voice**: shimmer  
**Speed**: 0.9  
**Category**: Success  
**Text**:

```
Muito obrigado mesmo! A avaliação de vocês foi enviada com sucesso. Sua opinião é muito importante para nós.
```

### 7. submitError.mp3

**Voice**: alloy  
**Speed**: 0.95  
**Category**: Error  
**Text**:

```
Ops! Infelizmente ocorreu um erro ao enviar o feedback. Por favor, tentem novamente em alguns instantes.
```

### 8. successMessage.mp3

**Voice**: shimmer  
**Speed**: 0.85  
**Category**: Success  
**Text**:

```
Parabéns e muito obrigado! O feedback de vocês foi enviado com sucesso. Agradecemos muito pela participação e contribuição valiosa!
```

---

## OpenAI TTS API Settings for High Quality

### Model: `tts-1-hd`

Use the high-definition model for best quality.

### Available Voices:

- **alloy**: Professional, clear voice (good for instructions and errors)
- **echo**: Deep, authoritative voice
- **fable**: Expressive, storytelling voice
- **nova**: Warm, friendly voice (good for welcomes and success)
- **onyx**: Confident, strong voice
- **shimmer**: Enthusiastic, energetic voice (good for celebrations)

### Speed Settings:

- Range: 0.25 to 4.0
- Recommended for Portuguese: 0.85 to 1.0
- Slower speeds (0.85-0.9) for clarity
- Normal speed (1.0) for professional messages

### Response Format: `mp3`

For best compatibility and quality.

---

## Simple Generation Commands

### Using curl (replace YOUR_API_KEY):

```bash
# 1. welcome.mp3
curl -X POST "https://api.openai.com/v1/audio/speech" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1-hd",
    "input": "Bem-vindos ao Sistema de Avaliação SOAR! Este sistema permite que vocês compartilhem suas experiências através de gravação de voz. É simples e fácil de usar.",
    "voice": "nova",
    "speed": 0.9,
    "response_format": "mp3"
  }' \
  --output welcome.mp3

# 2. recordingInstructions.mp3
curl -X POST "https://api.openai.com/v1/audio/speech" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1-hd",
    "input": "Olá pessoal! Para começar, cliquem no botão abaixo para gravar o feedback de vocês. É só falar naturalmente.",
    "voice": "nova",
    "speed": 0.95,
    "response_format": "mp3"
  }' \
  --output recordingInstructions.mp3

# 3. startRecording.mp3
curl -X POST "https://api.openai.com/v1/audio/speech" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1-hd",
    "input": "Perfeito! Agora podem falar tudo o que desejam compartilhar conosco. Fiquem à vontade para expressarem suas opiniões.",
    "voice": "shimmer",
    "speed": 0.9,
    "response_format": "mp3"
  }' \
  --output startRecording.mp3

# 4. stopRecording.mp3
curl -X POST "https://api.openai.com/v1/audio/speech" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1-hd",
    "input": "Ótimo! A gravação foi finalizada com sucesso. Por favor, aguardem alguns momentos enquanto processamos e transcrevemos o áudio de vocês.",
    "voice": "alloy",
    "speed": 1.0,
    "response_format": "mp3"
  }' \
  --output stopRecording.mp3

# 5. csatWelcome.mp3
curl -X POST "https://api.openai.com/v1/audio/speech" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1-hd",
    "input": "Agora vamos avaliar a experiência de vocês! Usando nosso sistema de feedback, escolham uma nota de zero a dez. Zero sendo muito ruim e dez sendo excelente.",
    "voice": "nova",
    "speed": 0.85,
    "response_format": "mp3"
  }' \
  --output csatWelcome.mp3

# 6. submitSuccess.mp3
curl -X POST "https://api.openai.com/v1/audio/speech" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1-hd",
    "input": "Muito obrigado mesmo! A avaliação de vocês foi enviada com sucesso. Sua opinião é muito importante para nós.",
    "voice": "shimmer",
    "speed": 0.9,
    "response_format": "mp3"
  }' \
  --output submitSuccess.mp3

# 7. submitError.mp3
curl -X POST "https://api.openai.com/v1/audio/speech" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1-hd",
    "input": "Ops! Infelizmente ocorreu um erro ao enviar o feedback. Por favor, tentem novamente em alguns instantes.",
    "voice": "alloy",
    "speed": 0.95,
    "response_format": "mp3"
  }' \
  --output submitError.mp3

# 8. successMessage.mp3
curl -X POST "https://api.openai.com/v1/audio/speech" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1-hd",
    "input": "Parabéns e muito obrigado! O feedback de vocês foi enviado com sucesso. Agradecemos muito pela participação e contribuição valiosa!",
    "voice": "shimmer",
    "speed": 0.85,
    "response_format": "mp3"
  }' \
  --output successMessage.mp3
```

---

## Text-Only Version (for copy-paste)

1. **welcome**: Bem-vindos ao Sistema de Avaliação SOAR! Este sistema permite que vocês compartilhem suas experiências através de gravação de voz. É simples e fácil de usar.

2. **recordingInstructions**: Olá pessoal! Para começar, cliquem no botão abaixo para gravar o feedback de vocês. É só falar naturalmente.

3. **startRecording**: Perfeito! Agora podem falar tudo o que desejam compartilhar conosco. Fiquem à vontade para expressarem suas opiniões.

4. **stopRecording**: Ótimo! A gravação foi finalizada com sucesso. Por favor, aguardem alguns momentos enquanto processamos e transcrevemos o áudio de vocês.

5. **csatWelcome**: Agora vamos avaliar a experiência de vocês! Usando nosso sistema de feedback, escolham uma nota de zero a dez. Zero sendo muito ruim e dez sendo excelente.

6. **submitSuccess**: Muito obrigado mesmo! A avaliação de vocês foi enviada com sucesso. Sua opinião é muito importante para nós.

7. **submitError**: Ops! Infelizmente ocorreu um erro ao enviar o feedback. Por favor, tentem novamente em alguns instantes.

8. **successMessage**: Parabéns e muito obrigado! O feedback de vocês foi enviado com sucesso. Agradecemos muito pela participação e contribuição valiosa!

---

## Quick Generation Script

Create a file `generate-all.sh` with your API key:

```bash
#!/bin/bash
API_KEY="YOUR_OPENAI_API_KEY_HERE"

# Create audio directory
mkdir -p public/audio

# Generate all files
curl -X POST "https://api.openai.com/v1/audio/speech" -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" -d '{"model": "tts-1-hd", "input": "Bem-vindos ao Sistema de Avaliação SOAR! Este sistema permite que vocês compartilhem suas experiências através de gravação de voz. É simples e fácil de usar.", "voice": "nova", "speed": 0.9, "response_format": "mp3"}' --output public/audio/welcome.mp3

curl -X POST "https://api.openai.com/v1/audio/speech" -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" -d '{"model": "tts-1-hd", "input": "Olá pessoal! Para começar, cliquem no botão abaixo para gravar o feedback de vocês. É só falar naturalmente.", "voice": "nova", "speed": 0.95, "response_format": "mp3"}' --output public/audio/recordingInstructions.mp3

curl -X POST "https://api.openai.com/v1/audio/speech" -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" -d '{"model": "tts-1-hd", "input": "Perfeito! Agora podem falar tudo o que desejam compartilhar conosco. Fiquem à vontade para expressarem suas opiniões.", "voice": "shimmer", "speed": 0.9, "response_format": "mp3"}' --output public/audio/startRecording.mp3

curl -X POST "https://api.openai.com/v1/audio/speech" -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" -d '{"model": "tts-1-hd", "input": "Ótimo! A gravação foi finalizada com sucesso. Por favor, aguardem alguns momentos enquanto processamos e transcrevemos o áudio de vocês.", "voice": "alloy", "speed": 1.0, "response_format": "mp3"}' --output public/audio/stopRecording.mp3

curl -X POST "https://api.openai.com/v1/audio/speech" -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" -d '{"model": "tts-1-hd", "input": "Agora vamos avaliar a experiência de vocês! Usando nosso sistema de feedback, escolham uma nota de zero a dez. Zero sendo muito ruim e dez sendo excelente.", "voice": "nova", "speed": 0.85, "response_format": "mp3"}' --output public/audio/csatWelcome.mp3

curl -X POST "https://api.openai.com/v1/audio/speech" -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" -d '{"model": "tts-1-hd", "input": "Muito obrigado mesmo! A avaliação de vocês foi enviada com sucesso. Sua opinião é muito importante para nós.", "voice": "shimmer", "speed": 0.9, "response_format": "mp3"}' --output public/audio/submitSuccess.mp3

curl -X POST "https://api.openai.com/v1/audio/speech" -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" -d '{"model": "tts-1-hd", "input": "Ops! Infelizmente ocorreu um erro ao enviar o feedback. Por favor, tentem novamente em alguns instantes.", "voice": "alloy", "speed": 0.95, "response_format": "mp3"}' --output public/audio/submitError.mp3

curl -X POST "https://api.openai.com/v1/audio/speech" -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" -d '{"model": "tts-1-hd", "input": "Parabéns e muito obrigado! O feedback de vocês foi enviado com sucesso. Agradecemos muito pela participação e contribuição valiosa!", "voice": "shimmer", "speed": 0.85, "response_format": "mp3"}' --output public/audio/successMessage.mp3

echo "All audio files generated!"
```

Then run: `chmod +x generate-all.sh && ./generate-all.sh`

---

## Audio Polishing with ffmpeg

After generating the audio files, you can polish them for professional quality:

### Professional Audio Processing

The system includes a professional audio polish script that applies:

- **Silence Removal**: Removes silence from beginning and end
- **Audio Normalization**: Applies loudness standards (-16 LUFS)
- **Frequency Filtering**: Optimizes frequency range (80Hz-15kHz)
- **High-Quality Encoding**: 320kbps MP3 with stereo optimization
- **Backup Creation**: Preserves original files

### Usage:

```bash
# Polish existing audio files
npm run audio:polish

# Or run the script directly
./scripts/polish-audio.sh

# Complete workflow (generate + polish + test)
npm run audio:workflow
```

### Before and After Polish:

**Original files** (hand-made): 685KB - 1,182KB  
**Polished files**: 99KB - 233KB  
**Duration reduction**: ~20-30% (silence removal)  
**Quality**: Professional broadcast standard
