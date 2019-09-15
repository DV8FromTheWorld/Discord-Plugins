<template>
  <div
    class="sticker-selector"
    :class="{ 'u-is-active': isStickerSelectorOpen }">
    Sticker Selection coming soon
  </div>
</template>

<script>
  import SelectorStateCommunication from '../../mixins/SelectorStateCommunication'

  export default {
    mixins: [ SelectorStateCommunication ]
  }
</script>

<style lang="stylus">
.sticker-selector
  display flex
  align-items center
  justify-content center
  height 0
  min-height 0
  transition min-height .1s ease-in
  overflow hidden
  color var(--text-normal)

  &.u-is-active
    min-height 250px
    border-top: 1px solid var(--background-modifier-accent);


</style>