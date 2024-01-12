<template>
  <div>
    <v-list-group
      v-if="title && items.length > 0"
      :prepend-icon="icon ?? ''"
    >
      <template v-slot:activator>
        <v-list-item-title>{{ title }}</v-list-item-title>
      </template>
      <v-list dense v-if="items.length > 0" v-for="item in items" >
        <v-list-item nuxt :to="localePath('/category/' + item.url)">
          <v-list-item-icon>
            <v-icon>{{ item.icon_class }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-list-group>
    <v-list-item dense v-if="menu && items < 1"  nuxt :to="localePath('/category/' + menu.slug)">
      <v-list-item-title>{{ menu.name }}</v-list-item-title>
    </v-list-item>
  </div>
</template>

<script>
export default {
  name: "menusList",
  props:['icon',"title","menu","items"]
}
</script>

<style scoped>

</style>
