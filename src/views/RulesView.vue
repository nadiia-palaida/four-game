<script>
export default {
  name: "RulesView",
  data() {
    return {
      rules: [
        {
          id: 1,
          text: 'Red goes first in the first game.'
        },
        {
          id: 2,
          text: 'Players must alternate turns, and only one disc can be dropped in each turn. '
        },
        {
          id: 3,
          text: 'The game ends when there is a 4-in-a-row or a stalemate.'
        },
        {
          id: 4,
          text: 'The starter of the previous game goes second on the next game.'
        }
      ]
    }
  }
}
</script>

<template>
  <div class="rules">
    <div class="container">
      <div class="rules-wrap">
        <div class="rules-info">
          <div class="rules-info__title">
            <h1 class="title title_l">RULES</h1>
          </div>

          <div class="rules-info__block">
            <h3 class="rules-info__subtitle title title_s">OBJECTIVE</h3>
            <p class="text">Be the first player to connect 4 of the same colored discs in a row (either vertically,
              horizontally, or diagonally).</p>
          </div>

          <div class="rules-info__block">
            <h3 class="rules-info__subtitle title title_s">HOW TO PLAY</h3>
            <ul class="rules-info__block-list">
              <li v-for="rule in rules" class="rules-info__block-item">
                <span class="rules-info__block-list-number">{{ rule.id }}</span>
                <p class="text">{{ rule.text }}</p>
              </li>
            </ul>
          </div>

          <button class="rules-info__btn">

          </button>

        </div>
      </div>
    </div>
  </div>
</template>
