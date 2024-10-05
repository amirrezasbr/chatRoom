<template>
  <v-row>
    <v-col
      :class="selectChatColor ? 'light-blue-bg white--text' : ''"
      cols="12"
      class="py-2"
    >
      {{ item.receiverUsername }}
    </v-col>
    <v-col cols="12" class="py-2">
      {{ item.message }}
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      selectChatColor: false,
    };
  },
  props: {
    item: {
      type: Object,
    },
    chatIds: {
      type: Array,
    },
  },
  watch: {
    chatIds() {
      if (this.item.chatId == this.chatIds) {
        this.selectChatColor = true;
      } else {
        this.selectChatColor = false;
      }
    },
  },
};
</script>

<style scoped>
.border {
  border: 5px solid var(--light-gray);
}
</style>
