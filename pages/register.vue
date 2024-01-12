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
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
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
    fetchCountries() {
      this.$axios
        .get("countries")
        .then((res) => {
          this.countries = res.data;
        })
        .catch((error) => {
          console.error("Error fetching countries:", error);
        });
    },
    fetchCities() {
      if (this.country_id) {
        this.$axios
          .get(`cities/${this.country_id}`)
          .then((res) => {
            this.cities = res.data;
          })
          .catch((error) => {
            console.error("Error fetching countries:", error);
          });
      } else {
        this.cities = [];
      }
    },
    submitRequest() {
      this.$axios
        .post("tenant-request/store?", this.fields)
        .then((response) => {
          this.successMessage =
            "Your Form has been submitted successfully, and it is under process. Our team will contact you for more details ";
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        });
    },
  },
  mounted() {
    this.fetchCountries();
  },
};
</script>

<style scoped>
.success-message {
  font-size: 2em; /* Adjust the font size as needed */
  text-align: center;
  padding: 20px;
  color: #120505; /* Change the text color to your desired color */
  border-radius: 5px;
}
</style>
