import React from 'react';
import Modal from 'react-modal';

const ModalComponent = ({
  isOpen, urlInput, fileInput, close, updateURLInput,
  updateFileInput, loadRasterAndCloseModal
}) => (
  <Modal
    isOpen={isOpen}
    shouldCloseOnOverlayClick={true}
    onRequestClose={close}
    closeTimeoutMS={200}
  >
    <header>
      <span className='geotiff-logo'></span>
      <h3>GeoTIFF</h3>
      <i
        className='material-icons'
        onClick={close}
      >
        clear
      </i>
    </header>
    <section className='content'>
      <p>You have two ways to link to your GeoTIFF. Add a url or upload a file.</p>
      <br />
      <label htmlFor="basic-url">
        URL to Your GeoTIFF
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
      <br />
      <button
        className='gt-button-accent full'
        onClick={loadRasterAndCloseModal}
      >
        GO
      </button>
      <p>Log feature requests and issues <a href="https://github.com/GeoTIFF/geotiff.io/issues">here</a>.</p>
    </section>
  </Modal>
);

export default ModalComponent;
