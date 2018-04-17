<template>
  <div class="vm-panel" :style="{ backgroundColor: bgColor }" :class="{ bgStyle: bgColor }">
    <div class="card-desc panel-body">
      <div v-if="editable && type == 'vertical'" class="control">
        <span class="edit" @click="modalEdit=true">
          <i class="fa fa-pencil"></i>
        </span>
        <span class="delete">
          <i class="fa fa-trash" @click="modalDelete=true"></i>
        </span>
        
      </div>
      <div v-if="title" class="panel-heading" :style="{ backgroundColor: hdColor }" :class="{ bgStyle: hdColor }">
        <span class="note-title">{{ title }}</span><span class="note-book-title"> ----《{{ book.title}}》</span>
        <div class="note-info">
          <span>页数：</span><span class="note-1">{{ note.fromPage }} </span>
          <span> ~ </span><span class="note-1">{{ note.toPage }}</span>
          <span>&nbsp;&nbsp;记录时间：</span><span class="note-1">{{ note.time }} </span></br>
          <span>阅读时间：</span><span class="note-1">{{ note.timeb }} </span>
          <span> ~ </span><span class="note-1">{{ note.timee }}</span>
        </div>
      </div>
      <div class="panel-body">
        {{ desc }}
      </div>
      <!--<a :href="detailUrl">
        more >
      </a>-->
      
    </div>
    <Modal
        v-model="modalEdit"
        title="Edit"
        ok-text="OK"
        cancel-text="Cancel"
        v-on:on-ok="editOk">
        <VmFormNote :note="note" :from="from" :book="book" :bookTitle="forNull" :bookId="forNull"
        :totalPage="totalPage" :fromPage="fromPage" :toPage="toPage"></VmFormNote>
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
  import VmFormNote from '@/components/note/vm-form-note'
  export default {
    name: 'VmNoteCard',
    components: {
      VmFormNote
    },
    props: {
      type: {
        type: String,
        default: 'vertical'
      },
      editable: {
        type: Boolean,
        default: false
      },
      note: {},
      title: {
        type: String,
        default: 'Title'
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
      },
      bgColor: {
        type: String,
        default: ''
      },
      hdColor: {
        type: String,
        default: ''
      },
    },
    data: function () {
      return {
        forNull: '',
        from: 'note-card',
        deleteDisabled: true,
        dataShow: [],
        showNum: 10,
        showStripe: false,
        tableSize: 'default',
        currentPage: 1,
        keyword: '',
        modalEdit: false,
        modalDelete: false,
        dataEdit: {},
        dataDelete: [],
        dataAdd: {},
        formData: [],
        book: {},
        fromPage: 0,
        toPage: 0,
        totalPage: 0
      }
    },
    methods: {
      editOk: function () {
        console.log("id::"+this.note.bookId);
        this.$emit('edit-ok', this.dataEdit)
      },
      deleteOk: function () {
        let that = this;
        let param = new URLSearchParams();
        param.append("id", this.note.id);
        this.$axios.post('fiction-note/deleteNote', param)
        .then(function(response) {
          if(response.data == 'success')
            that.$Message.success('删除成功！');
          else{
            that.$Message.error('null');
          }
        }).catch( function(response) {
            that.$Message.error('error');
        });
        this.$emit('delete-ok')
      },
      getBook: function(){
        let param = new URLSearchParams();
        let that = this;
        let url = "fiction-note/getBook";
        param.append("bid", this.note.bookId);
        
        this.$axios.post(url, param)
        .then(function(response) {
          that.book = response.data;
          that.totalPage = Number(that.book.totalPage);
          that.fromPage = Number(that.note.fromPage);
          that.toPage = Number(that.note.toPage);
          //console.log(that.book);
        }).catch( function(response) {
          that.$Message.error('请求错误！--note card');
        });
      }
    },
    mounted() {
      this.getBook();
    },
  }
</script>

<style lang="less" scoped>
  .note-book-title{
    font-weight:normal;
    color:#41b883;
    font-style:italic;
    font-size:15px;
  }
  .note-title{
    font-size:16px;
  }
  .bgStyle{
    color: rgba(255,255,255,0.8);
    .panel-heading{
      border-bottom: 1px solid rgba(255,255,255,0.3);
    }
  }
  .hdStyle{
    color: rgba(255,255,255,0.8);
  }
</style>