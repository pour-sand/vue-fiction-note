// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import iView from 'iview'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'whatwg-fetch'
import 'element-ui/lib/theme-chalk/index.css'
import '!style-loader!css-loader!less-loader!./theme/index.less'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
    storage: window.sessionStorage
});

Vue.config.productionTip = false
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios;
Vue.use(iView)
Vue.use(ElementUI)
Vue.use(Vuex)

//Vuex配置
const store = new Vuex.Store({
  state: {
    domain:'http://localhost:8090', //保存后台请求的地址，修改时方便（比方说从测试服改成正式服域名）
    userInfo: { //保存用户信息
      nick: null,
      uid: null,
      sex: null,
      role: "visitor",
      photo: null
    }
  },
  mutations: {
    //更新用户信息
    updateUserInfo(state, newUserInfo) {
      state.userInfo = newUserInfo;
    },
    defaultUserInfo(state){
      state.userInfo.nick = null;
      state.userInfo.uid = null;
      state.userInfo.sex = null;
      state.userInfo.role = "visitor";
      state.userInfo.photo = null;
    }
  },
  getters: {
    getRole: function(state){
      console.log("role "+state.userInfo.role);
      return state.userInfo.role;
    },
    getUid: function(state){
      return state.userInfo.uid;
    },
    getUserInfo: function(state){
      return state.userInfo;
    },
    getPhoto: function(state){
      return state.userInfo.photo;
    }
  },
  plugins: [vuexLocal.plugin]
})

//设置cookie
Vue.prototype.setCookie = function(c_name,value,expiredays) {
  var exdate=new Date()
  exdate.setDate(exdate.getDate()+expiredays)
  document.cookie=c_name+ "=" + escape(value) +
    ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
    console.log("setCookie====" + document.cookie);
};

//获取cookie
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}
Vue.prototype.getCookie = getCookie;

//删除cookie
Vue.prototype.delCookie =(name) => {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

/* eslint-disable no-new */
new Vue({
  data: {},
  el: '#app',
  render: h => h(App),
  router,
  store,
  watch:{
    "$router": 'checkLogin'
  },
  methods:{
    checkLogin(){
      //检查是否存在session
      if(!this.getCookie('userName')){
        console.log("checkLogin#####"+this.getCookie('nick'))
        this.$router.push('/login');
      }else{
        this.$router.push('/note');
      }
    }
  },
  template: '<App/>',
  components: { App }
})
