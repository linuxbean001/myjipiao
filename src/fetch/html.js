import 'whatwg-fetch'
import 'es6-promise'

export function html(url) {
  var result = fetch(url, {
      credentials: 'include',
      cache: "no-cache",

      headers: {
          'Accept': 'text/plain, */*',
          'Access-Control-Allow-Origin':'*'
      }
  });

  return result;
}
