import OfflinePluginRuntime from 'offline-plugin/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app';
import buildStore from './build-store';
import { Provider } from 'react-redux';
import { loadTools } from './actions/tool-list-actions';
import { addRaster } from './actions/raster-actions';
import UrlService from './services/UrlService';
import ToolListService from './services/ToolListService';
import Map from './Map';
import '../styles/style.less';

OfflinePluginRuntime.install();

const store = buildStore();
store.dispatch(loadTools());
window.store = store; // made this global so it can be accessed from Map

const url = UrlService.get('url');
if (url) {
  store.dispatch(addRaster(url));
}

// const toolName = UrlService.get('tool');
// if (toolName) {
//   ToolListService.getToolList().then(tools => {
//     const tool = tools.find(tool => tool[2] === toolName);
//   });
// }

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);

Map.initialize();
