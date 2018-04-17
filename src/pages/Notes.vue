<template>
  <VmNote :data="dataNotes" @delete-ok="deletefn" @edit-ok="edit" class="vm-margin"></VmNote>
</template>

<script>
  import VmNote from '@/components/note/vm-note'
  export default {
    name: 'Notes',
    components: {
      VmNote
    },
    methods: {
      edit: function (data) {
        this.dataNotes.forEach(function (elem) {
          if (elem.id === data.id) {
            for (let i in data) {
              elem[i] = data[i]
            }
          }
        })
      },
      deletefn: function (data) {
        for (let i = 0; i < this.dataNotes.length; i++) {
          if (this.dataNotes[i].id === data.id) {
            this.dataNotes.splice(i, 1)
          }
        }
      },
      getNotes: function(data){
        let url = "fiction-note/userAllNotes";
        let param = new URLSearchParams();
        let that = this;
        param.append("uid", this.uid);
        this.$axios.post(url, param)
        .then(function(response) {
          that.dataNotes = response.data;
        }).catch( function(response) {
          that.$Message.error('请求错误！--notes');
        });
      }
    },
    data: function () {
      return {
        dataNotes: []
      }
    },
    mounted() {
      this.getNotes();
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
