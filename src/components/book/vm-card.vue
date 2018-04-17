<template><!-- -->
  <div :class="[type === 'horizantal' ? 'vm-card-horizantal' : 'vm-card-vertical' , 'vm-panel']">
    <div class="card-img">
      <img :src="picture" alt="">
      <div v-if="editable && type == 'vertical'" class="control">
        <span v-show="isShowEdit" class="edit">
          <a :href="editUrl"><i class="fa fa-pencil"></i></a>     
        </span>
        <span v-show="isShowEdit" class="delete">
          <i class="fa fa-trash" @click="modalDelete=true"></i>
        </span>
        <span v-show="isShowAdd" class="add"><!-- v-show="isShowAdd && inList" -->
          <i class="fa fa-plus" @click="modalAdd=true"></i>
        </span>
      </div>
    </div>
    <div class="card-desc panel-body">
      <h2>{{ title }}</h2>
      <h4>Author</h4>
      <span>{{ author }}</span>
      <h4>Press</h4>
      <span>{{ press }}</span>
      <br><br><hr class="hr"><br>
      <router-link :to="{ path:'/bookInfo', query: {id: bid, picture: img} }">
        <i class="fa fa-dashboard"></i>
        more >
      </router-link>
    </div>
    <Modal
        v-model="modalAdd"
        title="Add to book list"
        ok-text="OK"
        cancel-text="Cancel"
        v-on:on-ok="addOk">
        Are you sure to add this book to your list?
    </Modal>
    <Modal
        v-model="modalDelete"
        title="Delete"
        ok-text="OK"
        cancel-text="Cancel"
        v-on:on-ok="deleteOk">
        Are you sure to delete this data?
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'VmCard',
    props: {
      type: {
        type: String,
        default: 'vertical'
      },
      inList: {
        type: Boolean,
        default: false
      },
      bid: {
        type: String,
        default: ""
      },
      editable: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: 'Title'
      },
      author: {
        type: String,
        default: '#'
      },
      press: {
        type: String,
        default: '#'
      },
      img: {
        type: String,
        default: require('@/assets/img/img-1.jpg')
      },
      desc: {
        type: String,
        default: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry,Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'
      },
      detailUrl: {
        type: String,
        default: '#'
      },
      editUrl: {
        type: String,
        default: '#'
      },
      addUrl: {
        type: String,
        default: '#'
      }
    },
    data: function () {
      return {
        picture: '',
        modalDelete: false,
        modalAdd: false
      }
    },
    methods: {
      deleteOk: function () {
        this.$emit('delete-ok')
      },
      addOk: function(){
        let param = new URLSearchParams();
        console.log("uid bid===="+this.uid+" "+this.bid);
        param.append("userId", this.uid);
        param.append("bookId", this.bid);
        let that=this;
        this.$axios.post('fiction-note/addToBookList', param)
        .then(function(response){
          console.log("===="+response.data);
          if(response.data == "successful")
            that.$Message.success('添加成功！');
          else if(response.data == "existed")
            that.$Message.warning('添加过了!');
        }).catch(function(response){
            that.$Message.error('未知错误!');
        });
      },
      getBookImg: function(){
        this.picture = 'http://localhost:8080/fiction-note/getImg?filename='+this.img;
      }
    },
    mounted: function () {
      this.getBookImg();
    },
    computed: {
      uid: function(){
        return this.$store.getters.getUid;
      },
      isShowAdd: function(){
        return this.$store.getters.getRole == "1";
      },
      isShowEdit: function(){
        return this.$store.getters.getRole == "0";
      }
    }
  }
</script>

<style>
.hr{
  height:1px;
  border:none;
  border-top:1px dashed #41b883;
}
</style>
