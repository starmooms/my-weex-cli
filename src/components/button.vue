<template>
    <button class="btn" @click="jump('/about')">
        <text class="f">{{ msg }}</text>
    </button>
</template>

<script>
export default {
    data() {
        return {
            msg: '跳转'
        }
    }
}
</script>

<style lang="less">
.btn {
    background-color: #7be7e7;
    padding: 20px 40px;
    font-size: 14px;
    color: #ffffff;
}
.f {
    color: #ffffff;
}
</style>


