<template>
    <div class="vm-image-list">
    </br><h1>Add Book</h1></br>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="Title" prop="title">
            <Input v-model="formValidate.title" placeholder="Enter title"></Input>
        </FormItem>
        <FormItem label="Subtitle" prop="subtitle">
            <Input v-model="formValidate.subtitle" placeholder="Enter subtitle"></Input>
        </FormItem>
        <FormItem label="Author" prop="author">
            <Input v-model="formValidate.author" placeholder="Enter author"></Input>
        </FormItem>
        <FormItem label="Translator" prop="translator">
            <Input v-model="formValidate.translator" placeholder="Enter translator"></Input>
        </FormItem>
        <FormItem label="Press" prop="press">
            <Input v-model="formValidate.press" placeholder="Enter press"></Input>
        </FormItem>
        <FormItem label="Publish Date" prop="date">
            <DatePicker type="date" placeholder="Select date" v-model="formValidate.date"></DatePicker>
        </FormItem>
        <FormItem label="TotalPage" prop="totalPage">
            <InputNumber :min="1" v-model="formValidate.totalPage"></InputNumber>
        </FormItem>
        <FormItem label="Upload Image" prop="img">
            <!--<Upload
                ref="upload" name="upfile"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                action="http://localhost:8080/fiction-note/uploadImg"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="camera" size="20"></Icon>
                </div>
            </Upload>-->
            <div class="upload-img" v-bind:style="{backgroundImage: preview}">
                <img :src="preview" alt="">
                <input id="upload" class="hide" alt="" ref="img" type="file" accept="image/*" @change="tirggerFile($event)">
                <Icon type="ios-cloud-upload" size="30"></Icon>
			</div>
            <!--<input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg"/>
            <div class="file_upload">
				<div class="file_con">
					<div>
						<input type="file" class="hide" id="upload"><span class="file_uploader">上传单个文件</span><span class="upload_bt none">确认上传</span>
					</div>
					<div class="img_holder"></div>
				</div>
				<span class="progress"></span>
			</div>-->
        </FormItem>
        <FormItem label="Intro" prop="intro">
            <Input v-model="formValidate.intro" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
    </div>
</template>
<script>
    //import VmUploadImg from '@/components/vm-upload-img'
    export default {
        name: 'AddBook',
        data () {
            return {
                preview:'url(@/assets/img/1984.jpg)',
                defaultList: [
                    {
                        'name': '1984.jpg',
                        'url': '@/assets/img/1984.jpg'
                    }
                ],
                imgName: '',
                visible: false,
                uploadList: [],
                formValidate: {
                    title: '',
                    subtitle: '',
                    author: '',
                    translator: '',
                    press: '',
                    date: '',
                    intro: '',
                    totalPage: 1,
                    picture: ''
                },
                ruleValidate: {
                    title: [
                        { required: true, message: 'The title cannot be empty', trigger: 'blur' }
                    ],
                    press: [
                        { required: true, message: 'The press cannot be empty', trigger: 'blur' }
                    ],
                    
                    // subtitle: [
                    //     { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
                    //     { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
                    // ],
                    author: [
                        { required: true, message: 'The author cannot be empty', trigger: 'blur' }
                    ],

                    // interest: [
                    //     { required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change' },
                    //     { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
                    // ],
                    date: [
                        { required: true, type: 'date', message: 'Please select the date', trigger: 'change' }
                    ],
                    intro: [
                        { required: true, message: 'Please enter a personal introduction', trigger: 'blur' },
                        { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            tirggerFile: function (event) {
                console.log(event.target.files.length);
                let that = this;
                if(event.target.files.length > 1){
                    this.$Message.warning('仅允许一张图片，请重新选择！');
                    this.$refs.img.val('');
                    console.log(this.$refs.img.files.length);
                }else{
                    var file = event.target.files[0];
                    if(file.type.indexOf("image") == 0) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);                    
                        reader.onload = function(e) {
                            // 图片base64化
                            var newUrl = this.result;
                            that.preview = newUrl;
                        };
                        
                    }

                }

            },
            handleSubmit (name) {
                let param = new FormData();
                param.append('upfile', this.$refs.img.files[0]);

                var that =  this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.$refs.img.files.length > 0){
                            this.$axios.post('fiction-note/uploadImg', param)
                            .then(function(response) {
                                console.log("1 add book..." + response);
                                that.formValidate.picture = response.data;
                                console.log("this add book..." + that.formValidate.picture);
                                that.$axios.post('fiction-note/addBook', that.formValidate)
                                .then(function(response) {
                                    that.$Message.success('Success!');
                                    that.$router.push('/imagelist');
                                }).catch( function(response) {
                                    that.$Message.success("2 add book request error..." + response);
                                });
                            }).catch( function(response) {
                                that.$Message.success("1 add book..." + response);
                            });
                        }else{
                            that.$Message.warning('请添加图片！');
                        }
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            //handle upload pic
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
                //const fileList = this.$refs.upload.fileList;
                //this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                file.url = '@/assets/img/1984.jpg';
                file.name = '1984.jpg';
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleBeforeUpload (file) {
                let reader = new FileReader()
                reader.readAsDataURL(file)
                const _this = this
                reader.onloadend = function (e) {
                    file.url = reader.result
                    _this.uploadList.push(file)
                }

                // const check = this.uploadList.length < 5;
                // if (!check) {
                //     this.$Notice.warning({
                //         title: 'Up to five pictures can be uploaded.'
                //     });
                // }
                // return check;
            }
        },
        mounted () {
            //this.uploadList = this.$refs.upload.fileList;
        }
    }
</script>

<style>
.upload-img {
    display: inline-block;
    width: 115px;
    height: 172px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
}
.upload-img img{
    width: 100%;
    height: 100%;
}
.upload-ico{
    
}
.hide {
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
    z-index: 5;
}
</style>