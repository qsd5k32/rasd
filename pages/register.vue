<template>
  <split-form image-path="https://www.w3schools.com/html/img_girl.jpg">
    <v-card flat>
      <v-card-title>Request Form</v-card-title>
      <v-card-text>
        <v-form lazy-validation v-model="valid" v-if="!successMessage">
          <v-text-field
            outlined
            name="full_name"
            :error-messages="errors.full_name"
            :label="$t('auth.name')"
            :rules="[(v) => !!v || $t('validation.required')]"
            @change="errors.full_name = []"
            v-model="fields.full_name"
            color="primary"
            prepend-inner-icon="mdi-account-tie"
          />
          <v-text-field
            :error-messages="errors.name"
            :label="$t('auth.username')"
            :rules="[(v) => !!v || $t('validation.required')]"
            @change="errors.company_name = []"
            color="primary"
            prepend-inner-icon="mdi-account"
            v-model="fields.company_name"
            outlined
          />
          <v-text-field
            outlined
            :error-messages="errors.email"
            :label="$t('auth.email')"
            :rules="[
              (v) => !!v || $t('validation.required'),
              (v) => /.+@.+\..+/.test(v) || $t('validation.email'),
            ]"
            @change="
              extractDomain();
              errors.email = [];
            "
            color="primary"
            required
            type="email"
            v-model="fields.email"
            prepend-inner-icon="mdi-at"
          />

          <v-text-field
            outlined
            name="phone"
            :error-messages="errors.phone"
            :label="$t('auth.phone')"
            :rules="[(v) => !!v || $t('validation.required')]"
            @change="errors.phone = []"
            v-model="fields.phone"
            color="primary"
            prepend-inner-icon="mdi-phone"
          />

          <v-btn
            :disabled="!valid"
            class="white--text"
            color="primary"
            @click="submitRequest()"
            block
          >
            {{ $t("submit") }}
          </v-btn>
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
      overlay: false,
      valid: false,
      fields: {
        company_name: "",
        domain_name: "",
        email: "",
        phone: "",
        full_name: "",
        city_id: "",
      },
      errors: {
        company_name: [],
        country: [],
        full_name: [],
        phone: [],
        email: [],
        domain_name: [],
      },
      country_id: "",
      successMessage: null,
      countries: [],
      cities: [],
      files: [],
    };
  },
  watch: {
    overlay(val) {
      val &&
        setTimeout(() => {
          this.overlay = false;
        }, 2000);
    },
  },
  methods: {
    extractDomain() {
      if (this.fields.email) {
        this.fields.domain_name = this.fields.email.split("@")[1];
      }
    },

    submitRequest() {},
  },
  mounted() {},
};
</script>
