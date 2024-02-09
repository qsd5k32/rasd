
<template>
  <div>
    <v-container v-if="$auth.loggedIn" class="mt-12">
      <h1>قائمة الحالات المركزية</h1>
      <v-simple-table class="mt-12">
        <template v-slot:default>
          <thead>
          <tr>
            <th class="">رقم الحالة</th>
            <th class="">عنوان الحالة</th>
            <th class="">الموقع</th>
            <th class="">تصنيف</th>
            <th class="">تصنيف فرعي</th>
            <th class="">تاريغ</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in items" @click="showDetails(item)">
            <td>{{ item.id }}</td>
            <td>{{ item.case_name }}</td>
            <td>{{ item.location }}</td>
            <td><span v-if="item.category">{{ item.category.parent.name }}</span></td>
            <td><span v-if="item.category">{{ item.category.name }}</span></td>
            <td>{{ item.created_at }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-dialog persistent v-model="detailsDialog">
        <v-card v-if="item">
          <v-card-actions>
            <v-btn icon @click="detailsDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-title>تفاصيل الحالة</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <p>رقم الحالة : {{ item.id }}</p>
                <p> عنوان الحالة : <span>{{ item.case_name }}</span></p>

                <p>تصنيف : <span v-if="item.category">{{ item.category.parent.name }}</span></p>

                <p>تصنيف فرعي: <span v-if="item.category">{{ item.category.name }}</span></p>

                <p>تاريغ : <span>{{ item.created_at }}</span></p>
                <p>{{ item.date }}</p>
                <v-divider />
                <v-slide-group
                  v-if="item.first_step && item.first_step.media"
                  class="pa-1"
                  mandatory
                  show-arrows
                >
                  <v-slide-item
                    v-for="media in item.first_step.media"
                    :key="n"
                    v-slot="{ active, toggle }"
                  >
                    <v-card
                      @click="openShowImage(media,item.first_step.media)"
                      :color="active ? 'primary' : 'grey lighten-1'"
                      class="ma-4"
                      height="200"
                      width="100"
                    >
                      <v-img v-if="media.type == 'image'" height="200" width="100" :src="media.path"></v-img>
                    </v-card>
                  </v-slide-item>
                </v-slide-group>
              </v-col>
              <v-col cols="12" md="6">
                <GMap
                  v-if="detailsDialog"
                  ref="gMap"
                  language="en"
                  :center="mapLocation"
                  :options="{fullscreenControl: false, streetViewControl: false, mapTypeControl: false, zoomControl: true}"
                  :zoom="16"
                >
                  <GMapMarker
                    :position="mapLocation"
                  >
                    <GMapInfoWindow>
                      <v-img src="/hero.png"  width="200" height="300"/>
                    </GMapInfoWindow>
                  </GMapMarker>
                  <GMapCircle :options="circleOptions"/>
                </GMap>
              </v-col>
              <v-col cols="12" md="12">
                <v-divider />
                <v-autocomplete messages="سيتم ارال الحالة الى المختص لمعالجتها" class="mt-4" outlined label="المشرفين"/>
                <v-btn color="primary">ارسال</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog fullscreen overlay-color="#fff" overlay-opacity="1" v-model="showImage">
        <v-card flat color="rgb(0 0 0 / 90%)">
          <v-card-actions>
            <v-btn icon @click="showImage = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-actions>
          <v-img class="mx-auto" v-if="currentMedia" max-width="250px" :src="currentMedia.path"></v-img>
          <v-slide-group
            v-if="medias"
            class="pa-1"
            mandatory
            show-arrows
          >
            <v-slide-item
              v-for="media in medias"
              v-slot="{ active, toggle }"
            >
              <v-card
                :color="active ? 'primary' : 'grey lighten-1'"
                class="ma-4"
                height="100"
                width="100"
                @click="currentMedia = media"
              >

                <v-img v-if="media.type == 'image'" height="200" width="100" :src="media.path">

                </v-img>
              </v-card>
            </v-slide-item>
          </v-slide-group>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script >
export default {
  middleware: 'auth',
  data: () => ({

    detailsDialog: false,
    item: {},
    items: [],
    currentMedia: null,
    medias: [],
    showImage: false,
    // maps info
    currentLocation: {},
    circleOptions: {

    },
    mapLocation: {
        // real lat and lng
        lat: 23.8859,
        lng: 45.0792
    }
    ,
    pins: {
      selected: "data:image/png;base64,iVBORw0KGgo...",
      notSelected: "data:image/png;base64,iVBORw0KGgo..."
    },


  }),
  mounted() {
    this.getCases();
  },

  methods: {
    showDetails(item) {
      this.item = item;
      this.mapLocation = {
        // real lat and lng
        lat: 23.8859,
        lng: 45.0792
      };
      if(item.first_step)
      {
        this.mapLocation.lat = parseFloat(item.first_step.lat)
        this.mapLocation.lng = parseFloat(item.first_step.lng);
      }
      this.detailsDialog = true;
    },
    getCases()
    {
      this.$axios.get('cases').then(res => {
        this.items = res.data.data;
      })
    },
    openShowImage(media,medias)
    {
      this.medias = medias;
      this.currentMedia = media;
      this.showImage = true;
    }
  }
}
</script>
