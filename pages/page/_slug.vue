<template>
  <div v-if="!loading">
    <v-container>
      <v-card flat>
        <v-card-text>
          <h2 class="text-center black--text">{{ page.title }}</h2>
          <div class="mt-4" v-html="page.body"></div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
export default {
  name: "_slug",
  computed:{
    ...mapGetters({
      page: 'page/getData',
      loading: 'page/getLoading'
    })
  },
  mounted(){

    this.getPage(this.$route.params.slug)
  },
  methods: {
    ...mapActions({
      getPage: 'page/fetchData'
    }),
  }
}
</script>

<style scoped>

</style>
