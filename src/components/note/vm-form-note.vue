<template>
<div>
    </br><h1>{{book.title}}{{bookTitle}}</h1></br>
    <Form ref="formValidate" :model="formValidate" :rules="ruleNote" :label-width="80">
        <FormItem label="TITLE" prop="title">
            <Input v-model="formValidate.title" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="FROM" prop="fromTime">
            <DatePicker v-model="formValidate.timeb" type="datetime" placeholder="Select date and time" style="width: 408px"></DatePicker>
        </FormItem>
        <FormItem label="TO" prop="toTime">
            <DatePicker v-model="formValidate.timee" type="datetime" placeholder="Select date and time" style="width: 408px"></DatePicker>
        </FormItem>
        <FormItem label="FROM" prop="fromPage">
            <InputNumber :min="1" v-model="formValidate.fromPage"></InputNumber>
        </FormItem>
        <FormItem label="TO" prop="toPage">
            <InputNumber :min="1" v-model="formValidate.toPage"></InputNumber>
        </FormItem>
        <FormItem label="CONTEXT" prop="content">
            <Input v-model="formValidate.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="VISIBLE" prop="visible">
            <i-switch v-model="formValidate.visible" size="large">
                <span slot="open">yes</span>
                <span slot="close">no</span>
            </i-switch>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
</div>
</template>
<script>
    export default {
        name: 'VmFormNote',
        props: {
            from: {
                type: String,
                default: 'add-note'
            },
            bookTitle: {
                type: String,
                default: ''
            },
            totalPage: {
                type: Number,
                default: 1
            },
            book: {
                default: {
                    title: '',
                    totalPage: 1
                }
            },
            note: {
                default: {
                    id: '',
                    userId: '',
                    bookId: '',
                    title: '',
                    timeb: '',
                    timee: '',
                    content: '',
                    visible: true,
                    fromPage: 1,
                    toPage: 1
                }
            },
            fromPage: {
                type: Number,
                default: 1
            },
            toPage: {
                type: Number,
                default: 1
            },
            bookId: {}
        },
        data () {
            const validatePage = (rule, value, callback) => {
                console.log("....");
                setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error('Please enter a numeric value'));
                    }else {
                        let tempTotalPage = this.book.totalPage;
                        if(this.from == 'add-note')
                            tempTotalPage = this.totalPage;
                        value = parseInt(value);
                        console.log("book===="+tempTotalPage);
                        if (value > tempTotalPage) {
                            callback(new Error('<= total page'));
                        } else if(this.formValidate.fromPage > this.formValidate.toPage){
                            callback(new Error('Page from < to'));
                        } else {
                            callback();
                        }
                    }
                }, 1000);
            };
            return {
                formValidate: {
                    id: this.note.id,
                    userId: this.note.userId,
                    bookId: this.note.bookId,
                    title: this.note.title,
                    timeb: this.note.timeb,
                    timee: this.note.timee,
                    content: this.note.content,
                    visible: this.note.visible=='1',//true,
                    fromPage: this.fromPage,
                    toPage: this.toPage
                },
                ruleNote: {
                    fromPage: [
                        { validator: validatePage, trigger: 'blur' }
                    ],
                    toPage: [
                        { validator: validatePage, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let url = "fiction-note/addNote";
                        let that = this;
                        //console.log(that.formValidate);
                        if(that.from == 'add-note'){
                            that.formValidate.userId = this.uid;
                            that.formValidate.bookId = that.bookId;
                        }
                        this.$axios.post(url, that.formValidate)
                        .then(function(response) {
                            if(response.data == 'success'){
                                that.$Message.success('Success!');
                                location.reload();
                            }else if(response.data == 'Wrong time error'){
                                that.$Message.success('Please check your time!');
                            }
                        }).catch( function(response) {
                            console.log(response)
                            that.$Message.error('请求错误！--add/edit note');
                        });
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
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