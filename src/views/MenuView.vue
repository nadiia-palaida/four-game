<script>
import Icon from "../components/Icon.vue";
export default {
  components: {Icon}
}
</script>

<template>
  <main class="main-menu">
    <div class="container">
      <div class="menu-wrap">
        <div class="menu">
          <div class="menu__logo">
            <img src="@/assets/images/logo.svg" alt="logo">
          </div>

          <router-link :to="{name: 'game'}" class="menu__btn btn btn_icon btn_color-second">
            <div>PLAY VS PLAYER</div>

            <Icon src="player-vs-player" width="82" height="46"/>
          </router-link>

          <button class="menu__btn btn">
            <div>GAME RULES</div>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
