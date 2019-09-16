<template>
  <div
    class="sticker-selector"
    :class="{ 'u-is-active': isStickerSelectorOpen }">
    <div class="sticker-selector__tab-row">
      <StickerPackTab
        v-for="stickerPack in allStickerPacks"
        :key="stickerPack.id"
        :pack-info="stickerPack"
        :is-selected="selectedStickerPackId === stickerPack.id"
        @pack-selected="selectStickerPack">
      </StickerPackTab>
    </div>
    <section class="sticker-selector__sticker-display">
      <div
        v-for="sticker in selectedStickerPack.stickers"
        :key="sticker.id"
        class="sticker">
          <img class="sticker__image" :src="sticker.stickerUrl">
      </div>
    </section>
  </div>
</template>

<script>
  import SelectorStateCommunication from '../../mixins/SelectorStateCommunication'
  import StickerPackTab from './StickerPackTab.vue'

  const makeSticker = () => ({ id: Math.random(), stickerUrl: "https://i.imgur.com/t3z8PLy.png" })

  export default {
    mixins: [ SelectorStateCommunication ],
    components: {
      StickerPackTab
    },
    data() {
      return {
        userDefinedStickerPacks: [{
          id: 'fma',
          thumbnailImg: 'https://i.imgur.com/t3z8PLy.png',
          stickers: Array.from({length: 22}, makeSticker)
        }],
        selectedStickerPackId: 'recently-used'
      }
    },
    computed: {
      allStickerPacks() {
        const recentlyUsedStickers = {
          id: 'recently-used',
          thumbnailImg: 'https://i.imgur.com/CvhIWAL.png',
          stickers:  Array.from({length: 5}, makeSticker)
        }

        return [recentlyUsedStickers, ...this.userDefinedStickerPacks]
      },
      selectedStickerPack() {
        return this.allStickerPacks.find(pack => pack.id === this.selectedStickerPackId)
      }
    },
    methods: {
      selectStickerPack(packId) {
        this.selectedStickerPackId = packId
      },
    }
  }
</script>

<style lang="stylus">
.sticker-selector
  display flex
  flex-direction column
  height 0
  min-height 0
  transition min-height .1s ease-in
  overflow hidden
  color var(--text-normal)

  &__tab-row
    display flex
    height 50px
    padding 5px 0
    margin 0 20px
    border-bottom 1px solid var(--background-modifier-accent);

  &__sticker-display
    display flex
    flex-wrap wrap
    align-items flex-start
    margin 0 20px
    height 100%
    background-color var(--background-secondary)

    //When we hover over the sticker selection area, add a visual indicator to all stickers, except
    // the one being hovered, that
    &:hover .sticker:not(:hover)
      opacity 0.55

  &.u-is-active
    min-height 250px
    border-top 3px solid var(--background-modifier-accent)

.sticker
  cursor pointer

  &__image
    width 100px
    height @width


</style>