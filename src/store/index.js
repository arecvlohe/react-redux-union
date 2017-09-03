import Type from "union-type";
import { createStore, combineReducers } from "redux";
import memoize from "ramda/src/memoize";
import path from "ramda/src/path";
import axios from "axios";
import Future from "fluture";

// MESSAGES

const Msg = Type({
  FETCH_GIF: [],
  GIF_RESPONSE: [Object],
  GIF_ERROR: [Object]
});

// ASYNC ACTIONS

const fetchGif = () =>
  Future((rej, res) => {
    axios
      .get(
        "https://api.giphy.com/v1/gifs/random?" +
          "api_key=670526ba3bda46629f097f67890105ed" +
          "&tag=&rating=G"
      )
      .then(res)
      .catch(rej);
  });

const onGifSuccess = response => {
  gifResponse(response);
};

const onGifError = err => {
  gifErr(err);
};

// MESSAGE HANDLERS

const nextState = Msg.caseOn({
  FETCH_GIF: state => {
    fetchGif().fork(onGifError, onGifSuccess);
    return state;
  },
  GIF_RESPONSE: (response, state) => ({ ...state, gif: response }),
  GIF_ERROR: (err, state) => ({ ...state, gifErr: err }),
  _: state => state
});

// STATE

const initialState = {
  gif: {},
  gifError: {}
};

// UPDATE

function app(state = initialState, { type = Msg.DEFAULT, payload = null }) {
  if (typeof type === "string") return state;
  return nextState(type, state);
}

// STORE

const store = createStore(
  combineReducers({ app }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// ACTIONS

export const getGif = () => {
  store.dispatch({ type: Msg.FETCH_GIF });
};

export const gifResponse = response => {
  store.dispatch({ type: Msg.GIF_RESPONSE(response) });
};

export const gifError = err => {
  store.dispatch({ type: Msg.GIF_ERROR(err) });
};

// SELECTORS

export const gifUrl = memoize(
  path(["app", "gif", "data", "data", "image_original_url"])
);
export const gifErr = memoize(path(["app", "gifErr"]));

// EXPORT DEFAULT

export default store;
