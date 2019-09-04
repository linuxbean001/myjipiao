import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css'
import registerServiceWorker from './registerServiceWorker';


import { Provider } from 'react-redux';
import configureStore from './store/configureStore'

import Routers from './routes/index';


const store = configureStore();

const Root = () => (
    <Provider store={store}>
        <Routers/>
    </Provider>
);


ReactDOM.render( <Root/>
,
 document.getElementById('root')
);
//registerServiceWorker();
