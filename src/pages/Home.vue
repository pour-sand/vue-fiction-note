<template>
  <div class="home">
    <Row class="header" type="flex" align="middle">
      <div class="logo">
        <img src="" height="30" alt="">
        <span>Fiction</span>NOTE
      </div>
      <VmMsgPush style="margin-left:20px" :data="msgPushData"></VmMsgPush>
      <Dropdown class="login-info" placement="bottom-end">
        <Button type="ghost">
            <img :src="portrait" height="30" alt="portrait">{{ uname }}
            <Icon type="arrow-down-b"></Icon>
        </Button>
        <Dropdown-menu slot="list">
            <Dropdown-item divided>
              <a href="javascript:void(0)" @click="logout"><i class="fa fa-key"></i>Log out</a>
            </Dropdown-item>
            <Dropdown-item divided>
              <a href="javascript:void(0)" @click="userInfo"><i class="fa fa-cog"></i>Setting</a>
            </Dropdown-item>
        </Dropdown-menu>
      </Dropdown>
    </Row>   
    <div class="sidebar">
      <Menu theme="dark" width="100%" class="menu" :active-name="activeName" :accordion="true">
          <Menu-item name="Books">
              <router-link to="/books">
                <i class="fa fa-book"></i>
                All Books
              </router-link>
          </Menu-item>
          
          <Submenu name="DataTable">
              <template slot="title">
                  <i class="fa fa-home"></i>
                  Home
              </template>
              <Menu-item name="Booklist">
                <router-link to="/booklist">
                  <i class="fa fa-list"></i>
                  My Book List 
                </router-link>
              </Menu-item>
              <Menu-item name="Panels">
                  <router-link to="/notes">
                    <i class="fa fa-pencil"></i>
                    My Notes
                  </router-link>
              </Menu-item>
              <Menu-item name="TimeManagement">
                  <router-link to="/time">
                    <i class="fa fa-bar-time"></i>
                    Time Management 
                  </router-link>
              </Menu-item>
              <Menu-item name="Charts">
                  <router-link to="/charts">
                    <i class="fa fa-bar-chart"></i>
                    My Charts 
                  </router-link>
              </Menu-item>
              <Menu-item name="BasicTable">
                <router-link to="/basic-table">
                  Basic Table 
                </router-link>
              </Menu-item>
          </Submenu>
          
          <Menu-item name="Dashboard">
              <router-link to="/">
                <i class="fa fa-dashboard"></i>
                Dashboard
              </router-link>
          </Menu-item>
          <Menu-item name="Widget">
              <router-link to="/widget">
                <i class="fa fa-cogs"></i>
                我的主页-1
              </router-link>
          </Menu-item>
          
          <Menu-item name="Editor">
              <router-link to="/editor">
                <i class="fa fa-pencil"></i>
                编辑
              </router-link>
          </Menu-item>
          
          <Submenu name="Pages">
              <template slot="title">
                  <i class="fa fa-file"></i>
                  Pages
              </template>
              <Menu-item name="Login">
                <router-link to="/login">
                  Login 
                </router-link>
              </Menu-item>
              <Menu-item name="Lockscreen">
                <router-link to="/lockscreen">
                  Lockscreen 
                </router-link>
              </Menu-item>
              <Menu-item name="Loading">
                <router-link to="/loading">
                  Loading
                </router-link>
              </Menu-item>
          </Submenu>
      </Menu>
    </div>
    <div class="main-content">
      <router-view></router-view> 
      <p class="vm-author">fiction-note designed by <a href="https://github.com/luosijie" target="_blank">fff</a></p> 
    </div>
  </div>
  </div>
</template>
<script>
import VmMsgPush from '@/components/vm-msg-push.vue'
export default {
  name: 'home',
  components: {
    VmMsgPush
  },
  mounted: function () {
    if(this.getCookie('nick')){
      this.uname = this.getCookie('nick');
    }
    this.activeName = this.$route.name;
    this.setPhoto();
  },
  computed: {
    nick () {
      if(this.getCookie('nick')){
        return this.$store.state.userInfo.nick;
      }else{
        return '';
      }
    },
    photo: function(){
      return this.$store.getters.getPhoto;
    }
  },
  methods: {
    logout: function() {
      //删除cookie并跳到登录页
      var that = this;
      that.isLogouting = true;
      console.log("before delete===="+that.getCookie('nick'));
      that.delCookie('nick');
      //that.delCookie('uid');
      //that.delCookie('role');
      //that.delCookie('sex');
      that.$store.commit('defaultUserInfo');
      //that.$router.push('/login');
      setTimeout(()=>{
        this.$router.push('/login');
      },3000)
    },
    userInfo: function(){
      console.log(this.photo);
      this.$router.push('/');
    },
    setPhoto: function(){
      this.portrait = 'http://localhost:8080/fiction-note/getPortrait?filename='+this.photo;
    }
  },
  data () {
    return {
      uname: '',
      portrait: '',
      activeName: 'Dashboard',
      isLogouting: false,
      msgPushData: [
        {
          image: require('@/assets/img/photo.jpg'),
          from: 'JesseLuo',
          time: '2017-1-8',
          message: 'I like your website very much!'
        },
        {
          image: require('@/assets/img/photo.jpg'),
          from: 'JesseLuo',
          time: '2017-1-8',
          message: 'I like your website very much!'
        },
        {
          image: require('@/assets/img/photo.jpg'),
          from: 'JesseLuo',
          time: '2017-1-8',
          message: 'I like your website very much!'
        },
        {
          image: require('@/assets/img/photo.jpg'),
          from: 'JesseLuo',
          time: '2017-1-8',
          message: 'I like your website very much!'
        },
        {
          image: require('@/assets/img/photo.jpg'),
          from: 'JesseLuo',
          time: '2017-1-8',
          message: 'I like your website very much!'
        }
      ]
    }
  }
}
</script>
