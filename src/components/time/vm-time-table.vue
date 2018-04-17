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
        <Button @click="addButton"><i class="fa fa-plus"></i> Add</Button>
        <Button :disabled="deleteDisabled" @click="modalDelete = true"><i class="fa fa-trash"></i> Delete</Button>
      </div>
      <Table :stripe="showStripe" :size="tableSize" :columns="showColumns" :data="dataShow" @on-selection-change="selectChange"></Table>
      <Row type="flex" justify="space-between" class="footer">
        <div class="info-bar">
          Show
          <Input-number class="input-number" v-model="showNum" :max="data.length" :min="1" @on-change=" updateDataShow ">{{ showNum }}</Input-number>/ Page
        </div>
        <div class="page">
          <span class="total">Total {{ data.length }}</span>
          <Page :total="data.length" :current="currentPage" :page-size="showNum" @on-change="pageChange"></Page>
        </div>
      </Row>
    </div>
    <Modal v-model="modalEdit" title="Edit" ok-text="OK" cancel-text="Cancel" v-on:on-ok="editOk">
      <Form :label-width="50">
        <Form-item v-for="(value, key) in dataEdit" :label="convertKey(key)" :key="dataEdit.id">
          <Input v-model="dataEdit[key]" :placeholder="'Please enter' + key"></Input>
        </Form-item>
      </Form>
    </Modal>
    <Modal v-model="modalAdd" title="Add" ok-text="OK" cancel-text="Cancel" v-on:on-ok="addOk('formValidate')">
      <Form ref="formValidate" :label-width="50" :model="formValidate" :rules="ruleValidate">
        <FormItem label="类型" prop="type">
          <Select v-model="formValidate.type" style="width:200px">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="主题" prop="theme">
          <Input v-model="formValidate.theme" placeholder="Enter something..."></Input>
        </FormItem>
        <!-- <Form-item v-for="item in columns" :label="item.title" :key="item.id">
                <Input v-model="dataAdd[item.key]" :placeholder="'Please enter ' + item.title"></Input>
              </Form-item>
    v-model="formValidate.toPage" -->
        <Row>
          <Col span="11">
          <FormItem label="时间" prop="begin">
            <DatePicker v-model="formValidate.begin" type="datetime" placeholder="Select start date and time" style="width: 200px">
            </DatePicker>
          </FormItem>
          </Col>
          <Col span="11">
          <FormItem label="" prop="end">
            <DatePicker v-model="formValidate.end" type="datetime" placeholder="Select end date and time" style="width: 200px"></DatePicker>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
          <FormItem v-show="formValidate.type=='Done'" label="起始页" prop="fromPage">
            <InputNumber v-model="formValidate.fromPage" :min="1" style="width: 155px"></InputNumber>
          </FormItem>
          </Col>
          <Col span="11">
          <FormItem v-show="formValidate.type=='Done'" label="结束页" prop="toPage">
            <InputNumber v-model="formValidate.toPage" :min="1" style="width: 200px"></InputNumber>
          </FormItem>
          </Col>
        </Row>
        </FormItem>
        <Form-item label="书目" prop="books">
          <Select v-model="formValidate.books" multiple filterable remote :remote-method="remoteMethod" :loading="loading2">
              <Option v-for="(option, index) in options2" :value="option.value" :key="index">{{option.label}}</Option>
            </Select>
        </Form-item>
      </Form>
    </Modal>
    <Modal v-model="modalDelete" title="Delete" ok-text="OK" cancel-text="Cancel" v-on:on-ok="deleteOk">
      Are you sure to delete this data?
    </Modal>
  </Row>
</template>

