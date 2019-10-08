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
      <template v-if="selectedStickerPack">
        <div
          v-for="sticker in selectedStickerPack.stickers"
          :key="sticker.id"
          class="sticker">
          <img class="sticker__image" :src="sticker.stickerUrl">
        </div>
      </template>
      <template v-else>
        <div class="sticker-selector__sticker-display__placeholder">
          No pack selected.
        </div>
      </template>
    </section>
  </div>
</template>

<script>
  import SelectorStateCommunication from '../../mixins/SelectorStateCommunication'
  import StickerPackTab from './StickerPackTab.vue'

  const LAST_USED_STICKER_PACK = 'net.dv8tion.discord.LINE.last-used-sticker-pack'

  export default {
    mixins: [ SelectorStateCommunication ],
    components: {
      StickerPackTab
    },
    created() {
      this.loadSettings()
      this.loadPacks()
    },
    data() {
      return {
        showRecentlyUsedStickersTab: true,
        showFavoriteStickersTab: true,

        recentlyUsedStickers: [],
        userDefinedStickerPacks: [],
        selectedStickerPackId: this.$localStorage.getItem(LAST_USED_STICKER_PACK)
      }
    },
    computed: {
      allStickerPacks() {
        return [
          // this.showRecentlyUsedStickersTab ? this.getRecentUsedStickersPack() : null,
          // this.showFavoriteStickersTab ? {} : null,
          ...this.userDefinedStickerPacks
        ]
        .filter(pack => pack)
      },
      selectedStickerPack() {
        return this.allStickerPacks.find(pack => pack.id === this.selectedStickerPackId)
      }
    },
    methods: {
      selectStickerPack(packId) {
        this.selectedStickerPackId = packId
        this.$localStorage.setItem(LAST_USED_STICKER_PACK, packId)
      },
      async loadSettings() {
        const settings = await this.$services.settingsManager.getSettings()

        this.showRecentlyUsedStickersTab = settings.enableRecentlyUsedStickersTab
        this.showFavoriteStickersTab = settings.enableFavoriteStickersTab
      },
      async loadPacks() {
        const allPacks = await this.$services.stickerManager.getAllPacks()

        this.userDefinedStickerPacks = allPacks.map(packInfo => {
          return {
            id: packInfo.name,
            thumbnailImg: packInfo.tabImage,
            stickers: packInfo.stickers.map(stickerDataUrl => {
              return {
                id: Math.random(),
                stickerUrl: stickerDataUrl
              }
            })
          }
        })
      },
      getRecentUsedStickersPack() {

      }
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

    &__placeholder
      display flex
      flex 1
      align-self center
      justify-content center

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