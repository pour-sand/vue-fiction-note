<template>
  <VmImageList :data="books" @delete-ok="deletefn" class="vm-margin"></VmImageList>
</template>

<script>
  import VmImageList from '@/components/book/vm-image-list'
  export default {
    name: 'Books',
    components: {
      VmImageList
    },
    data: function () {
      return {
        books: []
      }
    },
    methods: {
      deletefn: function (data) {
        for (let i = 0; i < this.books.length; i++) {
          if (this.books[i].id === data.id) {
            this.deleteBook(data);
            this.books.splice(i, 1)
          }
        }
      },
      deleteBook: function(data){
        let loginParam = new URLSearchParams();
        loginParam.append("id", data.id);
        let that = this;
        console.log("delete book ===" + data.id);
        this.$axios.post('fiction-note/delBook', data.id)
        .then(function(response) {
          
        }).catch( function(response) {
          console.log("delete book ===" + response);
        });
      },
      getAllBooks: function (){
        let url = "fiction-note/allBooks";
        let param = new URLSearchParams();
        let that = this;
        
        param.append("uid", this.uid);
        if(this.role == "0"){
          url = "fiction-note/admin/allBooks";
        }
        
        this.$axios.post(url, param)
        .then(function(response) {
          that.books = response.data;
        }).catch( function(response) {
          that.$Message.error('请求错误！--all books');
        });
      }
    },
    mounted() {
      this.getAllBooks();
    },
    computed: {
      role: function(){
        return this.$store.getters.getRole;
      },
      uid: function(){
        return this.$store.getters.getUid;
      }
    }
  }
</script>
