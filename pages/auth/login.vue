<!--
  - Copyright (c) 2020.
  - Author:  Belgacemi mohamed seddik
  - github:  http://github.com/seddik32
  - facebook: https://www.facebook.com/Qsd5k
  - email: sed75dik@gmail.com
  - Last modified: 6/12/20, 1:21 PM
  -->

<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col class="mt-5 mb-5" cols="12" md="6" sm="8">
        <login-card />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import LoginCard from "../../components/loginCard";
    export default {
      name: 'Login',
      components: {LoginCard},
      middleware: 'guest',
      data() {
        return {
          loading: false,
          valid: false,
          notAuthenticate: false,
          fields: {
            username: '',
            password: '',
            client_id: '2',
            client_secret: 'K6Vrs6deHbwsN1Bvo2MDU00aLWIP2E4Il8Y0fCIc',
            grant_type: 'password'
          }
        }
      },
      head() {
        return {
          title: 'login',
        }
      },
      mounted() {
        console.log(this.$auth.loggedIn)
      },
      methods: {
        login() {

          try {

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
            }).finally(() => {

            });
          } catch (e) {
             this.$router.push('/login')
          }
        },
    }
  }
</script>

<style scoped></style>
