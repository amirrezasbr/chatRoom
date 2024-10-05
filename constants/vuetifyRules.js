export const regex = {
  persian: /^[آ-ی]+$/,
  stringNumber: /^[a-zA-Z]-[0-9]+$/,
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<script>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export const rules = {
  required: (v) => !!v || "این فیلد اجباری است",
  length: (v) =>
    v == null ||
    v.length <= 0 ||
    v.length > 5 ||
    " این فیلد بیشتر از 5 کاراکتر باید باشد",
  persian_string: (v) =>
    v == null ||
    v.length <= 0 ||
    regex.persian.test(v) ||
    "نام وارد شده باید به فارسی باشد",
  email: (v) =>
    v == null ||
    v.length <= 0 ||
    regex.email.test(v) ||
    "ایمیل وارد شده درست نمی‌باشد",
  referallCode: (v) =>
    v == null ||
    v.length <= 0 ||
    regex.stringNumber.test(v) ||
    "کد دعوت شامل ترکیبی از حروف انگلیسی و اعداد می‌باشد",
};
export default rules;
