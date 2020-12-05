import fetch from 'node-fetch';
import { get, isEmpty, split, includes, omit } from 'lodash';
import {GLOBAL_CONFIG} from '../../config/index'
import urljoin from 'url-join';
require('isomorphic-fetch')

const parseReponse = async response => {
  console.log('parseResponse', response)
  try {
    return await response.json();
  } catch (ex) {
    console.log('Could not parse as json');
  }

  try {
    return await response.text();
  } catch (ex) {
    console.log('Could not parse as text');
  }
  return null;
};

class RestClient {
    constructor(props){
    }

  setExceptionHandler(exceptionHandler) {
    this.exceptionHandler = exceptionHandler;
  }

  createHeaders() {
    let headers = { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'};


    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxNzExMDM1NSIsImlhdCI6MTYwNDgzMDY5N30.UoVA9_JoBW8Sh2ztyy6PxTliMEg7t42CDL1KKqLHV9E';

    if (token) {
      headers = { ...headers, Authorization: `Bearer ${token}`};
    }
    console.log('header:', JSON.stringify(headers));
    return headers;
  }

  getUrl(path, options) {
    

    const url = urljoin(GLOBAL_CONFIG.APPS_DOMAIN, path);
    console.log('url: ', url);
    return url;
  }

  async asyncGet(path) {
    console.log('asyncGet')
    try {
      const response = await fetch(this.getUrl(path), {
        headers: this.createHeaders(),
      });

      const data = await parseReponse(response);
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

  async asyncGetBody(path, ij_data) {
    console.log('asyncGet')
    try {
      const response = await fetch(this.getUrl(path), {
        headers: this.createHeaders(),
        body: JSON.stringify(ij_data)
      });

      const data = await parseReponse(response);
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

  async asyncPost(path, data, isFormData) {
    console.log('asyncPost', JSON.stringify(data))
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    try {
      const response = await fetch(this.getUrl(path), {
        method: 'POST',
        headers: isFormData ? { ...omit(this.createHeaders(), 'Content-Type') } : this.createHeaders(),
        body: JSON.stringify(data),
      });

      const resData = await parseReponse(response);
      if (response.status === 401 || get(resData, 'error.code') === 401) {
        this.exceptionHandler && this.exceptionHandler();
      }
      const hasError = !response.ok || !isEmpty(get(resData, 'error'));
      return {
        hasError,
        data: resData,
      };
    } catch (ex) {
      console.log(ex);
      return {
        hasError: true,
        data: ex,
      };
    }
  }

  async asyncPut(path, data) {
    try {
      const response = await fetch(this.getUrl(path), {
        method: 'PUT',
        headers: this.createHeaders(),
        body: JSON.stringify(data),
      });

      const resData = await parseReponse(response);
      if (response.status === 401 || get(resData, 'error.code') === 401) {
        this.exceptionHandler && this.exceptionHandler();
      }
      const hasError = !response.ok || !isEmpty(get(resData, 'error'));
      return {
        hasError,
        data: resData,
      };
    } catch (ex) {
      console.log(ex);
      return {
        hasError: true,
        data: ex,
      };
    }
  }

  async asyncDelete(path, data, options) {
    try {
      const response = await fetch(this.getUrl(path, options), {
        headers: this.createHeaders(),
        body: JSON.stringify(data),
        method: 'delete',
      });

      const res = await parseReponse(response);
      if (response.status === 401 || get(res, 'error.code') === 401) {
        this.exceptionHandler && this.exceptionHandler();
      }

      return {
        hasError: !response.ok,
        data: res,
      };
    } catch (ex) {
      console.log(ex);
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
        headers: isFormData ? { ...omit(this.createHeaders(), 'Content-Type') } : this.createHeaders(),
        body: isFormData ? data : JSON.stringify(data),
      });

      const resData = await parseReponse(response);
      if (response.status === 401 || get(resData, 'error.code') === 401) {
        this.exceptionHandler && this.exceptionHandler();
      }
      const hasError = !response.ok || !isEmpty(get(resData, 'error'));
      return {
        hasError,
        data: resData,
      };
    } catch (ex) {
      console.log(ex);
      return {
        hasError: true,
        data: ex,
      };
    }
  }
  
}

export default new RestClient();
