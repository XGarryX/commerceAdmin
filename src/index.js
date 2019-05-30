import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore  } from 'redux'
import appReducer from './redux/reduces/app'
import './style/index.css'
import App from './App'
import * as serviceWorker from './serviceWorker';

const defaultStore = {
    tab: {
        tabList: [],
        tabKey: null
    },
    sider: {
        collapsed: false
    },
    token: null,
    lastTime: {},
}
const store = createStore(appReducer, defaultStore)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root')
)
serviceWorker.unregister();
