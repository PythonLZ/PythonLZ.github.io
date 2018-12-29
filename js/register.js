var vm = new Vue({
	el: '#app',
	data: {
	    // host:host,
        host,
		error_name: false,
		error_password: false,
		error_check_password: false,
		error_phone: false,
		error_allow: false,
		error_image_code: false,
		// error_sms_code: false,

		username: '',
		password: '',
		password2: '',
		mobile: '', 
		image_code: '',
		// sms_code: '',
		allow: false,

        image_code_id: '', // uuid
        image_code_url: '', // 访问后端视图的地址，得到image

        // sending_flag: false, // 是否正在发送短信的标识
        // sms_code_tip: '获取短信验证码', // 获取短信验证码的提示文字
        error_image_code_message: '', // 图片验证码错误提示

        error_name_message: '', // 用户名输入框错误提示
        error_phone_message: '', // 手机号码输入框错误提示
        error_sms_code_message: '', // 对象验证码错误提示


	},
	// 当模板渲染结束时会被调用的
	mounted: function () {
		// 调用生成访问后端接口的地址
		this.generate_image_code();
    },
	methods: {
		// 生成uuid
		generate_uuid: function(){
			var d = new Date().getTime();
			if(window.performance && typeof window.performance.now === "function"){
				d += performance.now(); //use high-precision timer if available
			}
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (d + Math.random()*16)%16 | 0;
				d = Math.floor(d/16);
				return (c =='x' ? r : (r&0x3|0x8)).toString(16);
			});
			return uuid;
		},
		// 生成一个图片验证码的编号，并设置页面中图片验证码img标签的src属性
		generate_image_code: function(){
			// 生成一个编号
			// 严格一点的使用uuid保证编号唯一， 不是很严谨的情况下，也可以使用时间戳
			this.image_code_id = this.generate_uuid();

			// 设置页面中图片验证码img标签的src属性
			// this.image_code_url = 'http://127.0.0.1:8000' + "/image_codes/" + this.image_code_id + "/";
            this.image_code_url = this.host + "/image_codes/" + this.image_code_id + "/";
		},
		// 检查用户名
        check_username: function (){
            var len = this.username.length;
            if(len<5||len>20) {
                this.error_name_message = '请输入5-20个字符的用户名';
                this.error_name = true;
            } else {
                this.error_name = false;
            }
            // 检查重名
            if (this.error_name == false) {
                axios.get(this.host + '/usernames/' + this.username + '/count/', {
                        responseType: 'json'
                    })
                    .then(response => {
                        if (response.data.count > 0) {
                            this.error_name_message = '用户名已存在';
                            this.error_name = true;
                        } else {
                            this.error_name = false;
                        }
                    })
                    .catch(error => {
                        console.log(error.response.data);
                    })
            }
        },
		check_pwd: function (){
			var len = this.password.length;
			if(len<8||len>20){
				this.error_password = true;
			} else {
				this.error_password = false;
			}		
		},
		check_cpwd: function (){
			if(this.password!=this.password2) {
				this.error_check_password = true;
			} else {
				this.error_check_password = false;
			}		
		},
		// 检查手机号
        check_phone: function (){
            var re = /^1[345789]\d{9}$/;
            if(re.test(this.mobile)) {
                this.error_phone = false;
            } else {
                this.error_phone_message = '您输入的手机号格式不正确';
                this.error_phone = true;
            }
            if (this.error_phone == false) {
                axios.get(this.host + '/mobiles/'+ this.mobile + '/count/', {
                        responseType: 'json'
                    })
                    .then(response => {
                        if (response.data.count > 0) {
                            this.error_phone_message = '手机号已存在';
                            this.error_phone = true;
                        } else {
                            this.error_phone = false;
                        }
                    })
                    .catch(error => {
                        console.log(error.response.data);
                    })
            }
        },
		check_image_code: function () {
            // if (!this.image_code) {
            //     this.error_image_code = true;
            // } else {
            //     this.error_image_code = false;
            // }
            if (this.image_code.length != 4) {
                this.error_image_code = true;
                this.error_image_code_message = '图片验证码长度不正确!';
            }else{
                // 发送ajax请求，来判断填写的4个字符是否和图片验证吗一样，忽略大小写
                // 如果一致，则通过，不一致则显示错误信息
                //axios.get(this.host + '/image_codes/' + this.mobile + '/?text=' + this.image_code+'&image_code_id='+ this.image_code_id
                axios.get(this.host + "/image_codes/text/" + this.image_code_id + "/").then((response) => {
                    var getText = response.data.text.toLowerCase();
                    console.log(this.image_code)
                    if (getText === this.image_code.toLowerCase()) {
                        this.error_image_code = false;
                    } else {
                        this.error_image_code = true;
                        this.error_image_code_message = "图片验证码不一致，请重试";
                    }
                    console.log(getText)


                }).catch(()=> {
                    this.error_image_code_message = '发送到服务器失败';
                })
            }

        },


		check_allow: function(){
			if(!this.allow) {
				this.error_allow = true;
			} else {
				this.error_allow = false;
			}
		},

		// 注册
        on_submit: function(){
            this.check_username();
            this.check_pwd();
            this.check_cpwd();
            this.check_phone();
            this.check_image_code();
            this.check_allow();

            if(this.error_name == false && this.error_password == false && this.error_check_password == false
                && this.error_phone == false  && this.error_allow == false
            && this.error_image_code == false) {
                axios.post(this.host + '/users/', {
                        username: this.username,
                        password: this.password,
                        password2: this.password2,
                        mobile: this.mobile,
                        // sms_code: this.sms_code,
                        allow: this.allow.toString()
                    }, {
                        responseType: 'json'
                    })
                    .then(response => {

                        // 记录用户的登录状态
                        sessionStorage.clear();
                        localStorage.clear();
                        localStorage.token = response.data.token;
                        localStorage.username = response.data.username;
                        localStorage.user_id = response.data.id;
                        localStorage.expires_at = response.expires_at;
                        location.href = '/index.html';
                    })
                    .catch(error=> {
                        if (error.response.status == 400) {
                            if ('non_field_errors' in error.response.data) {
                                this.error_sms_code_message = error.response.data.non_field_errors[0];
                            } else {
                                this.error_sms_code_message = '数据有误';
                            }
                            this.error_sms_code = true;
                        } else {
                            console.log(error.response.data);
                        }
                    })
            }
        }
	}
});
