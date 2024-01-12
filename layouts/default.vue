<template>
  <v-app>
    <NavBar />
    <!-- <v-app-bar
      :clipped-left="clipped"
      flat
      color="primary"
      app
    >
      <v-btn @click="rightDrawer = !rightDrawer" color="white" icon><v-icon>mdi-menu</v-icon></v-btn>
      <v-toolbar-title>
        <nuxt-link class="text-decoration-none d-flex align-center justify-center" :to="localePath('/')">
          <span class="white--text">app</span>
        </nuxt-link></v-toolbar-title>
      <v-btn
        color="white"
        icon
        @click="loginDialog = true"
        v-if="!$auth.loggedIn"

      >
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
      <profile-menu v-if="$auth.loggedIn" />
      <v-spacer/>
      <v-btn href="https://www.facebook.com/biljumlastore/" target="_blank" icon color="white">
        <v-icon>mdi-facebook</v-icon>
      </v-btn>
      <v-btn href="https://www.instagram.com/biljumlastore/" target="_blank"  icon color="white">
        <v-icon>mdi-instagram</v-icon>
      </v-btn>
    </v-app-bar> -->
    <!--            <mega-menu v-if="$vuetify.breakpoint.lgAndUp" :title="menu.name" :items="menu.items" v-for="menu in menus"/>-->
    <!--            <v-btn icon nuxt :to="localePath('/')"><v-icon>mdi-home</v-icon></v-btn>-->

    <!--      <delivery />-->

    <v-main style="margin-top: 60px">
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
      title: "بالجملة",
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
