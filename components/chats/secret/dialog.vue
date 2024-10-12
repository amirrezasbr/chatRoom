<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-form ref="form">
              <v-row>
                <v-col cols="12">
                  <div
                    :class="$vuetify.theme.dark ? 'white--text' : ''"
                    class="py-1 title-text-field"
                  >
                    نام کاربر
                  </div>
                  <v-text-field
                    hide-details="auto"
                    v-model="username"
                    outlined
                    dense
                    label="نام کاربری که با آن میخواهید secret chat داشته باشید وارد کنید"
                    :rules="[rules.required]"
                    :background-color="
                      $vuetify.theme.dark ? 'Surface800-bg' : 'Surface100-bg'
                    "
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    @click="addContact"
                    block
                    :loading="loading"
                    :color="
                      $vuetify.theme.dark ? 'var(--secondary)' : 'var(--purple)'
                    "
                  >
                    <span :class="$vuetify.theme.dark ? '' : 'white--text'">
                      اضافه کردن
                    </span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import rules from "@/constants/vuetifyRules";
import services from "~/services";
export default {
  data() {
    return {
      username: "",
      loading: false,
      rules,
    };
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    addContact() {
      if (this.$refs.form.validate()) {
        if (!this.loading) this.loading = true;
        let data = {
          receiverUsername: this.username,
          isSecret: true,
        };
        services.chat
          .create(data)
          .then((response) => {
            this.loading = false;
            this.$emit("getChatLists", response.data);
            this.$toast.success("با موفقیت به لیست کاربران اضافه شد");
            this.dialog = false;
          })
          .catch((error) => {
            this.$toast.error(error?.response?.data?.error);
            console.log("error", error);
            this.loading = false;
            this.dialog = false;
          });
      } else {
        this.$toast.error("لطفا موارد را به درستی وارد کنید");
      }
    },
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style></style>
