# Advanced Audio System with Zustand - Implementation Guide

## 🎯 Overview

The SOAR feedback system now uses an advanced audio management system built with Zustand that eliminates audio loops and provides user control over audio playback. The system features a priority-based queue, centralized state management, and loop prevention mechanisms.

## 🏗️ Architecture

### Core Components

1. **Audio Store** (`src/stores/audioStore.ts`)
   - Zustand-based centralized state management
   - Priority-based audio queue system
   - Audio playback control and loop prevention

2. **Audio Context** (`src/contexts/AudioContext.tsx`)
   - Page-level audio management
   - Component isolation to prevent loops
   - Auto-play sequences with delay management

3. **Audio Toggle** (`src/components/atoms/AudioToggle/AudioToggle.tsx`)
   - Floating UI control for users
   - Visual indicators for queue status
   - One-click audio system toggle

4. **Advanced Audio Hook** (`src/hooks/useAdvancedAudio.ts`)
   - High-level interface to the store
   - Type-safe audio operations
   - Component-friendly API

## 🔧 Key Features

### 1. Audio Queue with Priority System
```typescript
// High priority (8) - Important user feedback
playPageAudio("submitSuccess", 8);

// Medium priority (5) - Standard interactions  
playComponentAudio("startRecording", 5);

// Low priority (3) - Background notifications
queueAudio("backgroundNotification", { priority: 3 });
```

### 2. Loop Prevention
- **Page-level tracking**: Prevents same audio from playing multiple times per page
- **Component isolation**: Each component tracks its own audio state
- **Queue deduplication**: Prevents duplicate entries in the queue

### 3. User Control
- **Audio toggle**: Users can disable/enable audio system
- **Visual feedback**: Queue status and playback indicators
- **Graceful degradation**: System works without audio when disabled

## 📁 File Structure

```
src/
├── stores/
│   └── audioStore.ts              # Zustand store for audio state
├── hooks/
│   ├── useAdvancedAudio.ts        # Main audio hook
│   └── useCachedTTS.ts            # Legacy (kept for compatibility)
├── contexts/
│   └── AudioContext.tsx           # Page/component audio providers
├── components/
│   └── atoms/
│       └── AudioToggle/           # Floating audio control
└── app/
    ├── layout.tsx                 # Includes AudioToggle
    ├── page.tsx                   # Uses AudioProvider
    └── csat/page.tsx              # Uses AudioProvider
```

## 🎵 Audio Files

All audio files are professionally recorded MP3s located in `public/audio/`:

- `welcome.mp3` - Page welcome message
- `recordingInstructions.mp3` - Recording component instructions
- `startRecording.mp3` - Recording start feedback
- `stopRecording.mp3` - Recording stop feedback  
- `csatWelcome.mp3` - CSAT page welcome
- `submitSuccess.mp3` - Successful submission
- `submitError.mp3` - Error submission
- `successMessage.mp3` - General success

## 🚀 Usage Examples

### Page-Level Audio (Prevents Loops)
```tsx
// Wrap page content with AudioProvider
export default function MyPage() {
  return (
    <AudioProvider 
      pageId="unique-page-id"
      autoPlayAudios={[
        { messageKey: "welcome", delay: 1000, priority: 8 }
      ]}
    >
      <PageContent />
    </AudioProvider>
  );
}

// Use in page components
function PageContent() {
  const { playPageAudio } = useAudioContext();
  
  const handleSubmit = async () => {
    const success = await submitData();
    if (success) {
      playPageAudio("submitSuccess", 8);
    }
  };
}
```

### Component-Level Audio (Isolated)
```tsx
function MyComponent() {
  const { playComponentAudio } = useComponentAudio("my-component-id");
  
  useEffect(() => {
    // Only plays once per component instance
    playComponentAudio("componentWelcome", 6);
  }, []);
  
  const handleAction = () => {
    playComponentAudio("actionFeedback", 7);
  };
}
```

### Direct Audio Control
```tsx
function AudioControls() {
  const { 
    playAudio, 
    queueAudio, 
    isEnabled, 
    toggleAudio 
  } = useAdvancedAudio();
  
  const handlePlay = () => {
    playAudio("welcome", { priority: 8, force: true });
  };
  
  const handleQueue = () => {
    queueAudio("notification", { priority: 5 });
  };
}
```

