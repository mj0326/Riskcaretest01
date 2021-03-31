import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { store } from './redux/store'
import './index.scss';
import Router from './components/Router';

ReactDOM.render(
	<Provider store={store}>
		<React.StrictMode>
			<Router />
		</React.StrictMode>
	</Provider>,
	document.getElementById('root')
);