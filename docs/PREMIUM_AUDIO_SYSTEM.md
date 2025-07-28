# Premium Brazilian Portuguese Audio System 🎵

## Overview

The SOAR Feedback System now features a **premium Brazilian Portuguese audio system** with high-quality TTS (Text-to-Speech) generated using OpenAI's TTS-1-HD model. This system provides natural, emotionally appropriate audio messages optimized specifically for Portuguese pronunciation and intonation.

## ✨ Features

### Premium Audio Quality
- **OpenAI TTS-1-HD**: Highest quality model available
- **Optimized Voice Selection**: Different voices for different message types
- **Natural Speed Control**: Customized speeds for Brazilian Portuguese clarity
- **Large File Sizes**: 130-221KB per file indicating premium quality
- **MP3 Format**: Best compatibility and quality

### Intelligent Voice Mapping
| Message Type     | Voice     | Speed    | Purpose                      |
| ---------------- | --------- | -------- | ---------------------------- |
| Welcome messages | `nova`    | 0.9      | Warm and welcoming           |
| Instructions     | `nova`    | 0.95     | Friendly and clear           |
| Action prompts   | `shimmer` | 0.9      | Encouraging and enthusiastic |
| Status updates   | `alloy`   | 1.0      | Professional and clear       |
| Success messages | `shimmer` | 0.85-0.9 | Celebratory and positive     |
| Error messages   | `alloy`   | 0.95     | Clear and helpful            |

### Internationalization (i18n) System
- **Structured Configuration**: Organized by language and message type
- **Extensible**: Easy to add new languages
- **Type-Safe**: Full TypeScript support
- **Categorized Messages**: Organized by purpose (welcome, instruction, action, etc.)

## 🎯 Audio Messages

### Current Brazilian Portuguese Messages

1. **welcome** (203KB, nova, speed: 0.9)
   - "Bem-vindos ao Sistema de Avaliação SOAR! Este sistema permite que vocês compartilhem suas experiências através de gravação de voz. É simples e fácil de usar."

2. **recordingInstructions** (135KB, nova, speed: 0.95)
   - "Olá pessoal! Para começar, cliquem no botão abaixo para gravar o feedback de vocês. É só falar naturalmente."

3. **startRecording** (161KB, shimmer, speed: 0.9)
   - "Perfeito! Agora podem falar tudo o que desejam compartilhar conosco. Fiquem à vontade para expressarem suas opiniões."

4. **stopRecording** (167KB, alloy, speed: 1.0)
   - "Ótimo! A gravação foi finalizada com sucesso. Por favor, aguardem alguns momentos enquanto processamos e transcrevemos o áudio de vocês."

5. **csatWelcome** (221KB, nova, speed: 0.85)
   - "Agora vamos avaliar a experiência de vocês! Usando nosso sistema de feedback, escolham uma nota de zero a dez. Zero sendo muito ruim e dez sendo excelente."

6. **submitSuccess** (149KB, shimmer, speed: 0.9)
   - "Muito obrigado mesmo! A avaliação de vocês foi enviada com sucesso. Sua opinião é muito importante para nós."

7. **submitError** (130KB, alloy, speed: 0.95)
   - "Ops! Infelizmente ocorreu um erro ao enviar o feedback. Por favor, tentem novamente em alguns instantes."

8. **successMessage** (194KB, shimmer, speed: 0.85)
   - "Parabéns e muito obrigado! O feedback de vocês foi enviado com sucesso. Agradecemos muito pela participação e contribuição valiosa!"

## 🛠️ Generation Scripts

### TypeScript Generation (Recommended)
```bash
npm run audio:generate
```
- Uses TypeScript for reliability
- Full error handling and progress tracking
- Rate limiting to ensure quality
- Automatic file cleanup and regeneration

### Curl-based Generation (Alternative)
```bash
npm run audio:generate:curl
```
- Direct API calls using curl
- Useful for debugging API issues
- Shell script with colored output

