<template background-color="red">
  <split-form>
    <v-card flat class="pa-4">
      <v-card-title> Login </v-card-title>
      <v-card-text>
        <v-alert
          icon="mdi-alert-circle"
          text
          type="error"
          v-model="notAuthenticate"
        >
          {{ $t("auth.notAuthorized") }}
        </v-alert>
        <v-form lazy-validation v-model="valid">
          <v-text-field
            outlined
            :label="$t('auth.email')"
            :rules="[
              (v) => !!v || $t('validation.required'),
              (v) => /.+@.+\..+/.test(v) || $t('validation.email'),
            ]"
            color="primary"
            prepend-inner-icon="mdi-at"
            required
            type="email"
            v-model="fields.email"
          />
          <v-text-field
            outlined
            :label="$t('auth.password')"
            :rules="[(v) => !!v || $t('validation.required')]"
            color="primary"
            id="password"
            prepend-inner-icon="mdi-lock"
            type="password"
            v-model="fields.password"
          />
          <v-checkbox :label="$t('auth.remember')" color="primary" />
          <v-layout>
            <v-btn
              :disabled="!valid"
              :loading="loading"
              @click="login()"
              color="primary"
              block
              >{{ $t("auth.login") }}
            </v-btn>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </split-form>
</template>

<script>
export default {
  middleware: "guest",
  data() {
    return {
      loading: false,
      valid: false,

      notAuthenticate: false,
      fields: {
        email: "",
        password: "",
      },
    };
  },
  head() {
    return {
      title: "login",
    };
  },
  mounted() {
    console.log(this.$auth.loggedIn);
  },
  methods: {
    login() {
      this.loading = true;
      try {
        this.$auth
          .loginWith("local", {
            data: this.fields,
          })
          .then((res) => {
            console.log(res);
            console.log(this.$auth);
            console.log(this.$auth.user);
            this.$router.push("/dashboard");
            //window.location.reload();
          })
          .catch((e) => {
            console.error(e);
            this.error = true;
          })
          .finally(() => {
            this.loading = false;
          });
      } catch (e) {
        this.$router.push("/auth/login");
      }
    },
  },
};
</script>

<style scoped></style>
