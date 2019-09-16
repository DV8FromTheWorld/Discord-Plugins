<template>
  <div
    class="sticker-tab"
    :class="{ 'u-is-active': isSelected }"
    @keydown.enter.prevent="emitPackSelected"
    @keydown.space.prevent="emitPackSelected"
    @click.prevent="emitPackSelected">
    <img
      class="sticker-tab__image"
      :class="{ 'sticker-tab__image--needs-invert': packInfo.id === 'recently-used' }"
      :src="packInfo.thumbnailImg"
    />
  </div>
</template>

<script>
  export default {
    props: {
      isSelected: { type: Boolean, default: false },
      packInfo: { type: Object, required: true },
    },
    data() {
      return {
      }
    },
    computed: {
    },
    methods: {
      emitPackSelected() {
        this.$emit('pack-selected', this.packInfo.id)
      }
    }
  }
</script>

<style lang="stylus">
.sticker-tab
  position relative //Needed for the ::after's position absolute + width/height
  width 48px
  height 38px
  display flex
  align-items center
  justify-content center
  cursor pointer

  & + &
    margin-left 4px

  &__image
    max-width 44px
    max-height 38px
    filter grayscale(95%)

    .theme-dark &--needs-invert
      filter grayscale(95%) invert(35%)

  //Create the on-hover border without causing flashing from height/width gaining
  // an extra pixel due to adding a border.
  &:hover::after
    content ''
    position absolute
    height 100%
    width 100%
    border 1px solid var(--background-modifier-accent);

  &.u-is-active
    background-color var(--background-secondary)

    & ^[0]__image
      filter grayscale(0%)

      .theme-dark &--needs-invert
        filter grayscale(0%) invert(35%)


</style>