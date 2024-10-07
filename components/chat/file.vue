<template>
  <div class="d-block" id="link"></div>
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
      file: null,
    };
  },
  mounted() {
    this.getFile(this.content);
  },
  methods: {
    getFile(id) {
      services.file
        .get(id, this.chatId)
        .then((response) => {
          this.file = URL.createObjectURL(response.data);
          const div = document.getElementById("link");
          const a = document.createElement("a");
          a.href = URL.createObjectURL(response.data);
          a.target = "_blank";
          a.textContent = id;
          div.appendChild(a);
          return this.file;
        })
        .catch((error) => {
          console.log("errorImage", error);
        });
    },
  },
};
</script>

<style></style>
