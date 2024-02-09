<template>
  <v-container class="mt-10">
    <v-row justify-center align-center>
      <v-col cols="12" sm="6" md="3" lg="2" v-for="Rasidcase in steps">
        <v-card nuxt :to="localePath('/step/' + Rasidcase.first_step.id)"  v-if="Rasidcase.first_step.media[0]" class="mx-1 mt-2">
          <v-img v-if="Rasidcase.first_step.media[0]" :src="Rasidcase.first_step.media[0].path" width="100%" height="150px">
            <v-card-title>{{ Rasidcase.title }}</v-card-title>
          </v-img>
          <v-card-text>
            <span>{{ $t('number', {id: Rasidcase.id}) }}</span>
            <br />
            {{ Rasidcase.first_step.note }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "steps",
  components: {},
  data()
  {
    return {
      steps: [],
    }
  },
  mounted() {
    this.getSteps()
  },
  methods: {
    getSteps()
    {
      this.$axios.get("steps").then((res) => {
        this.steps = res.data.data;
      })
    },
  },

};
</script>
