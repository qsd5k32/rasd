<template>
  <v-app>
    <NavBar />

    <v-main>
      <toast-notification />
      <Nuxt />
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :left="!this.$vuetify.rtl"
      :right="this.$vuetify.rtl"
      temporary
      app
    >
      <v-card flat>
        <v-card-text class="text-capitalize">
          <v-list-item nuxt :to="localePath('/')">
            <v-list-item-content>{{ $t("home") }}</v-list-item-content>
          </v-list-item>
          <v-list-item nuxt :to="localePath('/search')">
            <v-list-item-content>{{ $t("shop") }}</v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item nuxt :to="localePath('/page/about-us')">
            <v-list-item-content>{{ $t("about_us") }}</v-list-item-content>
          </v-list-item>
          <v-list-item nuxt :to="localePath('/contact')">
            <v-list-item-content>{{ $t("contactUs") }}</v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
    <v-dialog v-model="loginDialog" v-if="!$auth.loggedIn" max-width="700">
      <v-card>
        <login-card v-if="!registerCard" />
        <register-card :login-dialog="loginDialog" v-else />
        <v-card-text>
          <v-btn v-if="!registerCard" text @click="registerCard = true"
            >{{ $t("auth.register") }}
          </v-btn>
          <v-btn v-else text @click="registerCard = false"
            >{{ $t("auth.login") }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "DefaultLayout",
  data() {
    return {
      clipped: false,
      drawer: false,
      loginDialog: false,
      registerCard: false,
      shopping_cart: false,
      fixed: false,
      query: null,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Inspire",
          to: "/inspire",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
    };
  },
  computed: {
    ...mapGetters({}),
  },
  mounted() {},
  methods: {
    ...mapActions({}),
    search() {
      this.$router.push(this.localePath("/search?query=" + this.query));
    },
  },
};
</script>
<style>
input[type="password"] {
  font-family: auto;
}
</style>
