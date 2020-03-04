import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ExplainBindingsComponent from './playground/Developer';

ReactDOM.render(
    <App />,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

//ovo bi trebalo negde da cuva prethodno stanje ali to ne radi!
if(module.hot){
    module.hot.accept();
}