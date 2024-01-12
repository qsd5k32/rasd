<template>
  <div>
    <v-select v-if="select" class="mt-4" :items="languages" v-model="language" @change="changeLanguage" item-text="name" item-value="code" outlined :label="$t('language')"/>
    <div v-else>
      <v-btn text v-if="language === 'ar'" @click="setLang('en')" class="font-weight-bold">EN</v-btn>
      <v-btn text v-if="language === 'en'" @click="setLang('ar')"><v-icon>mdi-abjad-arabic</v-icon></v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "changeLanguage",
  props: {
    select: Boolean
  },
  data(){
    return {
      language: 'en',
      languages: [],
    }
  },
  mounted() {
    console.log(this.$i18n.locales)
    this.language = this.$cookies.get('lang')
    this.languages = this.$i18n.locales
    this.rtlSwitch()
  },
  methods: {
    setLang(lang)
    {
      this.language = lang;
      this.changeLanguage()
    },
    changeLanguage()
    {
      console.log(this.language)
      this.$i18n.setLocale(this.language)
      this.$cookies.set('lang',this.language)
      this.rtlSwitch()
      setInterval(() => {
        window.location.reload()
      },500)


    },
    rtlSwitch()
    {
      if(this.$cookies.get('lang') == 'ar')
      {
        this.$vuetify.rtl = true;
        this.rtl = true;
      }else{
        this.$vuetify.rtl = false;
        this.rtl = false;
      }

    }
  }
}
</script>

<style scoped>

</style>
