import GeneralPresenter from './presenter/general-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MenuPresenter from './presenter/menu-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import NewEventButtonView from './view/new-event-button-view.js';
import {render} from './framework/render.js';
import {MenuItem} from './const.js';

const siteMainElement = document.querySelector('.page-body');
const siteHeaderMenuElement = siteMainElement.querySelector('.trip-main');
const siteHeaderNavElement = siteHeaderMenuElement.querySelector('.trip-controls__navigation');
const siteHeaderFiltersElement = siteHeaderMenuElement.querySelector('.trip-controls__filters');
const siteEventsContainerElement = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

let statsComponent = null;

const generalPresenter = new GeneralPresenter({
  tripEventsContainer: siteEventsContainerElement,
  routeContainer: siteHeaderMenuElement,
  menuContainer: siteHeaderNavElement,
  filtersContainer: siteHeaderFiltersElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: siteHeaderFiltersElement,
  filterModel,
  pointsModel,
});

const menuPresenter = new MenuPresenter({
  menuContainer: siteHeaderNavElement,
});

const newPointButtonComponent = new NewEventButtonView({
  onButtonClick: handleNewPointButtonClick
});

function handleNewPointButtonClick() {
  generalPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

const menuClickHandler = (menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      generalPresenter.destroy();
      break;
    case MenuItem.TABLE:
      generalPresenter.destroy();
      generalPresenter.init();
      break;
  }
};

render(newPointButtonComponent, siteHeaderMenuElement);

generalPresenter.init();
filterPresenter.init();
menuPresenter.init(menuClickHandler);
