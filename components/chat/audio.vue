<template>
  <div>
    <audio controls class="white--text border pr-2" :src="audio" />
  </div>
</template>

<script>
import services from "~/services";

export default {
  props: {
    content: {
      type: String,
    },
    chatId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      audio: null,
    };
  },
  mounted() {
    this.getAudio(this.content);
  },
  methods: {
    getAudio(id) {
      services.file
        .get(id, this.chatId)
        .then((response) => {
          this.audio = URL.createObjectURL(response.data);
          return this.audio;
        })
        .catch((error) => {
          console.log("errorImage", error);
        });
    },
  },
};
</script>

<style></style>
