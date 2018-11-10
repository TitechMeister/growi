'use strict';
const form = require('express-form');
const field = form.field;

module.exports = form(
  field('settingForm[security:passport-mikan:isEnabled]').trim().toBooleanStrict().required(),
  field('settingForm[security:passport-mikan:cookieName]'),
  field('settingForm[security:passport-mikan:apiUrl]'),
  field('settingForm[security:passport-mikan:loginUrl]')
);
