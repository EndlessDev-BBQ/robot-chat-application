var API = (function () {
  const BASE_URL = "https://study.duyiedu.com";
  const AUTHORIZATION_KEY = "authorization";

  /**
   * 通用性封装
   */

  // GET请求的封装
  function get(path) {
    const headers = {};
    const authorization = localStorage.getItem(AUTHORIZATION_KEY);
    if (authorization) {
      // 如果存在，那就加到到 headers 里
      headers.authorization = `Bearer ${authorization}`;
    }

    return fetch(BASE_URL + path, { headers });
  }

  // POST请求的封装
  function post(path, bodyObj) {
    const headers = {
      "Content-Type": "application/json",
    };
    const authorization = localStorage.getItem(AUTHORIZATION_KEY);

    if (authorization) {
      // 如果存在，那就加到到 headers 里
      headers.authorization = `Bearer ${authorization}`;
    }

    return fetch(BASE_URL + path, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyObj),
    });
  }

  /**
   * 用户注册
   * @param {Object} userInfo
   * 请求参数：
   * HEADER:
   * Content-Type : application/json
   * BODY:
   * loginId - string
   * nickname - string
   * loginPwd - string
   */
  async function reg(userInfo) {
    // 拿到响应行和响应头
    const res = await post("/api/user/reg", userInfo);

    // 拿到响应体
    const body = await res.json();

    return body;
  }

  /**
   * 用户登录
   * @param {Object} loginInfo
   * 请求参数：
   * HEADER:
   * Content-Type : application/json
   * BODY:
   * loginId - string
   * loginPwd - string
   */
  async function login(loginInfo) {
    const res = await post("/api/user/login", loginInfo);

    const result = await res.json();
    if (result.code === 0) {
      // 登录成功
      // 将响应头中的authorization保存起来（localStorage）
      const authorization = res.headers.get("authorization");
      localStorage.setItem(AUTHORIZATION_KEY, authorization);
    }

    return result;
  }

  /**
   * 验证用户是否存在
   * @param {String} loginId
   * 请求参数：
   * HEADER:
   * Content-Type : application/json
   * BODY:
   * loginId - string
   */
  async function exists(loginId) {
    const res = await get(`/api/user/exists?loginId=${loginId}`);
    const body = await res.json();
    return body;
  }

  /**
   * 当前登录的用户信息
   * 请求参数：
   * HEADER:
   * authorization
   */
  async function profile() {
    const res = await get("/api/user/profile");

    const body = await res.json();
    return body;
  }

  /**
   * 发送聊天消息
   * @param {String} content 聊天的内容
   * 请求参数：
   * HEADER:
   * Content-Type: application/json
   * authorization: string
   */
  async function sendChat(content) {
    const res = await post("/api/chat", { content });

    const body = await res.json();
    return body;
  }

  /**
   * 获取聊天记录
   * 请求参数：
   * HEADER:
   * authorization
   */
  async function getHistory() {
    const res = await get("/api/chat/history");

    const body = await res.json();
    return body;
  }

  /**
   * 退出登陆
   */
  function loginOut() {
    localStorage.removeItem(AUTHORIZATION_KEY);
  }

  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})();
