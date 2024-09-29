const moongose = require('mongoose')

const settingGeneralSchema = new moongose.Schema({
    name_web : String,
    logo : String,
    phone : String,
    address : String,
    email_contact : String,
    copyright : String,
    updatedById : String
}, {
    timestamps: true
});

const SettingGeneral = moongose.model('SettingGeneral', settingGeneralSchema, 'setting-general');

module.exports = SettingGeneral;