<template>
  <div>
   <v-row v-if="!$auth.loggedIn">
      <v-col cols="12">
        <login-card />
      </v-col>
    </v-row>
    <div v-if="$auth.loggedIn">
        <div v-if="$auth.user.user_role_id == 1">
          <take-shot />
        </div>
        <div v-if="$auth.user.user_role_id == 2">
          <cases-list />
        </div>
        <div v-if="$auth.user.user_role_id == 3">
          <step-list />
        </div>
        <div v-if="$auth.user.user_role_id == 5">
          <daily-report />
        </div>
    </div>
  </div>
</template>

<script>


import CasesList from "@/components/casesList.vue";
import StepList from "@/components/stepList.vue";

export default {
  components: {CasesList,StepList},
  methods: {

  }
};
</script>

<style lang="scss" scoped></style>
