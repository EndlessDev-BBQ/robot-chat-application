// 账号表单验证
var loginIdValidator = new FieldValidator("txtLoginId", async function (value) {
  if (!value) {
    return "请填写账号";
  }

  const resp = await API.exists(value);
  if (resp.data) {
    // 账号已存在
    return "账号已存在";
  }
});

// 昵称表单验证
var nicknameValidator = new FieldValidator("txtNickname", async function (
  value
) {
  if (!value) {
    return "请填写昵称";
  }
});

// 密码表单验证
var loginPwdValidator = new FieldValidator("txtLoginPwd", async function (
  value
) {
  if (!value) {
    return "请输入密码";
  }
});

// 确认密码表单验证
var loginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  async function (value) {
    if (!value) {
      return "请再次输入密码";
    }

    // 验证此密码是否和密码表单的内容是一致的
    if (value !== loginPwdValidator.inputDom.value) {
      return "两次密码输入不一致";
    }
  }
);

// 提交表单时做一个整体的验证
const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  const res = await FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
  );
  if (!res) {
    return; // 验证未通过
  }

  // 验证通过
  // 调用注册API，注册账户
  const formData = new FormData(form); // 传入表单，得到一个表单数据对象(只有在 input 有写入 name 属性的情况下才会获取到这个 input 所填入的值)
  /**
   * console.log(formData.entries()); // 返回的是一个迭代器，其实里面是这样的
   * [["loginId": "xxxxx"],[],[]]
   */
  const data = Object.fromEntries(formData.entries()); // 把它转换为 对象 格式

  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("注册成功，点击确定，跳转到登录页!");
    // 跳转到登录页面
    location.href = "./login.html";
  } else {
    alert(resp.msg);
  }
};
