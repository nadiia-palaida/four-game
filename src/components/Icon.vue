<script>
export default {
  name: "Icon",
  props: {
    src: {type: String, required: true}
  },
  computed: {
    srcDir() {
      return new URL(`../assets/images/svg/sprite.svg`, import.meta.url).href
    }
  }
}
</script>

<template>
  <svg class="icon">
    <use :xlink:href="`${srcDir}#${src}`" />
  </svg>
</template>
