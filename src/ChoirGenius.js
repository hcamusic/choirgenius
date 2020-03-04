const url = require('url');
const axios = require('axios');
const escapeStringRegexp = require('escape-string-regexp');
const qs = require('qs');
const { Cookie } = require('tough-cookie');
const csvjson = require('csvjson');
const _ = require('lodash');

class ChoirGenius {
  constructor(baseURL) {
    this._baseURL = baseURL;

    this._axios = axios.create({ baseURL });
  }

  async login(username, password) {
    const result = await this._axios({
      url: '/user/login',
      method: 'post',
      data: qs.stringify({
        name: username,
        pass: password,
        form_id: 'user_login',
        op: 'Log in'
      }),
      maxRedirects: 0,
      validateStatus: status => status === 302
    });

    const cookies = result.headers['set-cookie']
      .map(Cookie.parse)
      .map(cookie => cookie.cookieString());

    this._axios.defaults.headers.common['Cookie'] = cookies.join('; ');
  }

  async getMembers() {
    const csvPath = escapeStringRegexp(
      url.resolve(this._baseURL, '/system/files/export/')
    );
    const csvPattern = new RegExp(`${csvPath}.*\.csv`);

    const exportStartRedirect = await this._axios.get('/g/admin/export/users', {
      validateStatus: status => status === 302,
      maxRedirects: 0
    });

    const batchActionStart = exportStartRedirect.headers.location;
    const batchActionDo = batchActionStart.replace('op=start', 'op=do');
    const batchActionFinished = batchActionStart.replace(
      'op=start',
      'op=finished'
    );

    await this._axios.get(batchActionStart);
    await this._axios.post(batchActionStart);
    await this._axios.get(batchActionDo);
    const exportDoneRedirect = await this._axios.get(batchActionFinished, {
      validateStatus: status => status === 302,
      maxRedirects: 0
    });

    const finishedPage = await this._axios.get(
      exportDoneRedirect.headers.location
    );

    const [csvDownload] = finishedPage.data.match(csvPattern);

    const exportResult = await this._axios.get(csvDownload);
    const csvData = await csvjson.toObject(exportResult.data, {
      quote: '"'
    });

    return csvData.map(csvUser => {
      const user = {};

      Object.entries(csvUser).forEach(([key, value]) => {
        if (value) {
          user[_.camelCase(key)] = value;
        }
      });

      user.roles = user.roles ? user.roles.split(',') : [];

      return user;
    });
  }
}

module.exports = ChoirGenius;
