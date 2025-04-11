(async function () {
  // 验证是否有登录，没有登录就跳转到登录页，登录了就保存用户的数据
  const resp = await API.profile();
  const user = resp.data; // 有登录会返回用户信息，没有登录会返回 null

  if (!user) {
    // 登录失败
    alert("未登录，或者登录已过期");
    location.href = "./login.html";
    return;
  }

  // 下面的就是都登录成功的状态
  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    form: $(".msg-container"),
  };

  setUserInfo(); // 设置用户信息
  // 点击右上角的 ×
  doms.close.onclick = function () {
    // 注销
    API.loginOut();
    location.href = "./login.html";
  };

  // 提交内容
  doms.form.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };

  loadHistory(); // 加载历史信息

  /* 加载历史消息 */
  async function loadHistory() {
    const resp = await API.getHistory();
    const hisChatsObj = resp.data;
    for (const chat of hisChatsObj) {
      addChat(chat);
    }
    // 滚动到底部
    scrollToBottom();
  }

  /* 发送消息 */
  async function sendChat() {
    const content = doms.txtMsg.value.trim(); // 首尾空格去掉
    if (!content) {
      // 没有输入任何消息
      console.log("请输入消息后再发送");

      return;
    }

    // 有输入消息了
    addChat({
      content,
      createdAt: Date.now(),
      from: user.loginId,
      to: null,
    });

    // 清空内容
    doms.txtMsg.value = "";

    scrollToBottom(); // 滑动到底部

    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data, // 展开
    });

    scrollToBottom(); // 滑动到底部
  }

  window.sendChat = sendChat;
  /* 设置用户信息 */
  function setUserInfo() {
    /* 这里不能用 innerHTML
        不管怎样，都不能信任用户会给你提交的是正常的信息
        所以，不管用户提交什么，我们都只能将它转换为纯文本的形式来看
    */
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  /* 增加一条消息
    消息格式：
    content:"my name is  qiaqia，kla，kla，qia qia qia"
    createdAt:1652347192389
    from:"haha"
    to:null
    _id:"627cd13863832f0548a21ce8"
  */
  async function addChat(chatInfo) {
    const chatItemDom = $$$("div");
    chatItemDom.className = `chat-item ${chatInfo.from ? "me" : ""}`;

    const imgDom = $$$("img");
    imgDom.className = "chat-avatar";
    imgDom.src = chatInfo.from
      ? "./asset/avatar.png"
      : "./asset/robot-avatar.jpg";

    const chatContentDom = $$$("div");
    chatContentDom.className = "chat-content";
    chatContentDom.innerText = chatInfo.content;

    const chatDateDom = $$$("div");
    chatDateDom.className = "chat-date";
    chatDateDom.innerText = formatDate(chatInfo.createdAt);

    chatItemDom.appendChild(imgDom);
    chatItemDom.appendChild(chatContentDom);
    chatItemDom.appendChild(chatDateDom);

    doms.chatContainer.appendChild(chatItemDom);
  }

  /**
   * 格式化日期
   * @param {Date} date
   */
  function formatDate(date) {
    const dates = new Date(date);
    const year = dates.getFullYear(); // 年
    const month = (dates.getMonth() + 1).toString().padStart(2, "0"); // 月：不足两位用 0 补足
    const day = dates.getDay().toString().padStart(2, "0"); // 日：不足两位用 0 补足

    const hour = dates.getHours().toString().padStart(2, "0");
    const min = dates.getMinutes().toString().padStart(2, "0");
    const sec = dates.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  }

  /* 滚动到底部 */
  function scrollToBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }
})();
