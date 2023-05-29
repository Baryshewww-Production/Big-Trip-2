import {createRandomWaypoint} from '../mock/waypoint-mock.js';

const POINT_COUNT = 6;

export default class PointsModel {
  points = Array.from({length: POINT_COUNT}, createRandomWaypoint);

  getPoints() {
    return this.points;
  }
}
