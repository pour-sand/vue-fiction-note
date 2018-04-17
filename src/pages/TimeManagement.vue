<template>
  <VmTimeTable title="Editable Table" 
           type="edit" 
           :columns="dataColumns" 
           :data="dataTable"
           v-on:add-ok="add"
           v-on:edit-ok="edit"
           v-on:delete-ok="deletefn"
           class="vm-margin">
  </VmTimeTable>
</template>

<script>
  import VmTimeTable from '@/components/time/vm-time-table'
  export default {
    name: 'TimeManagement',
    components: {
      VmTimeTable
    },
    methods: {
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
      },
      getTimes: function(){
        let that = this;
        let url = "fiction-note/getTime";

        this.$axios.get(url)
        .then(function(response) {
          if(null != response.data)
            that.dataTable = response.data;
          else {
            that.$Message.warning({
                content: '暂无书本数据',
                duration: 20,
                closable: true
            });
          }
        }).catch( function(response) {
          that.$Message.error('请求错误！--all time msg');
        });
      },
    },
    data () {
      return {
        dataColumns: [
          {
            id: '20156545',
            title: '类型',
            key: 'type'
          },
          {
            id: '20156546',
            title: '主题',
            key: 'theme'
          },
          {
            id: '20156547',
            title: '开始',
            key: 'begin'
          },
          {
            id: '20156548',
            title: '结束',
            key: 'end'
          },
          {
            id: '20156549',
            title: '持续时间',
            key: 'during'
          }
        ],
        dataTable: [
            {
            id: '65416s843154',
            name: '王小明',
            age: 18,
            address: '北京市朝阳区芍药居'
          },
        ]
      }
    },
    mounted(){
      this.getTimes();
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