import { useState, useRef, useCallback } from 'react';
import { AudioFeedbackService } from '@/services/AudioFeedbackService';

/**
 * Custom hook for audio feedback functionality
 * Follows DRY principle by encapsulating common logic
 */
export function useAudioFeedback() {
  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioFeedbackService = useRef(new AudioFeedbackService());

  /**
   * Start recording audio
   */
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const recorder = await audioFeedbackService.current.startRecording();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
    }
  }, []);

  /**
   * Stop recording audio
   */
  const stopRecording = useCallback(async () => {
    try {
      if (!mediaRecorderRef.current) {
        throw new Error('No active recording session');
      }

      const blob = await audioFeedbackService.current.stopRecording(mediaRecorderRef.current);
      setAudioBlob(blob);
      setIsRecording(false);
      
      // Auto-transcribe after recording stops
      try {
        setIsTranscribing(true);
        setError(null);
        
        const text = await audioFeedbackService.current.transcribeAudio(blob);
        setTranscription(text);
      } catch (transcribeErr) {
        const errorMessage = transcribeErr instanceof Error ? transcribeErr.message : 'Failed to transcribe audio';
        setError(errorMessage);
      } finally {
        setIsTranscribing(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop recording';
      setError(errorMessage);
      setIsRecording(false);
    }
  }, []);

  /**
   * Transcribe audio to text
   */
  const transcribeAudio = useCallback(async (blob: Blob) => {
    try {
      setIsTranscribing(true);
      setError(null);
      
      const text = await audioFeedbackService.current.transcribeAudio(blob);
      setTranscription(text);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to transcribe audio';
      setError(errorMessage);
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  /**
   * Submit audio feedback
   */
  const submitFeedback = useCallback(async (npsScore?: number, additionalComment?: string) => {
    try {
      if (!audioBlob) {
        throw new Error('No audio recording available');
      }

      setIsSubmitting(true);
      setError(null);
      
      await audioFeedbackService.current.submitAudioFeedback(
        audioBlob,
        npsScore,
        additionalComment
      );
      
      setIsSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit feedback';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [audioBlob]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setIsRecording(false);
    setAudioBlob(null);
    setTranscription('');
    setIsTranscribing(false);
    setIsSubmitting(false);
    setError(null);
    setIsSuccess(false);
    mediaRecorderRef.current = null;
  }, []);

  return {
    // State
    isRecording,
    audioBlob,
    transcription,
    isTranscribing,
    isSubmitting,
    error,
    isSuccess,
    
    // Actions
    startRecording,
    stopRecording,
    transcribeAudio,
    submitFeedback,
    resetForm,
  };
}
