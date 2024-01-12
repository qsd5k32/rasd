<template>
  <div>
    <section class="mb-12"></section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "IndexPage",
  components: {},
  computed: {
    ...mapGetters({}),
    fullHeight() {
      return window.innerHeight - 120;
    },
  },
  data() {
    return {
      products: null,
      cycle: false,
      slides: ["First", "Second", "Third", "Fourth", "Fifth"],
    };
  },
  mounted() {},
  methods: {
    ...mapActions({}),
  },
};
</script>
