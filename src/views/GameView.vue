<script>
import Icon from "../components/Icon.vue";
import ModalPause from "../components/ModalPause.vue";
import {mapActions, mapState} from "pinia";
import {useMainStore} from "../stores/main";

const ROWS = 6
const COLUMNS = 7

const PLAYER_ONE = 1
const PLAYER_TWO = 2
export default {
  name: "GameView",
  components: {ModalPause, Icon},
  computed: {
    getBgColor() {
      return this.winner === PLAYER_ONE ? '#FD6687;' : this.winner === PLAYER_TWO ? '#FFCE67;' : '#5C2DD5;'
    },
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
    },
    widthCircle() {
      if(document.documentElement.clientWidth > 768) {
        return 64
      } else if (document.documentElement.clientWidth <= 768 && document.documentElement.clientWidth > 576) {
        return 57
      } else if (document.documentElement.clientWidth <= 576 && document.documentElement.clientWidth > 0) {
        return 40
      }
    },
    widthCirclePadding() {
      if(document.documentElement.clientWidth > 768) {
        return 24
      } else if (document.documentElement.clientWidth < 768 && document.documentElement.clientWidth > 576) {
        return 18
      } else if (document.documentElement.clientWidth < 576 && document.documentElement.clientWidth > 0) {
        return 10
      }
    },
    widthFirstCirclePadding() {
      if(document.documentElement.clientWidth > 768) {
        return 20
      } else if (document.documentElement.clientWidth < 768 && document.documentElement.clientWidth > 576) {
        return 18
      } else if (document.documentElement.clientWidth < 576 && document.documentElement.clientWidth > 0) {
        return 10
      }
    },
    ...mapState(useMainStore, ['modal']),
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
        countColumnOne: 0,
        countColumnTwo: 0,
        countDiagonalOne: 0,
        countDiagonalTwo: 0,
        countDiagonalRevertOne: 0,
        countDiagonalRevertTwo: 0,
      },

      loading: false,
      circleWidth: 0,
      circleWidthPadding: 0,
    }
  },
  methods: {
    ...mapActions(useMainStore, ['openModal', 'closeModal']),
    onClick(row, column) {
      if (!this.loading) {
        let cell = this.game.findLast(rowItem => !rowItem[column])
        cell[column] = (this.activePlayer)
        this.activePlayer = this.activePlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE

        if (!this.winner) {
          this.checkWinNew()
        }
      }
    },

    checkWinNew() {
      this.checkRows()
      this.checkColumns()
      this.checkDiagonalOne()
      this.checkDiagonalTwo()
    },

    checkRows() {
      this.game.forEach((rowItem, rowIndex) => {
        this.counter.countRowOne = 1
        this.counter.countRowTwo = 1

        rowItem.forEach((cellItem, cellIndex) => {
          if (cellItem === PLAYER_ONE && cellItem === rowItem[cellIndex + 1]) {
            this.counter.countRowOne++
          } else if (cellItem === PLAYER_TWO && cellItem === rowItem[cellIndex + 1]) {
            this.counter.countRowTwo++
          }

          if (this.counter.countRowOne === 4) {
            if (!this.winner) {
              for (let j = cellIndex + 1; j >= cellIndex - 2 && j >= 0; j--) {
                setTimeout(() => {
                  this.$refs[`bg-animate-${rowIndex}-${j}`][0].classList.add('is-four')
                }, 1000)
              }
            }

            this.setWinner(PLAYER_ONE)
          } else if (this.counter.countRowTwo === 4) {
            if (!this.winner) {
              for (let j = cellIndex + 1; j >= cellIndex - 2 && j >= 0; j--) {
                setTimeout(() => {
                  this.$refs[`bg-animate-${rowIndex}-${j}`][0].classList.add('is-four')
                }, 1000)
              }
            }

            this.setWinner(PLAYER_TWO)
          }
        })
      })
    },

    checkColumns() {
      this.countColumnOne = 0
      this.countColumnTwo = 0

      this.game.forEach((rowItem, rowIndex) => {
        rowItem.forEach((cellItem, cellIndex) => {
          this.counter.countColumnOne = 0
          this.counter.countColumnTwo = 0

          for (let countRow = 0, countCell = 0; countRow < 4 && countCell < 4; countRow++) {
            if (rowIndex + countRow < this.game.length && cellIndex + countCell < rowItem.length) {
              if (cellItem === PLAYER_ONE && cellItem === this.game[rowIndex + countRow][cellIndex]) {
                this.counter.countColumnOne++

                if (this.counter.countColumnOne === 4) {
                  if (!this.winner) {
                    let newCountCell = countCell
                    for (let j = countRow; j >= 0; j--) {
                      setTimeout(() => {
                        this.$refs[`bg-animate-${rowIndex + j}-${cellIndex}`][0].classList.add('is-four')
                        newCountCell--
                      }, 1000)
                    }
                  }

                  this.setWinner(PLAYER_ONE)
                }
              } else if (cellItem === PLAYER_TWO && cellItem === this.game[rowIndex + countRow][cellIndex]) {
                this.counter.countColumnTwo++

                if (this.counter.countColumnTwo === 4) {
                  if (!this.winner) {
                    let newCountCell = countCell

                    for (let j = countRow; j >= 0; j--) {
                      setTimeout(() => {
                        this.$refs[`bg-animate-${rowIndex + j}-${cellIndex}`][0].classList.add('is-four')
                        newCountCell--
                      }, 1000)
                    }
                  }

                  this.setWinner(PLAYER_TWO)
                }
              } else {
                this.counter.countColumnOne = 0
                this.counter.countColumnTwo = 0
              }
            }
          }
        })
      })
    },

    checkDiagonalOne() {
      this.countDiagonalOne = 0
      this.countDiagonalTwo = 0

      this.game.forEach((rowItem, rowIndex) => {
        rowItem.forEach((cellItem, cellIndex) => {
          this.counter.countDiagonalOne = 0
          this.counter.countDiagonalTwo = 0

          for (let countRow = 0, countCell = 0; countRow < 4 && countCell < 4; countRow++, countCell++) {
            if (rowIndex + countRow < this.game.length && cellIndex + countCell < rowItem.length) {
              if (cellItem === PLAYER_ONE && cellItem === this.game[rowIndex + countRow][cellIndex + countCell]) {
                this.counter.countDiagonalOne++

                if (this.counter.countDiagonalOne === 4) {
                  if (!this.winner) {
                    let newCountCell = countCell
                    for (let j = countRow; j >= 0; j--) {
                      setTimeout(() => {
                        this.$refs[`bg-animate-${rowIndex + j}-${cellIndex + newCountCell}`][0].classList.add('is-four')
                        newCountCell--
                      }, 1000)
                    }
                  }

                  this.setWinner(PLAYER_ONE)
                }
              } else if (cellItem === PLAYER_TWO && cellItem === this.game[rowIndex + countRow][cellIndex + countCell]) {
                this.counter.countDiagonalTwo++

                if (this.counter.countDiagonalTwo === 4) {
                  if (!this.winner) {
                    let newCountCell = countCell

                    for (let j = countRow; j >= 0; j--) {
                      setTimeout(() => {
                        this.$refs[`bg-animate-${rowIndex + j}-${cellIndex + newCountCell}`][0].classList.add('is-four')
                        newCountCell--
                      }, 1000)
                    }
                  }

                  this.setWinner(PLAYER_TWO)
                }
              } else {
                this.counter.countDiagonalOne = 0
                this.counter.countDiagonalTwo = 0
              }
            }
          }
        })
      })
    },

    checkDiagonalTwo() {
      this.countDiagonalRevertOne = 0
      this.countDiagonalRevertTwo = 0

      this.game.forEach((rowItem, rowIndex) => {
        rowItem.forEach((cellItem, cellIndex) => {
          this.countDiagonalRevertOne = 0
          this.countDiagonalRevertTwo = 0

          for (let countRow = 3, countCell = 0; countRow >= 0 && countCell < 4; countRow--, countCell++) {
            if (rowIndex + countRow < this.game.length && cellIndex + countCell < rowItem.length) {
              if (cellIndex + 3 < rowItem.length && this.game[rowIndex][cellIndex + 3] === PLAYER_ONE && this.game[rowIndex][cellIndex + 3] === this.game[rowIndex + countRow][cellIndex + countCell]) {
                this.counter.countDiagonalRevertOne++
                if (this.counter.countDiagonalRevertOne === 4) {
                  this.setWinner(PLAYER_ONE)

                  let newCountCell = countCell
                  for (let j = countRow; j < 4 && j >= 0; j++) {
                    setTimeout(() => {
                      this.$refs[`bg-animate-${rowIndex + j}-${cellIndex + newCountCell}`][0].classList.add('is-four')
                      newCountCell--
                    }, 1000)
                  }
                }
              } else if (cellIndex + 3 < rowItem.length && this.game[rowIndex][cellIndex + 3] === PLAYER_TWO && this.game[rowIndex][cellIndex + 3] === this.game[rowIndex + countRow][cellIndex + countCell]) {
                this.counter.countDiagonalRevertTwo++
                if (this.counter.countDiagonalRevertTwo === 4) {
                  this.setWinner(PLAYER_TWO)

                  let newCountCell = countCell
                  for (let j = countRow; j < 4 && j >= 0; j++) {
                    setTimeout(() => {
                      this.$refs[`bg-animate-${rowIndex + j}-${cellIndex + newCountCell}`][0].classList.add('is-four')
                      newCountCell--
                    }, 1000)
                  }
                }
              } else {
                this.counter.countDiagonalRevertOne = 0
                this.counter.countDiagonalRevertTwo = 0
              }
            }
          }
        })
      })
    },

    setWinner(winner) {
      clearInterval(this.timeInterval);
      this.winner = winner
      this.winner === PLAYER_ONE ? this.playerOneScore++ : this.playerTwoScore++
    },

    playAgain() {
      let elements = document.querySelectorAll('.is-four')
      for (let elem of elements) {
        elem.classList.remove('is-four')
      }

      this.winner = null
      this.createArray()
      this.seconds = 0
      this.countTime()
    },

    restart() {
      let elements = document.querySelectorAll('.is-four')
      for (let elem of elements) {
        elem.classList.remove('is-four')
      }
      clearInterval(this.timeInterval)
      this.openModal('ModalPause')
    },

    createArray() {
      for (let i = 0; i < ROWS; i++) {
        this.game[i] = Array.apply(null, Array(COLUMNS));
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
        } else if (!this.modal) {
          this.setCountInterval()
        }
      });
    },

    continueGame() {
      this.closeModal()
      this.setCountInterval()
    },
    restartGame() {
      this.closeModal()
      clearInterval(this.timeInterval);
      this.playAgain()
      this.playerOneScore = 0
      this.playerTwoScore = 0
    }
  },
  mounted() {
    this.createArray()
    this.countTime()

    window.addEventListener('continue-game', this.continueGame)
    window.addEventListener('restart-game', this.restartGame)
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
            <img v-show="activePlayer === PLAYER_ONE" src="@/assets/images/svg/marker-red.svg" alt="marker"
                 :style="{left: (88 * markerPosition) + 'px'}"
                 class="game__field-marker">
            <img v-show="activePlayer === PLAYER_TWO" src="@/assets/images/svg/marker-yellow.svg" alt="marker"
                 :style="{left: (88 * markerPosition) + 'px'}" class="game__field-marker">

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
                          :style="{top: ((widthCircle + widthCirclePadding) * rowIndex) + widthFirstCirclePadding + 'px', left: ((widthCircle  + widthCirclePadding) * index) + widthFirstCirclePadding  + 'px'}"
                  >
                    <div class="game__field-bg-animate" :ref="`bg-animate-${rowIndex}-${index}`"
                         :class="{'game__field-bg-animate_player-one': PLAYER_ONE === item, 'game__field-bg-animate_player-two': PLAYER_TWO === item, animate: PLAYER_ONE === item || PLAYER_TWO === item}"

                    >
                      <Icon src="white-circle" width="34" height="34" class="game__field-bg-icon"/>
                    </div>
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

    <div class="main-game__bg" :style="`background: ${getBgColor}`"></div>
  </main>
</template>
