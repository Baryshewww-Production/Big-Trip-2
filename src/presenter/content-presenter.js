import {render, RenderPosition} from '../render.js';
import EditFormView from '../view/edit-form-view.js';
import FiltersView from '../view/filters-view.js';
import MenuNavView from '../view/menu-nav-view.js';
import RouteWrapperView from '../view/route-wrapper-view.js';
import RouteInfoView from '../view/route-info-view.js';
import RouteCostView from '../view/route-cost-view.js';
import SortingView from '../view/sorting-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import WaypointView from '../view/waypoint-view.js';
import NoPointsView from '../view/no-points-view.js';
import {getIsEscape} from '../utils.js';

const INITIAL_COUNT_OF_POINTS = 6;
const POINT_COUNT_PER_STEP = 1;

export default class ContentPresenter {
  #routeWrapperComponent = new RouteWrapperView();
  #tripEventsListComponent = new TripEventsListView();
  #newEventButtonComponent = null;
  #tripEventsContainer = null;
  #routeContainer = null;
  #menuContainer = null;
  #filtersContainer = null;
  #pointsModel = null;

  #points = [];
  #renderedPointsCount = INITIAL_COUNT_OF_POINTS;

  constructor({tripEventsContainer, routeContainer, menuContainer, filtersContainer, pointsModel, newEventButton}) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#routeContainer = routeContainer;
    this.#menuContainer = menuContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
    this.#newEventButtonComponent = newEventButton;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    render(this.#routeWrapperComponent, this.#routeContainer, RenderPosition.AFTERBEGIN);
    render(new RouteInfoView(), this.#routeWrapperComponent.element);
    render(new RouteCostView(), this.#routeWrapperComponent.element);
    render(new MenuNavView(), this.#menuContainer);
    render(new FiltersView(), this.#filtersContainer);

    if (this.#points.length === 0) {
      render(new NoPointsView(), this.#tripEventsContainer);
    } else {
      render(new SortingView(), this.#tripEventsContainer);
      render(this.#tripEventsListComponent, this.#tripEventsContainer);

      for (let i = 0; i < Math.min(this.#points.length, INITIAL_COUNT_OF_POINTS); i++) {
        this.#renderPoint(this.#points[i]);
      }
    }

    this.#newEventButtonComponent.addEventListener('click', this.#newEventButtonHandler);
  }

  // Функция-обработчик нажатия на кнопку New event. Добавляет новую точку маршрута из массива с данными
  #newEventButtonHandler = (evt) => {
    evt.preventDefault();

    if (this.#points.length === 0) {
      render(new SortingView(), this.#tripEventsContainer);
      render(this.#tripEventsListComponent, this.#tripEventsContainer);
    }
    this.#points
      .slice(this.#renderedPointsCount, this.#renderedPointsCount + POINT_COUNT_PER_STEP)
      .forEach((point) => this.#renderPoint(point));

    this.#renderedPointsCount += POINT_COUNT_PER_STEP;
  };

  #renderPoint(point) {
    const pointComponent = new WaypointView({point});
    const pointEditComponent = new EditFormView({point});

    // Функция, которая переводит точку маршрута в режим редактирования (открывается форма редактирования)
    const replaceWaypointToForm = () => {
      this.#tripEventsListComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    // Функция, которая переводит точку маршрута в режим редактирования (открывается форма редактирования)
    const replaceFormToWaypoint = () => {
      this.#tripEventsListComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    // Функция-обработчик нажатия клавиши Escape
    const escKeyDownHandler = (evt) => {
      if(getIsEscape(evt)) {
        evt.preventDefault();
        replaceFormToWaypoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceWaypointToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    pointEditComponent.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToWaypoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(pointComponent, this.#tripEventsListComponent.element);
  }
}
