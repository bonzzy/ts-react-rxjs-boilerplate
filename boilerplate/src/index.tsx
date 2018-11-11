import { render } from 'react-dom';
import * as React from 'react';
import {PageComponent} from './components/PageComponent';
import { BrowserRouter as Router } from 'react-router-dom';
import {HotReloader} from './HotReloader';
// import configureStore from './configureStore';

// import './scss/style.scss';
const appRootElement = document.getElementById('root');

function renderMain(IndexComponent: React.ReactType) {
    return (
        <Router>
            <div>
                TEST
                <IndexComponent />
            </div>
        </Router>
    );
}

render(renderMain(PageComponent), appRootElement);

// // @ts-ignore
// if (module.hot) {
//     // @ts-ignore
//     module.hot.accept('./components/PageComponent', (event, a) => {
//         console.log("Hot reloading PageComponent", event, a)
//         const indexComponent = require('./components/PageComponent').PageComponent;
//         render(renderMain(indexComponent), appRootElement);
//     });
// }