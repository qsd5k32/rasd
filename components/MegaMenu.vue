<template>
  <v-menu
    max-width="100%"
    min-width="100%"
    style="left:0;right: 0;border-radius: 0"
    offset-y
    bottom
    class="rounded-0"
    open-on-hover
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :icon="!!icon"
        :text="!!title"
        class="text-capitalize"
        dark
        v-bind="attrs"
        v-on="on"
      >
        <v-icon v-if="icon">mdi-{{ icon }}</v-icon>
        <span v-if="title" class="text-capitalize">{{ title }}</span>
      </v-btn>
    </template>

    <v-card class="rounded-0" style="border-radius: 0">
      <v-card-text>
        <v-row>
          <v-col v-for="item in items">
            <v-list dense>
              <v-list-group
                v-if="item.children.length > 0"
                :value="true"
                :prepend-icon="item.icon_class"
              >
                <template v-slot:activator>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </template>
                <v-list dense>
                  <div v-for="child in item.children">

                    <v-list-group
                      v-if="child.children.length > 0"
                      :value="true"
                      :prepend-icon="child.icon_class"
                    >
                      <template v-slot:activator>
                        <v-list-item-title>{{ child.title }}</v-list-item-title>
                      </template>
                      <v-list dense>
                        <v-list-item nuxt :to="localePath('/category/' + child2.url)" v-for="child2 in child.children">
                          <v-list-item-icon>
                            <v-icon>{{ child2.icon_class }}</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>{{ child2.title }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-list-group>
                    <v-list-item v-else nuxt :to="localePath('/category/' + child.url)" >
                      <v-list-item-icon>
                        <v-icon>{{ child.icon_class }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{ child.title }}</v-list-item-title>
                    </v-list-item>
                  </div>


                </v-list>
              </v-list-group>
              <v-list-item v-if="item.children.length < 1 && !item.parent_id" nuxt :to="localePath('/category/' + item.url)">
                <v-list-item-icon>
                  <v-icon>{{ item.icon_class }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "MegaMenu",
  props:['icon',"title","items"]
}
</script>

<style scoped>

</style>
