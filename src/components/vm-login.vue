<template>
  <Row class="vm-login vm-panel">
   <Col span="10" class="login-form">
     <div class="login-header">
       <img src="../assets/img/logo.png" height="80" alt="">
       <p><span>Fiction</span>NOTE</p>
     </div>
     <div class="login-form">
        <Input v-model="username" placeholder="please enter username"></Input>
        <Input v-model="password" type="password" placeholder="Please enter password"></Input>
        <Button type="primary" @click="login">Login</Button>
     </div>
     <div class="login-footer">
       <Checkbox v-model="remenber">Remenber</Checkbox>
       <span class="forget"><a href="#">Forget Password</a></span>
     </div>
   </Col>
   <Col span="14" class="login-ad">
     <span class="photo-author">Photo: Jure Kravanja</span>
   </Col>
   <Modal v-model="loginInfo">
        <p slot="header" style="color:#f60000;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>Error</span>
        </p>
        <div style="text-align:center">
            <p>{{ modalText }}</p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long :loading="modal_loading" @click="ok">OK</Button><!--:loading="modal_loading"  -->
        </div>
    </Modal>
  </Row>
  
</template>
<script>
  export default {
    name: 'VmLogin',
    data: function () {
      return {
        isLoging: false,
        username: '',
        password: '',
        remenber: false,
        loginInfo: false,
        modalText: 'Please fill the text!',
        userInfo: {
            nick: null,
            uid: null,
            sex: null,
            role: null
        }
      }
    },

    methods: {
      ok: function(){
        this.loginInfo = false;
      },
      login(){
        if(this.username != '' && this.password != ''){
          this.toLogin();
        }else{
          this.loginInfo = "Please fill the text!";
          this.loginInfo = true;
        }
      },
      test: function(){
        this.$axios.get('/fiction-note/test').then(function(response) {
          console.log("-----"+response.data.data)
            // 这里是处理正确的回调
        }).catch( function(response) {
            // 这里是处理错误的回调
          console.log("++++++"+response)
        });
      },
      toLogin(){
        //加密，先省略
        //let password_sha = hex_sha1(hex_sha1(this.password));

        let loginParam = new URLSearchParams();
        loginParam.append("username", this.username);
        loginParam.append("password", this.password);

        this.isLoging = true;
        var that = this;

        this.$axios.post('fiction-note/loginUser', loginParam)
        .then(function(response) {
            // 这里是处理正确的回调
            if (100 == response.data.code) {
              let expireDays = 1000 * 60 * 60 * 24 * 15;
              that.setCookie('nick', response.data.data.userName, expireDays);

              that.userInfo.nick = response.data.data.userName;
              that.userInfo.uid = response.data.data.id;
              that.userInfo.role = response.data.data.role;
              that.userInfo.sex = response.data.data.sex;
              that.userInfo.photo = response.data.data.photo;
              that.$store.commit('updateUserInfo', that.userInfo);
              that.$router.push('/notes');
            } else {
              that.modalText = response.data.msg;
              that.loginInfo = true;
            }
        }).catch( function(response) {
          this.modalText = "Unknow Error"
          //console.log("++++++" + response);
        });
        this.modalText = "Please fill the text!";
      }
    }
  }
</script>
