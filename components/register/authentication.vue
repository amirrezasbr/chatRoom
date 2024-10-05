<template>
  <v-container fluid>
    <v-row no-gutters justify="center">
      <v-col cols="12" sm="6">
        <v-card elevation="0">
          <v-card-text
            :class="$vuetify.theme.dark ? 'primary-bg' : 'white-bg'"
            class="pa-md-16 card-height d-flex align-center"
          >
            <v-row>
              <v-col cols="12" class="d-flex justify-space-between">
                <p class="text-gradient header-s">farafund</p>
                <v-icon @click="toggleColor">
                  {{
                    $vuetify.theme.dark
                      ? "mdi-weather-sunny white--text"
                      : "mdi-moon-new"
                  }}
                </v-icon>
              </v-col>
              <v-col cols="12">
                <v-form ref="form">
                  <v-row>
                    <v-col cols="12">
                      <div
                        :class="$vuetify.theme.dark ? 'white--text' : ''"
                        class="py-2 title-900 d-flex justify-center"
                      >
                        لطفا کد تایید ارسال شده به ایمیل خود را وارد کنید
                      </div>
                      <div
                        :class="$vuetify.theme.dark ? 'white--text' : ''"
                        class="py-2 title-900 d-flex justify-center"
                      >
                        {{ emailValue }}
                      </div>
                      <v-otp-input
                        length="5"
                        v-model="verificationToken"
                        :background-color="
                          $vuetify.theme.dark
                            ? 'Surface800-bg'
                            : 'Surface100-bg'
                        "
                        class="otp-direction"
                        type="number"
                      >
                      </v-otp-input>
                      <div class="d-flex justify-center align-center">
                        {{ timerCounter }} ثانیه | کد دریافت نکرده اید؟
                        <v-btn
                          @click="resendEmail"
                          text
                          :loading="resendVerficationEmailLoading"
                          color="var(--purple)"
                        >
                          درخواست مجدد
                        </v-btn>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-btn
                        @click="cancelRegister"
                        block
                        outlined
                        :loading="cancelLoading"
                        :color="
                          $vuetify.theme.dark
                            ? 'var(--secondary)'
                            : 'var(--purple) '
                        "
                      >
                        انصراف
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-btn
                        @click="registerOtp"
                        block
                        :loading="otpLoading"
                        :color="
                          $vuetify.theme.dark
                            ? 'var(--secondary)'
                            : 'var(--purple) '
                        "
                      >
                        <span :class="$vuetify.theme.dark ? '' : 'white--text'">
                          تایید کد
                        </span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        v-if="$vuetify.breakpoint.mdAndUp"
        cols="1"
        :class="$vuetify.theme.dark ? 'primary-bg' : 'white-bg'"
      >
        <div v-if="$vuetify.theme.dark" class="candle-height">
          <v-img :src="require('@/assets/img/Groupblack.png')" />
        </div>
        <div v-else class="candle-height">
          <v-img :src="require('@/assets/img/Grouppurple.png')" />
        </div>
      </v-col>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="3">
        <div v-if="$vuetify.theme.dark" class="div-img-height Surface900-bg">
          <v-img class="img-height" :src="require('@/assets/img/candle.svg')" />
        </div>
        <div v-else class="div-img-height purple-bg px-3">
          <v-img class="img-height" :src="require('@/assets/img/Group.png')" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import services from "~/services";

export default {
  props: {
    emailValue: String,
  },
  data() {
    return {
      timerCounter: 120,
      verificationToken: "",
      otpLoading: false,
      cancelLoading: false,
      required: true,
      resendVerficationEmailLoading: false,

      rules: {
        length: (v) =>
          v.length <= 7 || " این فیلد بیشتر از 8 کاراکتر باید باشد",
        required: (v) => !!v || "این فیلد اجباری است",
      },
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
  watch: {
    timerCounter: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCounter--;
          }, 1000);
        }
      },
      immediate: true,
    },
  },
  methods: {
    toggleColor() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("useDarkTheme", this.$vuetify.theme.dark.toString());
    },
    cancelRegister() {
      if (!this.cancelLoading) this.cancelLoading = true;

      this.$emit("show-register");
    },
    resendEmail() {
      if (this.timerCounter == 0) {
        if (!this.resendVerficationEmailLoading)
          this.resendVerficationEmailLoading = true;
        let data = {
          email: this.emailValue,
        };
        services.user
          .resendVerificationEmail(data)
          .then((response) => {
            this.timerCounter = 120;
            this.resendVerficationEmailLoading = false;
            this.$toast.success("ایمیل با موفقیت مجددا برای شما ارسال شد");
          })
          .catch((error) => {
            console.log("error", error);
            this.resendVerficationEmailLoading = false;
            this.$toast.error(error.message);
          });
      } else {
        this.$toast.error(
          "تا " + this.timerCounter + " ثانیه دیگر می‌توانید دوباره امتحان کنید"
        );
      }
    },
    registerOtp() {
      if (!this.otpLoading) this.otpLoading = true;
      if (this.verificationToken != "") {
        let data = {
          email: this.emailValue,
          verificationToken: this.verificationToken,
        };
        services.user
          .verifyEmail(data)
          .then((response) => {
            this.otpLoading = false;
            this.$router.push("/login");
            this.$toast.success("اطلاعات شما با موفقیت ثبت شد");
          })
          .catch((error) => {
            console.log("error", error);
            this.otpLoading = false;
            this.$toast.error(error.message);
          });
      } else {
        this.otpLoading = false;
        this.$toast.error("کد تاییدیه نمی‌تواند خالی باشد");
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
.otp-direction {
  direction: ltr;
}
.img-height {
  height: 100%;
  max-height: 40rem;
}
.div-img-height {
  height: 100%;
  max-height: 40.625rem;
}
.candle-height {
  height: 100%;
  width: 100%;
  max-height: 17.18rem;
  max-width: 13.46rem;
}
.card-height {
  height: 108vh;
}
</style>
