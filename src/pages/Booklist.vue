<template>
  <VmBooklist title="Editable Table" 
           type="edit" 
           :columns="dataColumns" 
           :data="dataTable"
           v-on:add-ok="add"
           v-on:edit-ok="edit"
           v-on:delete-ok="deletefn"
           class="vm-margin">
  </VmBooklist>
</template>

<script>
  import VmBooklist from '@/components/book/vm-booklist'
  export default {
    name: 'Booklist',
    components: {
      VmBooklist
    },
    methods: {
      getBookList: function(){
        let that = this;
        let url = "fiction-note/getUserBookList";
        let param = new URLSearchParams();
        param.append("userId", this.uid);

        this.$axios.post(url, param)
        .then(function(response) {
          console.log("0000====="+response.data.code);
          if(200 == response.data.code)
            that.dataTable = response.data.data;
          else if(201 == response.data.code)
            that.$Message.warning({
                content: '书单待添加！',
                duration: 20,
                closable: true
            });
        }).catch( function(response) {
          that.$Message.error('请求错误！');
        });
      },
      add: function (data) {
        this.dataTable.unshift(data)
      },
      edit: function (data) {
        this.dataTable.forEach(function (elem) {
          if (elem.id === data.id) {
            for (let i in data) {
              elem[i] = data[i]
            }
          }
        })
      },
      deletefn: function (data) {
        for (let i = 0; i < this.dataTable.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (this.dataTable[i].id === data[j].id) {
              this.dataTable.splice(i, 1)
            }
          }
        }
      }
    },
    data () {
      return {
        dataColumns: [
          {
            id: '20156541',
            title: 'No.',
            key: 'picture'
          },
          {
            id: '20156542',
            title: 'Title',
            key: 'title'
          },
          {
            id: '20156543',
            title: 'Author',
            key: 'author'
          },
          {
            id: '20156544',
            title: 'Adding time',
            key: 'time'
          }
        ],
        dataTable: [
          {
            id: '65416s843154',
            title: '1984',
            author: '乔治',
            time: '北京市朝阳区芍药居'
          }
        ]
      }
    },
    mounted(){
      this.getBookList();
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
