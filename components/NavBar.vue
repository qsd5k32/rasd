<template>
  <div>
    <!-- App Bar -->
    <v-app-bar fixed flat absolute color="transparent" dark>
      <change-language />
      <v-spacer />
      <v-menu offset-y v-if="$auth.loggedIn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            class="text-capitalize"
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-menu-down</v-icon>
            {{ $auth.user.name }}
          </v-btn>
          <span class="mx-auto" v-if="$auth.user.user_title">{{  $auth.user.user_title.name }}</span>
        </template>
        <v-list dense>
          <v-list-item
            class="text-center"
            @click="logout"
          >
            <span class="mx-auto">Logout<v-icon>mdi-logout</v-icon></span>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-bottom-navigation
      v-if="$auth.loggedIn"
      v-model="bottomNav"
      color="primary"
      app
      >
      <v-btn
        icon
        :to="localePath('/')"
        >
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn
        icon
        nuxt
        :to="localePath('/steps')"
        >
        <v-icon>mdi-clipboard</v-icon>
      </v-btn>


    </v-bottom-navigation>
    <!-- Main Content -->
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
  }),
  methods: {
    logout() {
      this.$auth.logout();
      this.$router.push("/");
    },
  },
};
</script>
