

<template>
  <div class="mt-12">
   <div v-if="$auth.loggedIn">
     <v-container>
       <h3 class="mt-12">الخطوات</h3>
       <v-simple-table class="mt-6" dense v-if="steps">
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
           <tr v-for="step in steps">
             <td colspan="1">{{ step.rasid_case_id }}</td>
             <td>{{ step.start }}</td>
             <td>{{ step.end }}</td>
             <td>
               <v-btn icon>
                 <v-icon>mdi-attachment</v-icon>
               </v-btn>
             </td>
             <td>{{ step.note }}</td>
             <td v-if="step.step_status">{{ step.step_status.name }}</td>
             <td>
                <v-btn icon color="white" @click="showDetails(step)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
               <v-btn v-if="step.step_status && step.step_status.id == 1" icon color="primary" @click="setStepProcessing(step)">
                 <v-icon>mdi-check-circle</v-icon>
               </v-btn>
             </td>
           </tr>
           </tbody>
         </template>
       </v-simple-table>
     </v-container>
   </div>
    <v-dialog v-model="detailsDialog" persistent fullscreen>
      <v-card>
        <v-card-actions>
          <v-btn icon @click="detailsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <v-row v-if="item">
            <v-col cols="12" md="8">
              <v-row>
                <v-col v-if="item.rasid_case" cols="12" md="6">
                  <p>رقم الحالة : {{ item.rasid_case.id }}</p>
                  <p> عنوان الحالة : <span>{{ item.rasid_case.case_name }}</span></p>

                  <p>تصنيف : <span v-if="item.rasid_case.category && item.rasid_case.category.parent">{{ item.rasid_case.category.parent.name }}</span></p>

                  <p>تصنيف فرعي: <span v-if="item.rasid_case.category">{{ item.rasid_case.category.name }}</span></p>

                  <p>تاريغ : <span>{{ item.rasid_case.created_at }}</span></p>
                  <p>{{ item.date }}</p>
                  <v-divider />
                  <div class="amber--text">

                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-slide-group
                    v-if="item.rasid_case.first_step && item.rasid_case.first_step.media"
                    class="pa-1"
                    mandatory
                    show-arrows
                  >
                    <v-slide-item
                      v-for="media in item.rasid_case.first_step.media"
                      v-slot="{ active, toggle }"
                    >
                      <v-card
                        @click="openShowImage(media,item.rasid_case.first_step.media)"
                        :color="active ? 'primary' : 'grey lighten-1'"
                        class="ma-4"
                        height="60"
                        width="60"
                      >
                        <v-img v-if="media.type == 'image'" height="60" width="60" :src="media.path"></v-img>
                      </v-card>
                    </v-slide-item>
                  </v-slide-group>
                  <v-divider />
                  <div class="mt-2" v-if="item.rasid_case.first_step">
                    <p v-for="note in item.rasid_case.first_step.notes">
                      <span>ملاحظة {{ note.id }} : </span>
                      <span>{{ note.note }}</span>
                    </p>
                  </div>
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
            <v-col cols="12" md="12" v-if="item.step_status && item.step_status.id == 2">

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="note" outlined label="ملاحظة"/>
                  <v-btn small color="primary" class="mb-1" @click="takeNote">اضافة ملاحظة</v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-slide-group
                    v-if="photoPreviews"
                    class="pa-1"
                    mandatory
                    show-arrows>
                    <v-slide-item
                      v-for="media in photoPreviews"
                      v-slot="{ active, toggle }">
                      <v-card
                        @click="openShowImage(media,photoPreviews)"
                        :color="active ? 'primary' : 'grey lighten-1'"
                        class="ma-4"
                        height="60"
                        width="60">
                        <v-img v-if="media.type == 'image'" height="60" width="60" :src="media.path"></v-img>
                      </v-card>
                    </v-slide-item>
                    <v-slide-item
                      v-for="noteText in notes"
                      v-slot="{ active, toggle }">
                      <v-card
                        :color="active ? 'primary' : 'grey lighten-1'"
                        class="ma-4"
                        height="60"
                        width="60">
                        <v-card-text>{{ noteText }}</v-card-text>
                      </v-card>
                    </v-slide-item>
                  </v-slide-group>
                </v-col>
              </v-row>
              <v-divider />
              <v-layout justify-center align-center>
                <v-btn
                  class="text-capitalize mt-10"
                  icon
                  large
                  color="primary"
                  @click="showPhotoCapture"
                >
                  <v-icon size="80px">mdi-circle-slice-8</v-icon>
                </v-btn>
              </v-layout>
              <input
                type="file"
                accept="image/*"
                capture="camera"
                ref="photoInput"
                @change="handlePhoto"
                hidden
              />
              <v-btn small @click="updateStep(item)" color="primary">تحديث</v-btn>
            </v-col>

            <v-col cols="12" md="12" v-if="item.step_status && item.step_status.id == 2">
              <v-divider />
              <v-btn small color="primary" block class="mt-2" @click="forward">انعاء</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showStepDialog">
      <v-card>
        <v-card-actions>
          <v-btn icon @click="showStepDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <v-row v-if="stepItem">
            <v-col cols="12" md="6">
              <p >رقم الخطوة : {{ stepItem.id }}</p>
              <p > بداية : <span>{{ stepItem.start }}</span></p>
              <p > نهاية : <span>{{ stepItem.end }}</span></p>
              <p > ملاحظة : <span>{{ stepItem.note }}</span></p>
              <p > الحالة : <span v-if="stepItem.step_status">{{ stepItem.step_status.name }}</span></p>
              <v-slide-group
                v-if="stepItem.media"
                class="pa-1"
                mandatory
                show-arrows>
                <v-slide-item
                  v-for="media in stepItem.media"
                  v-slot="{ active, toggle }">
                  <v-card
                    @click="openShowImage(media,stepItem.media)"
                    :color="active ? 'primary' : 'grey lighten-1'"
                    class="ma-4"
                    height="60"
                    width="60">
                    <v-img v-if="media.type == 'image'" height="60" width="60" :src="media.path"></v-img>
                  </v-card>
                </v-slide-item>
              </v-slide-group>
            </v-col>
            <v-col cols="12" md="6">
              <h3>ملاحظات</h3>
              <p class="mt-0 mb-0 py-0" v-for="noteText in stepItem.notes">{{ noteText.note }}</p>
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
  </div>
