"use client"

import * as React from "react";
import AudioPlaybackContext from "@/app/lib/AudioPlaybackContext";
import type {FC, ReactNode} from 'react'

interface AudioPlaybackProviderProps {
  children: ReactNode
}

const AudioPlaybackProvider: FC<AudioPlaybackProviderProps> = ({children}) => {
  const [playingAudioId, setPlayingAudioId] = React.useState<string | null>(null);

  return (
      <AudioPlaybackContext.Provider value={{playingAudioId, setPlayingAudioId}}>
        {children}
      </AudioPlaybackContext.Provider>);
}

export default AudioPlaybackProvider;