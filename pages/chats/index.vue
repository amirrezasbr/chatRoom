<template>
  <div>
    <chats-dialog v-model="dialog" v-if="dialog" @getChatLists="showUserChat" />
    <v-row>
      <v-col cols="3" class="border">
        <v-row>
          <v-col cols="6"> لیست چت ها </v-col>
          <v-col cols="6" class="d-flex justify-end">
            <v-icon @click="addChat" class="cursor-pointer">mdi-plus</v-icon>
          </v-col>
          <v-col cols="12" class="py-3" @click="showChats">
            <div
              v-for="(item, index) in chatLists"
              :key="index"
              @click="selectChatId(item?.chatId, item?.receiverUsername)"
            >
              <chats-list
                :item="item"
                class="cursor-pointer"
                :selectChatColor="selectChatColor"
                :chatIds="chatIds"
              />
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="9">
        <p v-if="!showChat">چتی برای نمایش وجود ندارد</p>
        <div v-else>
          <chat :chatId="chatId" :receiverUsername="receiverUsername" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import services from "~/services";

export default {
  data() {
    return {
      chatLists: [],
      chatId: "",
      receiverUsername: "",
      chatIds: [],
      showChat: false,
      selectChatColor: false,
      dialog: false,
    };
  },
  mounted() {
    this.getChatList();
  },
  methods: {
    showUserChat(response) {
      this.getChatList();
      this.showChat = true;
      this.chatId = response.chatId;
      this.receiverUsername = response.receiverUsername;
    },
    selectChatId(chatId, receiverUsername) {
      this.receiverUsername = receiverUsername;
      this.chatId = chatId;
      if (this.chatIds.length == 0) {
        this.chatIds.push(chatId);
      } else if (this.chatIds.length != 0) {
        this.chatIds.splice(0, 1);
        this.chatIds.push(this.chatId);
      }
    },
    getChatList() {
      services.chat
        .list()
        .then((response) => {
          this.chatLists = response.data;
        })
        .catch((error) => {
          console.log("error", error);
          this.$toast.error(`${error.response?.data?.error}`);
        });
    },
    showChats() {
      this.showChat = true;
    },
    addChat() {
      this.dialog = true;
    },
  },
};
</script>

<style scoped>
.border {
  border-left: 5px solid var(--light-blue);
}
</style>
