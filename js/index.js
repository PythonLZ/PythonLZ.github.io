var vm = new Vue({
    el: '#app',
    // 修改Vue变量的读取语法，避免和django模板语法冲突
    delimiters: ['[[', ']]'],
    data: {
        host,
        username: sessionStorage.username || localStorage.username,
        user_id: sessionStorage.user_id || localStorage.user_id,
        token: sessionStorage.token || localStorage.token,
        //存储新增返回值
        expires_at:sessionStorage.expires_at || localStorage.expires_at,
        cart_total_count: 0, // 购物车总数量
        cart: [], // 购物车数据,
        f1_tab: 1, // 1F 标签页控制
        f2_tab: 1, // 2F 标签页控制
        f3_tab: 1, // 3F 标签页控制
    },
    mounted: function(){
        this.get_cart();
    },
    methods: {
        // 退出
        logout: function(){
            sessionStorage.clear();
            localStorage.clear();
            location.href = '/login.html';
        },
        // 获取购物车数据
        get_cart: function(){
            axios.get(this.host+'/cart/', {
                    headers: {
                        'Authorization': 'JWT ' + this.token
                    },
                    responseType: 'json',
                    withCredentials: true
                })
                .then(response => {
                    this.cart = response.data;
                    this.cart_total_count = 0;
                    for(var i=0;i<this.cart.length;i++){
                        if (this.cart[i].name.length>25){
                            this.cart[i].name = this.cart[i].name.substring(0, 25) + '...';
                        }
                        this.cart_total_count += this.cart[i].count;

                    }
                })
                .catch(error => {
                    console.log(error.response.data);
                })

        },
        //tianjiashoucangjia
        addFavorite:function(sURL, sTitle){
            try{
                window.external.addFavorite(sURL, sTitle)
            }
            catch(e){
                try{
                    window.sidebar.addPanel(sTitle, sURL, "")
                }
                catch(e){
                    alert("按快捷键_Ctrl+D_进行添加")
                }
            }
        },
    }
});
