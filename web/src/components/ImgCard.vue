<template>
  <div class="imgCard">
    <!-- 1 -->
    <div v-if="img.length===1">
      <img
        class="w-100 mb-1"
        :src="item.url"
        alt="item.img"
        v-for="(item, index) in img"
        :key="index"
      >
    </div>

    <!-- 2,4 -->
    <div
      v-if="img.length===2 || img.length===4"
      class="img d-flex jc-between flex-wrap"
    >
      <img
        class="mb-1"
        :src="item.url"
        alt="item.img"
        v-for="(item, index) in img"
        :key="index"
      >
    </div>

    <!-- 3,5,6,7,8,9 -->
    <div
      v-if="img.length!==1 && img.length!==2 && img.length!==4"
      class="img2 d-flex jc-start flex-wrap"
    >
      <img
        class="mb-1"
        :src="item.url"
        alt="item.img"
        v-for="(item, index) in img"
        :key="index"
        :class="{'mr-1':(index+1)%3!==0}"
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    img: { type: Array, required: true },
  },
}
</script>

<style lang="scss">
.imgCard {
  .img {
    img {
      width: 49.5%;
    }
  }
  .img2 {
    img {
      width: 32.6%;
    }
  }
}
</style>
