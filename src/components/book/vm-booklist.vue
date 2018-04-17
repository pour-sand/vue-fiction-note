<template>
  <Row class="vm-table vm-panel">
    <div class="panel-heading">
      {{ title }}
    </div>
    <div class="panel-body">
      <Row type="flex" justify="space-between" class="control">
        <div class="table-style">
          <h3>Stripe</h3>
          <i-switch v-model="showStripe" style="margin: 0 30px 0 10px"></i-switch>
          <h3>Size</h3>
          <Radio-group v-model="tableSize" type="button" style="margin-left: 10px">
            <Radio label="large">Large</Radio>
            <Radio label="default">Default</Radio>
            <Radio label="small">Small</Radio>
          </Radio-group>
        </div>
        <div class="search-bar">
          <Input placeholder="Please enter ..." v-model="keyword" style="width: 300px"></Input>
          <Button type="ghost" @click="search"><i class="fa fa-search"></i></Button>
        </div>
      </Row>
      <div class="edit" v-if="type === 'edit'">
          <!--<Button @click="modalAdd = true" ><i class="fa fa-plus"></i> Add</Button>-->
          <Button  :disabled="deleteDisabled" @click="modalDelete = true"><i class="fa fa-trash"></i></Button>
      </div>
      <Table :stripe="showStripe" :size="tableSize" :columns="showColumns" :data="dataShow" @on-selection-change="selectChange"></Table>
      <Row type="flex" justify="space-between" class="footer">
        <div class="info-bar">
          Show<Input-number class="input-number" v-model="showNum" :max="data.length" :min="1" @on-change=" updateDataShow ">{{ showNum }}</Input-number>/ Page
        </div>
        <div class="page">
          <span class="total">Total {{ data.length }}</span>
          <Page :total="data.length" :current="currentPage" :page-size="showNum" @on-change="pageChange"></Page>
        </div>
      </Row>
    </div>
    <!--<Modal
        v-model="modalEdit"
        title="Edit"
        ok-text="OK"
        cancel-text="Cancel"
        v-on:on-ok="editOk">
        <Form :label-width="50">
          <Form-item v-for="(value, key) in dataEdit" :label="convertKey(key)" :key="dataEdit.id">
            <Input v-model="dataEdit[key]" :placeholder="'Please enter ' + key"></Input>
          </Form-item>
        </Form>
    </Modal>-->
    <Modal
        v-model="modalDelete"
        title="Delete"
        ok-text="OK"
        cancel-text="Cancel"
        v-on:on-ok="deleteOk">
        {{ deleteModalText }}
    </Modal>
    <Modal
        v-model="modalAdd"
        title="Add Note"
        ok-text="OK"
        cancel-text="Cancel"
        v-on:on-ok="addOk">
        <VmFormNote :from="from" :bookTitle="bookTitle" :totalPage="totalPage" :bookId="bookId"
        :fromPage="currentPage" :note="forNullO" :book="forNullO"></VmFormNote>
    </Modal>
  </Row>
</template>

<script>
  import VmFormNote from '@/components/note/vm-form-note'
  export default {
    components: {
      VmFormNote
    },
    name: 'VmBooklist',
    props: {
      title: {
        type: String,
        default: 'Basic Table'
      },
      type: String,
      columns: Array,
      data: Array
    },
    data () {
      return {
        forNullS: '',
        forNullO: {},
        from: 'add-note',
        deleteModalText: 'Are you sure to delete this data?',
        deleteDisabled: true,
        dataShow: [],
        showNum: 10,
        showStripe: false,
        tableSize: 'default',
        currentPage: 1,
        keyword: '',
        modalEdit: false,
        modalAdd: false,
        modalDelete: false,
        dataEdit: {},
        dataDelete: [],
        dataAdd: {},
        formData: [],
        bookTitle: '',
        totalPage: 0,
        bookId: ''
      }
    },
    methods: {
      editOk: function () {
        this.$emit('edit-ok', this.dataEdit)
      },
      addOk: function () {
        //this.$emit('add-ok', this.dataAdd)
      },
      deleteOk: function () {
        let that = this;
        let param = new URLSearchParams();
        param.append("userId", this.uid);
        param.append("bookId", this.bookId);
        this.$axios.post('fiction-note/delInList', param)
        .then(function(response) {
          if(response.data == 'success')
            that.$Message.success('删除成功！');
          else{
            that.$Message.error('null');
          }
        }).catch( function(response) {
            that.$Message.error('error');
        });
        this.$emit('delete-ok', this.dataDelete)
      },
      pageChange: function (page) {
        this.currentPage = page
        this.updateDataShow()
      },
      updateDataShow: function () {
        let startPage = (this.currentPage - 1) * this.showNum
        let endPage = startPage + this.showNum
        this.dataShow = this.data.slice(startPage, endPage)
      },
      search: function () {
        let that = this
        let tempData = that.data
        that.dataShow = []
        tempData.forEach(function (elem) {
          for (let i in elem) {
            if (elem[i].toString().indexOf(that.keyword) > -1) {
              that.dataShow.push(elem)
              return
            }
          }
        })
      },
      selectChange: function (data) {
        this.dataDelete = data
      },
      remove: function (index) {
        this.dataShow.splice(index, 1)
      },
      renderOperate: function (h, params) {
        return h('div', [
          /*h('Button', {
            props: {
              type: 'info',
              size: 'small'
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: () => {
                for (let i in params.row) {
                  console.log("params: "+params.row[i])
                  if (i !== '_index' && i !== '_rowKey') {
                    this.dataEdit[i] = params.row[i]
                  }
                }
                this.modalEdit = true
              }
            }
          }, 'Edit'),*/
          h('Button', {
            props: {
              type: 'error',
              size: 'small'
            },
            on: {
              click: () => {
                this.bookId = params.row.id;
                this.dataDelete.push(params.row)
                this.modalDelete = true
              }
            }
          }, 'Delete'),
          h('Button', {
            props: {
              type: 'warning',
              size: 'small'
            },
            on: {
              click: () => {
                this.bookTitle = params.row.title;
                this.totalPage = parseInt(params.row.totalPage);
                console.log("params: "+this.totalPage);
                this.modalAdd = true;
              }
            }
          }, 'Add')
        ])
      },
      convertKey: function (value) {
        let returnValue = value
        this.columns.forEach(function (elem) {
          for (let i in elem) {
            if (i === 'key' && elem[i] === value) {
              returnValue = elem.title
            }
          }
        })
        return returnValue
      }
    },
    computed: {
      showColumns: function () {
        let showColumn = this.columns.slice()
        showColumn.forEach(function (elem) {
          elem.sortable = true
        })
        if (this.type === 'edit') {
          showColumn.unshift({
            type: 'selection',
            width: 60,
            align: 'center'
          })
          showColumn.push({
            title: 'Operation',
            key: 'action',
            width: 150,
            align: 'center',
            render: this.renderOperate
          })
        }
        return showColumn
      },
      role: function(){
        return this.$store.getters.getRole;
      },
      uid: function(){
        return this.$store.getters.getUid;
      }
    },
    watch: {
      data: function () {
        this.dataShow = this.data.slice(0, this.showNum)
      },
      dataDelete: function () {
        if (this.dataDelete.length === 0) {
          this.deleteDisabled = true
        } else {
          this.deleteDisabled = false
        }
      }
    },
    mounted: function () {
      this.dataShow = this.data.slice(0, this.showNum)
    }
  }
</script>
