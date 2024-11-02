// pages/invite/invite.js
var util = require('../../utils/util.js')
var dmNetwork = require('../../utils/network.js')
var checkBank = require('../../utils/checkBank.js')
import { OCR } from "../../utils/ocr";
var app = getApp()

var inviteData = {}
var getcode = ''
var codeTimer = true
var resultData=[]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: "",
    sexArray: ['男', '女'],//性别选择器
    carNums:['带车','不带车'],
    contactRelationship:'',
    contactRelationshipList:['父母','配偶','子女','兄弟姐妹','朋友','同事','其他'],
    region: ['广东省', '广州市', '海珠区'],//地区选择器默认值
    // customItem: '全部',
    schoolArray: ['初中及以下', '高中', '大专', '本科', '硕士', '博士及以上'],//学历选择器范围
    inviteData: {
      project_name: "aaa",
      logo: {
        url: "",
        thumb_url: ""
      }
    },
    user_name: '',
    items: [],
    phone: '',
    sexData: '',
    user_height: '',
    user_weight: '',
    user_identity: '',
    user_school: '',
    isshow: false,
    isRight: false,
    sexData: '',//性別
    carNum:'',
    sexId: '',//性别value
    personnel_number: 0,//人员编号
    datail_address: '',//详细地址
    birthData: '',//出生日期
    graduate_date: '',//毕业时间
    entry_date: '',//入职日期
    degree: '',//学历
    specialty: '',//专业
    bank: '',//银行卡开户名
    bank_info: '',//开户行全称
    bank_card_number: 0,//银行卡号    
    showMask:false,
    needNameAuth:0,
    isCounting: false,
    countingTxt: '获取验证码',
    countingTxt2: '',
    province_id: '',
    province_array:[],
    province_name: '',
    province_index: -1,
    bank_provice_id:'',
    isRequieBankProviceId:false,
    city_id: '',
    city_name: '',
    district_id: '',
    district_name: '',
    degreeId: '',//学历ID
    hasPhone: false,//手机号是否可修改
    hasReal_name: false,//是否实名认证
    protocolData: '',//电子协议返回数据
    protocol_user_id: '',//协议用户ID
    protocol_order_id: '',//协议流水号
    arrowsexShow: true,
    arrowbirthShow: true,
    haveTeam: true,//是否有小组名称
    andriodStyle: true,
    showVcode : false,
    pagehidden:false,
    caller: "invite", //getphonemask 调用者
    code: '',
    emergency_contact_person_mobile:'',//紧急联系人手机号
    emergency_contact_person:'',//紧急联系人姓名
    isIdentifyBank:false,
    is_jump_driver_license_info:false,//是否跳转驾照
    customFields:[],
    submitCustomFields:[],
    frontCardImg:'',
    card_front:'',
    backCardImg:'',
    card_back:'',
    is_health_cert:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.code){
    //APP分享
      getcode = options.code
      this.setData({
        code: options.code
      });

    }else{
      var src = decodeURIComponent(options.q)
      var index = src.indexOf('code=')
      getcode = src.substr(index + 5)
      this.setData({
        code: src.substr(index + 5)
      });
    }    

    var that = this
    that.initAjax()
    if (!app.globalData.userInfo)//未登录
    {
      that.setData({
        showMask: true,
      })
    }
    if (options.province_id){
      that.setData({
        province_id: options.province_id,
        province_name: options.province_name,
        city_id: options.city_id,
        city_name: options.city_name,
        district_id: options.district_id,
        district_name: options.district_name
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },  
  //获取项目邀请信息
  initAjax: function () {
    var that = this
    dmNetwork.get(dmNetwork.inviteProject, { code: getcode},(res) => {
      console.log('邀请信息' + JSON.stringify(res.data))
      console.log('邀请team_id：' + JSON.stringify(res.data.data.team_id))
      console.log('邀请project_id：' + JSON.stringify(res.data.data.project_id))
      console.log('邀请group_id：' + JSON.stringify(res.data.data.group_id))
      console.log('是否跳转驾照：' + JSON.stringify(res.data.data.is_jump_driver_license_info))
      if (res.data.errno == 0) {
        
        if (res.data.data.user_in_project) {
          wx.reLaunch({
            url: '../minework/minework?project_id=' + res.data.data.project_id + '&team_id=' + res.data.data.team_id + '&group_id=' + res.data.data.group_id,
          })
        }else{

          that.getPosition();
          // that.initResult(res.data.data.required_form_list);
          this.initCustomFields(res.data.data.required_form_list);
          that.setData({
            pagehidden:true,
            inviteData: res.data.data,
            items: res.data.data.required_field_info,
            customFields:res.data.data.required_form_list,//动态表单
            is_jump_driver_license_info: res.data.data.is_jump_driver_license_info
          })
          that.setData({
            needNameAuth: res.data.data.is_name_auth
          })
          //实名认证
          if (res.data.data.current_user_info.real_name_auth == 1) {
            that.setData({
              hasReal_name: true,
            })
          } else {
            that.setData({
              hasReal_name: false,
            })
          }
          
          //姓名
          if (res.data.data.current_user_info.real_name) {
            that.setData({
              user_name: res.data.data.current_user_info.real_name
            })
          } else {
            that.setData({
              user_name: ''
            })
          }
          //手机号
          if (res.data.data.current_user_info.mobile) {
            that.setData({
              phone: res.data.data.current_user_info.mobile,
              showVcode: false,
              hasPhone: true
            })

          } else {
            that.setData({
              phone: '',
              showVcode: true
            })

          }

          //身份证正面
          if (res.data.data.current_user_info.card_front) {
            that.setData({
              card_front: res.data.data.current_user_info.card_front.replace('https://work.doumi.com/show.php?p=',''),
              frontCardImg:res.data.data.current_user_info.card_front,
            })
          }else{
            that.setData({
              card_front: '',
              frontCardImg:''
            })
          }

          //身份证反面
          if (res.data.data.current_user_info.card_back) {
            that.setData({
              card_back: res.data.data.current_user_info.card_back.replace('https://work.doumi.com/show.php?p=',''),
              backCardImg:res.data.data.current_user_info.card_front,
            })
          }else{
            that.setData({
              card_back: '',
              backCardImg:'',
            })
          }

          //是否有健康证
          if (res.data.data.current_user_info.is_health_cert) {
            let is_health_cert = '';
            if(res.data.data.current_user_info.is_health_cert  == 1){
              is_health_cert = '有'
            }
            if(res.data.data.current_user_info.is_health_cert  == 2){
              is_health_cert = '无'
            }
            that.setData({
              is_health_cert: is_health_cert,
            })
          }else{
            that.setData({
              is_health_cert: ''
            })
          }



          //遍历必填项
          var required_field_info = res.data.data.required_field_info
          var current_user_info = res.data.data.current_user_info
          for (var i = 0; i < required_field_info.length; i++) {
            if (1 == required_field_info[i].id) {
              if (required_field_info[i].value == 1) {
                that.setData({
                  sexData: '男'
                })
              } else if (required_field_info[i].value == 2) {
                that.setData({
                  sexData: '女'
                })
              } else {
                that.setData({
                  sexData: ''
                })
              }
            } else if (2 == required_field_info[i].id) {
              if (0 == required_field_info[i].value) {
                that.setData({
                  user_height: ''
                })
              } else {
                that.setData({
                  user_height: required_field_info[i].value
                })
              }
            } else if (3 == required_field_info[i].id) {
              if (0 == required_field_info[i].value) {
                that.setData({
                  user_weight: ''
                })
              } else {
                that.setData({
                  user_weight: required_field_info[i].value
                })
              }
            } else if (4 == required_field_info[i].id) {
              that.setData({
                user_school: required_field_info[i].value
              })
            } else if (5 == required_field_info[i].id) {
              if (required_field_info[i].value == '') {
                that.setData({
                  birthData: ''
                })
              } else {
                var birth = required_field_info[i].value.replace(/-/g, '年') + '月'
                that.setData({
                  birthData: birth
                })
              }
            } else if (6 == required_field_info[i].id) {
              that.setData({
                user_identity: required_field_info[i].value
              })
            } else if (7 == required_field_info[i].id) {
              //省市区
              that.setData({
                province_id: required_field_info[i].value.province_id,
                city_id: required_field_info[i].value.city_id,
                district_id: required_field_info[i].value.district_id,
              })
            } else if (8 == required_field_info[i].id) {
              that.setData({
                personnel_number: required_field_info[i].value
              })
            } else if (9 == required_field_info[i].id) {
              that.setData({
                datail_address: required_field_info[i].value
              })
            } else if (10 == required_field_info[i].id) {
              //毕业日期
              if (required_field_info[i].value == '') {
                that.setData({
                  graduate_date: ''
                })
              } else {
                var graduate = required_field_info[i].value.replace(/-/g, '年') + '月'
                that.setData({
                  graduate_date: graduate
                })
              }
            } else if (11 == required_field_info[i].id) {
              //入职日期
              if (required_field_info[i].value == '') {
                that.setData({
                  entry_date: ''
                })
              } else {
                var entry = required_field_info[i].value.replace(/-/g, '年') + '月'
                that.setData({
                  entry_date: entry
                })
              }
            } else if (12 == required_field_info[i].id) {
              //学历
              if (required_field_info[i].value != 0 && required_field_info[i].value != '') {

                var degreeId = parseInt(parseInt(required_field_info[i].value) - 1)
                that.setData({
                  degreeId: degreeId
                })
              } else {
                that.setData({
                  degreeId: 0
                })
              }

              if (required_field_info[i].value == 1) {
                that.setData({
                  degree: '初中及以下'
                })
              } else if (required_field_info[i].value == 2) {
                that.setData({
                  degree: '高中'
                })
              } else if (required_field_info[i].value == 3) {
                that.setData({
                  degree: '大专'
                })
              } else if (required_field_info[i].value == 4) {
                that.setData({
                  degree: '本科'
                })
              } else if (required_field_info[i].value == 5) {
                that.setData({
                  degree: '硕士'
                })
              } else if (required_field_info[i].value == 6) {
                that.setData({
                  degree: '博士及以上'
                })
              } else {
                that.setData({
                  degree: ''
                })
              }
            } else if (13 == required_field_info[i].id) {
              that.setData({
                specialty: required_field_info[i].value
              })
            } else if (14 == required_field_info[i].id) {
              that.setData({
                bank: required_field_info[i].value
              })
            } else if (15 == required_field_info[i].id) {
              that.setData({
                bank_info: required_field_info[i].value
              })
            } else if (16 == required_field_info[i].id) {
              if (0 == required_field_info[i].value) {
                that.setData({
                  bank_card_number: ''
                })
              } else {
                that.setData({
                  bank_card_number: required_field_info[i].value
                })
              }
            }else if (18 == required_field_info[i].id) {
              that.setData({
                emergency_contact_person: required_field_info[i].value
              })
            } else if (19 == required_field_info[i].id) {
              that.setData({
                emergency_contact_person_mobile: required_field_info[i].value
              })
            } else if (37 == required_field_info[i].id) {
              //与紧急联系人关系
              if (required_field_info[i].value != 0 && required_field_info[i].value != '') {
                that.setData({
                  contactRelationship: that.data.contactRelationshipList[required_field_info[i].value - 1]
                })
              } else {
                that.setData({
                  contactRelationship: ''
                })
              }
            }else if (20 == required_field_info[i].id) {
              that.setData({
                isRequieBankProviceId: true
              })
            }else if (21 == required_field_info[i].id) {
              if (required_field_info[i].value == 1) {
                that.setData({
                  carNum: '带车'
                })
              } else if (required_field_info[i].value == 2) {
                that.setData({
                  carNum: '不带车'
                })
              } else {
                that.setData({
                  carNum: ''
                })
              }
            }
          } 
        }
      
         
      }
      else
      {
        that.setData({
          pagehidden: true
        })
        // wx.showToast({
        //   title: res.data.errmsg,
        //   icon: "none"
        // })
      }
    },(err) => {
    //网络异常处理
      that.setData({
        pagehidden: true
      })
      wx.showToast({
        title: '服务器异常',
        icon: "none"
      })
    })
  },
  //获取地区数据
  getPosition: function () {
    var that = this
    dmNetwork.get(dmNetwork.invitePosition, { team_id: 0, project_id: 0 }, (res) => {
      if (res.data.errno == 0) {
        var placeDate = res.data.data
        //遍历省
        for (var i = 0; i < placeDate.length; i++){
          if (that.data.province_id == placeDate[i].province_id){
            that.setData({
              province_name: placeDate[i].short_name,
              province_index:i
            })
          }
          let obj={
            province_id:placeDate[i].province_id,
            short_name:placeDate[i].short_name
          };
          that.data.province_array.push(obj)
          var province = placeDate[i];
          province.children = province.child;
          //遍历市
          // if((that.data.province_id == placeDate[i].province_id)
          for (var j = 0; j < province.children.length; j++){
            if (that.data.city_id == province.children[j].city_id){
              that.setData({
                city_name: province.children[j].short_name
              })
            }
            var city = province.children[j];
            city.children = city.child;
            delete province.children[j].child;
            //遍历区
            for (var k = 0; k < city.children.length; k++){
              if (that.data.district_id == city.children[k].district_id){
                that.setData({
                  district_name: city.children[k].short_name
                })
              }
              var district = city.children[k];
              delete city.children[k].district_id;
            }
          }
        }
        console.log('ggggggggggggggggggg',that.data.province_array);
        this.setData({
          province_array:that.data.province_array
        })
      }
    }, (err) => {
      //网络异常处理
      wx.showToast({
        title: '服务器异常',
        icon: "none"
      })
    })
  },
  bindPickerChange(e){
    console.log('eeeeeeeeee',e);
    let value=Number(e.detail.value);
    console.log('eeeeeeeeee',this.data.province_array[value].province_id);

    this.setData({
      bank_provice_id:this.data.province_array[value].province_id,
      province_index:value
    })
  },
  //前往选择省市区
  gotoPostion: function (e) {
    wx.navigateTo({
      url: '../provincelist/provincelist',
    })
  },
  //性别选择器
  bindPickerSex: function (e) {
    var that = this
    if (e.detail.value == 0){ 
      that.setData({
        sexData : '男'
      })     
    }else{     
      that.setData({
        sexData: '女'
      }) 
    }
  },
  bindPickerCarNum:function(e){
    console.log(e)
    var that = this
    if (e.detail.value == 0){ 
      that.setData({
        carNum : '带车'
      })     
    }else{     
      that.setData({
        carNum: '不带车'
      }) 
    }
  },

  bindPickercontactRelationship:function(e){
    console.log(e)
    var that = this
    that.setData({
      contactRelationship: that.data.contactRelationshipList[e.detail.value]
    })
  },
  //出生日期选择器
  bindBirthDateChange: function(e){
    var that = this
    var birth_data = e.detail.value
    birth_data = birth_data.substring(0, 7)
    birth_data = birth_data.replace(/-/g, '年') + '月'
    that.setData({
      birthData: birth_data
    })
  },
  //毕业时间选择器
  bindGraduateDateChange: function (e) {
    var that = this
    var graduateDate = e.detail.value
    graduateDate = graduateDate.substring(0, 7)
    graduateDate = graduateDate.replace(/-/g, '年') + '月'
    that.setData({
      graduate_date: graduateDate
    })
  },
  //入职日期选择器
  bindEntryDateChange: function (e) {
    var that = this
    var entryDate = e.detail.value
    entryDate = entryDate.substring(0, 7)
    entryDate = entryDate.replace(/-/g, '年') + '月'
    that.setData({
      entry_date: entryDate
    })
  },
  //学历选择器
  bindPickerChang: function (e) {
    var that = this
    // var transParam = parseInt(parseInt(e.detail.value) + 1)
    var transParam = parseInt(e.detail.value)
    that.setData({
      degreeId: transParam
    })
    if (e.detail.value == 0) {
      that.setData({
        degree: '初中及以下'
      })
    } else if(e.detail.value == 1) {
      that.setData({
        degree: '高中'
      })
    } else if (e.detail.value == 2) {
      that.setData({
        degree: '大专'
      })
    } else if (e.detail.value == 3) {
      that.setData({
        degree: '本科'
      })
    } else if (e.detail.value == 4) {
      that.setData({
        degree: '硕士'
      })
    } else if (e.detail.value == 5) {
      that.setData({
        degree: '博士及以上'
      })
    }    
  },
  //居住地点选择器
  bindRegionChange: function (e) {
    // console.log("居住地点选择器"+JSON.stringify(e))
    that.setData({
      province_id:e.detail.value[0],
      city_id: e.detail.value[1],
      district_id: e.detail.value[2],
    })
  },
  //引导修改手机号
  // changeTel: function (e) {
  //   wx.navigateTo({
  //     url: '../changetel/changetel',
  //   })
  // },
  //实时获取input
  usernameInput: function (e) {
    this.setData({
      user_name: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  vcodeInput: function (e) {
    this.setData({
      vCode: e.detail.value
    })
  },
  userheightInput: function (e) {
    this.setData({
      user_height: e.detail.value
    })
  },
  userweightInput: function (e) {
    this.setData({
      user_weight: e.detail.value
    })
  },
  useridentityInput: function (e) {
    this.setData({
      user_identity: e.detail.value
    })
  },
  personelnumberInput: function (e) {
    this.setData({
      personnel_number: e.detail.value
    })
  },
  detailaddressInput: function (e) {
    this.setData({
      datail_address: e.detail.value
    })
  },
  userschoolInput: function (e) {
    this.setData({
      user_school: e.detail.value
    })
  },
  specialtyInput: function (e) {
    this.setData({
      specialty: e.detail.value
    })
  },
  bankInput: function (e) {
    this.setData({
      bank: e.detail.value
    })
  },
  bankinfoInput: function (e) {
    this.setData({
      bank_info: e.detail.value
    })
  },
  bankcardInput: function (e) {
    let res=checkBank.bankCardAttribution(e.detail.value);
    this.setData({
      bank_card_number: e.detail.value,
      bank_info:(res!='error'?res.bankName:''),
      isIdentifyBank:(res!='error')
    })
  },
  emergencyPerInput: function (e) {
    this.setData({
      emergency_contact_person: e.detail.value
    })
  },
  emergencyMobInput: function (e) {
    this.setData({
      emergency_contact_person_mobile: e.detail.value
    })
  },
  //获取验证码
  getVCode: function (e) {
    console.log(JSON.stringify(this.data.phone));
    if (!codeTimer) return
    var mobile = this.data.phone;
    var regMobile = /^1\d{10}$/;
    if (mobile == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"

      })
      return
    } else if (!regMobile.test(mobile)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: "none",
      })
      return
    }else{
      this.setData({
        isRight : true
      })
    }
    dmNetwork.get(dmNetwork.bxVcode, { mobile: mobile }, (res) => {
      console.log("验证码" + JSON.stringify(res))
      if (res.data.errno == 0) {
        this.setData({
          isCounting: true
        })
        this.countDown(60);
      }
      else if (res.data.errno == 25017) {
        wx.showToast({
          title: '获取验证码次数已达上限',
        })
      }
      else {
        wx.showToast({
          title: res.data.errmsg,
        })
      }
    }, (err) => {
      //网络异常处理
      wx.showToast({
        title: '服务器异常',
        icon: "none"
      })
    })


  },
  countDown(seconds) {
    codeTimer = false
    this.setData({
      isCounting: true,
      countingTxt2: '60秒后重发'
    })
    var _seconds = seconds;
    var tId;
    tId = setInterval(() => {
      if (_seconds == 0) {
        clearInterval(tId);
        this.setData({
          isCounting: false,
          countingTxt: '重新获取'

        })
        codeTimer = true
      } else {
        _seconds = _seconds - 1;
        this.setData({
          countingTxt2: `${_seconds}秒后重发`
        })
      }
    }, 1000)
  },
  //检验验证码
  checkVcode: function (e) {
    var userName = this.data.user_name;
    var userIdnumber = this.data.user_identity;
    var mobile = this.data.phone;
    var vCode = this.data.vCode;
    if (userName == '') {
      wx.showToast({
        title: '请输入真实姓名',
        icon: "none"
      })
      return
    }
    // if (userIdnumber == '') {
    //   wx.showToast({
    //     title: '请输入身份证号',
    //     icon: "none"
    //   })
    //   return
    // }
    if (mobile == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })
      return
    }
    //未激活用户校验验证码 isRequieBankProviceId
    if (this.data.showVcode) {
      if (!vCode) {
        wx.showToast({
          title: '请输入验证码',
          icon: "none"
        })
        return
      }
    }
    if (this.data.showVcode) {
      dmNetwork.get(dmNetwork.bxVcodeCheck, { mobile: this.data.phone, msg_code: vCode }, (res) => {
        console.log("验证码检查" + JSON.stringify(res))
        if (res.data.errno == 0) {
          if (res.data.data) {
            this.addProject();
          } else {
            wx.showToast({
              title: '验证码填写错误',
              icon: "none"
            })
            return
          }
        }
        else {
          wx.showToast({
            title: res.errmsg,
            icon: "none"
          })
        }
      }, (err) => {
        //网络异常处理
        wx.showToast({
          title: '服务器异常',
          icon: "none"
        })
      })

    } else {
      //已登录用户直接加入项目
      this.addProject()
    }
  },
  //加入项目
  addProject: function () {
    var that = this
    var student = {};
    var addData = [];
    student.user_name = that.data.user_name;
    student.identity = "999999";
    student.phone = that.data.phone;
    for (var i = 0; i < that.data.items.length; i++) {
      if (that.data.items[i].id == 1) {
        if (that.data.sexData == '男') {
          student.gender = 1
        } else if (that.data.sexData == '女') {
          student.gender = 2
        } else {
          wx.showToast({
            title: '请选择性别',
            icon: "none"
          })
          return
        }
      } else if (that.data.items[i].id == 2) {
        if (that.data.user_height != '' && that.data.user_height != 0) {
          student.height = that.data.user_height
        } else {
          wx.showToast({
            title: '请填写身高',
            icon: "none"
          })
          return
        }
      } else if (that.data.items[i].id == 3) {
        if (that.data.user_weight != '' && that.data.user_weight != 0) {
          student.weight = that.data.user_weight
        } else {
          wx.showToast({
            title: '请填写体重',
            icon: "none"
          })
          return
        }
      } else if (that.data.items[i].id == 5) {        
        if (that.data.birthData != '') {
          var changeDate = that.data.birthData.replace(/年/g, '-')
          changeDate = changeDate.replace(/月/g, '')
          student.birthday = changeDate
        } else {
          wx.showToast({
            title: '请选择出生年月',
            icon: "none"
          })
          return
        }
      } else if (that.data.items[i].id == 6) {
        if (that.data.user_identity != '') {
          student.idnumber = that.data.user_identity
        } else {
          wx.showToast({
            title: '请填写身份证号',
            icon: "none"
          })
          return
        }
      } else if (that.data.items[i].id == 7) {
        if (that.data.province_id != '' && that.data.province_id != 0) {
          student.province_id = that.data.province_id
          student.city_id = that.data.city_id
          student.district_id = that.data.district_id
        } else {
          wx.showToast({
            title: '请填写居住地址',
            icon: "none"
          })
          return
        }
      } else if (that.data.items[i].id == 4) {
        if (that.data.user_school != '') {
          student.school = that.data.user_school
        }
      } else if (that.data.items[i].id == 8) {
        if (that.data.personnel_number != '' && that.data.personnel_number != 0) {
          student.personnel_number = that.data.personnel_number
        } else {
          wx.showToast({
            title: '请填写人员编号',
            icon: "none"
          })
          return
        }
      } else if (that.data.items[i].id == 9) {
        if (that.data.datail_address != '') {
          const regex = /^[\u4e00-\u9fa5a-zA-Z0-9\s-]{5,}$/;  
          if (!regex.test(that.data.datail_address)) {  
            wx.showToast({
              title: '地址格式不正确或长度不足',
              icon: "none"
            })
            return false; // 地址格式不正确或长度不足  
          }  
          student.datail_address = that.data.datail_address
        } else {
          wx.showToast({
            title: '请填写详细地址',
            icon: "none"
          })
          return
        }
      } else if (that.data.items[i].id == 10) {
        if (that.data.graduate_date != '' && that.data.graduate_date != 0) {
          var graduateDate = that.data.graduate_date.replace(/年/g, '-')
          graduateDate = graduateDate.replace(/月/g, '')
          student.graduate_date = graduateDate
        } else {
          wx.showToast({
            title: '请填写毕业时间',
            icon: "none"
          })
          return
        }
      } else if (that.data.items[i].id == 11) {
        if (that.data.entry_date != '' && that.data.entry_date != 0) {
          var entryDate = that.data.entry_date.replace(/年/g, '-')
          entryDate = entryDate.replace(/月/g, '')
          student.entry_date = entryDate
        } else {
          wx.showToast({
            title: '请填写入职日期',
            icon: "none"
          })
          return
        }
      } else if (that.data.items[i].id == 12) {
        if (that.data.degree != '') {
          student.degree = parseInt(parseInt(that.data.degreeId) + 1 ) 
        } else {
          wx.showToast({
            title: '请填写学历',
            icon: "none"
          })
          return
        }
      } else if (that.data.items[i].id == 13) {
        if (that.data.specialty != '') {
          student.specialty = that.data.specialty
        } else {
          wx.showToast({
            title: '请填写专业',
            icon: "none"
          })
          return
        }
      } else if (that.data.items[i].id == 14) {
        if (that.data.bank != '' && that.data.bank != 0) {
          student.bank = that.data.bank
        } else {
          wx.showToast({
            title: '请填写银行开户名',
            icon: "none"
          })
          return
        }
      } else if (that.data.items[i].id == 15) {
        if (that.data.bank_info != '') {
          student.bank_info = that.data.bank_info
        } else {
          wx.showToast({
            title: '请填写开户行全称',
            icon: "none"
          })
          return
        }
      } else if (that.data.items[i].id == 16) {
        var n = /^[0-9]*$/;
        if(!(/^[0-9]*$/.test(that.data.bank_card_number))){
          wx.showToast({
            title: '银行卡号需为数字',
            icon: "none"
          })
          return
        }
        if (that.data.bank_card_number != '' && that.data.bank_card_number != 0) {
          student.bank_card_number = that.data.bank_card_number
        } else {
          wx.showToast({
            title: '请填写银行卡号',
            icon: "none"
          })
          return
        }
      }else if (that.data.items[i].id == 18) {
        if (that.data.emergency_contact_person != '') {
          student.emergency_contact_person  = that.data.emergency_contact_person 
        } else {
          wx.showToast({
            title: '请填写紧急联系人姓名',
            icon: "none"
          })
          return
        }
      }else if (that.data.items[i].id == 19) {
        if (that.data.emergency_contact_person_mobile != '') {
          student.emergency_contact_person_mobile = that.data.emergency_contact_person_mobile
        } else {
          wx.showToast({
            title: '请填写紧急联系人电话',
            icon: "none"
          })
          return
        }
      }else if(that.data.items[i].id == 37){
        //与紧急联系人关系
        
        if (that.data.contactRelationship == '') {
          wx.showToast({
            title: '请选择与紧急联系人关系',
            icon: "none"
          })
          return
        }

        student.contact_person_relation = that.data.contactRelationshipList.indexOf(that.data.contactRelationship) + 1

      }else if(that.data.items[i].id == 20){
        if (that.data.bank_provice_id=='') {
          wx.showToast({
            title: '请选择开户行省份',
            icon: "none"
          })
          return
        }else{
          student.bank_provice_id=this.data.bank_provice_id
        }
      }else if(that.data.items[i].id == 21){
        if (that.data.carNum == '带车') {
          student.bring_own_car = 1
        } else if (that.data.carNum == '不带车') {
          student.bring_own_car = 2
        } else {
          wx.showToast({
            title: '请选择是否带车',
            icon: "none"
          })
          return
        }
      }else if(that.data.items[i].id == '34'){
        if(this.data.is_health_cert){
          student.is_health_cert = this.data.is_health_cert == '有' ? '1' : '2'
        }else{
          wx.showToast({
            title: '请选择是否有健康证',
            icon: "none"
          })
          return
        }
      }else if(that.data.items[i].id == '35'){
        if(this.data.card_front){
          student.card_front = this.data.card_front;
        }else{
          wx.showToast({
            title: '请上传身份证正面',
            icon: "none"
          })
          return
        }
      }else if(that.data.items[i].id == '36'){
        if(this.data.card_back){
          student.card_back = this.data.card_back;
        }else{
          wx.showToast({
            title: '请上传身份证反面',
            icon: "none"
          })
          return
        }
      }
    };
    console.log('/////dddd',that.data.submitCustomFields);
    for (var i = 0; i < that.data.submitCustomFields.length; i++) {
      let data=that.data.submitCustomFields[i];
      // debugger
      if(data.info[0].type=="Imageview"&&data.info[0].info.value.length==0){
        wx.showToast({
          title: `请上传${data.info[0].info.title}`,
          icon: "none"
        })
        return
      }

      if(data.info[0].type=="SingleText"&&!data.info[0].info.value){
        wx.showToast({
          title: `请输入${data.info[0].info.title}`,
          icon: "none"
        })
        return
      }
    }
    addData.push(student);
    var jsonData = JSON.stringify(addData)
    var params = {};
    params.user_list = jsonData
    params.form_list=JSON.stringify(this.data.submitCustomFields)
    params.code = getcode
    params.source = "2"
    params.dmclient = "weixinqyxcx"
    params = JSON.stringify(params)
    console.log('传入', params)
    if(this.data.hasReal_name){
      wx.showToast({
        title: '已完成实名认证，正在提交...',
        icon: "loading",
        duration: 10000
      })
    }else{
      wx.showToast({
        title: '请先完成实名认证...',
        icon: "none",
      })
      return;
    }
    // return
    setTimeout(() => {

      dmNetwork.post(dmNetwork.inviteAdd, { "url": 'sea/api/1.0/client/v1/group/member_add_share', "params": params }, (res) => {
        wx.hideToast()
        if (res.data.errno == 0) {
          if(this.data.carNum=='带车'){
            wx.navigateTo({
              url:'../uc/driving_license/driving_license'
            })
          }else{
            wx.reLaunch({
              url: '../minework/minework',
            })
          }
          
        }
        else {
          wx.showToast({
            title: res.data.errmsg,
            icon: "none"
          })
        }
      }, (err) => {
        //网络异常处理
        wx.hideToast()
        wx.showToast({
          title: '服务器异常',
          icon: "none"
        })
      })
    }, 2000)
  },
  //动态表单
  onSingleChange: function (ev) {
    console.log('evvvv>>>',ev);
    let {index,item}=ev.currentTarget.dataset;
    let value = ev.detail.value;
    let fields={
      "form_id":item.field,
      "info":[
          {
              "id":item.id,
              "type":item.type,
              "name":item.name,
              "info":{...item.info,value}
          }
      ]
    };
    this.data.submitCustomFields[index]=fields;
  },
  onUploadimg: function (ev) {
    console.log('././././',ev);
    let {index,item}=ev.currentTarget.dataset;
    let value=ev.detail.value;
    let fields={
      "form_id":item.field,
      "info":[
          {
              "id":item.id,
              "type":item.type,
              "name":item.name,
              "info":{...item.info,value}
          }
      ]
    };
    this.data.submitCustomFields[index]=fields;
    console.log('llllll>>>>',this.data.submitCustomFields);
    return
    resultData[ev.currentTarget.dataset.index].value.url = []
    resultData[ev.currentTarget.dataset.index].value.thumb_url = []
    for (var i = 0; i < ev.detail.value.length; i++) {
      resultData[ev.currentTarget.dataset.index].value.url.push(ev.detail.value[i].url)
      resultData[ev.currentTarget.dataset.index].value.thumb_url.push(ev.detail.value[i].thumb_url)
    }
    console.log('////',resultData);
  },
  initResult(require_field) {
    resultData.splice(0, resultData.length)
    for (var i = 0; i < require_field.length; i++) {
      var item = {}
      item.id = require_field[i].id
      item.type = require_field[i].type
      item.name = require_field[i].info.title
      item.value = require_field[i].info.value
      item.required = require_field[i].info.required

      if (item.type == 'Imageview' && require_field[i].info.check_guide != null) {
        item.value.thumb_url = []
        item.value.url = []
        item.min = require_field[i].info.check_guide.min
        item.max = require_field[i].info.check_guide.max
      }
      resultData.push(item)
      console.log('hshshshshshshssh>>>>>>>>>>>>>>',resultData);
    }
  },
  //初始化动态表单
  initCustomFields(data){
    let newData=data.filter(v=>{
      return v.type=='SingleText'||v.type=='Imageview' 
    });
    this.data.submitCustomFields=newData.map((v,i)=>{
      return {
        "form_id":v.field,
        "info":[
          {
            "id":v.id,
            "type":v.type,
            "name":v.name,
            "info":{...v.info}
          }
        ]
      }
    })
    console.log('mdmmdmdmdmd',this.data.submitCustomFields);
  },

  // 身份证正面
  async uploadIDcard(e) {
    // if (this.data.is_ocr_check == 0) {
    //   wx.showToast({
    //     title: "您已经进行过ocr识别，请勿重复上传！",
    //     icon: "none",
    //   });
    //   return;
    // }
    const target = e.currentTarget.dataset.idcard;
    const ocrUploadConfig = {
      isOcr: true,
      frontCardImg: "front_image",
      backCardImg: "back_image",
      ocrUrl: "/sea/api/1.0/client/v1/user/ocr/idcard?dmclient=weixinxcx",
    };
    const [error, uploadData] = await OCR.uploadImg(target, ocrUploadConfig);
    console.log("uploaddata.....", uploadData);
    let idcard_number = uploadData.newOcrData.data.idcard_number;
    let user_name = uploadData.newOcrData.data.user_name;
    if(!this.data.user_identity || !this.data.user_name){
      //从身份证号中截取出生年月，格式为1990年01月
      let birth = idcard_number.substring(6, 10) + '年' + idcard_number.substring(10, 12) + '月';
      this.setData({
        user_identity:idcard_number,
        user_name,
        hasReal_name:true,
        birthData:birth
      })
    }

    if(uploadData.target == 'frontCardImg' && idcard_number){
      if(idcard_number != this.data.user_identity){
        wx.showToast({
          title: '身份证信息与当前登录人不一致，请重新上传',
        })
        return;
      }
    }

    // this.getCardimg(uploadData);
    //if(uploadData.name == 'front_image')
    if(uploadData.target == 'frontCardImg'){
      //this.frontCardImg = uploadData.zipPath;
      this.setData({
        frontCardImg:uploadData.zipPath,
        card_front:uploadData.newDoumiData.info[0].url
      })
    }
    if(uploadData.target == 'backCardImg'){
      this.setData({
        backCardImg:uploadData.zipPath,
        card_back:uploadData.newDoumiData.info[0].url
      })
    }
    
  },

  bindPickerheath(e){
    var that = this
    if (e.detail.value == 0){ 
      that.setData({
        is_health_cert : '有'
      })     
    }else{     
      that.setData({
        is_health_cert: '无'
      }) 
    }

  },


  //获取详细地址信息
  handleTapGetAddrDetail() {
    wx.chooseLocation({
      success: (res) => {
        console.log(res);
        this.setData({
          datail_address: `${res.address}-${res.name}`
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  
  // }
})