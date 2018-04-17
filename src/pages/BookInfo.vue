<template>
    <div>
        <br>
        <Card style="width:100%; height:550px; padding:30px; text-align:left">
            <h1 style="">{{book.title}}</h1>
            <h2>{{book.subtitle}}</h2><br>
            <hr class="hr"><br>
            <div class="book-detail-top left"><span class="book-detail-add"><!-- v-show="isShowAdd && inList" -->
                        <i class="fa fa-plus"></i>
                    </span>
                <img class="book-detail" :src="picture" alt="">
            </div>
            <div class="book-detail-top right">
                <Form :model="book" label-position="right" :label-width="100">
                    <FormItem label="作者">
                        <Input v-model="book.author"></Input>
                    </FormItem>
                    <FormItem label="出版社">
                        <Input v-model="book.press"></Input>
                    </FormItem>
                    <FormItem label="简介">
                        <Input v-model="book.intro" type="textarea" placeholder="" :rows="8"></Input>
                    </FormItem>
                </Form>
            </div>
            <div class="book-detail-top left">
                <Form :model="book" label-position="right" :label-width="100">
                    <FormItem label="译者">
                        <Input v-model="book.translator" size="small"></Input>
                    </FormItem>
                    <FormItem label="出版日期">
                        <Input v-model="book.pubTime" size="small"></Input>
                    </FormItem>
                    <FormItem label="页数">
                        <Input v-model="book.totalPage" size="small" placeholder="" disabled></Input>
                    </FormItem>
                </Form>
            </div>
        </Card>
        <br>
        <Card style="width:100%; padding:30px; text-align:left">
            <div class="vm-image-list">
                <h1>Notes of {{book.title}}</h1><br>
                <VmNoteTable :notes="notes"></VmNoteTable>
            </div>
        </Card>
        <!--<Row class="image-list-heading vm-panel">
                    
                    <Row type="flex" align="middle" justify="space-between" class="panel-body">
                        <div class="search-bar">
                            <Input placeholder="Please enter ..." v-model="keyword" style="width: 300px"></Input>
                            <Button type="ghost" @click="search"><i class="fa fa-search"></i></Button>
                        </div>
                        <Row type="flex" align="middle" class="page">
                            <span>Show</span>
                            <Input :max="40" :min="1" :number="true" v-model="showNum" class="input-number" @on-change=" updateDataShow "></Input>
                            <span class="margin-end">/ Page</span>
                            <span class="total">Total {{ data.length }}</span>
                            <Page :total="data.length" :current="currentPage" :page-size="showNum" @on-change="pageChange"></Page>
                        </Row>
                    </Row>
                </Row>-->
    </div>
</template>
<script>
    import VmNoteTable from '@/components/note/vm-note-table';
    export default {
        name: 'BookInfo',
        components: {
            VmNoteTable
        },
        data() {
            return {
                picture: '',
                book: {},
                notes: []
            }
        },
        methods: {
            getBook: function() {
                let param = new URLSearchParams();
                let that = this;
                let url = "fiction-note/getBook";
                param.append("bid", this.$route.query.id);
                this.picture = 'http://localhost:8080/fiction-note/getImg?filename=' + this.$route.query.picture;
                this.$axios.post(url, param)
                    .then(function(response) {
                        that.book = response.data;
                        console.log(that.book.picture);
                    }).catch(function(response) {
                        that.$Message.error('请求错误！--book detail');
                    });
            },
            getNotes: function() {
                let param = new URLSearchParams();
                let that = this;
                let url = "fiction-note/oneBookNotes";
                param.append("bid", this.$route.query.id);
                this.$axios.post(url, param)
                    .then(function(response) {
                        that.notes = response.data;
                    }).catch(function(response) {
                        that.$Message.error('请求错误！--one book notes');
                    });
            }
        },
        mounted() {
            this.getBook();
            this.getNotes();
        }
    }
</script>

<style>
    .book-detail {
        height: 250px;
        border: none;
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        border: 1px solid #000;
    }
    .book-detail-top {
        float: left;
        height: 100px;
        .left {
            width: 30%;
        }
    }
    .book-detail-top.right {
        width: 53%;
    }
    .book-detail-add {
        display: flex;
        justify-content: center;
        margin-left: 10px;
        align-items: center;
        color: #41b883;
        font-size: 18px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
    }
    .hr {
        height: 1px;
        border: none;
        border-top: 1px dashed #41b883;
    }
</style>
