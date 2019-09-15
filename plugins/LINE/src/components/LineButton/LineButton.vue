<template>
  <div
    class="line-icon"
    :class="{ 'u-is-active': isStickerSelectorOpen }"
    @keydown.enter.prevent="toggleStickerSelector"
    @keydown.space.prevent="toggleStickerSelector"
    @click.prevent="toggleStickerSelector">
    <img
      class="line-icon__image"
      aria-label="Opens and closes the LINE Sticker Selector"
      src="./line-icon.png"
    />
  </div>
</template>

<script>
  import SelectorStateCommunication from '../../mixins/SelectorStateCommunication'

  export default {
    mixins: [ SelectorStateCommunication ]
  }
</script>

<style lang="stylus">
  .line-icon
    width 40px
    display flex
    align-items center
    justify-content center
    cursor pointer
    filter grayscale(95%)
    transition filter .1s ease-in

    &__image
      height 25px
      transition height .1s ease-in

    &:hover, &.u-is-active
      filter grayscale(0%)
      transition filter .1s ease-in

      & ^[0]__image
        height 28px

</style>