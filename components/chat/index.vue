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
        <div v-else-if="item.contentType == 'audio'">
          <chat-audio :content="item.content" :chatId="chatId" />
        </div>
        <div class="d-block" v-else-if="item.contentType == 'file'">
          <chat-file :content="item.content" :chatId="chatId" />
        </div>
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
            v-model="file"
            @click:append="sendFile"
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
            @click:prepend="takePicture"
            elevation="0"
            prepend-icon="mdi-picture-in-picture-bottom-right-outline"
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
import { picture } from "~/constants/pictureButton";
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
      file: null,
      messages: [],
      isTyping: false,
      isTypingId: "",
      type: "text",
      isRecording: false,
      rules,
      sendAudio: false,
      audioFile: null,
      audioRecorder: undefined,
      audioChunks: [],
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
    async takePicture() {
      await picture(this.chatId);
    },
    checkConnectingStatus() {
      if (socket == undefined) {
        const token = localStorage.getItem("token");
        connectSocket(token);
      }
    },
    sendFile() {
      const data = new FormData();
      data.append("chatId", this.chatId);
      data.append("file", this.file[0]);

      services.file
        .upload(data)
        .then((response) => {
          const message = {
            chatId: this.chatId,
            content: response.data.filename,
            contentType: "file",
          };
          socket.emit("message", message);
          this.file = null;
        })
        .catch((error) => {
          console.log("error", error);
        });
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
    recordAudioMessage() {
      this.isRecording = !this.isRecording;
      if (this.isRecording) {
        // start recording
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            const options = {
              mimeType: "audio/webm",
              audioBitsPerSecond: 8000,
            };
            this.audioRecorder = new MediaRecorder(stream, options);
            this.audioRecorder.addEventListener("dataavailable", (event) => {
              this.audioChunks.push(event.data);
            });
            this.audioRecorder.start();
          })
          .catch((error) => {
            console.log("error", error);
          });
      } else {
        if (this.audioRecorder && this.audioRecorder.state !== "inactive") {
          // stop recording
          this.audioRecorder.addEventListener("stop", () => {
            this.audioRecorder.stream.getTracks().forEach((track) => {
              track.stop();
              const audioBlob = new Blob(this.audioChunks, {
                type: "audio/webm",
              });
              this.audioFile = new File([audioBlob], "audio.webm", {
                type: "audio/webm",
              });
              // emiting data
              const data = new FormData();
              data.append("chatId", this.chatId);
              data.append("file", this.audioFile);
              console.log("file", this.audioFile);
              services.file
                .upload(data)
                .then((response) => {
                  const message = {
                    chatId: this.chatId,
                    content: response.data.filename,
                    contentType: "audio",
                  };
                  socket.emit("message", message);
                  this.file = null;
                })
                .catch((error) => {
                  console.log("error", error);
                });
              this.audioChunks = [];
            });
          });
          this.audioRecorder.stop();
        }
      }
    },

    sendMessage() {
      if (this.message == "") {
        this.recordAudioMessage();
      } else {
        let message = {
          chatId: this.chatId,
          content: this.message,
          contentType: "text",
        };
        socket.emit("message", message);
        this.message = "";
      }
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
