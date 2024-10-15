<template>
  <div>
    <chats-dialog v-model="dialog" v-if="dialog" @getChatLists="showUserChat" />
    <chats-secret-dialog
      v-model="secretDialog"
      v-if="secretDialog"
      @getChatLists="showUserChat"
    />
    <v-row>
      <v-col cols="3" class="border">
        <v-row>
          <v-col cols="6"> لیست چت ها </v-col>
          <v-col cols="6" class="d-flex justify-end">
            <v-icon @click="addSecretChat" class="cursor-pointer">
              mdi-chat
            </v-icon>
            <v-icon @click="addChat" class="cursor-pointer">mdi-plus</v-icon>
          </v-col>
          <v-col cols="12" class="py-3" @click="showChats">
            <div v-for="(item, index) in chatLists" :key="index">
              <chats-list
                :item="item"
                class="cursor-pointer"
                @selectChatId="selectChatId"
                :selectChatColor="item.chatId == chatId"
                :chatIds="chatIds"
              />
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="9">
        <p v-if="!showChat">چتی برای نمایش وجود ندارد</p>
        <div v-else>
          <chat
            :chatId="chatId"
            :checkMessage="deleteMessages"
            :chatsList="chatLists"
            :receiverUsername="receiverUsername"
            @getChatList="getChatList"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import services from "~/services";
import { connectSocket, socket } from "~/constants/socket";

export default {
  data() {
    return {
      chatLists: [],
      deleteMessages: false,
      chatId: "",
      receiverUsername: "",
      chatIds: [],
      chatListIds: [],
      showChat: false,
      selectChatColor: false,
      secretDialog: false,
      dialog: false,
    };
  },
  mounted() {
    this.getChatList();
    this.checkConnectingStatus();
  },
  methods: {
    checkConnectingStatus() {
      if (socket === undefined) {
        const token = localStorage.getItem("token");
        connectSocket(token);
        socket.on("chat list", () => {
          this.getChatList(this.chatId);
        });
      }
    },
    showUserChat(response) {
      this.getChatList();
      this.showChat = true;
      this.chatId = response.chatId;
      this.receiverUsername = response;
    },
    selectChatId(item) {
      this.receiverUsername = item;
      this.chatId = item.chatId;
    },
    getChatList(id) {
      services.chat
        .list()
        .then((response) => {
          this.chatLists = response.data;
          this.chatListIds = [];
          this.chatLists.forEach((chatList) => {
            this.chatListIds.push(chatList.chatId);
          });
          if (!this.chatListIds.includes(id) && id) {
            this.deleteMessages = true;
            this.showChat = false;
          }
        })
        .catch((error) => {
          console.log("error", error);
          this.$toast.error(`${error.response?.data?.error}`);
        });
    },
    showChats() {
      this.showChat = true;
    },
    addSecretChat() {
      this.secretDialog = true;
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
