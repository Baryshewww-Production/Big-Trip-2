import AbstractView from '../framework/view/abstract-view.js';

function createNoPointsView() {
  return '<p class="trip-events__msg">Loading...</p>';
}

export default class LoadingView extends AbstractView {

  get template() {
    return createNoPointsView();
  }
}
