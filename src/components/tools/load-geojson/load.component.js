import React from 'react';
import ToolHeader from '../../shared/tool-header';
import ToolContent from '../../shared/tool-content';
import ToolFooter from '../../shared/tool-footer';

const LoadComponent = ({
  urlInput, fileInput, updateURLInput, updateFileInput, loadGeometry
}) => (
  <div id='load-tool' className='tool'>
    <ToolHeader
      logoURL="/images/load.svg"
      title="Load a GeoJSON"
    />
    <ToolContent>
      <p className='tool-desc'>
        You have two ways to add a GeoJSON to the map. Add a url or upload a file
      </p>
      <br />
      <label htmlFor="basic-url">
        URL to Your GeoJSON
      </label>
      <div className="input-group">
        <input
          type="text"
          className="gt-input"
          onChange={updateURLInput}
        />
      </div>
      <br />
      <p className="or"><b>OR</b></p>
      <label htmlFor="basic-url">
        Load File
      </label>
      <div className="gt-input">
        <input
          type="file"
          onChange={updateFileInput}
        />
      </div>
      <div className="content-row submit-row">
        <button
          className='gt-button-accent full'
          onClick={loadGeometry}
        >
          Load
        </button>
      </div>
    </ToolContent>
    <ToolFooter />
  </div>
);

export default LoadComponent;
