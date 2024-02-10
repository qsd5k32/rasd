
<template>
  <div>
    <v-container v-if="$auth.loggedIn" class="mt-12">
      <h1>قائمة الحالات المركزية</h1>
      <v-simple-table dense class="mt-12">
        <template v-slot:default>
          <thead>
          <tr>
            <th class="" colspan="1">رقم الحالة</th>
            <th class="" >عنوان الحالة</th>
            <th class="">مقدم الطلب</th>
            <th class="">تصنيف</th>
            <th class="">تصنيف فرعي</th>
            <th class="">تاريغ</th>
            <th class="">حالة</th>
            <th>الإجراءات</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in items" @click="showDetails(item)">
            <td colspan="1">{{ item.id }}</td>
            <td>{{ item.case_name }}</td>
            <td><span v-if="item.user">{{ item.user.name }}</span></td>
            <td><span v-if="item.category">{{ item.category.parent.name }}</span></td>
            <td><span v-if="item.category">{{ item.category.name }}</span></td>
            <td>{{ item.created_at }}</td>
            <td>
              <span v-if="item.case_status">{{ item.case_status.name }}</span>
            </td>
            <td></td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-dialog fullscreen persistent v-model="detailsDialog">
        <v-card v-if="item">
          <v-card-actions>
            <v-btn icon @click="detailsDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-title>تفاصيل الحالة</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="8">
                <v-row>
                  <v-col cols="12" md="6">
                    <p>رقم الحالة : {{ item.id }}</p>
                    <p> عنوان الحالة : <span>{{ item.case_name }}</span></p>

                    <p>تصنيف : <span v-if="item.category">{{ item.category.parent.name }}</span></p>

                    <p>تصنيف فرعي: <span v-if="item.category">{{ item.category.name }}</span></p>

                    <p>تاريغ : <span>{{ item.created_at }}</span></p>
                    <p>{{ item.date }}</p>
                  </v-col>
                  <v-col cols="12" md="6">
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
                          height="60"
                          width="60"
                        >
                          <v-img v-if="media.type == 'image'" height="60" width="60" :src="media.path">
                          </v-img>
                          <video v-if="media.type == 'video'" style="height:60px;width:60px;max-height: 60px;max-width: 60px" :src="media.path"></video>

                          <v-overlay
                            absolute
                          >
                            <v-icon v-if="media.type == 'image'">mdi-image</v-icon>
                            <v-icon v-if="media.type == 'video'">mdi-video</v-icon>
                            <v-icon v-if="media.type == 'text'">mdi-format-text</v-icon>
                            <v-icon v-if="media.type == 'audio'">mdi-headset</v-icon>
                          </v-overlay>
                        </v-card>
                      </v-slide-item>
                    </v-slide-group>
                    <v-divider />
                    <ul class="mt-2" v-if="item.first_step">
                      <li v-for="note in item.first_step.notes">
                        <span>ملاحظة {{ note.id }} : </span>
                        <span>{{ note.note }}</span>
                      </li>
                    </ul>
                  </v-col>
                  <v-col v-if="item.case_status && item.case_status.id == 1" cols="12" md="12">
                    <v-divider />
                    <v-btn class="mt-4" block small color="primary" @click="forward">
                      موافقة و بدء الاجراءات
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="4">
                <GMap
                  v-if="detailsDialog"
                  ref="gMap"
                  language="en"
                  style="width: 100%; height: 400px;"
                  :center="mapLocation"
                  :options="{fullscreenControl: true, streetViewControl: false, mapTypeControl: false, zoomControl: true}"
                  :zoom="16"
                >
                  <GMapMarker
                    :position="mapLocation"
                  >
                  </GMapMarker>
                  <GMapCircle :options="circleOptions"/>
                </GMap>
              </v-col>

              <v-col cols="12" md="12">
                <h3>الخطوات</h3>
                <v-simple-table dense v-if="item.steps">
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th class="">رقم الخطوة</th>
                      <th class="">بداية</th>
                      <th class="">نهاية</th>
                      <th class="">ملحقات</th>
                      <th class="">ملاحظة</th>
                      <th class="">الحالة</th>
                      <th>الإجراءات</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="step in item.steps">
                      <td>{{ step.id }}</td>
                      <td>{{ step.start }}</td>
                      <td>{{ step.end }}</td>
                      <td>{{ step.media.length }}</td>
                      <td>{{ step.note }}</td>
                      <td><span v-if="step.step_status">{{ step.step_status.name }}</span></td>
                      <td></td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
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
          <v-img class="mx-auto" v-if="currentMedia && currentMedia.type == 'image'" max-width="250px" :src="currentMedia.path"></v-img>
          <video class="mx-auto d-block" controls v-if="currentMedia && currentMedia.type == 'video'" style="height:300px;width:100%;max-height: 350px;max-width: 250px" :src="currentMedia.path"></video>
          <audio class="mx-auto d-block" v-if="currentMedia && currentMedia.type == 'audio'" controls :src="currentMedia.path">
            <source :src="currentMedia.media">
          </audio>
          <div style="width: 250px" class="mx-auto d-block" v-if="currentMedia && currentMedia.type == 'text'">
            {{ currentMedia.path }}
          </div>
          <v-slide-group
            style="width: 100%;position: absolute;bottom: 10px"
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
                height="60"
                width="60"
                @click="currentMedia = media"
              >

                <v-img v-if="media.type == 'image'" height="60" width="60" :src="media.path">
                </v-img>
                <video v-if="media.type == 'video'" style="height:60px;width:60px;max-height: 60px;max-width: 60px" :src="media.path"></video>

                <v-overlay
                  absolute
                >
                  <v-icon v-if="media.type == 'image'">mdi-image</v-icon>
                  <v-icon v-if="media.type == 'video'">mdi-video</v-icon>
                  <v-icon v-if="media.type == 'text'">mdi-format-text</v-icon>
                  <v-icon v-if="media.type == 'audio'">mdi-headset</v-icon>
                </v-overlay>
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
    moderator_id: null,
    currentMedia: null,
    moderators: [],
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
      console.log('show details');
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
      /*this.$axios.get('moderators/' + item.id).then(res => {
        this.moderators = res.data.data;
        console.log(this.moderators,'mooooooooooderators');
      })*/
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
    },
    forward()
    {
      this.$axios.post('forward/' + this.item.id).then(res => {
        this.detailsDialog = false;
        this.getCases();
      })
    }
  }
}
</script>
