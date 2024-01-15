<template>
  <div>
    <!-- App Bar -->
    <v-app-bar v-if="!$auth.loggedIn" flat absolute color="transparent" dark>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        v-if="$vuetify.breakpoint.smAndDown"
      ></v-app-bar-nav-icon>
      <nuxt-link to="/">
        <v-toolbar-title>
          <v-img
            src="/icon.png"
            height="70px"
            contain
            class="mx-2"
          ></v-img>
        </v-toolbar-title>
      </nuxt-link>
      <v-spacer></v-spacer>
      <template v-if="$vuetify.breakpoint.mdAndUp">
        <v-btn class="text-capitalize" text to="/auth/login">{{ $t('auth.login') }}</v-btn>
        <v-btn class="text-capitalize" text to="/auth/register">{{ $t('auth.register')}}</v-btn>
      </template>
    </v-app-bar>

    <!-- Navigation Drawer for smaller screens -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item link to="/auth/login">
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/auth/register">
          <v-list-item-title>Register</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-bottom-navigation
      v-if="$auth.loggedIn"
      v-model="bottomNav"
      color="primary"
      app
      >
      <v-btn
        icon
        to="/"
        >
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn
        icon
        >
        <v-icon>mdi-clipboard</v-icon>
      </v-btn>
      <v-btn
        icon
        to="/profile"
        >
        <v-icon>mdi-account-circle</v-icon>
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
};
</script>
