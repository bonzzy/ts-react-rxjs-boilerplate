import { render } from 'react-dom';
import * as React from 'react';
import {PageComponent} from './components/PageComponent';
import { BrowserRouter as Router } from 'react-router-dom';

const appRootElement = document.getElementById('root');

function renderMain(IndexComponent: React.ReactType) {
    return (
        <Router>
            <div>
                <IndexComponent />
            </div>
        </Router>
    );
}

render(renderMain(PageComponent), appRootElement);

// @ts-ignore
if (module.hot) {
    // @ts-ignore
    module.hot.accept('./components/PageComponent', (event) => {
        console.log("Hot reloading PageComponent", event)
        const indexComponent = require('./components/PageComponent').PageComponent;
        render(renderMain(indexComponent), appRootElement);
    });
}