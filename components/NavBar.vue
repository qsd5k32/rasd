<template>
  <div>
    <!-- App Bar -->
    <v-app-bar style="z-index: 999" fixed flat absolute color="transparent" dark>
      <change-language />
      <v-spacer />
      <v-menu offset-y v-if="$auth.loggedIn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            class="text-capitalize"
            color="primary"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-menu-down</v-icon>
            {{ $auth.user.name }}
          </v-btn>
          <span class="mx-1 black--text" v-if="$auth.user.user_title">{{  $auth.user.user_title.name }}</span>
          <v-chip outlined label color="primary" class="mx-1" v-if="$auth.user.company">{{  $auth.user.company.name }}</v-chip>
          <span class="mx-1 black--text" v-if="$auth.user.company">{{  $auth.user.company.company_type.name }}</span>
        </template>
        <v-list dense>
          <v-list-item>
            <v-list-item-title>{{ $t("profile") }}</v-list-item-title>
          </v-list-item>
          <v-list-item class="mx-1 black--text" v-if="$auth.user.user_title">user title:{{  $auth.user.user_title.name }}</v-list-item>
          <v-list-item class="mx-1 black--text" v-if="$auth.user.user_role">user role:{{  $auth.user.user_role.name }}</v-list-item>
          <v-list-item class="mx-1 black--text" v-if="$auth.user.company">company:{{  $auth.user.company.name }}</v-list-item>
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
