// 用户登录和注册的表单项验证的通用代码

/**
 * 对某一个表单项进行验证的构造函数
 */
class FieldValidator {
  /**
   * 构造器
   * @param {String} txtId 文本框的Id
   * @param {Function} validatorFunc 验证规则函数，当需要对该文本框进行验证时，会调用该函数，函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若没有返回，则表述无错误
   */
  constructor(txtId, validatorFunc) {
    this.inputDom = $("#" + txtId);
    this.pDom = this.inputDom.nextElementSibling;
    this.validatorFunc = validatorFunc;

    // 表单失去焦点
    this.inputDom.onblur = () => {
      this.validate();
    };
  }

  /**
   * 注册在原型上
   * 验证，成功返回 true ，失败返回 false
   */
  async validate() {
    const err = await this.validatorFunc(this.inputDom.value);
    if (err) {
      // 有错误
      this.pDom.innerText = err;
      return false;
    } else {
      this.pDom.innerText = "";
      return true;
    }
  }

  /**
   * 注册在静态方法上
   * @param {FieldValidator[]} validators
   */
  static async validate(...validators) {
    // 调用每个表单下的验证方法（原型的那个），返回一个包含每个表单验证结果的一个 Promise 数组
    const proms = validators.map((v) => v.validate());
    // 验证是否所有的 Promise 结果都是 true
    const res = await Promise.all(proms);
    return res.every((r) => r); // 判断数组每一项是否为 true：全是 true 为 true，有一个 false 为 false
  }
}

// // 封装所有需要验证的表单，统一进行验证
// function test() {
//   FieldValidator.validate(loginIdValidator, nicknameValidator).then((res) => {
//     console.log(res);
//   });
// }
