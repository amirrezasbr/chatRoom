<template>
  <v-row>
    <!-- todo d-flex flex-column-reverse -->
    <v-col cols="9" class="header-position mb-10 px-0 py-0">
      <p class="black--text px-5">{{ receiverUsername }}</p>
      <p v-if="isTypingId == chatId" class="black--text px-5">
        {{ isTyping ? "در حال نوشتن ..." : "" }}
      </p>
    </v-col>
    <v-col cols="12" class="py-15">
      <div v-for="(item, index) in messages" :key="index">
        <p
          v-if="item.contentType == 'text'"
          class="white--text border pr-2"
          :class="
            receiverUsername === item.senderUsername ? 'light-blue-bg' : 'green'
          "
        >
          {{ item.content }}
        </p>
        <div
          :class="
            receiverUsername === item.senderUsername ? 'light-blue-bg' : 'green'
          "
          class="white--text border my-3"
          v-else-if="item.contentType == 'image'"
        >
          <chat-image :content="item.content" :chatId="chatId" />
        </div>

        <!-- <audio
          v-else-if="item.contentType == 'audio'"
          class="white--text border pr-2"
          :class="
            receiverUsername === item.senderUsername ? 'light-blue-bg' : 'green'
          "
          :src="item.content"
        /> -->
      </div>
    </v-col>
    <v-col cols="9" class="position mt-10 px-0 py-0" v-if="type == 'text'">
      <v-row>
        <v-col cols="3">
          <v-file-input
            :append-icon="'mdi-send'"
            small-chips
            background-color="Surface100-bg"
            solo
            multiple
            placeholder="عکس را اینجا آپلود کنید"
            elevation="0"
            hide-details="auto"
            show-size
          ></v-file-input>
        </v-col>
        <v-col cols="9">
          <v-text-field
            hide-details="auto"
            background-color="Surface100-bg"
            solo
            elevation="0"
            @click:append="sendMessage"
            placeholder="پیغام را اینجا بنویسید"
            :append-icon="
              message == []
                ? ' mdi-microphone'
                : sendAudio
                ? 'mdi-microphone-plus'
                : 'mdi-send'
            "
            v-model="message"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { connectSocket, socket } from "~/constants/socket";
import rules from "~/constants/vuetifyRules";
import services from "~/services";

export default {
  props: {
    chatId: {
      type: String,
      required: true,
    },
    receiverUsername: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      message: "",
      messages: [],
      isTyping: false,
      isTypingId: "",
      type: "text",
      showChat: false,
      dialog: false,
      rules,
      sendAudio: false,
      audioURL: null,
      audioBlob: null,
      mediaRecorder: null,
      chunks: [],
    };
  },
  mounted() {
    this.checkConnectingStatus();
    this.getMessages();
    this.getChatHistory();
    this.checkIsTyping();
  },
  watch: {
    chatId() {
      this.getChatHistory();
    },
    message() {
      this.checkSendingStatus();
    },
  },
  methods: {
    checkConnectingStatus() {
      if (socket == undefined) {
        const token = localStorage.getItem("token");
        connectSocket(token);
      }
    },
    sendFile() {
      this.type = this.type == "image" ? "text" : "image";
    },
    checkSendingStatus() {
      socket.emit("is typing", this.chatId);
    },
    checkIsTyping() {
      let myTimeOut;
      socket.on("is typing", (message) => {
        clearTimeout(myTimeOut);
        this.isTyping = true;
        this.isTypingId = message;
        if (this.isTyping) {
          myTimeOut = setTimeout(() => {
            this.isTyping = false;
          }, 5000);
        }
      });
    },
    getMessages() {
      socket.on("message", (message) => {
        console.log("message", message);
        this.messages.push(message);
      });
    },
    getChatHistory() {
      services.chat
        .history(this.chatId, null)
        .then((response) => {
          this.messages = response.data;
        })
        .catch((error) => {
          console.log("error", error);
          this.$toast.error(error.response.data.error);
        });
    },
    async sendAudioMessage() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event) => {
          this.chunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.chunks, { type: "audio/wav" });
          this.audioURL = URL.createObjectURL(this.audioBlob);
          this.chunks = [];
        };

        this.mediaRecorder.start();
        this.sendAudio = true;
        console.log(
          `you got an audio: ${this.mediaRecorder} `,
          this.audioURL,
          this.audioBlob,
          this.chunks
        );

        console.log("Recording started");
      } catch (error) {
        console.error("Error accessing the microphone:", error);
      }
      // navigator.mediaDevices
      //   .getUserMedia({ video: false, audio: true })
      //   .then((stream) => {
      //     console.log(`you got an audio: ${stream}`);
      //     window.localStream = stream; // A
      //     window.localAudio.srcObject = stream; // B
      //     window.localAudio.autoplay = true; // C
      //   })
      //   .catch((err) => {
      //     console.error(`you got an error: ${err}`);
      //   });
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        console.log("Recording stopped");
      }
    },
    sendMessage() {
      // if (this.message == "") {
      //   this.sendAudioMessage();
      // } else {
      // console.log("message1", this.chatId, this.message, socket);

      // if (socket.connected == false) {
      //   const token = localStorage.getItem("token");
      //   // connectSocket(token);
      //   token = JSON.parse(token);
      //   // console.log("message", this.chatId, this.message, socket, token);
      //   console.log("message", token);
      // }
      let message = {
        chatId: this.chatId,
        content: this.message,
        contentType: "text",
      };
      socket.emit("message", message);
      this.message = "";
      // }
    },
  },
};
</script>

<style scoped>
.border {
  border: 1px solid black;
  width: 20%;
  border-radius: 10px;
}
.position {
  position: fixed;
  background-color: aliceblue;
  bottom: 0;
}
.header-position {
  position: fixed;
  background-color: aliceblue;
  top: 0;
}
</style>
