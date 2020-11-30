import fetch from 'node-fetch';
import { get, isEmpty, split, includes, omit } from 'lodash';
import {GLOBAL_CONFIG} from '../../config/index'
import urljoin from 'url-join';

const parseReponse = async response => {
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
    let headers = { 'Content-Type': 'application/json' };

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxNzExMDM1NCIsImlhdCI6MTYwMTQyOTEwMX0.r4oaJSeAS70gbAXWr83p2lU0LKSwrAoW0-BE3_13Zkg';

    if (token) {
      headers = { ...headers, Authorization: `Bearer ${token}` };
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

  async asyncPost(path, data, isFormData) {
    if (!isServerSide) return;
    try {
      const response = await fetch(this.getUrl(path), {
        method: 'POST',
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

  async asyncPut(path, data) {
    if (!isServerSide) return;
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
    if (!isServerSide) return;
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
    if (!isServerSide) return;
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
