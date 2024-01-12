<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-btn block @click="showPhotoCapture">Take Photo</v-btn>
        <input
          type="file"
          accept="image/*"
          capture="camera"
          ref="photoInput"
          @change="handlePhoto"
          hidden
        />
      </v-col>
    </v-row>

    <!-- Add UI elements for retake or send options -->
    <v-dialog v-model="showPhotoOptions" persistent>
      <v-card>
        <v-card-title>Photo Options</v-card-title>
        <v-card-text>
          <v-img :src="photoPreview"></v-img>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="retakePhoto">Retake</v-btn>
          <v-btn color="primary" @click="sendPhoto">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Similar UI elements for audio recording will be added -->
    <!-- Button to start/stop recording -->
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-btn block @click="toggleRecording">{{
          recording ? "Stop Recording" : "Record Audio"
        }}</v-btn>
      </v-col>
    </v-row>

    <!-- Dialog for audio options -->
    <v-dialog v-model="showAudioOptions" persistent>
      <v-card>
        <v-card-title>Audio Options</v-card-title>
        <v-card-text>
          <audio controls :src="audioPreview"></audio>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="recordAgain">Record Again</v-btn>
          <v-btn color="primary" @click="sendAudio">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
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
    async sendPhoto() {
      try {
        const formData = new FormData();
        formData.append("image", this.photoData);

        // Add location data to formData
        const location = await this.getCurrentLocation();
        formData.append("location", JSON.stringify(location));

        // Axios POST request
        await this.$axios.post("your-api-endpoint/photo", formData);
        this.showPhotoOptions = false;
      } catch (error) {
        console.error(error);
      }
    },
    getCurrentLocation() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => reject(error)
        );
      });
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
