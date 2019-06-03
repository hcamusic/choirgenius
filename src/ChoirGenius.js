const axios = require('axios');
const qs = require('qs');
const pDoWhilst = require('p-do-whilst');
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
    let status;

    await pDoWhilst(
      async () => {
        const result = await this._axios({
          method: 'post',
          url: '/gtable/member_list/action',
          headers: {
            'x-requested-with': 'XMLHttpRequest'
          },
          withCredentials: true,
          maxRedirects: 0,
          data: qs.stringify({
            gtable_action: 'export_selected',
            'gtable_ids[]': 'select_all'
          })
        });

        status = result.data.status;
      },
      () => status !== 'done'
    );

    const exportResult = await this._axios.get('/g/members/export');
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

  async getEvents(start, end) {
    const { data } = await this._axios.get('/g/calendar/events', {
      params: {
        start,
        end
      }
    });

    return data;
  }

  async emailEvent(options) {
    // subject: Another Test
    // message: Testy Test
    // sendto: none
    // reply-to: reply-to-me
    // include-links: 1
    // op: Send
    // form_build_id: form-7hPI_JTIM-rQCEKR35NImmzQAeId_lQCoP6GiIYdm7E
    // form_token: lKcAgXIAXOkGJuJ1vGhmoQf4W59352Xav6clC3DHe1I
    // form_id: gb_attendance_message_form
  }
}

module.exports = ChoirGenius;
