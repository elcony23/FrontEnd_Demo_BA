import axios from 'axios'
export default {
  post: (path:string, data:any, headers?:any, cancelToken?:any) => axios.post(path, data, {headers, cancelToken}).then(({data}) => data).catch(checkError),
  patch: (path:string, data:any, headers?:any, cancelToken?:any) => axios.patch(path, data, {headers, cancelToken}).then(({data}) => data).catch(checkError),
  put: (path:string, data:any, headers?:any) => axios.put(path, data, {headers}).then(({data}) => data).catch(checkError),
  get: (path:string, params:any, headers?:any) => axios.get(path, {params, headers}).then(({data}) => data).catch(checkError),
  delete: (path:string, params:any, headers?:any) => axios.delete(path, {params, headers}).then(({data}) => data).catch(checkError),
};

const checkError = (e:any) => {
  if(e.response && e.response.data && e.response.data.message) {
    const error = new Error(e.response.data.message);
    error.name = e.response.status;
    throw error;
  }
  else if(e.response && e.response.data && e.response.data.error) {
    const error = new Error(e.response.data.error);
    error.name = e.response.status;
    throw error;
  }
  else
    throw e
};