import LoadComponent from './load.component';
import { addVector } from '../../../actions/raster-actions';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import { showAlert } from '../../../actions/alert-actions';

// let urlToTiff = new URLSearchParams(window.location.search).get("url");
// if (urlToTiff) window.loadVector(urlToTiff);

const urlIsValid = url => {
  return /^http|^https/.test(url);
}

const mapDispatchToProps = dispatch => {
  return {
    showAlert: message => dispatch(showAlert(message)),
    addVector: input => dispatch(addVector(input))
  }
}

export const loadState = compose(
  connect(null, mapDispatchToProps),
  withState('urlInput', 'setURLInput', ''),
  withState('fileInput', 'setFileInput', ''),
  withHandlers({
    updateURLInput: ({ setURLInput }) => event => {
      return setURLInput(event.target.value.trim());
    },
    updateFileInput: ({ setFileInput }) => event => {
      return setFileInput(event.target.files[0]);
    },
    loadVector: ({ urlInput, fileInput, addVector, showAlert }) => () => {
      return new Promise((resolve, reject) => {
        try {
          if (urlInput !== '' ) {
            if (urlIsValid(urlInput)) {
              addVector(urlInput);
              resolve(true);
            } else {
              showAlert('Please make sure you are using a valid url. It must start with either http or https.');
            }
          } else if (fileInput !== '') {
            addVector(fileInput);
            resolve(true);
          } else {
            showAlert('Please add either a url or a geotiff file');
          }
        } catch (e) {
          showAlert('The raster you tried to load is not a valid geotiff. Please try again with a different file.');
          reject();
        }
      });
    }
  })
);

const LoadContainer = compose(loadState)(LoadComponent)

export default LoadContainer;
