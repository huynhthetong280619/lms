import cookie from "cookie"

export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie)
}

export function isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        return false;
      }
    }
  
    return JSON.stringify(obj) === JSON.stringify({});
  }