<template>
  <div>
    <v-img :src="image" height="100%" width="100%"></v-img>
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
      image: null,
    };
  },
  mounted() {
    this.getImage(this.content);
  },
  methods: {
    getImage(id) {
      console.log("id", id, this.content);
      services.file
        .get(id, this.chatId)
        .then((response) => {
          this.image = URL.createObjectURL(response.data);
          return this.image;
        })
        .catch((error) => {
          console.log("errorImage", error);
        });
    },
  },
};
</script>

<style></style>
