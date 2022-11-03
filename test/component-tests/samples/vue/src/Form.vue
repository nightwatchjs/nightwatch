<template>
  <h1>Movie Review</h1>
  <form @submit.prevent="submit">
    <label for="movie-input">Title of the movie</label>
    <input id="movie-input" v-model="title" name="title" />

    <label id="review-textarea">Your review</label>
    <textarea
        v-model="review"
        name="review-textarea"
        placeholder="Write an awesome review"
        aria-labelledby="review-textarea"
    />

    <label>
      <input v-model="rating" type="radio" value="3" />
      Wonderful
    </label>
    <label>
      <input v-model="rating" type="radio" value="2" />
      Average
    </label>
    <label>
      <input v-model="rating" type="radio" value="1" />
      Awful
    </label>

    <label id="recommend-label" for="recommend">
      Would you recommend this movie?
    </label>
    <input
        id="recommend"
        v-model="recommend"
        type="checkbox"
        name="recommend"
    />

    <button :disabled="submitDisabled" type="submit">Submit</button>
  </form>
</template>

<script>
export default {
  emits: {submit: null},
  data() {
    return {
      title: '',
      review: '',
      rating: '1',
      recommend: false,
    }
  },
  computed: {
    submitDisabled() {
      return !this.title || !this.review
    },
  },
  methods: {
    submit() {
      if (this.submitDisabled) return
      this.$emit('submit', {
        title: this.title,
        review: this.review,
        rating: this.rating,
        recommend: this.recommend,
      })
    },
  },
}
</script>