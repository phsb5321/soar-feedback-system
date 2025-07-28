# Global Audio Interceptor Implementation

## Overview

The Global Audio Interceptor ensures that any user interaction anywhere in the SOAR feedback system immediately stops any currently playing help audio. This implementation provides a seamless user experience where audio never interferes with user actions.

## Implementation Details

### Core Components

#### 1. `useGlobalAudioInterceptor` Hook (`src/hooks/useGlobalAudioInterceptor.ts`)

A React hook that provides global event interception for stopping audio playback.

**Features:**
- Listens for user interactions globally across the entire application
- Only activates when audio is currently playing (efficient)
- Uses event capture phase for early interception
- Configurable event types and behavior
- Proper cleanup and memory management
- TypeScript interfaces for type safety

**Default Events Monitored:**
- `click` - Mouse clicks anywhere on the page
- `keydown` - Keyboard interactions (accessibility)
- `touchstart` - Touch interactions (mobile support)

**Configuration Options:**
```typescript
interface UseGlobalAudioInterceptorOptions {
  events?: string[];           // Events to listen for
  useCapture?: boolean;        // Use capture phase (default: true)
  stopDelay?: number;          // Delay before stopping (default: 0)
  preventDefault?: boolean;    // Prevent event propagation (default: false)
}
```

#### 2. `GlobalAudioInterceptor` Component (`src/components/providers/GlobalAudioInterceptor.tsx`)

A provider component that implements the global interceptor using the hook.

**Features:**
- Invisible component (returns `null`)
- Uses the `useGlobalAudioInterceptor` hook with optimal defaults
- Client-side only (`"use client"`)
- Designed for root-level integration

#### 3. Root Layout Integration (`src/app/layout.tsx`)

The interceptor is integrated at the root level to ensure global coverage.

**Placement:**
- Positioned before `{children}` for proper event capture
- Runs on every page across the entire application
- No visual impact on the UI

## How It Works

### Event Flow

1. **User Interaction**: User clicks, types, or touches anywhere on the page
2. **Event Capture**: The global event listener captures the event early
3. **Audio Check**: Hook checks if audio is currently playing
4. **Audio Stop**: If audio is playing, it's immediately stopped
5. **Event Continuation**: Normal event handling continues uninterrupted

### Integration with Audio Store

The interceptor integrates seamlessly with the existing Zustand audio store:

```typescript
const { isPlaying, stopAudio } = useAudioStore();
```

- `isPlaying`: Determines if audio is currently active
- `stopAudio`: Immediately stops current audio and clears state

### Performance Optimizations

- **Conditional Activation**: Only processes events when audio is playing
- **Event Capture**: Uses capture phase to intercept events early
- **Memory Management**: Proper cleanup of event listeners and timeouts
- **Non-Blocking**: Doesn't interfere with normal application behavior

## Testing

### Automated Tests

Run the test script to verify implementation:

```bash
node scripts/test-global-audio-interceptor.js
```

**Test Coverage:**
- ✅ Hook existence and structure
- ✅ Component integration
- ✅ Root layout integration
- ✅ Audio store compatibility
- ✅ Implementation quality
- ✅ TypeScript integration

### Manual Testing

1. **Desktop Testing:**
   - Start help audio on any page
   - Click anywhere while audio is playing
   - Verify audio stops immediately

2. **Keyboard Testing:**
   - Start help audio
   - Press any key (Tab, Enter, Space, etc.)
   - Verify audio stops immediately

3. **Mobile Testing:**
   - Start help audio on mobile device
   - Touch anywhere on the screen
   - Verify audio stops immediately

4. **Accessibility Testing:**
   - Use screen reader with help audio
   - Navigate with keyboard
   - Verify audio stops don't interfere with accessibility tools

## Configuration

The implementation uses sensible defaults but can be customized if needed:

```typescript
// In GlobalAudioInterceptor.tsx
useGlobalAudioInterceptor({
  events: ["click", "keydown", "touchstart"], // Events to monitor
  useCapture: true,                           // Early event capture
  stopDelay: 0,                               // Immediate stopping
  preventDefault: false,                      // Don't block events
});
```

## Benefits

### User Experience
- **Immediate Response**: Audio stops instantly on any interaction
- **No Interference**: Normal app functionality remains unaffected
- **Universal Coverage**: Works across all pages and components
- **Accessibility**: Supports keyboard and screen reader users

### Technical Benefits
- **Performance**: Only active when needed
- **Memory Safe**: Proper cleanup prevents memory leaks
- **Type Safe**: Full TypeScript support
- **Maintainable**: Clean separation of concerns
- **Extensible**: Easy to modify or extend behavior

## Related Files

- `src/stores/audioStore.ts` - Audio state management
- `src/hooks/useAdvancedAudio.ts` - Audio playback hook
- `src/components/atoms/HelpButton/HelpButton.tsx` - Help button component
- `scripts/test-global-audio-interceptor.js` - Automated tests

## Migration Notes

This implementation replaces the previous manual audio silencing features:
- Removed global `toggleAudio` and `setEnabled` functions
- Removed audio queue clearing features
- Simplified to focus on user-triggered audio stopping only

## Future Enhancements

Potential improvements that could be added:
- Audio fade-out instead of immediate stopping
- Event-specific handling (different behavior for different events)
- Audio interruption analytics
- Configurable audio stopping policies per page

## Troubleshooting

### Audio Doesn't Stop
- Check if `GlobalAudioInterceptor` is properly imported in layout
- Verify audio store `stopAudio` method is working
- Check browser console for error messages

### Events Not Captured
- Ensure `useCapture: true` is set
- Check if other event handlers are stopping propagation
- Verify component is rendered before other event handlers

### Performance Issues
- Monitor if too many events are being processed
- Consider adding debouncing if needed
- Check for memory leaks with event listeners
