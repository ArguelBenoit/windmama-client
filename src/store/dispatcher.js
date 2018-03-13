import { Dispatcher } from 'flux';
import { typeOfActions } from './actions.js';
import store from './store.js';

var AppDispatcher = new Dispatcher();

AppDispatcher.register((action) => {

  switch (action.actionType) {

    case typeOfActions.LOAD_ACTIVITY:
      store.loading = action.value;
      store.emit(typeOfActions.LOAD_ACTIVITY);
      break;

    case typeOfActions.DATA_RECEIVED:
      store.emit(typeOfActions.LOAD_ACTIVITY);
      store.emit(typeOfActions.DATA_RECEIVED);
      break;

    case typeOfActions.LEFT_ACTIVATION:
      store.leftActive = !store.leftActive;
      store.rightActive = false;
      store.emit(typeOfActions.LEFT_ACTIVATION);
      break;

    case typeOfActions.RIGHT_ACTIVATION:
      store.rightActive = !store.rightActive;
      store.leftActive = false;
      store.emit(typeOfActions.RIGHT_ACTIVATION);
      break;

    case typeOfActions.HOVER_ID:
      store.hoverId = action.id;
      store.emit(typeOfActions.HOVER_ID);
      break;

    case typeOfActions.CHANGE_VIEWPORT:
      store.viewportWidth = action.size[0];
      store.viewportHeight = action.size[1];
      store.emit(typeOfActions.CHANGE_VIEWPORT);
      break;

    case typeOfActions.UPDATE_DETAIL:
      var id = JSON.parse(action.update).id;
      if (store.detail[id] && store.place[id]) {
        store.detail[id].unshift(action.update);
        store.idUpdate = id;
        store.emit(typeOfActions.UPDATE_DETAIL);
      }
      break;

    case typeOfActions.ADD_BOOKMARK:
      var tempBookmarks = store.bookmarks;
      if (tempBookmarks.indexOf(action.id) > -1) {
        tempBookmarks.splice(tempBookmarks.indexOf(action.id), 1);
      } else if (tempBookmarks.indexOf(action.id) === -1) {
        tempBookmarks.push(action.id);
      }
      localStorage.setItem('bookmarks', tempBookmarks.toString());
      store.bookmarks = tempBookmarks;
      store.emit(typeOfActions.ADD_BOOKMARK);
      break;

    case typeOfActions.CHANGE_SETTINGS:
      var settingsObject = action.object;
      store.settings = settingsObject;
      localStorage.setItem('settings', JSON.stringify(settingsObject));
      store.emit(typeOfActions.CHANGE_SETTINGS);
      break;

    default:
      break;
  }
});

export default AppDispatcher;