</template>

<script>
  export default {
    data(){
      return {
        item: null,
        detailsDialog: false,
        showStepDialog: false,
        steps: null,
        notes: [],
        note: null,
        stepItem: null,
        medias: [],
        moderators: [],
        moderator_id: null,
        currentMedia: null,
        showImage: false,
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

        photoData: [],
        photoPreviews: [],

      };
    },
    mounted() {
      this.getSteps();
    },
    methods: {
      takeNote()
      {
        this.notes.push(this.note);
        this.note = null;
      },
      getSteps()
      {
        this.$axios.get('my-steps').then((response) => {
          this.steps = response.data.data;
          console.log(this.steps);
        });
      },
      showPhotoCapture() {
        this.$refs.photoInput.click();
      },
      handlePhoto(event) {
        const file = event.target.files[0];
        if (file) {
          this.photoData.push({
            media_type: 'image',
            media: file
          });
          this.photoPreviews.push({
            path: URL.createObjectURL(file),
            type: 'image'
          });
          this.showPhotoOptions = true;
        }
      },
      showDetails(item)
      {
        this.item = item;
        this.mapLocation = {
          // real lat and lng
          lat: 23.8859,
          lng: 45.0792
        };
        console.log('item',item.rasid_case);
        if(item.rasid_case && item.rasid_case.first_step)
        {
          this.mapLocation.lat = parseFloat(item.rasid_case.first_step.lat)
          this.mapLocation.lng = parseFloat(item.rasid_case.first_step.lng);
        }
        this.detailsDialog = true;
      },
      setStepProcessing(step)
      {
        this.$axios.post('/setProcessing/' + step.id).then(res => {
          this.getSteps();
        })
      },
      showStep(step)
      {
        this.stepItem = step;
        this.showStepDialog = true;
      },
      openShowImage(media,medias)
      {
        this.medias = medias;
        this.currentMedia = media;
        this.showImage = true;
      },
      forward()
      {
        this.$axios.post('forward/' + this.item.rasid_case.id, {user_id: this.moderator_id}).then(res => {
          this.detailsDialog = false;
          this.getCases();
        })
      },
      updateStep(step)
      {
        this.loading = true;
        const formData = new FormData();
        this.photoData.forEach((media, index) => {
          console.log(media)
          formData.append(`media[${index}][media_type]`, media.media_type);
          formData.append(`media[${index}][file]`, media.media);
        });
        this.notes.forEach((noteText,index) => {
          formData.append(`note[${index}]`, noteText);
        });
        formData.append("_method", "put");
        this.$axios.post("steps/"+ step.id,formData,{
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          this.loading = false;
          this.showPhotoOptions = false;
          this.photoData = [];
          this.photoPreviews = [];
          this.notes = [];
          this.getStep();
        })
      }
    }
  }

</script>
<style scoped>

</style>
