<!--
  - Copyright (c) 2020.
  - Author:  Belgacemi mohamed seddik
  - github:  http://github.com/seddik32
  - facebook: https://www.facebook.com/Qsd5k
  - email: sed75dik@gmail.com
  - Last modified: 6/12/20, 1:21 PM
  -->

<template>
  <v-container style="margin-top: 70px">
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" lg="4" sm="12">
        <register-card />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>


    export default {
      name: 'Register',

      middleware: 'guest',
      head() {
        return {
        title: this.$t('auth.register')
      }
    },
    data() {
      return {
        loading: false,
        valid: false,
        register: 0,
        fields: {
          code: '',
          email: '',
          name: '',
          country_code: 1,
          phone: '',
          password: '',
          password_confirmation: '',
          client_id: '2',
          client_secret: 'K6Vrs6deHbwsN1Bvo2MDU00aLWIP2E4Il8Y0fCIc',
          grant_type: 'password',
          username:''
        },
        errors: {
          name: [],
          phone: [],
          country_code: [],
          email: [],
          username: [],
          password: []
        },
        flashErrors: {
          name: null,
          phone: null,
          country_code: null,
          email: null,
          username: null,
          password: null
        },
        agree: false,
      }
    },
    methods: {
      sendCode()
      {
        this.$axios.post('send_code',{
          phone: this.fields.phone
        }).then(res => {
          if(res.data.status == 'success') this.register = 1;
        })
      } ,
      verifyCode()
      {
        this.$axios.post('verify_code',{
          phone: this.fields.phone,
          code: this.fields.code
        }).then(res => {
          if(res.data.status) this.register = 2;
        })
      },
      getErrors() {
        if (this.flashErrors.name) {
          this.flashErrors.name.map((item) => {
            this.errors.name.push(this.$t(item))
          })
        }
        if (this.flashErrors.email) {
          this.flashErrors.email.map((item) => {
            this.errors.email.push(this.$t(item))
          })
        }
        if (this.flashErrors.username) {
          this.flashErrors.username.map((item) => {
            this.errors.username.push(this.$t(item))
          })
        }
        if (this.flashErrors.country_code) {
          this.flashErrors.country_code.map((item) => {
            this.errors.country_code.push(this.$t(item))
          })
        }
        if (this.flashErrors.phone) {
          this.flashErrors.phone.map((item) => {
            this.errors.phone.push(this.$t(item))
          })
        }
        if (this.flashErrors.password) {
          this.flashErrors.password.map((item) => {
            this.errors.password.push(this.$t(item))
          })
        }
      },
      register() {
        const {
          name,
          email,
          password,
          password_confirmation,
          phone,
          country_code
        } = this.fields
        this.fields.username = email
        this.$axios.post('register',this.fields).then(res => {
          console.log(res.data)
          if(res.data.status == 'success')
          {
            this.$auth
              .loginWith('local', {
                data: this.fields
              })
              .then((res) => {
                console.log(res)
                console.log(this.$auth)
                console.log(this.$auth.user)
                //this.$router.push('/')
              }).catch(e => {
              console.error(e)
              this.error = true
            })
          }
        })
      }
    }
  }
</script>

<style scoped></style>
