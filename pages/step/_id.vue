

<template>
  <div class="mt-10">
    <v-container>
      <v-card>
        <v-card-title v-if="item"><span>رقم الرصد :</span>{{ item.id }}</v-card-title>
        <v-card-text>
          <v-row v-if="item">
            <v-col cols="12" sm="12" md="6">
              <p> عنوان الحالة : <span>{{ item.case_name }}</span></p>

              <p>تصنيف : <span v-if="item.category">{{ item.category.parent.name }}</span></p>

              <p>تصنيف فرعي: <span v-if="item.category">{{ item.category.name }}</span></p>

              <p>تاريخ : <span>{{ item.created_at }}</span></p>
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
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <GMap
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
              </GMap>
            </v-col>
            <v-col cols="12" md="12">
              <v-divider />
              <h3 class="mt-4 mb-4">ملاحظات</h3>
              <ul  v-if="step.notes" class="mx-6">
                <li v-for="note in step.notes">
                  {{ note.note }}
                </li>
              </ul>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
    <v-dialog v-model="showPhotoOptions" persistent>
      <v-card>
        <v-card-title>{{ $t('photoOptions') }}</v-card-title>
        <v-card-text>
          <v-img max-height="400px" :src="photoPreview"></v-img>
          <v-textarea
            class="mt-3"
            :label="$t('notes')"
            v-model="note"
            outlined
            rows="1"
            counter
            :rules="[(v) => !!v || $t('validation.required')]"
            max-height="100px"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="retakePhoto">{{ $t('retake') }}</v-btn>
          <v-btn color="primary" @click="updateMedia">{{ $t('send2') }}</v-btn>
        </v-card-actions>
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
    <input
      type="file"
      accept="image/*"
      capture="camera"
      ref="photoInput"
      @change="handlePhoto"
      hidden
    />
  </div>
</template>
<script>
export default {
  middleware: 'auth',
  data() {
    return {
      loading: false,
      step_id: this.$route.params.id,
      step: {},
      showPhotoOptions: false,
      photoData: null,
      photoPreview: null,
      recording: false,
      mediaRecorder: null,
      audioChunks: [],
      media: [],
      mapLocation: {
        lat: 0,
        lng: 0,
      },
      audioData: null,
      audioPreview: null,
      lat: null,
      lng: null,
      item: null,
      steps : [],
      showAudioOptions: false,
      note: null,
      medias: [],
      currentMedia: null,
      showImage: false,
    }
  },
  mounted() {
    this.getStep()
  },
  methods: {
    getStep(){
      this.loading = true;
      this.$axios.get('steps/'+ this.step_id).then(res => {
        this.item = res.data.data;
        this.note = this.step.note;
        this.media = this.item.first_step.media;
        this.step = this.item.first_step;
        this.mapLocation.lat = parseFloat(this.step.lat);
        this.mapLocation.lng = parseFloat(this.step.lng);
      })
    },
    showPhotoCapture() {
      this.$refs.photoInput.click();
    },
    handlePhoto(event) {
      const file = event.target.files[0];
      if (file) {
        this.photoData = file;
        this.photoPreview = URL.createObjectURL(file);
        this.showPhotoOptions = true;
      }
    },
    retakePhoto() {
      this.showPhotoOptions = false;
      this.showPhotoCapture();
    },
    openShowImage(media,medias)
    {
      this.medias = medias;
      this.currentMedia = media;
      this.showImage = true;
    },
    updateMedia()
    {
      this.loading = true;
      const formData = new FormData();
      formData.append("media", this.photoData);
      formData.append("media_type", 'image');
      formData.append("note", this.note);
      formData.append("_method", "put");
      this.$axios.post("steps/"+ this.step_id,formData).then(res => {
        this.loading = false;
        this.showPhotoOptions = false;
        this.getStep();
      })
    },
  }
}

</script>
<style scoped>

</style>