<script>
  export default {
    name: 'VmTimeTable',
    props: {
      title: {
        type: String,
        default: 'Time Table'
      },
      type: String,
      columns: Array,
      data: Array
    },
    data() {
      return {
        nowItemId: '',
        typeList: [{
            value: 'To do',
            label: 'To do'
          },
          {
            value: 'Done',
            label: 'Done'
          }
        ],
        formValidate: {
          userId: '',
          theme: '',
          type: 'To do',
          books: [],
          begin: '',
          end: '',
          fromPage: 0,
          toPage: 0
        },
        maxSelectBook: 3,
        ruleValidate: {
          type: [{
            required: true,
            type: 'string',
            message: 'Please select type',
            trigger: 'change'
          }],
          books: [{
              type: 'array',
              min: 1,
              message: 'Choose at least one book',
              trigger: 'change'
            },
            {
              type: 'array',
              max: this.maxSelectBook,
              message: 'Choose 200 hobbies at best',
              trigger: 'change'
            }
          ],
          begin: [{
            required: true,
            type: 'date',
            message: 'Please select time',
            trigger: 'blur'
          }],
          end: [{
            required: true,
            type: 'date',
            message: 'Please select time',
            trigger: 'change'
          }]
          /*fromPage: [{
            validator: validatePage,
            trigger: 'blur'
          }],
          toPage: [{
            validator: validatePage,
            trigger: 'blur'
          }]*/
        },
        
        book: [],
        loading2: false,
        options2: [],
        booklist: [],
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
        formData: []
      }
    },
    methods: {
      /*typeChange: function(){
        let that = this;
        if(formValidate.type == "Done")
          that.maxSelectBook = 1;
        else if(formValidate.type == "To do")
          that.maxSelectBook = 3;
      },*/
      addButton: function(){
        this.getBookList();
        this.modalAdd = true;
      },
      editOk: function() {
        this.$emit('edit-ok', this.dataEdit)
      },
      addOk: function(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let that = this;
            let url = "fiction-note/addRecordTime";
            that.formValidate.userId = this.uid;
            console.log("...."+that.formValidate)
            this.$axios.post(url, that.formValidate)
              .then(function(response) {
                if ("success" == response.data){
                  //location.reload();
                } else {
                  that.$Message.error({
                    content: 'add time error',
                    duration: 20,
                    closable: true
                  });                  
                }
              }).catch(function(response) {
                that.$Message.error('请求错误！--add time');
              });
            
          } else {
            this.$Message.error('Check Your Input!');
          }
        })
      },
      deleteOk: function() {
        let that = this;
        let param = new URLSearchParams();
        param.append("id", this.nowItemId);
        this.$axios.post('fiction-note/delTime', this.dataDelete)
        .then(function(response) {
          if(response.data == 'success'){
            that.$Message.success('删除成功！');
            location.reload();           
          }

          else{
            that.$Message.error('null');
          }
        }).catch( function(response) {
            that.$Message.error('error');
        });
        this.$emit('delete-ok', this.dataDelete);
      },
      pageChange: function(page) {
        this.currentPage = page
        this.updateDataShow()
      },
      updateDataShow: function() {
        let startPage = (this.currentPage - 1) * this.showNum
        let endPage = startPage + this.showNum
        this.dataShow = this.data.slice(startPage, endPage)
      },
      search: function() {
        let that = this
        let tempData = that.data
        that.dataShow = []
        tempData.forEach(function(elem) {
          for (let i in elem) {
            if (elem[i].toString().indexOf(that.keyword) > -1) {
              that.dataShow.push(elem)
              return
            }
          }
        })
      },
      selectChange: function(data) {
        console.log(data);
        this.dataDelete = data
      },
      remove: function(index) {
        this.dataShow.splice(index, 1)
      },
      renderOperate: function(h, params) {
        return h('div', [
          h('Button', {
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
                  if (i !== '_index' && i !== '_rowKey') {
                    this.dataEdit[i] = params.row[i]
                  }
                }
                this.modalEdit = true
              }
            }
          }, 'Edit'),
          h('Button', {
            props: {
              type: 'error',
              size: 'small'
            },
            on: {
              click: () => {
                this.nowItemId = params.row.id;
                this.dataDelete.push(params.row)
                this.modalDelete = true
              }
            }
          }, 'Delete')
        ])
      },
      convertKey: function(value) {
        let returnValue = value
        this.columns.forEach(function(elem) {
          for (let i in elem) {
            if (i === 'key' && elem[i] === value) {
              returnValue = elem.title
            }
          }
        })
        return returnValue
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading2 = true;
          setTimeout(() => {
            this.loading2 = false;
            const booklist = this.booklist.map(item => {
              return {
                value: item,
                label: item
              };
            });
            this.options2 = booklist.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
          }, 200);
        } else {
          this.options2 = [];
        }
      },
      getBookList: function(){
        let url = "fiction-note/allBooks";
        let param = new URLSearchParams();
        param.append("uid", this.uid);
        let that = this;
        
        this.$axios.post(url, param)
        .then(function(response) {
          for(let i = 0; i < response.data.length; i++)
            that.booklist[i] = response.data[i].title
            //console.log();
        }).catch( function(response) {
          that.$Message.error('请求错误！time -- all books');
        });
      }
    },
    computed: {
      showColumns: function() {
        let that = this
        let showColumn = this.columns.slice()
        showColumn.forEach(function(elem) {
          elem.sortable = true
        })
        if (that.type === 'edit') {
          showColumn.unshift({
            type: 'selection',
            width: 60,
            align: 'center'
          })
          showColumn.push({
            title: '操作',
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
      data: function() {
        this.dataShow = this.data.slice(0, this.showNum)
      },
      dataDelete: function() {
        if (this.dataDelete.length === 0) {
          this.deleteDisabled = true
        } else {
          this.deleteDisabled = false
        }
      }
    },
    mounted: function() {
      this.dataShow = this.data.slice(0, this.showNum)
    }
  }
</script>