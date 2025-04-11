// 账号表单验证
var loginIdValidator = new FieldValidator("txtLoginId", async function (value) {
  if (!value) {
    return "请填写账号";
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

// 提交表单时做一个整体的验证
const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  const res = await FieldValidator.validate(
    loginIdValidator,
    loginPwdValidator
  );
  if (!res) {
    return; // 验证未通过
  }

  // 调用注册API，注册账户
  const formData = new FormData(form); // 传入表单，得到一个表单数据对象(只有在 input 有写入 name 属性的情况下才会获取到这个 input 所填入的值)
  /**
   * console.log(formData.entries()); // 返回的是一个迭代器，其实里面是这样的
   * [["loginId": "xxxxx"],[],[]]
   */
  const data = Object.fromEntries(formData.entries()); // 把它转换为 对象 格式

  const resp = await API.login(data);
  if (resp.code === 0) {
    alert("登录成功！");
    location.href = "./index.html";
  } else {
    alert(resp.msg);
    loginPwdValidator.inputDom.value = ""; // 清空密码框
  }
};
