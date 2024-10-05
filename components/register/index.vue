<template>
  <v-container fluid>
    <v-row no-gutters justify="center">
      <v-col cols="12" sm="6">
        <v-card elevation="0">
          <v-card-text
            class="pa-md-16 d-flex align-center"
            :class="$vuetify.theme.dark ? 'primary-bg' : 'white-bg'"
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
              <v-col
                cols="12"
                :class="$vuetify.theme.dark ? 'secondary-text' : 'purple-text'"
                class="title-900"
              >
                <p>ثبت نام در فرافاند</p>
              </v-col>
              <v-col
                cols="12"
                :class="$vuetify.theme.dark ? 'white--text' : ''"
                class="d-flex justify-space-between"
              >
                <p class="mb-0 title-400 d-flex align-center">
                  قبلا ثبت نام کرده‌اید؟
                </p>
                <v-btn x-small text class="px-0" @click="routeToLogIn">
                  <span class="button-400 purple-text"> ورود</span>
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-form ref="form">
                  <v-row>
                    <!-- <v-col cols="12">
                      <div
                        :class="$vuetify.theme.dark ? 'white--text' : ''"
                        class="py-1 title-text-field"
                      >
                        نام
                        <span
                          v-if="$attrs.required"
                          :class="
                            $attrs.required ? 'error--text' : 'white--text'
                          "
                        >
                          *
                        </span>
                      </div>
                      <v-text-field
                        hide-details="auto"
                        v-model="firstName"
                        solo
                        label="نام خود را وارد کنید"
                        dense
                        :rules="[rules.required, rules.persian]"
                        :background-color="
                          $vuetify.theme.dark
                            ? 'Surface800-bg'
                            : 'Surface100-bg'
                        "
                      >
                      </v-text-field>
                      <div
                        :class="$vuetify.theme.dark ? 'white--text' : ''"
                        class="pt-4 subtitle-text-field"
                      >
                        لطفا نام خود را به فارسی وارد کنید
                      </div>
                    </v-col> -->
                    <v-col cols="12">
                      <div
                        :class="$vuetify.theme.dark ? 'white--text' : ''"
                        class="py-1 title-text-field"
                      >
                        نام کاربری
                        <span
                          v-if="$attrs.required"
                          :class="
                            $attrs.required ? 'error--text' : 'white--text'
                          "
                        >
                          *
                        </span>
                      </div>
                      <v-text-field
                        hide-details="auto"
                        v-model="email"
                        solo
                        dense
                        label="نام کاربری خود را وارد کنید"
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
                        class="align-center py-1 title-text-field"
                      >
                        رمز عبور
                        <span
                          v-if="$attrs.required"
                          :class="
                            $attrs.required ? 'error--text' : 'white--text'
                          "
                        >
                          *
                        </span>
                      </div>
                      <v-text-field
                        v-model="password"
                        :background-color="
                          $vuetify.theme.dark
                            ? 'Surface800-bg'
                            : 'Surface100-bg'
                        "
                        hide-details="auto"
                        solo
                        dense
                        label="رمز عبور خود را وارد کنید"
                        :type="show_password ? 'text' : 'password'"
                        @click:append="onAppendClick"
                        :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                        :required="required"
                        :rules="[rules.required, rules.length]"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <div
                        :class="$vuetify.theme.dark ? 'white--text' : ''"
                        class="d-flex align-center py-1 justify-space-between title-text-field"
                      >
                        تکرار رمز عبور
                        <span
                          v-if="$attrs.required"
                          :class="
                            $attrs.required ? 'error--text' : 'white--text'
                          "
                        >
                          *
                        </span>
                      </div>
                      <v-text-field
                        v-model="rePassword"
                        :background-color="
                          $vuetify.theme.dark
                            ? 'Surface800-bg'
                            : 'Surface100-bg'
                        "
                        hide-details="auto"
                        solo
                        dense
                        :rules="[rules.required, rules.length]"
                        label="رمز عبور خود را مجددا وارد کنید"
                        :type="show_reset_password ? 'text' : 'password'"
                        @click:append="onAppendResetClick"
                        :append-icon="
                          show_reset_password ? 'mdi-eye' : 'mdi-eye-off'
                        "
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-btn
                        @click="register"
                        :loading="loading"
                        block
                        :color="
                          $vuetify.theme.dark
                            ? 'var(--secondary)'
                            : 'var(--purple)'
                        "
                      >
                        <span :class="$vuetify.theme.dark ? '' : 'white--text'">
                          ثبت نام
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
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import rules from "@/constants/vuetifyRules";
import services from "~/services";
export default {
  data() {
    return {
      show_password: false,
      show_reset_password: false,
      email: "",
      rules,
      firstName: "",
      password: "",
      rePassword: "",
      referralCode: "",
      verificationToken: "",
      loading: false,
      required: true,
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
    onAppendResetClick() {
      this.show_reset_password = !this.show_reset_password;
    },
    routeToLogIn() {
      this.$router.push("/login");
    },
    triggerAuthentication() {
      this.$emit("show-authentication");
      this.$emit("email", this.email);
      this.$toast.success("ایمیل با موفقیت برای شما ارسال شد");
    },
    register() {
      if (this.$refs.form.validate()) {
        if (!this.loading) this.loading = true;
        if (this.password == this.rePassword) {
          let data = {
            username: this.email,
            password: this.password,
          };

          services.user
            .register(data)
            .then((response) => {
              this.loading = false;
              this.$toast.success("با موفقیت ثبت نام شدید");
              this.$router.push("/login");
            })
            .catch((error) => {
              this.loading = false;
              console.log("error", error);
              this.$toast.error(`${error?.response?.data?.message}`);
            });
        } else {
          this.loading = false;
          this.$toast.warning(
            "رمز عبور وارد شده با تکرار رمز عبور مطابقت ندارد"
          );
        }
      } else {
        this.$toast.error("لطفا اطلاعات را به درستی وارد نمایید");
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
.theme--dark.v-expansion-panels .v-expansion-panel {
  background-color: unset;
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
.candle-height {
  height: 100%;
  width: 100%;
  max-height: 17.18rem;
  max-width: 13.46rem;
}
</style>
