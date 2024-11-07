// pages/uc/perfect_information/perfect_information.js
var dmNetwork = require("../../../utils/network.js");
import { OCR } from "../../../utils/ocr";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    real_name: "",
    mobile: "",
    idnumber: "",
    detail_address: "",
    detail_address_flag: true,
    detail_unit_company: "",
    detail_unit_company_flag: true,
    detail_leaving_reason_flag: true,
    detail_nocontract_reason_flag: true,
    detail_leaving_reason: "",
    detail_nocontract_reason: "",
    real_name_enable_flag: true,
    mobile_enable_flag: true,
    idnumber_enable_flag: true,
    detail_address_enable_flag: true,
    is_protocol_supplement_info: 0,
    is_has_extend: false,  //扩展字段-文本
    extend_info: [], //扩展信息-文本
    extend_fields_flag: [],
    fields_1: "", //扩展信息1-文本
    fields_2: "", //扩展信息1-文本
    fields_3: "", //扩展信息1-文本
    fields_4: "", //扩展信息1-文本
    fields_5: "", //扩展信息1-文本
    team_id: "",
    project_id: "",
    protocol_order_id: "",
    index: -1,
    employer: "",
    company: [],
    frontCardImg: "",
    backCardImg: "",
    uploadFrontImg: "",
    uploadBackImg: "",
    bank_images: "",
    health_images: "",
    bank_images_view: "",
    health_images_view: "",
    is_upload_idcard_info: 0,
    is_social: false,
    is_ocr_check: 1,
    newOcrData: {},
    group_id: "",
    nature_list: [],
    nature_register: [],
    nationText: "",
    nationId: "",
    natureRegisterText: "",
    natureRegisterId: "",
    registerResidence: "",
    registerResidenceText: "",
    placeAddress: "",
    placeAddressText: "",
    addressText: "",
    sign_channel: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      team_id: options.team_id,
      is_protocol_supplement_info: options.is_protocol_supplement_info,
      is_upload_idcard_info: options.is_upload_idcard_info,
      is_social: options.is_social == "true",
      // agreement_num: options.agreement_num,
      // protocol_type: options.protocol_type,
      project_id: options.project_id,
      protocol_order_id: options.protocol_order_id,
      is_ocr_check: options.is_ocr_check,
      group_id: options.group_id,
      sign_channel: options.sign_channel,
    });
    // this.getFormFields(options);
    that
      .getauthentication(options.project_id)
      .then(
        (result) => {
          that.initBaseInfoAndCardData(result);
            console.log("getauthentication1==", result.extend);
          if(result.extend != ""){
            //const extend_v = {"fields_1": "哈哈哈", "fields_2": "冲冲冲"};
            //console.log("getauthentication2==", extend_v);
            console.log("getauthentication3==", this.data.extend_fields_flag);

              //用户扩展数据赋值,下一步提交时 传参需要 fields_1=xxx&fields_2=xxx
              for (let key in result.extend) {
                  if (result.extend.hasOwnProperty(key) && result.extend[key].value) {
                      console.log(key + ": " + result.extend[key].fields + "-" + result.extend[key].value);
                      this.data.extend_fields_flag[result.extend[key].fields] = true;
                        that.setData({
                            [result.extend[key].fields] :  result.extend[key].value,
                        });
                  }
              }
            console.log("getauthentication4==", this.data.extend_fields_flag);
              that.setData({
                is_has_extend: true,
                extend_info: result.extend,
                extend_fields_flag: this.data.extend_fields_flag
              });
          }
          result.is_company &&
            that.getCompany().then((companyData) => {
              that.setData({
                company: companyData.list,
              });
            });
          options.is_social == "true" &&
            that
              .getPersonalFormFields(options.project_id)
              .then((personalData) => {
                that.setData({
                  nature_register: personalData.nature_register,
                  nature_list: personalData.nature_list,
                });
                that.initCustomFields(result, personalData);
              });
        },
        (err) => {
          console.log("then err", err);
        }
      )
      .catch((err) => {
        console.log("cacth error", err);
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  getauthentication: function (project_id) {
    return new Promise((resolve, reject) => {
      dmNetwork.get(dmNetwork.getauthentication, { project_id }, (res) => {
        const { data, errmsg, errno } = res.data;
        if (errno == 0 && data) {
          resolve(data);
        } else {
          reject(errmsg);
        }
      });
    });
  },
  // 初始化基本信息及证件信息
  initBaseInfoAndCardData: function (data) {
    const that = this;
    const allFormData = { ...data };
    that.setData({
      real_name: allFormData.real_name,
      mobile: allFormData.mobile,
      idnumber: allFormData.idnumber,
      detail_address: allFormData.detail_address,
      employer: allFormData.is_company,
      bank_images_view: allFormData.bank_images,
      health_images_view: allFormData.health_images,
      frontCardImg: allFormData.card_front,
      backCardImg: allFormData.card_back,
      uploadFrontImg: allFormData.card_front,
      uploadBackImg: allFormData.card_back,
      bank_images: allFormData.bank_images,
      health_images: allFormData.health_images,
      real_name_enable_flag: !allFormData.real_name,
      mobile_enable_flag: !allFormData.mobile,
      idnumber_enable_flag: !allFormData.idnumber,
      detail_address_enable_flag: !allFormData.detail_address,
    });
  },
  //获取个人基本信息表单字段
  getPersonalFormFields: function (project_id) {
    var that = this;
    return new Promise((resolve, reject) => {
      dmNetwork.get(dmNetwork.getFormFields, { project_id }, (res) => {
        const { data, errno, errmsg } = res.data;
        if (errno == 0 && data) {
          resolve(data);
        } else {
          reject(errmsg);
        }
      });
    });
  },
  /**
   * 获取用人单位
   * @param {*} e
   */
  getCompany: function () {
    const that = this;
    return new Promise((resolve, reject) => {
      dmNetwork.get(
        dmNetwork.getCompany,
        { page_no: 1, page_size: 10000 },
        (res) => {
          const { data, errno, errmsg } = res.data;
          if (errno == 0 && data) {
            resolve(data);
          } else {
            reject(errmsg);
          }
        }
      );
    });
  },
  // 初始化个人基本信息表单字段
  initBaseInfoFormFields: function (data) {},

  next: function () {
    const that = this;
    if (!that.checkFormData()) {
      return;
    }
    if (this.data.is_social && !that.checkFormDataNew()) {
      return;
    }

    if(this.data.sign_channel == 1 ){
      wx.showLoading({
        title: "加载中",
        mask: true,
      });
      const { ocrParams, otherInfoParams } = that.getOtherInfoParams();
      const allPromise =
        that.data.is_upload_idcard_info == 1 && that.data.is_ocr_check == 1
          ? [that.setOcr(ocrParams), that.setOtherInfo(otherInfoParams)]
          : [that.setOtherInfo(otherInfoParams)];
      console.log("kaieee", allPromise);
      // return
      Promise.all(allPromise)
        .then((v) => {
          console.log("sucess", v);
          dmNetwork.post(dmNetwork.protocol_sign, request_data, (res) => {
            wx.hideLoading();
            if (res.data.errno == 0) {
              //跳转到uc/eSigningPage/eSigningPage
              wx.navigateTo({
                url: '/pages/uc/eSigningPage/eSingingPage?project_id=' + that.data.project_id + '&team_id=' + that.data.team_id
              });
            } else {
              wx.showToast({
                title: res.data.errmsg,
                icon: "none",
              });
            }
          });
        })
        .catch((err) => {
          // that.hideLoading()
          console.log("faile", err);
        });
      var request_data = {
        protocol_order_id: this.data.protocol_order_id,
        team_id: that.data.team_id,
        project_id: that.data.project_id,
        code: '',
      };
    }else{
      this.otherNext();
    }

  },

  otherNext: function () {
    const that = this;

    const { ocrParams, otherInfoParams } = that.getOtherInfoParams();
    console.log("kaieee", ocrParams);
    console.log("kaieee", otherInfoParams);
    // return;
    that.loading();
    const allPromise =
      that.data.is_upload_idcard_info == 1 && that.data.is_ocr_check == 1
        ? [that.setOcr(ocrParams), that.setOtherInfo(otherInfoParams)]
        : [that.setOtherInfo(otherInfoParams)];
    console.log("kaieee", allPromise);
    // return
    Promise.all(allPromise)
      .then((v) => {
        that.hideLoading();
        console.log("sucess", v);
        const navigateUrl = `../contract_signing_new/contract_signing_new?project_id=${that.data.project_id}&team_id=${that.data.team_id}`;
        wx.navigateTo({
          url: navigateUrl,
        });
      })
      .catch((err) => {
        // that.hideLoading()
        console.log("faile", err);
      });
    return;
    dmNetwork.get(dmNetwork.doauthentication, params, (res) => {
      wx.hideLoading();
      let navigateUrl = `../contract_signing_new/contract_signing_new?project_id=${that.data.project_id}&team_id=${that.data.team_id}`;
      if (res.data.errno == 0) {
        wx.navigateTo({
          url: navigateUrl,
        });
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: "none",
        });
      }
    });
  },
  // ocr 请求
  setOcr(params) {
    return new Promise((resolve, reject) => {
      dmNetwork.get(dmNetwork.auth, params, (res) => {
        if (res.data.errno == 0 || res.data.errno == 29022) {
          resolve(res.data);
        } else {
          reject();
        }
      });
    });
  },
  // 其他请求
  setOtherInfo(params) {
    return new Promise((resolve, reject) => {
      dmNetwork.get(dmNetwork.doauthentication, params, (res) => {
        if (res.data.errno == 0) {
          resolve(res.data);
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: "none",
            duration: 3000,
          });
          reject();
        }
      });
    });
  },
  initCustomFields: function (result, personalData) {
    console.log("result....", result);
    console.log("personalData....", personalData);
    const natureList = personalData.nature_list;
    const natureRegister = personalData.nature_register;
    const nation = natureList.find((v) => v.id == result.nation);
    const nature = natureRegister.find((v) => v.id == result.nature_register);
    const registerResidence = result.register_residence.split(",")[1];
    const registerResidenceCode = result.register_residence;
    const placeAddress = result.place_address.split(",");
    this.setData({
      nationText: nation.name,
      nationId: nation.id,
      natureRegisterText: nature.name,
      natureRegisterId: nature.id,
      registerResidenceText: registerResidence,
      registerResidence: registerResidenceCode,
      placeAddressText: placeAddress[1],
      placeAddress: placeAddress[0] + "," + placeAddress[1],
      addressText: placeAddress[2],
    });
    // const {
    //   nation,
    //   nature_register,
    //   place_address,
    //   real_name,
    //   register_residence,
    // } = result;
  },
  bindRegionChange: function (e) {
    const { code, value } = e.detail;
    const registerResidence = code[code.length - 1] + "," + value.join("_");
    console.log("ressss", registerResidence);
    this.setData({
      registerResidenceText: value.join("_"),
      registerResidence,
    });
  },
  bindPlaceAddressTextChange: function (e) {
    const { code, value } = e.detail;
    const placeAddress = code[code.length - 1] + "," + value.join("_");
    this.setData({
      placeAddressText: value.join("_"),
      placeAddress,
    });
  },
  handleAddressText: function (e) {
    console.log("eeeeeee", e);
    const { value } = e.detail;
    const addressText = value.replace(/\,|\，/gi, "");
    console.log("adreeee", addressText);
    this.setData({
      addressText,
    });
  },

  // 选择民族
  handleNature: function (e) {
    const { value } = e.detail;
    const { id = "", name = "" } = this.data.nature_list[value];
    this.setData({
      nationText: name,
      nationId: id,
    });
  },
  // 选择户口性质
  handleRegister: function (e) {
    const { value } = e.detail;
    const { id = "", name = "" } = this.data.nature_register[value];
    this.setData({
      natureRegisterText: name,
      natureRegisterId: id,
    });
  },

  real_name: function (e) {
    var value = e.detail.value;
    if (value) {
      this.setData({
        real_name: value,
      });
    } else {
      this.setData({
        real_name: "",
      });
    }
  },

  mobile: function (e) {
    var value = e.detail.value;
    if (value) {
      this.setData({
        mobile: value,
      });
    } else {
      this.setData({
        mobile: "",
      });
    }
  },

  idnumber: function (e) {
    var value = e.detail.value;
    if (value) {
      this.setData({
        idnumber: value,
      });
    } else {
      this.setData({
        idnumber: "",
      });
    }
  },

  detail_address: function (e) {
    var value = e.detail.value;
    if (value) {
      this.setData({
        detail_address: value,
      });
    } else {
      this.setData({
        detail_address: "",
      });
    }
  },
 bind_extend_c: function (e) {
    var value = e.detail.value;
     console.log("bind_extend_c===1", e.detail);
     console.log("bind_extend_c===2", e.currentTarget.dataset.extend_fid);
     let extend_fid = e.currentTarget.dataset.extend_fid;
     console.log("bind_extend_c===3", extend_fid);
    if (value) {
      this.setData({
        //fields_1: value
        [extend_fid] : value
      });
    } else {
      this.setData({
        //fields_1: ""
        [extend_fid] : ""
      });
    }
  },

  bindDateChange(e) {
    this.setData({
      laborRelationsDate: e.detail.value,
    });
  },
  blur_unit_company() {
    if (!this.data.detail_unit_company) {
      return;
    }
    this.setData({
      detail_unit_company_flag: false,
    });
  },
  on_unit_company_txt() {
    this.setData({
      detail_unit_company_flag: true,
    });
  },
  blur_detail_address() {
    if (!this.data.detail_address) {
      return;
    }
    this.setData({
      detail_address_flag: false,
    });
  },
  on_detail_address_txt() {
    this.setData({
      detail_address_flag: true,
    });
  },

    blur_extend_fields(e) {

        let extend_fid = e.currentTarget.dataset.extend_fid;
        //console.log("blur_extend_fields===1", extend_fid);

        if (!this.data[extend_fid]) {
            return;
        }
        this.setData({
            //extend_fields_flag[extend_fid]: false,
            [extend_fid]: e.detail.value,
        });
    },
    /*
    on_extend_fields(e) {

        let extend_fid = e.currentTarget.dataset.extend_fid;
        console.log("on_extend_fields===1", extend_fid);

        this.data.extend_fields_flag[extend_fid] = true;
        this.setData({
            extend_fields_flag: this.data.extend_fields_flag
        });
        console.log("on_extend_fields===2", this.data.extend_fields_flag);
    },
    */

  detail_unit_company: function (e) {
    var value = e.detail.value;
    if (value) {
      this.setData({
        detail_unit_company: value,
      });
    } else {
      this.setData({
        detail_unit_company: "",
      });
    }
  },

  blur_leaving_reason() {
    if (!this.data.detail_leaving_reason) {
      return;
    }
    this.setData({
      detail_leaving_reason_flag: false,
    });
  },
  on_leaving_reason_txt() {
    this.setData({
      detail_leaving_reason_flag: true,
    });
  },
  detail_leaving_reason: function (e) {
    var value = e.detail.value;
    if (value) {
      this.setData({
        detail_leaving_reason: value,
      });
    } else {
      this.setData({
        detail_leaving_reason: "",
      });
    }
  },

  blur_nocontract_reason() {
    if (!this.data.detail_nocontract_reason) {
      return;
    }
    this.setData({
      detail_nocontract_reason_flag: false,
    });
  },
  on_nocontract_reason_txt() {
    this.setData({
      detail_nocontract_reason_flag: true,
    });
  },
  detail_nocontract_reason: function (e) {
    var value = e.detail.value;
    if (value) {
      this.setData({
        detail_nocontract_reason: value,
      });
    } else {
      this.setData({
        detail_nocontract_reason: "",
      });
    }
  },
  pickerChange: function (e) {
    console.log("vvvvvvvv", e);
    this.setData({
      index: e.detail.value,
    });
  },
  // 身份证正面
  async uploadIDcard(e) {
    if (this.data.is_ocr_check == 0) {
      wx.showToast({
        title: "您已经进行过ocr识别，请勿重复上传！",
        icon: "none",
      });
      return;
    }
    const target = e.currentTarget.dataset.idcard;
    const ocrUploadConfig = {
      isOcr: true,
      frontCardImg: "front_image",
      backCardImg: "back_image",
      ocrUrl: "/sea/api/1.0/client/v1/user/ocr/idcard?dmclient=weixinxcx",
    };
    const [error, uploadData] = await OCR.uploadImg(target, ocrUploadConfig);
    console.log("uploaddata.....", uploadData);
    this.getCardimg(uploadData);
  },
  // 健康证和银行卡
  async uploadHealthWithBankCard(e) {
    const target = e.currentTarget.dataset.ordinary;
    const uploadConfig = {
      isOcr: false,
      ocrUrl: "/sea/api/1.0/client/v1/user/ocr/idcard?dmclient=weixinxcx",
    };
    const [error, uploadData] = await OCR.uploadImg(target, uploadConfig);
    console.log("uploaddata.....", uploadData);
    this.getCardimg(uploadData);
  },
  //获取健康证和银行卡图片
  getCardimg({ target, zipPath, newDoumiData, newOcrData }) {
    const that = this;
    const cardImgConfig = {
      frontCardImg: {
        uploadImgView: "frontCardImg",
        uploadImg: "uploadFrontImg",
      },
      backCardImg: {
        uploadImgView: "backCardImg",
        uploadImg: "uploadBackImg",
      },
      healthCard: {
        uploadImgView: "health_images_view",
        uploadImg: "health_images",
      },
      bankCard: {
        uploadImgView: "bank_images_view",
        uploadImg: "bank_images",
      },
    };
    if (target == "frontCardImg") {
      wx.setStorageSync("upload_idcard_number", newOcrData.data.idcard_number);
      // that.setData({
      //   newOcrData
      // })
    }
    that.setData({
      [cardImgConfig[target].uploadImgView]: zipPath,
      [cardImgConfig[target].uploadImg]: newDoumiData.info[0].url,
    });
  },
  // 校验
  checkFormData() {
    const that = this;
    if (
      !(
        that.data.real_name &&
        that.data.mobile &&
        that.data.idnumber &&
        that.data.detail_address
      )
    ) {
      wx.showToast({
        title: "请填写姓名、手机号、身份证号、居住地区等基本信息！",
        icon: "none",
      });
      return;
    }
    console.log("e", that.data.newOcrData);
    const upload_idcard_number = wx.getStorageSync("upload_idcard_number");
    if (
      upload_idcard_number &&
      that.data.idnumber &&
      upload_idcard_number != that.data.idnumber
    ) {
      wx.showToast({
        title: "请上传本人身份证！",
        icon: "none",
      });
      return;
    }
    if (that.data.employer && that.data.index == -1) {
      wx.showToast({
        title: "请选择用人单位！",
        icon: "none",
      });
      return;
    }
    if (
      that.data.is_protocol_supplement_info == 1 &&
      !(
        that.data.detail_unit_company &&
        that.data.laborRelationsDate &&
        that.data.detail_leaving_reason &&
        that.data.detail_nocontract_reason
      )
    ) {
      wx.showToast({
        title:
          "请填选择或写原单位名称、原单位解除劳动关系时间、离职原因、无法出具原单位解除劳动关系证明原因！",
        icon: "none",
      });
      return;
    }
    if (
      that.data.is_upload_idcard_info == 1 &&
      !(that.data.uploadFrontImg && that.data.uploadBackImg)
    ) {
      wx.showToast({
        title: "请上传身份证正面、身份证反面等信息！",
        icon: "none",
      });
      return;
    }
    console.log(that.data.bank_images);
    console.log(that.data.health_images);
    if (
      that.data.is_upload_idcard_info == 1 &&
      !(that.data.bank_images && that.data.health_images)
    ) {
      wx.showToast({
        title: "请上传健康证、银行卡等信息！",
        icon: "none",
      });
      return;
    }
    return true;
  },
  // 校验自定义字段
  checkFormDataNew() {
    //addressText
    if (!this.data.nationId) {
      wx.showToast({
        title: "请选择民族！",
        icon: "none",
      });
      return;
    }
    if (!this.data.natureRegisterId) {
      wx.showToast({
        title: "请选择户口性质！",
        icon: "none",
      });
      return;
    }
    if (!this.data.registerResidence) {
      wx.showToast({
        title: "请选择户口所在地！",
        icon: "none",
      });
      return;
    }
    if (!this.data.placeAddress) {
      wx.showToast({
        title: "请选择居住地！",
        icon: "none",
      });
      return;
    }
    if (!this.data.addressText) {
      wx.showToast({
        title: "请输入详细居住地址",
        icon: "none",
      });
      return;
    }
    return true;
  },
  // 格式化图片
  formatImgUrl(url) {
    return url.replace(/https:\/\/work\.doumi\.com\/show\.php\?p=/g, "");
  },
  // 格式化参数
  getOtherInfoParams() {
    const that = this;
    let baseParams = {},
      protocolParams = {},
      employerParams = {},
      uploadCardParams = {},
      customFields = {},
      uploadBackWidthHealthCardParams = {},
      ocrParams = {},
      otherInfoParams = {};
    const { real_name, idnumber, detail_address, mobile, project_id, fields_1, fields_2, fields_3, fields_4, fields_5 } =
      that.data;
      console.log("getOtherInfoParams=1", project_id);

    baseParams = {
      name: real_name,
      idnumber: idnumber,
      detail_address: detail_address,
      mobile: mobile,
      project_id: project_id,
      fields_1: fields_1,
      fields_2: fields_2,
    };
    //扩展自动追加
    if(fields_1 != ""){
        baseParams.fields_1 = fields_1;
    }
    if(fields_2 != ""){
        baseParams.fields_2 = fields_2;
    }
    if(fields_3 != ""){
        baseParams.fields_3 = fields_3;
    }
    if(fields_4 != ""){
        baseParams.fields_4 = fields_4;
    }
    if(fields_5 != ""){
        baseParams.fields_5 = fields_5;
    }

    if (that.data.is_protocol_supplement_info == 1) {
      const {
        detail_unit_company,
        laborRelationsDate,
        detail_leaving_reason,
        detail_nocontract_reason,
        protocol_order_id,
      } = that.data;
      protocolParams = {
        original_company: detail_unit_company,
        leave_date: laborRelationsDate,
        leave_reason: detail_leaving_reason,
        no_leave_certify_reason: detail_nocontract_reason,
        protocol_order_id: protocol_order_id,
      };
    }

    if (that.data.employer) {
      const { company, index } = that.data;
      employerParams = {
        employer_id: company[index].id,
      };
    }
    if (that.data.is_upload_idcard_info == 1) {
      const { uploadFrontImg, uploadBackImg, bank_images, health_images } =
        that.data;
      uploadCardParams = {
        card_front: that.formatImgUrl(uploadFrontImg),
        card_back: that.formatImgUrl(uploadBackImg),
      };
      uploadBackWidthHealthCardParams = {
        bank_images: that.formatImgUrl(bank_images),
        health_images: that.formatImgUrl(health_images),
      };
    }
    if (this.data.is_social) {
      customFields = {
        nation: this.data.nationId,
        nature_register: this.data.natureRegisterId,
        register_residence: this.data.registerResidence,
        place_address: this.data.placeAddress + "," + this.data.addressText,
      };
    }
    ocrParams = {
      name: baseParams.name,
      idnumber: baseParams.idnumber,
      ...uploadCardParams,
    };
    otherInfoParams = {
      ...baseParams,
      ...protocolParams,
      ...employerParams,
      ...uploadBackWidthHealthCardParams,
      ...customFields,
    };
    return {
      ocrParams,
      otherInfoParams,
    };
  },
  loading: function () {
    wx.showLoading({
      title: "",
      mask: true,
    });
  },
  hideLoading: function () {
    wx.hideLoading({
      title: "",
      mask: true,
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
