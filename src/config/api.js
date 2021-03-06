import axios from 'axios'
import { stage } from '../config/credentials'
import  { Cache } from 'aws-amplify';

const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';

const makeRequestApi = (url, method, data) =>
  new Promise((resolve, reject) => {
    axios({
      url: url,
      method: method,
      headers: {'content-type': 'application-json','Authorization': Cache.getItem('userApp').token},
      data: JSON.stringify(data)
    })
      .then(data => {
        if (data.errors) reject(data.errors[0].message)
        else resolve(data.data)
      })
      .catch(err => {
        if (err.response && err.response.data) return reject(err.response.data.message)

        console.log('Unknown error', err)

        reject({ message: 'Unknown error' })
      })
  });

const get = (url, data) => makeRequestApi(url, GET, data);
const post = (url, data) => makeRequestApi(url, POST, data);
const put = (url, data) => makeRequestApi(url, PUT, data);
const remove = (url, data) => makeRequestApi(url, DELETE, data);

export default {
  makeRequestApi,
  get,
  post,
  put,
  remove
}
