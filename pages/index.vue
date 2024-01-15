<template>
  <div>
    <v-row v-if="!$auth.loggedIn">
      <v-col cols="12">
        <v-img
          src="/hero.png"
          width="100%"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="100vh"
        >
          <v-overlay absolute>
            <v-row align="center" justify="center">
              <v-col class="text-center" cols="12">
                <h1 class="display-2 font-weight-bold mb-3">{{ $t('welcomeToRasd') }}</h1>
                <p class="subtitle-1 white--text">{{ $t('discoverOurWorldclassServicesAndInnovativeSolution') }}</p>
              </v-col>
            </v-row>
          </v-overlay>
        </v-img>
      </v-col>
    </v-row>
    <div v-if="$auth.loggedIn">
      <v-img
        src="/dashboard.svg"
        width="100%"
        height="50vh"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        />
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
      <v-dialog v-model="showPhotoOptions" persistent>
        <v-card>
          <v-card-title>{{ $t('photoOptions') }}</v-card-title>
          <v-card-text>
            <v-img max-height="400px" :src="photoPreview"></v-img>
            <v-textarea
              class="mt-3"
              :label="$t('notes')"
              v-model="photoDescription"
              outlined
              rows="1"
              max-height="100px"
              />
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="retakePhoto">{{ $t('retake') }}</v-btn>
            <v-btn color="primary" @click="sendPhoto">{{ $t('send2') }}</v-btn>
          </v-card-actions>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPhotoOptions: false,
      photoData: null,
      photoPreview: null,
      recording: false,
      mediaRecorder: null,
      audioChunks: [],
      audioData: null,
      audioPreview: null,
      lat: null,
      lng: null,
      showAudioOptions: false,
    };
  },
  methods: {
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
        const formData = new FormData();
        formData.append("media", this.photoData);
        formData.append("media_type", 'image');

        // Add location data to formData
        const location = navigator.geolocation.getCurrentPosition(this.showPosition);
        formData.append("lat", this.lat);
        formData.append("lng", this.lng);

        // Axios POST request
        this.$axios.post("steps", formData).then((res) => {
          console.log(res);
        })
        this.showPhotoOptions = false;
      } catch (error) {
        console.error(error);
      }
    },
    showPosition(position) {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    },

    async toggleRecording() {
      if (this.recording) {
        this.stopRecording();
      } else {
        await this.startRecording();
      }
    },
    async startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
        this.mediaRecorder.onstop = () => {
          this.audioData = new Blob(this.audioChunks, { type: "audio/mpeg" });
          this.audioPreview = URL.createObjectURL(this.audioData);
          this.showAudioOptions = true;
        };

        this.mediaRecorder.start();
        this.recording = true;
      } catch (error) {
        console.error(error);
      }
    },
    stopRecording() {
      this.mediaRecorder.stop();
      this.recording = false;
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

<style lang="scss" scoped></style>
