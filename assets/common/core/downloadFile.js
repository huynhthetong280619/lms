import fetch from 'node-fetch';
import fileDownload from 'js-file-download';
import { notifyError } from './notify';

const downloadFile = (file) => {

    console.log('Download file', file.path);
    fetch(file.path, {
            method: 'GET'
        })
        .then(res => {
            return res.blob();
        })
        .then((blob) => {
            fileDownload(blob, `${file.name}.${file.type}`);
        })
        .catch(err => {
            notifyError('Error', err.message);
        })
}
export default downloadFile;