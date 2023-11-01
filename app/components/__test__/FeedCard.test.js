import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import FeedCard from '../../components/FeedCard'


const myFeed =
  { feedLink: "https://css-tricks.com/creating-a-clock-with-the-new-css-sin-and-cos-trigonometry-functions/", feedTitle: "Creating a Clock with the New CSS sin() and cos() Trigonometry Functions", category: "FRONTEND", itemKey: "cssTricks_4", date: "Wed, 08 Mar 2023 14:05:52 +0000" }

const myPodcast = {
  feedLink: " https://szertar.com/?p=1708480", feedTitle: "Az élek értelme", category: "OUT", podcast: "https://www.podtrac.com/pts/redirect.mp3/pdst.fm/e/chrt.fm/track/B69D94/traffic.megaphone.fm/BETO1637017875.mp3?updated=1692538080", itemKey: "szertar_2", date: "Sun, 20 Aug 2023 13:22:56 -0000"
}

const myImage =
  { feedLink: "https://xkcd.com/2849/", feedTitle: "Under the Stars", category: "OUT", image: true, itemKey: "xkcd_0", date: "Wed, 01 Nov 2023 04:00:00 -0000", feedDescription: "" }


it('should render feed title with link', () => {
  render(<FeedCard {...myFeed} />)
  const anchorElement = screen.getByRole('link')
  expect(screen.getByRole('link', { name: myFeed.feedTitle })).toHaveAttribute('href', myFeed.feedLink)
})

it('should render publish date', () => {
  render(<FeedCard {...myFeed} />)
  const dateElement = screen.getByText('2023-03-08')
  expect(dateElement).toBeInTheDocument()
})

it('should render podcast player if it is a podcast', () => {
  const pauseStub = jest
    .spyOn(window.HTMLMediaElement.prototype, 'pause')
    .mockImplementation(() => {})

  render(<FeedCard {...myPodcast} />)
  const audioPlayerElement = screen.getByTestId('audio-player-container')
  expect(audioPlayerElement).toBeInTheDocument()

  pauseStub.mockRestore()
})

it('should render an image tag if it is an image type feed', () => {
  render(<FeedCard {...myImage} />)
  const pictureElement = screen.getByTestId('image-container')
  expect(pictureElement).toBeInTheDocument()
})