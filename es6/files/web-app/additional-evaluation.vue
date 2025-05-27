<script setup  lang='ts'>
import evaluation from './evaluation.vue'
import { urlParamsStore } from '@/store/modules/urlParams'

const paramsStore = urlParamsStore()

const props = defineProps<{ type: number }>()
</script>

<template>
  <div class="px-15px pb-15px h-60px">
    <div class="tlt">
      {{ paramsStore?.params?.title }}
    </div>
  </div>
  <div class="rounded-t-10px bg-white pt-20px px-15px pb-15px">
    <evaluation :type="props.type" />
  </div>
</template>

<style scoped>
    .tlt{
    width: 100%;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    }
</style>
