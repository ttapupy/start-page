"use client"

import * as React from "react";

interface IAudioPBContext {
  playingAudioId: string | null;
  setPlayingAudioId: (playingAudioId: string | null) => void;
}

const AudioPlaybackContext = React.createContext<IAudioPBContext>({
  playingAudioId: null,
  setPlayingAudioId: () => {
  }
});

export default AudioPlaybackContext;