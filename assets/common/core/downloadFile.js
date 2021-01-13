import fetch from 'node-fetch';
import fileDownload from 'js-file-download';
import { notifyError } from './notify';

const downloadFile = (file) => {
    fetch(file.path, {
        method: 'GET',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Accept',
        mode: 'no-cors'
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