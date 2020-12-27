import fetch from 'node-fetch';
import { get, isEmpty, split, includes, omit } from 'lodash';
import { GLOBAL_CONFIG } from '../../config/index'
import urljoin from 'url-join';
require('isomorphic-fetch')
import glb_sv from '../../global/global.service';
import { parseCookies, setCookie, destroyCookie } from 'nookies'


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
  constructor(props) {
    
  }

  setExceptionHandler(exceptionHandler) {
    this.exceptionHandler = exceptionHandler;
  }

  createHeaders() {

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmQ0NzFjYjE1ODkyNjI5ODAzYjk5ZDAiLCJjb2RlIjoidGhpdmFuIiwiZW1haWxBZGRyZXNzIjoibmd1eWVudHJhbnRoaXZhbkBoY211dGUuZWR1LnZuIiwiZmlyc3ROYW1lIjoiVGhpIFbEg24iLCJzdXJOYW1lIjoiTmd1eeG7hW4gVHLhuqduIiwiaWF0IjoxNjA5MDQxODU0LCJleHAiOjE2MDkxMjgyNTR9.RkOl2B5614F9dzijNxFqlf4PE_0-1oI31F3ZCtAjOvo';
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
    console.log('url', url)
    return url;
  }

  async asyncGet(path) {
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
        
        console.log('blob', blob)
        // var file = window.URL.createObjectURL(blob);
        // window.location.assign(file)
      }).
      catch(err => {
        console.log('edxxxx')
      })
      
    } catch (ex) {
      return {
        hasError: true,
        data: ex,
      };
    }
  }

  async asyncPost(path, data) {
    console.log(path, data)
    try {
      const response = await fetch(this.getUrl(path), {
        method: 'POST',
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

  async asyncPostFile(path, data){
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
        method: 'DELETE',
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
