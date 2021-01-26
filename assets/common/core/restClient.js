import fetch from 'node-fetch';
import {get, isEmpty, split, includes, omit } from 'lodash';
import { GLOBAL_CONFIG } from '../../config/index'
import urljoin from 'url-join';
require('isomorphic-fetch')


const parseResponse = async response => {
    //console.log('parseResponse', response)
    try {
        return await response.json();
    } catch (ex) {
        //console.log('Could not parse as json');
    }

    try {
        return await response.text();
    } catch (ex) {
        //console.log('Could not parse as text');
    }
    return null;
};

class RestClient {
    constructor(props) {}

    setExceptionHandler(exceptionHandler) {
        this.exceptionHandler = exceptionHandler;
    }

    createHeaders(token) {
        let headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Accept',
            mode: 'no-cors'
        };

        return headers;
    }

    getUrl(path) {
        const url = urljoin(GLOBAL_CONFIG.APPS_DOMAIN, path);
        //console.log('url', url)
        return url;
    }

    async asyncGet(path, token) {
        try {
            const response = await fetch(this.getUrl(path), {
                headers: this.createHeaders(token),
            });

            const data = await parseResponse(response);
            if (response.status === 401 || get(data, 'error.code') === 401) {
                this.exceptionHandler && this.exceptionHandler();
            }

            const hasError = !response.ok || !isEmpty(get(data, 'error'));
            return {
                hasError,
                data,
            };
        } catch (ex) {
            return {
                hasError: true,
                data: ex,
            };
        }
    }

    async asyncDownLoad(path) {

        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmQ0NjA4OTg4MjBmMDAzNThkZjVmOTMiLCJjb2RlIjoiMTcxMTAzNTQiLCJlbWFpbEFkZHJlc3MiOiIxNzExMDM1NEBzdHVkZW50LmhjbXV0ZS5lZHUudm4iLCJmaXJzdE5hbWUiOiJRdcOibiIsInN1ck5hbWUiOiJOZ3V54buFbiBBbmgiLCJ1cmxBdmF0YXIiOiJodHRwOi8vc2ltcGxlaWNvbi5jb20vd3AtY29udGVudC91cGxvYWRzL3VzZXIxLnBuZyIsImZhY2Vib29rSWQiOiIxOTcyNTIxMDQyODg5Mzg1IiwiaWF0IjoxNjA4OTU3NzE1LCJleHAiOjE2MDkwNDQxMTV9.hG4SPhL2yGDk_R_a9B_JIkXoxI-7GeC4xjFsvotAzC0'
        let headers = {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data;boundary=<calculated when request is sent>',
            'Access-Control-Allow-Origin': '*',
            mode: 'no-cors'
        };

        try {
            await fetch(this.getUrl(path), {
                    headers,
                })
                .then(res => res.blob())
                .then(blob => {

                    //console.log('blob', blob)
                    // var file = window.URL.createObjectURL(blob);
                    // window.location.assign(file)
                }).
            catch(err => {
                //console.log('edxxxx')
            })

        } catch (ex) {
            return {
                hasError: true,
                data: ex,
            };
        }
    }

    async asyncPost(path, data, token) {
        //console.log(path, data)
        try {
            const response = await fetch(this.getUrl(path), {
                method: 'POST',
                headers: this.createHeaders(token),
                body: JSON.stringify(data),
            });

            const resData = await parseResponse(response);
            if (response.status === 401 || get(resData, 'error.code') === 401) {
                this.exceptionHandler && this.exceptionHandler();
            }
            const hasError = !response.ok || !isEmpty(get(resData, 'error'));
            return {
                hasError,
                data: resData,
            };
        } catch (ex) {
            //console.log(ex);
            return {
                hasError: true,
                data: ex,
            };
        }
    }

    async asyncPostFile(path, data) {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmQ0NjA4OTg4MjBmMDAzNThkZjVmOTMiLCJjb2RlIjoiMTcxMTAzNTQiLCJlbWFpbEFkZHJlc3MiOiIxNzExMDM1NEBzdHVkZW50LmhjbXV0ZS5lZHUudm4iLCJpYXQiOjE2MDgzNjg0MjYsImV4cCI6MTYwODQ1NDgyNn0.eL5TFl3-std47jyQvTJctuU6DCm_NdtLi-gDaAot4y4';

        let headers = {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data;boundary=<calculated when request is sent>',
            'Access-Control-Allow-Origin': '*',
            mode: 'no-cors'
        };

        try {
            const response = await fetch(this.getUrl(path), {
                method: 'POST',
                headers,
                body: data,
            });

            const resData = await parseResponse(response);
            if (response.status === 401 || get(resData, 'error.code') === 401) {
                this.exceptionHandler && this.exceptionHandler();
            }
            const hasError = !response.ok || !isEmpty(get(resData, 'error'));
            return {
                hasError,
                data: resData,
            };
        } catch (ex) {
            //console.log(ex);
            return {
                hasError: true,
                data: ex,
            };
        }
    }

    async asyncPut(path, data, token) {
        try {
            const response = await fetch(this.getUrl(path), {
                method: 'PUT',
                headers: this.createHeaders(token),
                body: JSON.stringify(data),
            });

            const resData = await parseResponse(response);
            if (response.status === 401 || get(resData, 'error.code') === 401) {
                this.exceptionHandler && this.exceptionHandler();
            }
            const hasError = !response.ok || !isEmpty(get(resData, 'error'));
            return {
                hasError,
                data: resData,
            };
        } catch (ex) {
            //console.log(ex);
            return {
                hasError: true,
                data: ex,
            };
        }
    }

    async asyncDelete(path, data, token) {
        try {
            const response = await fetch(this.getUrl(path), {
                headers: this.createHeaders(token),
                body: JSON.stringify(data),
                method: 'DELETE',
            });

            const res = await parseResponse(response);
            if (response.status === 401 || get(res, 'error.code') === 401) {
                this.exceptionHandler && this.exceptionHandler();
            }

            return {
                hasError: !response.ok,
                data: res,
            };
        } catch (ex) {
            //console.log(ex);
            return {
                hasError: true,
                data: ex,
            };
        }
    }

    async asyncPatch(path, data, isFormData) {
        try {
            const response = await fetch(this.getUrl(path), {
                method: 'PATCH',
                headers: isFormData ? {...omit(this.createHeaders(), 'Content-Type') } : this.createHeaders(),
                body: isFormData ? data : JSON.stringify(data),
            });

            const resData = await parseResponse(response);
            if (response.status === 401 || get(resData, 'error.code') === 401) {
                this.exceptionHandler && this.exceptionHandler();
            }
            const hasError = !response.ok || !isEmpty(get(resData, 'error'));
            return {
                hasError,
                data: resData,
            };
        } catch (ex) {
            //console.log(ex);
            return {
                hasError: true,
                data: ex,
            };
        }
    }


    async asyncUploadFile(file) {
        const formData = new FormData();
        formData.append('file', file)
            // replace this with your upload preset name
        formData.append('upload_preset', 'gmttm4bo');
        const options = {
            method: 'POST',
            body: formData,
            header: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Accept',
                mode: 'no-cors'
            }
        };

        // replace cloudname with your Cloudinary cloud_name
        return await fetch('https://api.Cloudinary.com/v1_1/dkepvw2rz/upload', options)
            .then(res => res.json())
            .then(res => {

                console.log('Response secure_url', res.secure_url);

                console.log('Response url', res.url);
                return {
                    name: res.original_filename,
                    path: res.url,
                    type: res.format || res.public_id.split('.')[1]
                }
            })
            .catch(err => {
                //console.log('Upload attachment', err);
                return null;
            });
    }
}

export default new RestClient();