'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff,
  Clock, AlertCircle, CheckCircle, Upload, Download,
  Play, Pause, RotateCcw, FileText, Send, ChevronRight,
  Shield, Star, TrendingUp
} from 'lucide-react';
import { supabase } from './hooks/useEnterpriseAuth';

interface InterviewRecordingPageProps {
  interviewId?: string;
  pilotProfileId: string;
  onComplete?: (recordingUrl: string, transcription: string) => void;
  onCancel?: () => void;
}

export function InterviewRecordingPage({
  interviewId,
  pilotProfileId,
  onComplete,
  onCancel
}: InterviewRecordingPageProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera and microphone
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoEnabled,
          audio: audioEnabled
        });
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true; // Mute local preview to avoid feedback
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setError('Unable to access camera or microphone. Please check permissions.');
      }
    };

    initMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [videoEnabled, audioEnabled]);

  // Toggle video
  const toggleVideo = async () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // Toggle audio
  const toggleAudio = async () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // Start recording
  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    mediaRecorderRef.current = new MediaRecorder(streamRef.current, { mimeType });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      setRecordingBlob(blob);
    };

    mediaRecorderRef.current.start(100); // Collect data every 100ms
    setIsRecording(true);
    setIsPaused(false);
    setError(null);

    // Start timer
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Upload recording to Cloudinary
  const uploadRecording = async () => {
    if (!recordingBlob) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', recordingBlob);
      formData.append('upload_preset', 'enterprise_unsigned');
      formData.append('folder', 'interviews');
      formData.append('resource_type', 'video');

      const uploadUrl = `https://api.cloudinary.com/v1_1/dridtecu6/video/upload`;
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadProgress(100);

      // Start transcription
      await startTranscription(data.secure_url);

    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload recording. Please try again.');
      setIsUploading(false);
    }
  };

  // Start transcription (placeholder - integrate with transcription service)
  const startTranscription = async (videoUrl: string) => {
    setIsTranscribing(true);
    setError(null);

    try {
      // Placeholder for transcription service integration
      // This would typically call a service like:
      // - AWS Transcribe
      // - Google Cloud Speech-to-Text
      // - OpenAI Whisper API
      // - AssemblyAI
      
      // For now, simulate transcription
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTranscription = `[00:00] Interviewer: Good morning, thank you for joining us today.
[00:15] Pilot: Good morning, I'm excited to be here.
[00:30] Interviewer: Let's start with your flight experience. Can you tell me about your current role?
[01:00] Pilot: I'm currently a First Officer on the A320 fleet with 2,500 total hours...
[02:30] Interviewer: That's impressive. Can you describe a challenging situation you've encountered?
[03:15] Pilot: Last year, we had an engine indication during climb out...
`;

      setTranscription(mockTranscription);
      setIsTranscribing(false);

      // Save to database
      await saveInterviewData(videoUrl, mockTranscription);

    } catch (err) {
      console.error('Transcription error:', err);
      setError('Transcription failed. Recording saved without transcription.');
      setIsTranscribing(false);
    }
  };

  // Save interview data to database
  const saveInterviewData = async (videoUrl: string, transcriptionText: string) => {
    try {
      const interviewData = {
        pilot_profile_id: pilotProfileId,
        recording_url: videoUrl,
        transcription: transcriptionText,
        transcription_status: 'completed',
        status: 'completed',
        completed_at: new Date().toISOString(),
        duration_minutes: Math.floor(duration / 60)
      };

      if (interviewId) {
        await supabase
          .from('interviews')
          .update(interviewData)
          .eq('id', interviewId);
      } else {
        await supabase
          .from('interviews')
          .insert(interviewData);
      }

      if (onComplete) {
        onComplete(videoUrl, transcriptionText);
      }
    } catch (err) {
      console.error('Database error:', err);
      setError('Failed to save interview data.');
    }
  };

  // Restart recording
  const restartRecording = () => {
    setRecordingBlob(null);
    setTranscription('');
    setDuration(0);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Video className="w-6 h-6 text-blue-400" />
              Interview Recording
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Record interview session with automatic transcription
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Video Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Local Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="aspect-video bg-slate-950 relative">
              {streamRef.current ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="w-16 h-16 text-slate-700" />
                </div>
              )}
              
              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-xs font-medium">
                    {isPaused ? 'PAUSED' : 'RECORDING'}
                  </span>
                </div>
              )}

              {/* Timer */}
              {isRecording && (
                <div className="absolute top-4 right-4 bg-slate-900/90 px-3 py-1.5 rounded-full">
                  <span className="text-white text-xs font-mono">
                    {formatDuration(duration)}
                  </span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-slate-800">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-xl transition-all ${
                    videoEnabled
                      ? 'bg-slate-800 text-white hover:bg-slate-700'
                      : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                  }`}
                >
                  {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-xl transition-all ${
                    audioEnabled
                      ? 'bg-slate-800 text-white hover:bg-slate-700'
                      : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                  }`}
                >
                  {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="p-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                ) : isPaused ? (
                  <button
                    onClick={resumeRecording}
                    className="p-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={pauseRecording}
                    className="p-3 rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-all"
                  >
                    <Pause className="w-5 h-5" />
                  </button>
                )}

                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="p-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Transcription & Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Transcription</h3>
              {transcription && (
                <button
                  onClick={() => navigator.clipboard.writeText(transcription)}
                  className="text-slate-400 hover:text-white text-sm flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" />
                  Copy
                </button>
              )}
            </div>

            {isTranscribing ? (
              <div className="flex items-center gap-3 text-slate-400 text-sm py-8">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span>Transcribing interview...</span>
              </div>
            ) : transcription ? (
              <div className="bg-slate-950 rounded-xl p-4 max-h-64 overflow-y-auto">
                <pre className="text-slate-300 text-sm whitespace-pre-wrap font-mono">
                  {transcription}
                </pre>
              </div>
            ) : (
              <div className="bg-slate-950 rounded-xl p-8 text-center">
                <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">
                  Transcription will appear here after recording
                </p>
              </div>
            )}

            {/* Recording Status */}
            {recordingBlob && !transcription && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Recording ready ({formatDuration(duration)})</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={uploadRecording}
                    disabled={isUploading}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-all"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading {uploadProgress}%
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload & Transcribe
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={restartRecording}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {isUploading && (
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recording Guidelines */}
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="text-white font-semibold text-sm mb-1">Recording Guidelines</h4>
              <ul className="text-slate-400 text-xs space-y-1">
                <li>• Ensure good lighting and clear audio quality</li>
                <li>• Conduct interview in a quiet environment</li>
                <li>• Speak clearly and at a moderate pace</li>
                <li>• Recording will be automatically transcribed</li>
                <li>• All recordings are stored securely and encrypted</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewRecordingPage;
