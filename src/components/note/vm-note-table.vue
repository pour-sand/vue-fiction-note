<template>
    <div>
        <Table :columns="columnTitle" :data="dataShow"></Table>
        <!----><br>
        <Row type="flex" align="middle" class="page">
            <span>Show&nbsp;</span>
            <Input :max="40" :min="1" :number="true" v-model="showNum" class="note-table-page" @on-change=" updateDataShow "></Input>
            <span class="margin-end">&nbsp;/ Page&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span class="total note-table-total-page">Total {{ notes.length }}</span>
            <Page :total="notes.length" :current="currentPage" :page-size="showNum" @on-change="pageChange"></Page>
        </Row>
    </div>
</template>
<script>
    import VmTableExpand from '@/components/note/vm-table-expand';
    export default {
        name: 'VmNoteTable',
        components: {
            VmTableExpand
        },
        props: {
            notes: {
                type: Array,
                default: {}
            }
        },
        data() {
            return {
                showNum: 4,
                currentPage: 1,
                dataShow: [],
                columnTitle: [{
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(VmTableExpand, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: '起始页',
                        key: 'fromPage',
                        sortable: true
                    },
                    {
                        title: '结束页',
                        key: 'toPage',
                        sortable: true
                    },
                    {
                        title: '起始时间',
                        key: 'timeb',
                        sortable: true
                    },
                    {
                        title: '结束时间',
                        key: 'timee',
                        sortable: true
                    },
                    {
                        title: '记录时间',
                        key: 'time',
                        sortable: true
                    },
                    {
                        title: 'User',
                        key: 'userId',
                        filters: [{
                                label: '好友',
                                value: 1
                            },
                            {
                                label: '我',
                                value: 2
                            }
                        ],
                        filterMultiple: false,
                        filterMethod(value, row) {
                            if (value === 1) {
                                return row.age > 25;
                            } else if (value === 2) {
                                return row.age < 25;
                            }
                        }
                    }
                ],
                notesHide: [{
                    title: 'Theme',
                    content: 18,
                }, ]
            }
        },
        methods: {
            updateDataShow: function() {
                let startPage = (this.currentPage - 1) * this.showNum
                let endPage = startPage + this.showNum
                this.dataShow = this.notes.slice(startPage, endPage)
            },
            pageChange: function(page) {
                this.currentPage = page
                this.updateDataShow()
            },
        },
        watch: {
            data: function() {
                this.dataShow = this.notes.slice(0, this.showNum) // update dataShow once data changed
            }
        },
        mounted: function() {
            this.dataShow = this.notes.slice(0, this.showNum)
        }
    }
</script>

<style>
.note-table-page{
    width: 40px;
}
.note-table-total-page{
    float:right;
}
</style>
