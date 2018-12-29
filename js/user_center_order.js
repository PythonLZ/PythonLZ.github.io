var vm = new Vue({
    el:'#app',

    data:{
        host,
        user_id: sessionStorage.user_id || localStorage.user_id,
        token: sessionStorage.token || localStorage.token,
        order_id:null,// 整个订单对象 keyi
        order_list:[],// 订单列表

    },

    mounted:function(){
        if(this.user_id && this.token){
            axios.get(this.host+'/orders/info/',{
            headers: {
                'Authorization': 'JWT ' + this.token
            },
            responseType: 'json'
        }).then((response)=>{
            this.order_id = response.data.order_id;//所有订单对象
            for(var k in this.order_id){
                this.order_list.push(k);
            }

        }).catch(error=>{
            alert(error)
        })
        }

    },

    methods:{

    }
});