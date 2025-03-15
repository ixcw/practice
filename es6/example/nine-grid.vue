<script>
  const works = [
    {
      image: 'https://ai-public.mastergo.com/ai/img_res/7edf2f1fd6c6ddd6234f584b6578c9aa.jpg'
    },
    {
      image: 'https://ai-public.mastergo.com/ai/img_res/590914c2fe8a2d17f78ea860e26f28b5.jpg'
    },
    {
      image: 'https://ai-public.mastergo.com/ai/img_res/31d164b3aa508d77a003b155bad20685.jpg'
    },
    {
      image: 'https://ai-public.mastergo.com/ai/img_res/a3f5f48e0f434665e28b0216119ce28d.jpg'
    },
    {
      image: 'https://ai-public.mastergo.com/ai/img_res/2fb2ca5a9b47bd620d353254a7134c17.jpg'
    }
    {
      image: 'https://ai-public.mastergo.com/ai/img_res/9dbee6ee704478c8a84b800eb6eaeb69.jpg'
    }
  ]
</script>
<template>
   <!-- 作品展示 -->
   <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-bold mb-4">作品展示</h2>
        <div class="grid grid-cols-3 gap-4">
          <div v-for="(work, index) in works" :key="index" class="relative aspect-square overflow-hidden rounded-lg">
            <img :src="work.image" class="w-full h-full object-cover object-top" :alt="'作品' + (index + 1)" />
          </div>
        </div>
      </div>
</template>