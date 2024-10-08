<template>
  <v-container fluid>
    <v-row no-gutters justify="center">
      <v-col cols="12" sm="6">
        <v-card elevation="0" class="card-height">
          <v-card-text
            class="pa-md-16 d-flex align-center card-height"
            :class="$vuetify.theme.dark ? 'primary-bg' : 'white-bg'"
          >
            <v-container fluid>
              <v-row>
                <v-col cols="12" class="d-flex justify-space-between">
                  <p class="text-gradient header-s">chat room</p>
                  <v-icon @click="toggleColor">
                    {{
                      $vuetify.theme.dark
                        ? "mdi-weather-sunny white--text"
                        : "mdi-moon-new"
                    }}
                  </v-icon>
                </v-col>
                <v-col
                  cols="12"
                  :class="
                    $vuetify.theme.dark ? 'secondary-text' : 'purple-text'
                  "
                  class="title-900"
                >
                  <p>ورود به چت روم</p>
                </v-col>
                <v-col
                  cols="12"
                  :class="$vuetify.theme.dark ? 'white--text' : ''"
                  class="d-flex justify-space-between"
                >
                  <p class="mb-0 d-flex align-center title-400">
                    اگر تا کنون ثبت نام نکرده‌اید؟
                  </p>
                  <v-btn text class="px-0" @click="routeToRegister">
                    <span class="purple-text"> ثبت نام</span>
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-form ref="form">
                    <v-row>
                      <v-col cols="12">
                        <div
                          :class="$vuetify.theme.dark ? 'white--text' : ''"
                          class="py-1 title-text-field"
                        >
                          نام کاربری
                        </div>
                        <v-text-field
                          hide-details="auto"
                          v-model="username"
                          outlined
                          dense
                          label="نام کاربری
 خود را وارد کنید"
                          prepend-inner-icon="mdi-email-outline"
                          :rules="[rules.required]"
                          :background-color="
                            $vuetify.theme.dark
                              ? 'Surface800-bg'
                              : 'Surface100-bg'
                          "
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <div
                          :class="$vuetify.theme.dark ? 'white--text' : ''"
                          class="d-flex justify-space-between py-1 title-text-field"
                        >
                          <v-row>
                            <v-col cols="3"> رمز عبور </v-col>
                            <v-col cols="9" class="d-flex justify-end">
                              <span class="purple-text">
                                رمز عبور خود را فراموش کرده‌اید؟
                              </span>
                            </v-col>
                          </v-row>
                        </div>
                        <v-text-field
                          v-model="password"
                          :background-color="
                            $vuetify.theme.dark
                              ? 'Surface800-bg'
                              : 'Surface100-bg'
                          "
                          hide-details="auto"
                          outlined
                          dense
                          label="رمز عبور خود را وارد کنید"
                          :type="show_password ? 'text' : 'password'"
                          @click:append="onAppendClick"
                          :append-icon="
                            show_password ? 'mdi-eye' : 'mdi-eye-off'
                          "
                          :rules="[rules.required, rules.length]"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-btn
                          @click="signIn"
                          block
                          :loading="loading"
                          :color="
                            $vuetify.theme.dark
                              ? 'var(--secondary)'
                              : 'var(--purple)'
                          "
                        >
                          <span
                            :class="$vuetify.theme.dark ? '' : 'white--text'"
                          >
                            ورود
                          </span>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import rules from "@/constants/vuetifyRules";
import services from "@/services";
import { connectSocket, socket } from "~/constants/socket";

export default {
  data() {
    return {
      service: "user",
      show_password: false,
      loading: false,
      username: "",
      password: "",
      rules,
    };
  },
  mounted() {
    const theme = localStorage.getItem("useDarkTheme");
    if (theme) {
      if (theme == "true") {
        this.$vuetify.theme.dark = true;
      } else this.$vuetify.theme.dark = false;
    }
  },
  methods: {
    toggleColor() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("useDarkTheme", this.$vuetify.theme.dark.toString());
    },
    onAppendClick() {
      this.show_password = !this.show_password;
    },
    routeToRegister() {
      this.$router.push("/register");
    },

    signIn() {
      if (this.$refs.form.validate()) {
        if (!this.loading) this.loading = true;

        services.user
          .login({
            username: this.username,
            password: this.password,
          })
          .then((response) => {
            axios.defaults.headers.common["Authorization"] =
              response.data.token;
            connectSocket(response.data.token);
            localStorage.setItem("token", response.data.token);
            this.$store.commit("setUserToken", response.data);
            this.$router.replace("/chats");
            this.loading = false;
          })
          .catch((error) => {
            this.$toast.error(error?.response?.data?.error);
            console.log("error", error?.response?.data?.error);
            this.loading = false;
          });
      } else {
        this.$toast.error("لطفا موارد را به درستی وارد کنید");
      }
    },
  },
};
</script>

<style scoped>
.text-gradient {
  background-image: linear-gradient(to right, #ffc700, #4b0cfd);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}
.google-img-size {
  width: 100%;
  height: 100%;
  max-height: 2rem;
  max-width: 1.85rem;
}
.img-height {
  height: 100%;
}
.card-height {
  height: 100%;
}
</style>
