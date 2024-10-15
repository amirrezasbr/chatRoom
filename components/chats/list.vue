<template>
  <v-row @click="selectChatId">
    <v-col
      v-if="item.isSecret"
      :class="selectChatColor ? 'light-blue-bg white--text' : ''"
      cols="12"
      class="py-2"
    >
      {{ item.receiverUsername }}-secret
    </v-col>
    <v-col
      v-else
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
    return {};
  },
  props: {
    item: {
      type: Object,
    },
    chatIds: {
      type: Array,
    },
    selectChatColor: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    selectChatId() {
      this.$emit("selectChatId", this.item);
    },
  },
};
</script>

<style scoped>
.border {
  border: 5px solid var(--light-gray);
}
</style>
