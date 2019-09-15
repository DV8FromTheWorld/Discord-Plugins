const STATE_EVENT = 'sticker-selector-state-change'

export default {
  data() {
    return {
      isStickerSelectorOpen: false
    }
  },
  methods: {
    toggleStickerSelector() {
      this.isStickerSelectorOpen = !this.isStickerSelectorOpen

      this.$eventBus.$emit('change-selector-state', { isOpen: this.isStickerSelectorOpen })
    },
    handleStickerSelectorChange(event) {
      this.isStickerSelectorOpen = event.isOpen
    }
  },
  created() {
    this.$eventBus.$on('change-selector-state', this.handleStickerSelectorChange)
  },
  beforeDestroy() {
    this.$eventBus.$off('change-selector-state', this.handleStickerSelectorChange)
  }
}