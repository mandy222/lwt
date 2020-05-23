<template>
  <div class="mt-3 px-3 pt-4 bg-white">
    <div class="border-bottom d-flex w-100 pb-3">
      <i class="iconfont fs-xxl text-primary shu" :class="`icon-${icon}`"></i>
      <span class="flex-1 fs-xl fw-4 title">{{ title }}</span>
      <span v-if="to" class="iconfont icon-moreread fs-xxl" @click="handleLink"></span>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    to: { type: String}
  },
  methods: {
    handleLink() {
      this.$router.push(this.to)
    }
  }
}
</script>

<style lang="scss">
.shu, .title {
  position: relative;
  left: -.5rem;
}
.title {
  font-weight: 550;
}
</style>
