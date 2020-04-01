import ActionTypes from '../actions';

export const manifoldNotifications = {
  notifications: [],
  count: 0
};

export default function notificationsReducer(state = manifoldNotifications, action) {
  switch (action.type) {
    case ActionTypes.NOTIFICATIONS_COUNT:
      return Object.assign({}, state, {
        count: action.count
      })
    case ActionTypes.NOTIFICATIONS:
    return Object.assign({}, state, {
      notifications: action.notifications
    })
    default:
      return state;
  }
}
