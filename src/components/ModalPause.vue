<script>
import {mapActions} from "pinia";
import {useMainStore} from "../stores/main";

export default {
  name: "ModalPause",
  methods: {
    ...mapActions(useMainStore, ['closeModal']),

    continueGame() {
      window.dispatchEvent(new Event('continue-game'))
    },
    restartGame() {
      window.dispatchEvent(new Event('restart-game'))
    },
    quitGame() {
      this.closeModal()
      this.$router.push({name: 'menu'})
    },
  }
}
</script>

<template>
  <div class="modal-wrap">
    <div class="modal modal-pause">
      <div class="modal__title title title_l title_light">PAUSE</div>

      <button @click="continueGame" class="modal__btn btn">CONTINUE GAME</button>
      <button @click="restartGame" class="modal__btn btn">RESTART</button>
      <button @click="quitGame" class="modal__btn btn btn_color-first">QUIT GAME</button>
    </div>
  </div>
</template>
