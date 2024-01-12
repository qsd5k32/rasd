<template>
  <div>
    <!-- App Bar -->
    <v-app-bar flat>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        v-if="$vuetify.breakpoint.smAndDown"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>RASD</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="$vuetify.breakpoint.mdAndUp">
        <v-btn text to="/login">Login</v-btn>
        <v-btn text to="/register">Register</v-btn>
      </template>
    </v-app-bar>

    <!-- Navigation Drawer for smaller screens -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item link to="/login">
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/register">
          <v-list-item-title>Register</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

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
