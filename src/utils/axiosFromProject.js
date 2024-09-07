import axios from 'axios'
import qs from 'qs'
import store from '../../store/index'
import { USER_LOGOUT } from '../../store/user'
import { LOADING_RESET } from '../../store/loading-server'
import $message from '../message'

axios.defaults.timeout = 30000; // 响应时间

// 请求拦截
axios.interceptors.request.use((config) => {
  config.url = (store.state.config.RESOURCE_URL || '') + config.url;
  if (config.params) {
    // 设置随机参数
    config.params.nowTime = new Date().getTime();
    // 设置错误回调
    if (config.params.errorBack) {
      config.errorBack = true;
      delete(config.params.errorBack);
    }
  }
  if (config.data) {
    // 设置随机参数
    config.data.nowTime = new Date().getTime();
    // 设置错误回调
    if (config.data.errorBack) {
      config.errorBack = true;
      delete(config.data.errorBack);
    }
  }
  if (!config.params && !config.data) {
    config.url += `${config.url.includes('?') ? '&' : '?'}nowTime=${new Date().getTime()}`;
  }
  // 设置token
  if (!config.url.includes('/login')) {
    config.headers.common.token = store.state.user.token;
    config.headers.common.langue = store.state.language.type;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 响应拦截
axios.interceptors.response.use((response) => {
  let { config: { errorBack, method }, data: { message = '' }, status } = response;
  switch (status) {
    case 200:
      method !== 'get' && message && !errorBack && $message({ message });
      return response;
    case 401:
      if (errorBack) {
        return response;
      }
      store.dispatch(USER_LOGOUT);
      return false;
    default:
      if (errorBack) {
        return response;
      }
      $message({ message, type: 'error' });
      break;
  }
  return Promise.reject(response);
}, (error) => {
  store.dispatch(LOADING_RESET);
  let { config: { errorBack, method }, data: { message = '' }, status } = error.response;
  switch (status) {
    case 200:
      method !== 'get' && message && !errorBack && $message({ message });
      return error.response;
    case 401:
      if (errorBack) {
        return error.response;
      }
      store.dispatch(USER_LOGOUT);
      return false;
    default:
      if (errorBack) {
        return error.response;
      }
      $message({ message, type: 'error' });
      break;
  }
  return Promise.reject(error);
});

export default {
  get: (url, params = {}) => {
    return new Promise((resolve, reject) => {
      axios.get(url, { params }).then((response) => {
        resolve(response);
      }).catch((error) => {
        console.error(error);
        throw new Error(error);
      });
    }).catch((error) => {
      console.error(error);
      throw new Error(error);
    });
  },
  post: (url, data = {}) => {
    return new Promise((resolve, reject) => {
      axios.post(url, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: [(data) => {
          return qs.stringify(data);
        }]
      }).then((response) => {
        resolve(response);
      }).catch((error) => {
        console.error(error);
        throw new Error(error);
      });
    }).catch((error) => {
      console.error(error);
      throw new Error(error);
    });
  },
  postJson: (url, data = {}) => {
    return new Promise((resolve, reject) => {
      axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' }
      }).then((response) => {
        resolve(response);
      }).catch((error) => {
        console.error(error);
        throw new Error(error);
      });
    }).catch((error) => {
      console.error(error);
      throw new Error(error);
    });
  },
  put: (url, data) => {
    return new Promise((resolve, reject) => {
      axios.put(url, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: [(data) => {
          return qs.stringify(data);
        }]
      }).then((response) => {
        resolve(response);
      }).catch((error) => {
        console.error(error);
        throw new Error(error);
      });
    }).catch((error) => {
      console.error(error);
      throw new Error(error);
    });
  },
  putJson: (url, data) => {
    return new Promise((resolve, reject) => {
      axios.put(url, data, {
        headers: { 'Content-Type': 'application/json' }
      }).then((response) => {
        resolve(response);
      }).catch((error) => {
        console.error(error);
        throw new Error(error);
      });
    }).catch((error) => {
      console.error(error);
      throw new Error(error);
    });
  },
  delete: (url) => {
    return new Promise((resolve, reject) => {
      axios.delete(url).then((response) => {
        resolve(response);
      }).catch((error) => {
        console.error(error);
        throw new Error(error);
      });
    }).catch((error) => {
      console.error(error);
      throw new Error(error);
    });
  },
}
