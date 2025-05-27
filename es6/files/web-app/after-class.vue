<script setup  lang='ts'>
import { useRoute } from 'vue-router'
import comprehensiveLevel from './comprehensiveLevel.vue'
import coreCompetencies from './coreCompetencies.vue'
import keyCapabilities from './keyCapabilities.vue'
import thinkingQuality from './thinkingQuality.vue'
import itemAnalysis from './itemAnalysis.vue'

const route = useRoute()
const title = route?.query?.title
</script>

<template>
  <div class="px-15px pb-15px h-60px">
    <div class="tlt">
      {{ title }}
    </div>
  </div>
  <div class="rounded-t-10px bg-white pt-20px px-10px pb-15px">
    <comprehensiveLevel />
    <van-divider class="py-10px" />

    <coreCompetencies />
    <van-divider class="py-10px" />

    <keyCapabilities />
    <van-divider class="py-10px" />

    <thinkingQuality />
    <van-divider class="py-10px" />

    <itemAnalysis />
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
