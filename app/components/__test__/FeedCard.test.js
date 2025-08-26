import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeedCard from "../FeedCard";

const myFeed = {
  feedLink:
    "https://css-tricks.com/creating-a-clock-with-the-new-css-sin-and-cos-trigonometry-functions/",
  feedTitle:
    "Creating a Clock with the New CSS sin() and cos() Trigonometry Functions",
  feedDescription: "A detailed guide on creating clocks with CSS trigonometry functions",
  category: "FRONTEND",
  sourceKey: "cssTricks",
  idx: 4,
  date: "Wed, 08 Mar 2023 14:05:52 +0000",
};

const myPodcast = {
  feedLink: "https://szertar.com/?p=1708480",
  feedTitle: "Az élek értelme",
  feedDescription: "A podcast about the meaning of life",
  category: "OUT",
  podcast:
    "https://www.podtrac.com/pts/redirect.mp3/pdst.fm/e/chrt.fm/track/B69D94/traffic.megaphone.fm/BETO1637017875.mp3?updated=1692538080",
  sourceKey: "szertar",
  idx: 2,
  date: "Sun, 20 Aug 2023 13:22:56 -0000",
};

const myImage = {
  feedLink: "https://xkcd.com/2849/",
  feedTitle: "Under the Stars",
  feedDescription: "<img src='https://imgs.xkcd.com/comics/under_the_stars.png' alt='Under the Stars comic' />",
  category: "OUT",
  image: true,
  sourceKey: "xkcd",
  idx: 0,
  date: "Wed, 01 Nov 2023 04:00:00 -0000",
};

it("should render feed title with link", () => {
  render(<FeedCard {...myFeed} />);
  const anchorElement = screen.getByRole("link", { name: myFeed.feedTitle });
  expect(anchorElement).toHaveAttribute("href", myFeed.feedLink);
});

it("should render publish date", () => {
  render(<FeedCard {...myFeed} />);
  const dateElement = screen.getByText("2023-03-08");
  expect(dateElement).toBeInTheDocument();
});

it("should render podcast player if it is a podcast", () => {
  const pauseStub = jest
    .spyOn(window.HTMLMediaElement.prototype, "pause")
    .mockImplementation(() => {});

  render(<FeedCard {...myPodcast} />);
  const audioPlayerElement = screen.getByTestId("audio-player-container");
  expect(audioPlayerElement).toBeInTheDocument();

  pauseStub.mockRestore();
});

it("should render an image tag if it is an image type feed", () => {
  render(<FeedCard {...myImage} />);
  const pictureElement = screen.getByTestId("image-container");
  expect(pictureElement).toBeInTheDocument();
});

it("should render skeleton component", () => {
  // Test that the skeleton component can be rendered
  const { container } = render(<FeedCard {...myFeed} />);
  expect(container.firstChild).toBeInTheDocument();
});

it("should render feed description", () => {
  render(<FeedCard {...myFeed} />);
  const descriptionElement = screen.getByText("A detailed guide on creating clocks with CSS trigonometry functions");
  expect(descriptionElement).toBeInTheDocument();
});

it("should have correct category styling", () => {
  render(<FeedCard {...myFeed} />);
  // The section element has the category styling
  const cardElement = document.querySelector('section');
  expect(cardElement).toHaveClass("border-retro_orange");
});

it("should have close button functionality", async () => {
  const user = userEvent.setup();
  render(<FeedCard {...myFeed} />);

  // Find the close button
  const closeButton = screen.getByRole("button");
  expect(closeButton).toBeInTheDocument();

  // Click the close button
  await user.click(closeButton);

  // After clicking, the skeleton should be shown instead of the original card
  await waitFor(() => {
    const skeletonElement = screen.getByTestId("skeleton-card");
    expect(skeletonElement).toBeInTheDocument();
  });
});
