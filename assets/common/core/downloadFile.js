import fetch from 'node-fetch';
import fileDownload from 'js-file-download';
import { notification } from 'antd';

const downloadFile = (file) => {
    fetch(file.path, { method: 'GET' })
        .then(res => {
            return res.blob();
        })
        .then((blob) => {
            fileDownload(blob, `${file.name}.${file.type}`);
        })
        .catch(err => {
            notification.error({
                message: "Error!",
                description: 'err.message'
            })
        })
}
export default downloadFile;