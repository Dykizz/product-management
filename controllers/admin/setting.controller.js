
const SettingGeneral = require('../../models/setting-general.model');
const Account = require('../../models/account.model');
const checkIframeAddress = require('../../helpers/checkIframeAddress')
// [GET] admin/setting/general
module.exports.general = async (_, res) => {
    let setting =  await SettingGeneral.findOne({});
    if (setting){
        const userUpdated = await Account.findOne({_id : setting.updatedById});
        setting.userUpdated = userUpdated.fullName;
    }
    res.render('admin/pages/setting/general.pug', {
        pageTitle: "Cài đặt chung",
        setting : setting
    })
}

// [PATCH] 
module.exports.general_PATCH = async (req, res) => {
    try {
        let { name_web, phone, email_contact , address, copyright } = req.body;
        if (!name_web || !phone || !email_contact  || !address || !copyright) {
            req.flash('warning', 'Hãy điền đầy đủ thông tin để cập nhật!');
            return res.redirect('back');
        }
        const isValidAdrress = checkIframeAddress(address);
        if (!isValidAdrress){
            req.flash('danger','Thẻ iframe không hợp lệ!');
            return res.redirect('back');
        }
        const { user } = res.locals;
        const setting = await SettingGeneral.findOne({});
        const obSetting = { ...req.body, updatedById: user._id.toString() };
        if (!setting) {
            const newSetting = new SettingGeneral(obSetting);
            await newSetting.save();
        } else {
            await SettingGeneral.updateOne({}, { $set: obSetting });

        }
        req.flash('success', 'Cập nhật phần cài đặt chung thành công!');
    } catch (error) {
        req.flash('danger','Quá trình cập nhật có lỗi xảy ra. Vui lòng thử lại sau!');
    }
    return res.redirect('back');

}