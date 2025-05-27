<!-- 个人报告 -->
<script setup lang="ts">
// import { useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue'
import AfterClass from './components/after-class.vue'
import AdditionalEvaluation from './components/additional-evaluation.vue'
import { onIsAppAloneModuleGoBack } from '@/utils/const'

const activeTab = ref(0)

// const router = useRouter()
// 返回上一级
function onClickLeft() {
  // router.go(-1)
  onIsAppAloneModuleGoBack()
}

function onClickTab(tab: any) {
  console.log(tab)
}
</script>

<template>
  <div class="kp-top">
    <van-nav-bar
      class="kp-bar" title="个人报告" left-arrow left-text="返回" :border="false" @click-left="onClickLeft"
    />
    <van-tabs class="kp-tabs" v-model:active="activeTab" @click-tab="onClickTab">
      <van-tab title="课后报告" />
      <van-tab title="增值评价" />
    </van-tabs>
  </div>
  <div class="content-area">
    <AfterClass v-if="activeTab === 0" />
    <AdditionalEvaluation v-if="activeTab === 1" :type="1" />
  </div>
</template>

<style scoped lang="scss">
.box {
  margin-top: 20px;
}

:deep(body) {
  overflow: hidden;
}

.kp-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 210px;
  padding-top: 25px;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  background: url('../images/bg.png') no-repeat center center / cover;

  .kp-bar {
    --van-nav-bar-background: rgb(000/0);
    color: white;
    --van-nav-bar-text-color: #262626;
    --van-nav-bar-icon-color: #262626;
    --van-nav-bar-title-text-color: #262626;
  }

  .kp-tabs {
    --van-tabs-nav-background: rgb(000/0);
    --van-tab-active-text-color: #1D5CE9;
    --van-tab-text-color: #262626;
    --van-tabs-bottom-bar-color: #262626;
    --van-tabs-bottom-bar-color: #1D5CE9;
  }
}

.content-area {
  position: fixed;
  top: 125px;
  top: calc(100px + constant(safe-area-inset-top));
  top: calc(100px + env(safe-area-inset-top));
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
