<template>
  <div class="line-icon-div">
    <img
      class="line-icon"
      aria-label="Opens and closes the LINE Sticker Selector"
      src="https://i.imgur.com/oOpi6Q9.png"
      @keydown.enter.prevent="toggleStickerSelector"
      @keydown.space.prevent="toggleStickerSelector"
      @click.prevent="toggleStickerSelector"
    />
  </div>
</template>

<script>
  export default {
    methods: {
      toggleStickerSelector() {
        console.log("triggering selector")
      }
    }
  }
</script>

<!--
<style lang="stylus">
  .line-icon-div {
    position: relative;
    margin: -12px 32px -12px 0px;
    height: 41px;
    width: 45px;
    cursor: pointer;
    display:  -webkit-box;
    display:  -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    filter: grayscale(95%);
    -webkit-filter: grayscale(95%);
    -webkit-box-align: center;
    -moz-box-align: center;
    -ms-box-align: center;
    -o-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -ms-box-pack: center;
    -o-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-transition: filter .3s ease-in, -webkit-filter .3s ease-in;
    -moz-transition: filter .3s ease-in, -webkit-filter .3s ease-in;
    -o-transition: filter .3s ease-in, -webkit-filter .3s ease-in;
    -ms-transition: filter .3s ease-in, -webkit-filter .3s ease-in;
    transition: filter .3s ease-in, -webkit-filter .3s ease-in;
  }

  .line-icon-div:hover {
    filter: grayscale(0%);
    -webkit-filter: grayscale(0%);
    -webkit-transition: filter .3s ease-in, -webkit-filter .3s ease-in;
    -moz-transition: filter .3s ease-in, -webkit-filter .3s ease-in;
    -o-transition: filter .3s ease-in, -webkit-filter .3s ease-in;
    -ms-transition: filter .3s ease-in, -webkit-filter .3s ease-in;
    transition: filter .3s ease-in, -webkit-filter .3s ease-in;
  }
</style>
-->