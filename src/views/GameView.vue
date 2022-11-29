<script>
import Icon from "../components/Icon.vue";
import ModalPause from "../components/ModalPause.vue";

const ROWS = 6
const COLUMNS = 7

const PLAYER_ONE = 1
const PLAYER_TWO = 2
export default {
  name: "GameView",
  components: {ModalPause, Icon},
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
      winner: null,
      playerOneScore: 0,
      playerTwoScore: 0,

      timeActive: {
        seconds: 0,
        minutes: 0,
        hours: 0
      },
      seconds: 0,
      timeInterval: null,

      counter: {
        countRowOne: 1,
        countRowTwo: 1,
        countColumnOne: 1,
        countColumnTwo: 1,
        countDiagonalOne: 1,
        countDiagonalTwo: 1,
        countDiagonalRevertOne: 1,
        countDiagonalRevertTwo: 1,
      },

      loading: false
    }
  },
  methods: {
    onClick(row, column) {
      if (!this.loading) {
        let cell = this.game.findLast(rowItem => !rowItem[column])
        cell[column] = (this.activePlayer)
        this.activePlayer = this.activePlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE

        if (!this.winner) {
          this.checkWin()
        }
      }
    },

    checkWin() {
      let revertArray = []

      for (let i = 0; i < COLUMNS; i++) {
        revertArray[i] = new Array(ROWS);
      }

      this.counter.countDiagonalOne = 1
      this.counter.countDiagonalTwo = 1
      this.counter.countDiagonalRevertOne = 1
      this.counter.countDiagonalRevertTwo = 1

      this.game.forEach((rowItem, rowIndex) => {
        this.counter.countRowOne = 1
        this.counter.countRowTwo = 1

        rowItem.forEach((cellItem, cellIndex) => {
          revertArray[cellIndex][rowIndex] = cellItem
        })

        rowItem.forEach((cellItem, cellIndex) => {
          //check rows
          if (cellItem === rowItem[cellIndex + 1]) {
            cellItem === PLAYER_ONE ? this.counter.countRowOne++ : this.counter.countRowTwo++

            if (this.counter.countRowOne === 4) {
              this.setWinner(PLAYER_ONE)
            } else  if (this.counter.countRowTwo === 4) {
              this.setWinner(PLAYER_TWO)
            }
          }

          //check first diagonal
          if (cellIndex + 1 < rowItem.length - 1 && rowIndex < this.game.length - 1) {
            if (cellItem === this.game[rowIndex + 1][cellIndex + 1]) {
              cellItem === PLAYER_ONE ? this.counter.countDiagonalOne++ : this.counter.countDiagonalTwo++

              if (this.counter.countDiagonalOne === 4) {
                this.setWinner(PLAYER_ONE)
              } else  if (this.counter.countDiagonalTwo === 4) {
                this.setWinner(PLAYER_TWO)
              }
            }
          }

          //check second diagonal
           if (cellIndex - 1 >= 0 && rowIndex + 1 < rowItem.length - 1) {
             if (cellItem === this.game[rowIndex + 1][cellIndex - 1]) {
               cellItem === PLAYER_ONE ? this.counter.countDiagonalRevertOne++ : this.counter.countDiagonalRevertTwo++

               if (this.counter.countDiagonalRevertOne === 4) {
                 this.setWinner(PLAYER_ONE)
               } else  if (this.counter.countDiagonalRevertTwo === 4) {
                 this.setWinner(PLAYER_TWO)
               }
             }
           }
        })
      })

      //check vertical
      revertArray.forEach((rowItem, rowIndex) => {
        this.counter.countColumnOne = 1
        this.counter.countColumnTwo = 1

        rowItem.forEach((cellItem, cellIndex) => {
          if (cellIndex + 1 < rowItem.length) {
            if (cellItem === rowItem[cellIndex + 1]) {
              cellItem === PLAYER_ONE ? ++this.counter.countColumnOne : ++this.counter.countColumnTwo

              if (this.counter.countColumnOne === 4) {
                this.setWinner(PLAYER_ONE)
              } else  if (this.counter.countColumnTwo === 4) {
                this.setWinner(PLAYER_TWO)
              }
            }
          }
        })
      })

      // console.log('revertArray', revertArray)
    },
    setWinner(winner) {
      clearInterval(this.timeInterval);
      this.winner = winner
      this.winner === PLAYER_ONE ? this.playerOneScore++ : this.playerTwoScore++
    },

    playAgain() {
      this.winner = null
      this.createArray()
      this.seconds = 0
      this.countTime()
    },
    restart() {
      this.playAgain()
      this.playerOneScore = 0
      this.playerTwoScore = 0
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

        <button @click="restart" class="btn-small">RESTART</button>
      </div>

      <div class="game-wrap">
        <div class="game">
          <div class="game__player">
            <Icon src="player-one" width="54" height="59" class="game__player-icon"/>
            <div class="game__player-title title title_s">PLAYER 1</div>
            <div class="game__player-score title title_l">{{ playerOneScore }}</div>
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
                          class="game__field-bg-circle" :disabled="winner"
                          :class="{animate: PLAYER_ONE === item || PLAYER_TWO === item}"
                          :style="{top: (88*rowIndex) + 20 + 'px', left: (88*index) + 20 + 'px'}"
                  >
                    <div class="game__field-bg-animate" :ref="`bg-animate-${rowIndex}-${index}`"
                         :class="{'game__field-bg-animate_player-one': PLAYER_ONE === item, 'game__field-bg-animate_player-two': PLAYER_TWO === item, animate: PLAYER_ONE === item || PLAYER_TWO === item}"
                    ></div>
                  </button>
                </template>
              </template>
            </div>

            <div v-if="!winner" class="game__field-info"
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

            <div v-else class="game__field-win">
              <div class="game__field-win-title title title_xs">PLAYER {{ winner }}</div>
              <div class="title title_l">WINS</div>

              <button @click="playAgain" class="btn-small">PLAY AGAIN</button>
            </div>
          </div>

          <div class="game__player">
            <Icon src="player-two" width="54" height="59" class="game__player-icon"/>
            <div class="game__player-title title title_s">PLAYER 2</div>
            <div class="game__player-score title title_l">{{ playerTwoScore }}</div>
          </div>
        </div>
      </div>
    </div>
  </main>


</template>