## ⚙️ Configuration

### Audio Store Configuration
```typescript
interface AudioStore {
  // Enable/disable audio system
  isEnabled: boolean;
  
  // Current playback state
  isPlaying: boolean;
  currentAudio: HTMLAudioElement | null;
  
  // Queue management
  queue: AudioQueueItem[];
  playedAudios: Set<string>;
  
  // Priority levels (1-10, higher = more important)
  // 1-3: Low priority (background)
  // 4-6: Medium priority (interactions)
  // 7-8: High priority (important feedback)
  // 9-10: Critical priority (errors, success)
}
```

### Audio Toggle States
- **Enabled + Playing**: Blue with green pulse indicator
- **Enabled + Queue**: Blue with yellow queue counter
- **Enabled + Idle**: Blue with microphone icon
- **Disabled**: Gray with dimmed icon

## 🔍 Loop Prevention Mechanisms

### 1. Page-Level Prevention
```typescript
// Each page tracks played audios
const playedPageAudios = useRef(new Set<string>());

const playPageAudio = async (messageKey: AudioMessageKey) => {
  const audioKey = `${pageId}-${messageKey}`;
  if (playedPageAudios.current.has(audioKey)) {
    return false; // Already played on this page
  }
  // Play and mark as played
};
```

### 2. Component-Level Prevention  
```typescript
// Each component instance tracks its own audio
const playedAudios = useRef(new Set<string>());

const playComponentAudio = async (messageKey: AudioMessageKey) => {
  const audioKey = `${componentId}-${messageKey}`;
  if (playedAudios.current.has(audioKey)) {
    return false; // Already played by this component
  }
  // Play and mark as played
};
```

### 3. Queue Deduplication
```typescript
// Store prevents duplicate queue entries
queueAudio: (messageKey, options) => {
  const existingIndex = queue.findIndex(item => item.messageKey === messageKey);
  if (existingIndex !== -1) {
    return; // Already in queue
  }
  // Add to queue
}
```

## 🎛️ User Controls

### Audio Toggle Features
- **Hover to expand**: Shows current status and queue count
- **Click to toggle**: Enables/disables entire audio system
- **Visual indicators**: 
  - Green dot: Currently playing
  - Yellow badge: Items in queue (with count)
  - Gray state: Audio disabled

### Accessibility
- **Graceful degradation**: All functionality works without audio
- **Visual feedback**: Audio state is always visible
- **User control**: Complete control over audio experience

## 🚫 What's Eliminated

### Audio Loops Caused By:
- ❌ Multiple `useEffect` calls playing same audio
- ❌ Component re-renders triggering audio
- ❌ Page navigation replaying welcome messages
- ❌ Duplicate audio queue entries
- ❌ Uncontrolled auto-play sequences

### Old TTS System:
- ❌ Web Speech API fallbacks
- ❌ Synthetic voice generation
- ❌ Browser TTS dependencies
- ❌ Screen reader audio conflicts

## ✅ Benefits

1. **No Audio Loops**: Sophisticated prevention mechanisms
2. **User Control**: Complete audio system toggle
3. **Professional Quality**: Only high-quality MP3 files
4. **Performance**: Efficient queue and state management
5. **Accessibility**: Visual indicators and graceful degradation
6. **Developer Experience**: Clean APIs and type safety

## 🔧 Troubleshooting

### Common Issues

1. **Audio not playing**
   - Check if audio is enabled in toggle
   - Verify browser autoplay policies
   - Check console for blocked audio messages

2. **Duplicate audio**
   - Ensure proper use of AudioProvider
   - Check component isolation with unique IDs
   - Verify queue deduplication is working

3. **Missing audio toggle**
   - Verify AudioToggle is in layout.tsx
   - Check if component is properly imported

### Debug Commands
```bash
# Test audio system
node scripts/test-advanced-audio.js

# Check for old TTS references  
grep -r "useCachedTTS\|playCustomText" src/

# Verify audio files
ls -la public/audio/
```

## 🚀 Future Enhancements

- **Volume controls** in audio toggle
- **Audio preferences** persistence
- **Custom audio themes**
- **Real-time queue visualization**
- **Audio analytics and usage tracking**

---

**The advanced audio system ensures a professional, user-controlled, and loop-free audio experience for the SOAR feedback system.** 🎉
