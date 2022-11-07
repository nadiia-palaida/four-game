<script>
import Icon from "../components/Icon.vue";

const ROWS = 6
const COLUMNS = 7

const PLAYER_ONE = 1
const PLAYER_TWO = 2
export default {
  name: "GameView",
  components: {Icon},
  computed: {
    getSeconds() {
      return Math.floor(this.seconds % 60)
    },
    getMinutes() {
      return Math.floor(this.seconds / 60)
    },
    getHours() {
      return Math.floor((this.seconds / 60) / 60)
    },
    isUserOnPage() {
      document.addEventListener('visibilitychange', () => {
        return document.hidden
      });
    }
  },
  data() {
    return {
      ROWS, COLUMNS,
      PLAYER_ONE, PLAYER_TWO,

      game: [],
      markerPosition: 0,
      activePlayer: PLAYER_ONE,

      timeActive: {
        seconds: 55,
        minutes: 0,
        hours: 0
      },
      seconds: 55,
      timeInterval: null,

      loading: false
    }
  },
  methods: {
    onClick(row, column) {
      if (!this.loading) {
        let cell = this.game.findLast((rowItem) => !rowItem[column])
        cell[column] = (this.activePlayer)
        this.activePlayer = this.activePlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE


        let elem = this.$refs[`bg-animate-${row}-${column}`]

        elem[0].style.transform = `translateY(${(88 * row) + 20 + 'px'})  transform: translateX(${(88*column) + 20 + 'px'}`
        console.log('this.$refs[\'bg-animate\']')
      }
    },

    createArray() {
      for (let i = 0; i < ROWS; i++) {
        this.game[i] = new Array(COLUMNS);
      }
    },
    setCountInterval() {
      this.timeInterval = setInterval(() => {
        this.seconds += 1
      }, 1000);
    },
    countTime() {
      this.setCountInterval()

      if (document.hidden)
        clearInterval(this.timeInterval);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          clearInterval(this.timeInterval);
        } else {
          this.setCountInterval()
        }
      });
    },
  },
  mounted() {
    this.createArray()
    this.countTime()

  }
}
</script>

<template>
  <main class="main-game">
    <div class="container">
      <div class="game-header">
        <router-link :to="{name: 'menu'}" class="btn-small">MENU</router-link>

        <div class="game-header__logo">
          <router-link :to="{name: 'menu'}">
            <img src="@/assets/images/logo.svg" alt="logo">
          </router-link>
        </div>

        <button class="btn-small">RESTART</button>
      </div>
      <div class="game-wrap">
        <div class="game">
          <div class="game__player">
            <Icon src="player-one" width="54" height="59" class="game__player-icon"/>
            <div class="game__player-title title title_s">PLAYER 1</div>
            <div class="game__player-score title title_l">12</div>
          </div>

          <div class="game__field">
            <img src="@/assets/images/svg/marker-red.svg" alt="marker" :style="{left: (88 * markerPosition) + 'px'}"
                 class="game__field-marker">
            <!--            <img src="@/assets/images/svg/marker-yellow.svg" alt="marker">-->

            <div class="game__field-bg" ref="game-field">
              <img src="@/assets/images/svg/board-layer-black-large.svg" alt="background-dark"
                   class="game__field-bg-dark">
              <img src="@/assets/images/svg/board-layer-white-large.svg" alt="background-light"
                   class="game__field-bg-light">

              <template v-for="(row, rowIndex) in game">
                <template v-for="(item, index) in row">
                  <button @click="onClick(rowIndex, index)" @mouseenter="markerPosition = index"
                          class="game__field-bg-circle"
                          :class="{'game__field-bg-circle_player-one': PLAYER_ONE === item, 'game__field-bg-circle_player-two': PLAYER_TWO === item}"
                          :style="{top: (88*rowIndex) + 20 + 'px', left: (88*index) + 20 + 'px'}"
                  ></button>
                  <div class="game__field-bg-animate" :ref="`bg-animate-${rowIndex}-${index}`"
                       :class="{'game__field-bg-animate_player-one': PLAYER_ONE === item, 'game__field-bg-animate_player-two': PLAYER_TWO === item}"
                  ></div>
                </template>
              </template>
            </div>

            <div class="game__field-info"
                 :class="{'game__field-info_minutes': getMinutes, 'game__field-info_hours': getHours}">
              <div class="game__field-info-bg"></div>

              <div class="game__field-info-content">
                <div class="game__field-info-title title title_xs title_light">PLAYER {{ activePlayer }}’S TURN</div>
                <div class="game__field-info-counter title title_l title_light">
                  <span v-show="getHours">{{ getHours }}hr</span>
                  <span v-show="getMinutes">{{ getMinutes }}m</span>
                  <span>{{ getSeconds }}s</span>
                </div>
              </div>
            </div>
          </div>


          <div class="game__player">
            <Icon src="player-two" width="54" height="59" class="game__player-icon"/>
            <div class="game__player-title title title_s">PLAYER 2</div>
            <div class="game__player-score title title_l">23</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
