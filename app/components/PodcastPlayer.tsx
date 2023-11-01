"use client"

import AudioPlayer from 'react-h5-audio-player';
import H5AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';
import AudioPlaybackContext from "@/app/lib/AudioPlaybackContext";
import * as React from "react";


interface IPodcastPlayer {
  podcast: string;
  itemKey: string;
}

const PodcastPlayer = ({ podcast, itemKey }: IPodcastPlayer) => {

  const { playingAudioId, setPlayingAudioId } = React.useContext(AudioPlaybackContext)
  const audioIsActive = playingAudioId === itemKey;
  const audioRef = React.useRef<H5AudioPlayer>(null)

  const onPlay = () => {
    setPlayingAudioId(itemKey)
  }

  React.useEffect(() => {
    if (audioRef.current?.audio?.current) {
      if (audioIsActive) {
        audioRef.current.audio.current.play();
      } else {
        audioRef.current.audio.current.pause();
      }
    }
  }, [audioIsActive]);

  return (
    <figure className='pt-4 text-center' data-testid='audio-player-container'>
      <AudioPlayer
        ref={audioRef}
        className="mx-auto"
        src={podcast}
        onPlay={onPlay}
      />
    </figure>
  )
};

export default PodcastPlayer;
