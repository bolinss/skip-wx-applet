import areaList from '../../../../../config/city';
import dfun from '../../../../../utils/dfun.js';
Page({
  data: {
    areaShow: false,
    areaList,
    realName: '',
    contact: '',
    addressDetailed: '',
    addressProvince: '',
    addressDistrict: '',
    addressCity: '',
    address: '',
    rules: {
      realName: false,
      contact: false,
      address: false,
      addressDetailed: false,
    },
    id: '',
  },
  onLoad: function (option) {
    if (option.action) {
      const action = JSON.parse(option.action);
      const {
        realName,
        contact,
        addressDetailed,
        addressProvince,
        addressDistrict,
        addressCity,
        sysConsigneeAddressId,
      } = action;

      this.setData({
        id: sysConsigneeAddressId,
        realName,
        contact,
        addressDetailed,
        addressProvince,
        addressDistrict,
        addressCity,
        address: `${addressProvince}-${addressDistrict}-${addressCity}`,
      });
    }
  },
  onShow: function () {},
  onChange(e) {
    const { key } = e.target.dataset;
    const value = e.detail;
    this.setData({
      [key]: value,
    });
    let showError = false;
    if (!value) {
      showError = true;
    }
    this.setData({
      [`rules.${key}`]: showError,
    });
  },
  onAreaShowChange(e) {
    this.setData({
      areaShow: !this.data.areaShow,
    });
  },
  selectedArea(e) {
    const [province, district, city] = e.detail.values;
    const address = `${province.name}-${district.name}-${city.name}`;
    this.setData({
      addressProvince: province.name,
      addressDistrict: district.name,
      addressCity: city.name,
      address,
    });
    this.onAreaShowChange();

    if (address) {
      this.setData({
        [`rules.address`]: false,
      });
    }
  },
  submit(e) {
    console.log(this.data.action);
    const {
      realName,
      contact,
      addressDetailed,
      addressProvince,
      addressDistrict,
      addressCity,
    } = this.data;
    const data = {
      realName,
      contact,
      addressDetailed,
      addressProvince,
      addressDistrict,
      addressCity,
    };
    const valid = this.validate();
    if (valid) {
      let type = 'post';
      const id = this.data.id;
      if (id) {
        type = 'put';
        data.sysConsigneeAddressId = id;
      }
      dfun.getAjax(
        '/api/applet-user-consignee-address',
        { ...data },
        type,
        (res) => {
          if (res.succeeded) {
            wx.navigateBack({
              delta: 1,
            });
          }
        }
      );
    }
  },
  validate() {
    const { realName, contact, addressDetailed, address } = this.data;
    const data = {
      realName,
      contact,
      addressDetailed,
      address,
    };
    let valid = true;
    const rules = {};
    for (let key in data) {
      const item = data[key];
      if (!item) {
        rules[key] = true;
        valid = false;
      } else {
        rules[key] = false;
      }
    }
    this.setData({
      rules,
    });
    return valid;
  },
});
