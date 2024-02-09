<template>
  <v-app>
    <NavBar />

    <v-main>
      <v-dialog style="overflow: hidden" fullscreen v-model="splashScreen">
        <v-card class="pa-0">
          <v-row style="height: 100vh" justify="center" align-content="center">
            <v-col>
              <v-img
                class="mx-auto d-block"
                height="100"
                width="100"
                src="/icon.png"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              >
              </v-img>
              <h1 class="display-2 text-center font-weight-bold mb-3">{{ $t('welcomeToRasd') }}</h1>
              <p class="subtitle-1 text-center white&#45;&#45;text">{{ $t('discoverOurWorldclassServicesAndInnovativeSolution') }}</p>
              <p class="text-center">Version 1.2</p>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
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
import { splashScreen } from "@/store/splash";

export default {
  name: "DefaultLayout",
  data() {
    return {
      clipped: false,
      drawer: false,
      loginDialog: false,
      registerCard: false,
      fixed: false,
      query: null,
      miniVariant: false,
      right: true,
      rightDrawer: false,
    };
  },
  computed: {
    ...mapGetters({
      splashScreen: 'splash/getData',
    }),
  },
  mounted() {
    setInterval(() => {
      this.hideSplashScreen();
    }, 1500);
  },
  methods: {
    ...mapActions({
      hideSplashScreen: 'splash/hideSplashScreen',
    }),
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
