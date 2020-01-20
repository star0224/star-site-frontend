import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Router from "./router";
import './config'
import 'babel-polyfill'
import 'antd-mobile/dist/antd-mobile.css'

// 刷新回到页面顶部
window.onload = () => {
    setTimeout(() => {
        window.scrollTo(0, 0)
    }, 10)
}

ReactDOM.render((
    <div>
        < Router />
    </div>

), document.getElementById('root'));

serviceWorker.unregister();
