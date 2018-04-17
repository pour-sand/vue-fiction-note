<style scoped>
    .expand-row {
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="80">
            <span class="expand-key">主题: </span>
            <span class="expand-value">{{ row.title }}</span>
            </Col>
        </Row>
        <Row>
            <Col span="80">
            <span class="expand-key">内容: </span>
            <span class="expand-value">{{ row.content }}</span>
            </Col>
        </Row>
        <Row><Col  span="80">...</Col></Row>
        <Row>
            <Col span="80">
            <span class="replay" @click="modalReplay=true"><i class="fa fa-comment"></i></span>
            </Col>
        </Row>
        <Modal v-model="modalReplay" title="Replay" ok-text="OK" cancel-text="Cancel" v-on:on-ok="editOk">
            <Input v-model="replay" type="textarea" placeholder="" :rows="6"></Input>
        </Modal>
    </div>
</template>
<script>
    export default {
        name: 'VmTableExpand',
        props: {
            row: Object
        },
        data() {
            return{
                modalReplay: false,
                replay: ''
            }
        }
    };
</script>

<style>
    .replay {
        font-style: italic;
        font-size: 9px;
        a {
            color: #41b883;
        }
    }
</style>