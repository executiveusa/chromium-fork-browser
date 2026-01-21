/**
 * Voice Integration Stubs
 * Speech-to-text and text-to-speech functionality
 */

export interface VoiceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export interface TTSConfig {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

/**
 * Speech Recognition (STT)
 * Converts speech to text
 */
export class SpeechRecognitionService {
  private recognition: any; // SpeechRecognition type
  private isListening: boolean = false;
  private onResult?: (transcript: string, isFinal: boolean) => void;
  private onError?: (error: string) => void;

  constructor(config: VoiceConfig = {}) {
    // Check if browser supports Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = config.continuous ?? false;
    this.recognition.interimResults = config.interimResults ?? true;
    this.recognition.lang = config.language ?? 'en-US';

    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      const isFinal = event.results[last].isFinal;
      
      if (this.onResult) {
        this.onResult(transcript, isFinal);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  /**
   * Start listening
   */
  start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ): void {
    if (!this.recognition) {
      console.warn('Speech recognition not available');
      return;
    }

    this.onResult = onResult;
    this.onError = onError;
    this.isListening = true;
    this.recognition.start();
  }

  /**
   * Stop listening
   */
  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }
}

/**
 * Text-to-Speech (TTS)
 * Converts text to speech
 */
export class TextToSpeechService {
  private synth: SpeechSynthesis;
  private config: TTSConfig;

  constructor(config: TTSConfig = {}) {
    this.synth = window.speechSynthesis;
    this.config = {
      rate: config.rate ?? 1.0,
      pitch: config.pitch ?? 1.0,
      volume: config.volume ?? 1.0,
      voice: config.voice,
    };
  }

  /**
   * Speak text
   */
  speak(text: string, onEnd?: () => void): void {
    if (!this.synth) {
      console.warn('Text-to-speech not supported');
      return;
    }

    // Cancel any ongoing speech
    this.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.config.rate!;
    utterance.pitch = this.config.pitch!;
    utterance.volume = this.config.volume!;

    // Set voice if specified
    if (this.config.voice) {
      const voices = this.synth.getVoices();
      const voice = voices.find(v => v.name === this.config.voice);
      if (voice) {
        utterance.voice = voice;
      }
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.synth.speak(utterance);
  }

  /**
   * Cancel ongoing speech
   */
  cancel(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Pause speech
   */
  pause(): void {
    if (this.synth) {
      this.synth.pause();
    }
  }

  /**
   * Resume speech
   */
  resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.synth ? this.synth.getVoices() : [];
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

/**
 * Voice Command Processor
 * Processes voice commands and triggers actions
 */
export class VoiceCommandProcessor {
  private stt: SpeechRecognitionService;
  private tts: TextToSpeechService;
  private onCommand?: (command: string) => Promise<void>;

  constructor() {
    this.stt = new SpeechRecognitionService({
      continuous: false,
      interimResults: true,
    });
    this.tts = new TextToSpeechService();
  }

  /**
   * Start voice command mode
   */
  startListening(onCommand: (command: string) => Promise<void>): void {
    this.onCommand = onCommand;
    
    this.stt.start(
      async (transcript, isFinal) => {
        console.log('Voice input:', transcript, isFinal ? '(final)' : '(interim)');
        
        if (isFinal && this.onCommand) {
          try {
            await this.onCommand(transcript);
          } catch (error) {
            console.error('Command execution failed:', error);
            this.speak('Command failed. Please try again.');
          }
        }
      },
      (error) => {
        console.error('Voice recognition error:', error);
        this.speak('Sorry, I did not understand that.');
      }
    );
  }

  /**
   * Stop listening
   */
  stopListening(): void {
    this.stt.stop();
  }

  /**
   * Speak text
   */
  speak(text: string, onEnd?: () => void): void {
    this.tts.speak(text, onEnd);
  }

  /**
   * Check if listening
   */
  isListening(): boolean {
    return this.stt.getIsListening();
  }

  /**
   * Check if speaking
   */
  isSpeaking(): boolean {
    return this.tts.isSpeaking();
  }

  /**
   * Cancel speech
   */
  cancelSpeech(): void {
    this.tts.cancel();
  }
}

// Global voice command processor instance
export const voiceProcessor = new VoiceCommandProcessor();
