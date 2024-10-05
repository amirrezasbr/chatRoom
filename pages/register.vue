<template>
  <div>
    <register
      v-if="!show"
      @show-authentication="showAuthentication"
      @email="email"
    />
    <!-- <register-authentication
      v-if="showOtp"
      @show-register="showRegister"
      :emailValue="emailValue"
    /> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      showOtp: false,
      emailValue: "",
    };
  },
  methods: {
    email(value) {
      this.emailValue = value;
    },
    showAuthentication() {
      this.show = true;
      this.showOtp = true;
    },
    showRegister() {
      this.show = false;
      this.showOtp = false;
    },
  },
};
</script>

<style></style>