### Testing Audio Files
```bash
npm run audio:test
```
- Verifies all audio files exist
- Shows file sizes and configurations
- Validates the complete audio system

## 📁 File Structure

```
src/
├── lib/
│   ├── i18n-audio.ts          # Internationalization system
│   └── audioMessages.ts       # Backward compatibility layer
├── services/
│   └── OpenAITTSService.ts    # Updated to use i18n system
└── app/api/generate-audio/
    └── route.ts               # API endpoint for generation

scripts/
├── generate-premium-audio.ts  # TypeScript generation script
├── generate-audio-curl.sh     # Curl-based generation script
└── test-audio.ts             # Audio verification script

public/audio/                  # Generated audio files
├── welcome.mp3
├── recordingInstructions.mp3
├── startRecording.mp3
├── stopRecording.mp3
├── csatWelcome.mp3
├── submitSuccess.mp3
├── submitError.mp3
└── successMessage.mp3
```

## 🔧 API Usage

### Generate Audio via API
```bash
curl -X POST "http://localhost:3000/api/generate-audio" \
  -H "Content-Type: application/json" \
  -d '{"forceRegenerate": true}'
```

### Check Audio Status
```bash
curl -X GET "http://localhost:3000/api/generate-audio"
```

## 💻 Development

### Adding New Messages
1. Update `src/lib/i18n-audio.ts`
2. Add the new message to the appropriate language configuration
3. Regenerate audio files: `npm run audio:generate`
4. Test: `npm run audio:test`

### Adding New Languages
1. Create new language configuration in `src/lib/i18n-audio.ts`
2. Update `CURRENT_LANGUAGE` constant
3. Regenerate audio files
4. Update any language-specific voice mappings

### Customizing Voice Settings
Edit the language configuration in `src/lib/i18n-audio.ts`:
```typescript
{
  text: "Your message text",
  voice: "nova", // alloy, echo, fable, onyx, nova, shimmer
  speed: 0.9,    // 0.25 to 4.0
  description: "Message purpose",
  category: "welcome" // welcome, instruction, action, feedback, success, error
}
```

## 🎵 Audio Quality Optimization

### Best Practices Implemented
1. **TTS-1-HD Model**: Highest quality available
2. **Brazilian Portuguese Optimization**: Text crafted for natural pronunciation
3. **Emotional Voice Mapping**: Different voices for different emotions
4. **Speed Optimization**: Slower speeds for clarity in Portuguese
5. **Professional File Sizes**: 130-221KB indicating premium quality

### Quality Indicators
- ✅ File sizes 130KB+ (premium quality)
- ✅ Natural Portuguese pronunciation
- ✅ Appropriate emotional intonation
- ✅ Clear speech at optimized speeds
- ✅ Professional voice selection

## 🚀 Deployment

The audio files are automatically served from `/public/audio/` and are accessible at:
- `http://your-domain.com/audio/welcome.mp3`
- `http://your-domain.com/audio/recordingInstructions.mp3`
- etc.

Ensure the `public/audio/` directory is included in your deployment and the files are properly cached for performance.

## 🔍 Troubleshooting

### No Audio Files
```bash
npm run audio:generate
```

### Poor Audio Quality
- Verify using TTS-1-HD model (not TTS-1)
- Check file sizes are 100KB+
- Review voice selection for message type

### API Errors
- Verify `OPENAI_API_KEY` in `.env.local`
- Check API quota and billing
- Use curl script for direct API testing

### File Not Found Errors
```bash
npm run audio:test  # Check which files are missing
npm run audio:generate  # Regenerate all files
```

## 📈 Performance

- **Generation Time**: ~40-50 seconds for all 8 files
- **File Sizes**: 130-221KB each (premium quality)
- **API Calls**: Rate-limited to prevent quality degradation
- **Caching**: Files cached indefinitely until regeneration

---

*This premium audio system provides the highest quality Brazilian Portuguese TTS available, with careful optimization for natural speech patterns and emotional appropriateness.*
