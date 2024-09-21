import Swipe, { SwipeItem } from 'swipejs/react';

const Slider = () => {
  let swipeEl;

  return (
    <div>
      <Swipe ref={o => swipeEl = o}>
        <SwipeItem>Slide One</SwipeItem>
        <SwipeItem>Slide Two</SwipeItem>
        <SwipeItem>Slide Three</SwipeItem>
      </Swipe>
      <button onClick={() => swipeEl.next()}>Next</button>
      <button onClick={() => swipeEl.prev()}>Previous</button>
    </div>
  );
};

export default Slider;