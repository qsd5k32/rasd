

<template>
  <div>
    <v-overlay v-if="loading" opacity="0.9" color="black">
      <v-img src="/icon.png"/>
      <v-progress-circular
        class="mx-auto d-block"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-overlay>
    <div v-if="locationAccess" class="camera mt-0 pb-0 pa-0 mb-0" :style="'position: relative;height:' + windowHeight + 'px;width:' + windowWidth + 'px'">
      <video :class="rasdType == 'text' || rasdType == 'audio' ? 'd-none': ''" webkit-playsinline="true" :height="windowHeight" playsinline="true" :width="windowWidth" ref="videoStream" id="video">

      </video>
      <v-container class="pt-12" v-if="rasdType == 'text'">
        <v-textarea class="mt-6" hint="يجب ان يكون اكثر من 5 احرف" counter v-model="note" outlined label="نص ملاحظة"></v-textarea>
      </v-container>
      <div style="position:absolute; top: 64px;right: 20px" v-if="rasdType == 'camera' || rasdType == 'videoRecording'">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn text  small v-on="on" @click="cameraInit">
              <span>تفعيل الكامرة</span>
            </v-btn>
          </template>
        </v-tooltip>
      </div>
      <div style="position:absolute; bottom: 10px;width: 100vw;">
        <v-chip-group @change="getSubCategories" v-model="categoryParent" class="mb-4">
          <v-chip filter :value="category.id" v-for="category in categories" color="primary">{{ category.name }}</v-chip>
        </v-chip-group>
        <v-chip-group v-model="category_id" class="mb-4" v-if="categoryParent">
          <v-chip filter :value="subCategory.id" v-for="subCategory in subCategories"
                  color="amber">{{ subCategory.name }}</v-chip>
        </v-chip-group>
        <v-layout class="mb-5">
          <v-spacer/>
          <v-btn fab :disabled="recording || recordingVideo"
                 :icon="rasdType != 'text'"
                 :outlined="rasdType != 'text'"
                 @click="switchToText">
            <v-icon>mdi-format-text</v-icon>
          </v-btn>
          <v-spacer/>
          <v-btn fab :disabled="recording || recordingVideo"
                 :icon="rasdType != 'camera'"
                 :outlined="rasdType != 'camera'"
                 @click="switchToCamera">
            <v-icon>mdi-camera</v-icon>
          </v-btn>
          <v-spacer/>
          <v-btn  fab :disabled="recording || recordingVideo"
                  :icon="rasdType != 'videoRecording'"
                  :outlined="rasdType != 'videoRecording'"
                  @click="switchToVideoRecording">
            <v-icon>mdi-video</v-icon>
          </v-btn>
          <v-spacer/>
        </v-layout>
        <div>
          <p class="text-center">
            <span v-if="rasdType == 'videoRecording' || rasdType == 'audio'">{{ formattedTime }}</span>
            <span style="color: transparent" v-else>
              &
            </span>
          </p>
        </div>
        <v-layout class="mb-5 px-10">
          <v-btn
            class="text-capitalize"
            icon
            fab
            color="primary"
            @click="switchCamera">
            <v-icon>mdi-orbit-variant</v-icon>
          </v-btn>
          <v-spacer/>
          <v-btn
            v-if="rasdType === 'camera'"
            class="text-capitalize"
            icon
            large
            fab
            color="primary"
            @click="takePhoto"
          >
            <v-icon size="80px">mdi-circle-slice-8</v-icon>
          </v-btn>
          <div v-if="rasdType === 'audio'">
            <v-btn
              v-if="!recording"
              class="text-capitalize"
              icon
              large
              fab
              color="primary"
              @click="startRecording"
            >
              <v-icon size="80px">mdi-record</v-icon>
            </v-btn>
            <v-btn
              v-if="recording"
              class="text-capitalize"
              icon
              large
              fab
              color="red"
              @click="stopRecording"
            >
              <v-icon size="80px">mdi-stop</v-icon>
            </v-btn>
          </div>
          <v-btn
            v-if="rasdType === 'text'"
            class="text-capitalize"
            icon
            fab
            @click="takeNote"
            large
            color="primary"
          >
            <v-icon size="80px">mdi-send-circle</v-icon>
          </v-btn>
          <div v-if="rasdType === 'videoRecording'">
            <v-btn
              v-if="recordingVideo"
              class="text-capitalize"
              icon
              fab
              large
              color="red"
              @click="stopRecordingVideo"
            >
              <v-icon size="80px">mdi-stop-circle-outline</v-icon>
            </v-btn>
            <v-btn
              v-if="!recordingVideo"
              class="text-capitalize"
              icon
              fab
              large
              color="primary"
              @click="startRecordingVideo"
            >
              <v-icon size="80px">mdi-record-circle-outline</v-icon>
            </v-btn>
          </div>
          <v-spacer/>
          <v-btn @click="showPhotoOptions = true" color="primary">
            ارسال
          </v-btn>
        </v-layout>
        <v-sheet
          height="73"
          class="mx-auto mt-0"
          elevation="0"
          color="transparent"
        >
          <v-slide-group
            class="pa-0 pb-2"
            center-active
          >
            <v-slide-item
              v-for="media in mediaPreview"
              v-slot="{ active, toggle }"
            >
              <v-card
                style="overflow: hidden"
                :color="active ? 'primary' : 'grey lighten-1'"
                class="ma-1"
                height="60"
                width="60"
                @click="openShowImage(media,mediaPreview)"
              >
                <v-img v-if="media.media_type == 'image'" height="60" width="60" :src="media.media">

                </v-img>
                <video v-if="media.media_type == 'video'" height="60" style="height:60px;width:60px;max-height: 60px;max-width: 60px" width="60" :src="media.media"></video>
                <v-overlay absolute>
                  <v-icon v-if="media.media_type == 'image'">mdi-image</v-icon>
                  <v-icon v-if="media.media_type == 'video'">mdi-video</v-icon>
                  <v-icon v-if="media.media_type == 'text'">mdi-format-text</v-icon>
                  <v-icon v-if="media.media_type == 'audio'">mdi-headset</v-icon>
                </v-overlay>
              </v-card>
            </v-slide-item>
          </v-slide-group>
        </v-sheet>
      </div>
    </div>
    <div v-else>
      <v-container style="height: 100vh">
        <v-row style="height: 100vh" justify="center" align-content="center" align="center">
          <v-col>
            <v-layout>
              <v-spacer/>
              <v-btn color="primary" v-if="!locationAccess" @click="getLocationPermission">{{ $t('allowLocationAccess') }}</v-btn>
              <v-spacer/>
            </v-layout>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <video class="d-none" :height="100" controls :width="100" id="recordedVideo">

    </video>
    <canvas class="d-none" id="myCanvas" :width="windowWidth" :height="windowHeight"></canvas>
    <v-dialog max-width="600" v-model="showPhotoOptions">
      <v-card>
        <v-card-title>انت على وشك ارسال حالة جديدة</v-card-title>
        <v-card-text>
          <ul class="mt-6 mb-6 mx-4">
            <li class="red--text" v-if="!category_id"> يجب ان تختار تصنيف الرصد اولا</li>
            <li class="red--text" v-if="this.notes.length < 1">
              يجب ان تضيف ملاحظات اولا
            </li>
            <li class="red--text" v-if="this.mediaData.length < 1">
              يجب ان تضيف صور اولا
            </li>
          </ul>
          <v-textarea
            class="mt-3"
            :label="$t('description')"
            v-model="title"
            outlined
            rows="1"
            counter
            :rules="[(v) => !!v || $t('validation.required')]"
            max-height="100px"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!category_id || this.notes.length < 1 || !this.title || this.mediaData.length < 1" color="primary" block @click="sendPhoto">{{ $t('send2') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showCameras">
      <v-card>
        <v-card-title>الكاميرات المتاحة</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="camera in cameras" :key="camera.deviceId">
              <v-list-item-content>
                <v-list-item-title>{{ camera.label }}</v-list-item-title>
                <v-list-item-subtitle>{{ camera.deviceId }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn @click="switchCameraDevice(camera.deviceId,camera.label)" color="primary">تغيير</v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
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
        <v-img class="mx-auto" v-if="currentMedia && currentMedia.media_type == 'image'" max-width="250px" :src="currentMedia.media"></v-img>
        <video class="mx-auto d-block" controls v-if="currentMedia && currentMedia.media_type == 'video'" style="height:300px;width:100%;max-height: 350px;max-width: 250px" :src="currentMedia.media"></video>
        <audio class="mx-auto d-block" v-if="currentMedia && currentMedia.media_type == 'audio'" controls :src="currentMedia.media">
          <source :src="currentMedia.media">
        </audio>
        <div style="width: 250px" class="mx-auto d-block" v-if="currentMedia && currentMedia.media_type == 'text'">
          {{ currentMedia.media }}
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

              <v-img v-if="media.media_type == 'image'" height="60" width="60" :src="media.media">
              </v-img>
              <video v-if="media.media_type == 'video'" style="height:60px;width:60px;max-height: 60px;max-width: 60px" :src="media.media"></video>

              <v-overlay
                absolute
              >
                <v-icon v-if="media.media_type == 'image'">mdi-image</v-icon>
                <v-icon v-if="media.media_type == 'video'">mdi-video</v-icon>
                <v-icon v-if="media.media_type == 'text'">mdi-format-text</v-icon>
                <v-icon v-if="media.media_type == 'audio'">mdi-headset</v-icon>
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

<style scoped>

</style>
<script>
export default {
  components: {

  },
  data() {
    return {
      showCameras: false,
      timer: 0,
      intervalId: null,
      recordingVideo: false,
      rasdType: 'camera',
      title: null,
      splashScreen: true,
      mediaStream: null,
      showPhotoOptions: false,
      categories: [],
      currentMedia: null,
      medias: [],
      showImage: false,
      audioActive: false,
      photoData: null,
      category_id: null,
      categoryParent: null,
      subCategories: [],
      photosData: [],
      photosPreview: [],
      mediaPreview: [],
      mediaData: [],
      photoPreview: null,
      recordedChunks: [],
      recording: false,
      mediaRecorder: null,
      audioChunks: [],
      cameraExact: "environment",
      audioData: [],
      audioPreview: [],
      lat: null,
      lng: null,
      steps : [],
      liveVideo: null,
      showAudioOptions: false,
      note: null,
      notes: [],
      cameraAccess: false,
      locationAccess: false,
      cameras: [],
      cameraDeviceID: null,
      loading: false,
    };
  },
  computed: {
    windowWidth() {
      return this.$vuetify.breakpoint.width;
    },
    windowHeight() {
      return this.$vuetify.breakpoint.height - 64;
    },
    formattedTime() {
      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
  },
  mounted() {

    this.getLocationPermission();
    if(this.locationAccess)
    {
      this.cameraInit();
    }
    this.getCategories();
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  },
  methods: {
    getCameras() {
      try {
        navigator.mediaDevices.enumerateDevices().then(devices => {
          this.cameras = devices.filter(device => device.kind === 'videoinput');
        });
        this.showCameras = true;
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    },
    switchToText()
    {
      this.audioActive = false;
      this.rasdType = 'text';
      this.cameraInit();
    },
    switchToCamera()
    {
      this.audioActive = false;
      this.rasdType = 'camera';
      this.cameraInit();
    },
    switchToVideoRecording()
    {
      this.audioActive = false;
      this.rasdType = 'videoRecording';
      this.cameraInit();
    },
    switchRasdType(rasdType = 'camera')
    {
      this.rasdType = rasdType;
      if(raasdType == 'camera')
      {

      }
      if(raasdType == 'text')
      {

      }
    },
    async getCameraPermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.cameraAccess = true;
        this.cameraInit();
      } catch (error) {
        this.cameraAccess = false;
        alert("Camera access denied. Please enable camera permissions.");
        // Handle the error here. Perhaps provide a way to ask for permission again.
      }
    },
    getLocationPermission() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    },
    openShowImage(media,medias)
    {
      this.medias = medias;
      this.currentMedia = media;
      this.showImage = true;
    },
    takeNote()
    {
      if(this.note.length > 5)
      {
        this.notes.push(this.note);
        this.mediaPreview.push({
          media_type: 'text',
          media: this.note
        });
        this.note = null;
      }
    },
    getCategories() {
      this.$axios.get("categories").then((res) => {
        this.categories = res.data.data;
      })
    },
    switchCamera() {
      if (this.cameraExact == "environment") {
        this.cameraExact = "user";
      } else {
        this.cameraExact = "environment";
      }
      this.cameraInit();
    },
    switchCameraDevice(deviceId,label) {
      let Devicetype = this.getCameraType(label)
      this.cameraExact = Devicetype;
      this.cameraDeviceID = deviceId;
      this.cameraInit();
    },
    getCameraType(label) {
      if (label.toLowerCase().includes('front')) {
        return 'user';
      } else if (label.toLowerCase().includes('back')) {
        return 'environment';
      } else {
        return 'environment';
      }
    },
    getSubCategories() {
      if(this.categoryParent)
      {
        this.$axios.get("categories/" + this.categoryParent).then((res) => {
          this.subCategories = res.data.data.children;
        })
      }
      else
      {
        this.subCategories = [];
      }
    },
    takePhoto() {
      const canvas = document.getElementById("myCanvas");
      const context = canvas.getContext("2d");
      context.drawImage(this.liveVideo, 0, 0, this.windowWidth, this.windowHeight);
      this.photoPreview = canvas.toDataURL("image/png");
      this.mediaPreview.push({
        'media_type': 'image',
        'media': this.photoPreview
      });
      this.photosPreview.push(this.photoPreview);
      canvas.toBlob((blob) => {
        this.photoData = blob;
        this.mediaData.push({
          'media_type': 'image',
          'media': new File([blob], 'photo.png', { type: "image/png" })
        });
      });
      console.log(this.photosData);
      //this.showPhotoOptions = true;
    },


    startRecordingVideo() {
      try {
        this.recordedChunks = [];
        const stream = this.mediaStream;

          this.liveVideo.srcObject = stream;
          this.liveVideo.play();

          //this.liveVideo.play();
          console.log('steam active',stream.active)
          this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

          this.mediaRecorder.ondataavailable = event => {
            console.log('chunks',event.data.size)
            if (event.data && event.data.size > 0) {
              this.recordedChunks.push(event.data);
            }
          };
          this.mediaRecorder.onstart = () => {
            console.log('MediaRecorder started started ',`${new Date().toISOString()}`);
          };
          this.mediaRecorder.onerror = (event) => {
            console.error("MediaRecorder error:", event);
          };
          this.mediaRecorder.start();
          this.recordingVideo = true;
          if (!this.intervalId) // Prevent multiple intervals
            this.intervalId = setInterval(() => {
              this.timer++;
            }, 1000);

      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    },
    stopRecordingVideo() {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        console.log('MediaRecorder stopped',`${new Date().toISOString()}`);
        const blob = new Blob(this.recordedChunks, {type:'video/webm'});
        console.log(`stop recording at ${new Date().toISOString()}`);

        const videoURL = URL.createObjectURL(blob);

        console.log("Video URL: ", videoURL);
        console.log("Video Blob: ", blob);
        this.recordedChunks = [];
        this.mediaPreview.push({
          media_type: 'video',
          media: videoURL
        });
        this.mediaData.push({
          'media_type': 'video',
          'media': new File([blob], 'video.webm', { type: "video/webm" })
        });
        this.photosData.push(blob);
        this.recordingVideo = false;
        this.timer = 0;
        clearInterval(this.intervalId);
        this.intervalId = null;
      };
      //this.liveVideo.srcObject.getTracks().forEach(track => track.stop());


    },
    cameraInit()
    {
      if(this.mediaStream)
      {
        this.mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      }
      let video = null;
      let canvas = null;
      let photo = null;
      let startbutton = null;
      this.liveVideo = this.$refs.videoStream;
      canvas = document.getElementById('canvas');
      photo = document.getElementById('photo');
      startbutton = document.getElementById('startbutton');
      navigator.mediaDevices
        .getUserMedia({ video: {
            height: { ideal: this.windowWidth },
            width: { ideal: this.windowHeight },
            facingMode: {
              exact: this.cameraExact
            }
          }, audio: this.audioActive })
        .then((stream) => {
          this.mediaStream = stream;
          this.liveVideo.srcObject = stream;
          this.liveVideo.play();
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
        });
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

    sendPhoto() {
      try {
        this.loading = true;
        const formData = new FormData();


        this.notes.forEach((noteText,index) => {
          formData.append(`note[${index}]`, noteText);
        });
        this.mediaData.forEach((media, index) => {
          formData.append(`media[${index}][media_type]`, media.media_type);
          formData.append(`media[${index}][file]`, media.media);
        });
        formData.append("category_id", this.category_id);
        formData.append("title", this.title);
        // Add location data to formData

        formData.append("lat", this.lat);
        formData.append("lng", this.lng);
        // Axios POST request
        this.$axios.post("steps", formData,{
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        }).then((res) => {
          console.log(res);
          this.mediaData = [];
          this.mediaPreview = [];
          this.notes = [];
          this.category_id = null;
          this.title = null;
          this.loading = false;
          this.$router.push('/step/'+res.data.data.id);
        })

        //this.showPhotoOptions = false;
      } catch (error) {
        console.error(error);

      }
    },
    showPosition(position) {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.locationAccess = true;
    },

    async toggleRecording() {
      if (this.recording) {
        this.stopRecording();
      } else {
        await this.startRecording();
      }
    },
    startRecording() {
      try {
        const stream = this.mediaStream;
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.start();
        if (!this.intervalId) // Prevent multiple intervals
          this.intervalId = setInterval(() => {
            this.timer++;
          }, 1000);
        this.recording = true;
      } catch (error) {
        alert(error);
      }
    },
    stopRecording() {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        let blob = new Blob(this.audioChunks, { type: "audio/mpeg" });
        this.audioData.push(blob);
        let RecordedAudio = URL.createObjectURL(blob);
        this.audioPreview.push(RecordedAudio);
        this.mediaPreview.push({
          media_type: 'audio',
          media: RecordedAudio
        });
        this.mediaData.push({
          'media_type': 'audio',
          'media': new File([blob], 'audio.mp3', { type: "audio/mpeg" })
        });
        this.showAudioOptions = true;
        this.recording = false;
        this.timer = 0;
        clearInterval(this.intervalId);
        this.intervalId = null;
      };

    },
    recordAgain() {
      this.showAudioOptions = false;
      this.toggleRecording();
    },
    async sendAudio() {
      try {
        const formData = new FormData();
        formData.append("audio", this.audioData);

        // Axios POST request
        await this.$axios.post("your-api-endpoint/audio", formData);
        this.showAudioOptions = false;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
