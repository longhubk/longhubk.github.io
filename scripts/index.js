// const server_url = "https://dblogit.herokuapp.com";
// const server_url = "https://crud-blog-lflgu9yk4-longhubk.vercel.app";
const server_url = "http://localhost:3000";

const perPage = 10;
const deltaPage = 2;
const ACT = ["view", "like", "dislike"];

const getFooter = () => {
  const footer = document.getElementsByTagName("footer")[0];
  footer.innerHTML = `
  <div class="fx wr">
    <a class="mr-1" href="mailto:longn7284@gmail.com">Email</a>
    <a class="mr-1" href="https://github.com/longhubk">Github</a>
    <button onclick="goToDown()" class="scroll-btn" id="down-btn" title="Go to down">v</button>
    <button onclick="goToTop()" class="scroll-btn" id="top-btn" title="Go to top">^</button>
  </div>`;
};

const getQueryParam = (param) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params[param];
};

const createPageItem = async (countNote, page = 1) => {
  let itemPages = "";
  const templateBtn = (numPage, display, isHidden = false) =>
    `<div ${isHidden ? 'class="hidden-page"' : ""}><button ${
      Number(numPage) === Number(page) ? 'id="current-page"' : ""
    } onclick="insertParam('page', ${numPage})">${display}</button></div>`;
  let maxPage = 1;
  for (let i = 0; i < countNote; i += perPage) {
    const numPage = +(i > 0 ? i / perPage : i) + 1;
    const isHidden =
      Number(numPage) > Number(page + deltaPage) ||
      Number(numPage) < Number(page - deltaPage);
    itemPages += templateBtn(numPage, numPage, isHidden);
    maxPage = numPage;
  }
  if (page > 1) {
    itemPages = templateBtn(+page - 1, "<") + itemPages;
  }
  if (page < maxPage) {
    itemPages =
      itemPages + templateBtn(+page + 1, ">") + templateBtn(maxPage, ">>");
  }
  if (page > deltaPage) {
    itemPages = templateBtn(1, "<<") + itemPages;
  }
  return itemPages;
};

const checkIsLogin = async () => {
  const oldTK = localStorage.getItem("token");
  if (oldTK) {
    try {
      const data = await axios.get(`${server_url}/user/profile`, {
        headers: { Authorization: `Bearer ${oldTK}` },
      });
      if (data.data.code === "00") {
        return data.data.msg.user.username;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    return false;
  }
};

const logout = () => {
  const oldTK = localStorage.getItem("token");
  localStorage.removeItem("token");
  location.reload();
};

const login = (us, pw) => {
  axios
    .post(`${server_url}/user/login`, { username: us, password: pw })
    .then((data) => {
      const { msg, code } = data.data;
      if (code === "00") {
        // window.alert("login success");
        localStorage.setItem("token", msg.token);
        localStorage.removeItem("TAGS");
        // location.reload();
        window.location.href = "/note.manager.html";
      } else {
        window.alert("login fail", msg);
      }
    })
    .catch((err) => {
      window.alert("login fail", err.msg);
    });
};

const signup = (us, pw, pwa) => {
  axios
    .post(`${server_url}/user/signup`, {
      username: us,
      password: pw,
      passwordAgain: pwa,
    })
    .then((data) => {
      const { msg, code } = data.data;
      if (code === "00") {
        window.alert("Sign up success");
        location.reload();
      } else {
        window.alert("Sign up fail", msg);
      }
    })
    .catch((err) => {
      window.alert("Sign up fail", err.msg);
    });
};

const renderNote = (rawMD) => {
  let md = new Remarkable({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (err) {}
      }
      try {
        return hljs.highlightAuto(str).value;
      } catch (err) {}
      return ""; // use external default escaping
    },
  });
  const res = md.render(rawMD);
  return res;
};
const getAdminListNote = async (page = 1, keyword, tag) => {
  try {
    const oldTK = localStorage.getItem("token");
    const url = `${server_url}/note/page-ad/${page}`;
    const kwUrl = keyword ? `${url}?keyword=${keyword}` : url;
    const tgUrl =
      keyword && tag
        ? `${kwUrl}&tag=${tag}`
        : tag
        ? `${url}?tag=${tag}`
        : kwUrl;
    const data = await axios.get(tgUrl, {
      headers: { Authorization: `Bearer ${oldTK}` },
    });
    if (data.data.code === "00") {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

const getListNote = async (page = 1, keyword = "") => {
  try {
    const data = await axios.get(
      `${server_url}/note/page/${page}${keyword ? `?keyword=${keyword}` : ""}`
    );
    if (data.data.code === "00") {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

const insertParam = (key, value, inc = "") => {
  key = encodeURIComponent(key);
  value = encodeURIComponent(value);

  var kvp = document.location.search
    .substr(1)
    .split("&")
    .filter((e) => e.includes(inc));

  let i = 0;

  for (; i < kvp.length; i++) {
    if (kvp[i].startsWith(key + "=")) {
      let pair = kvp[i].split("=");
      pair[1] = value;
      kvp[i] = pair.join("=");
      break;
    }
  }

  if (i >= kvp.length) {
    kvp[kvp.length] = [key, value].join("=");
  }

  let params = kvp.join("&");

  document.location.search = params;
};

const getAdminNote = async (noteId) => {
  try {
    const oldTK = localStorage.getItem("token");
    const data = await axios.get(`${server_url}/note/one-ad/${noteId}`, {
      headers: { Authorization: `Bearer ${oldTK}` },
    });
    if (data.data.code === "00") {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

const getNote = async (noteId) => {
  try {
    const data = await axios.get(`${server_url}/note/one/${noteId}`);
    if (data.data.code === "00") {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

const getCountNote = async (keyword = "") => {
  try {
    const data = await axios.get(
      `${server_url}/note/count${keyword ? `?keyword=${keyword}` : ""}`
    );
    if (data.data.code === "00") {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

const getNoteShare = async (noteId) => {
  try {
    const data = await axios.get(`${server_url}/note/one-share/${noteId}`);
    if (data.data.code === "00") {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

const getAdminCountNote = async (keyword = "", tag = "") => {
  try {
    const oldTK = localStorage.getItem("token");
    const uri = `${server_url}/note/count-ad${
      keyword ? `?keyword=${keyword}` : ""
    }${tag ? `${keyword === "" ? "?" : "&"}tag=${tag}` : ""} `;
    const data = await axios.get(uri, {
      headers: { Authorization: `Bearer ${oldTK}` },
    });
    if (data.data.code === "00") {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

const updateNote = async (updateData, oldData) => {
  const oldTK = localStorage.getItem("token");
  if (oldTK) {
    try {
      const data = await axios.post(
        `${server_url}/note/update`,
        { updateData, oldData },
        { headers: { Authorization: `Bearer ${oldTK}` } }
      );
      return data.data;
    } catch (err) {
      console.log(err);
    }
  } else {
    return { code: "09", msg: "no token" };
  }
};

const createNote = async (title, content, state = 0, tag) => {
  const oldTK = localStorage.getItem("token");
  if (oldTK) {
    try {
      const data = await axios.post(
        `${server_url}/note/`,
        { title, content, state, tag },
        { headers: { Authorization: `Bearer ${oldTK}` } }
      );
      return data.data;
    } catch (err) {
      console.log(err);
    }
  } else {
    return { code: "09", msg: "no token" };
  }
};

const createNewTag = async (tag) => {
  const oldTK = localStorage.getItem("token");
  if (oldTK) {
    try {
      const data = await axios.post(
        `${server_url}/tag/`,
        { tag },
        { headers: { Authorization: `Bearer ${oldTK}` } }
      );
      localStorage.removeItem("tags");
      return data.data;
    } catch (err) {
      console.log(err);
    }
  } else {
    return { code: "09", msg: "no token" };
  }
};

const updateTag = async (tag, tagId) => {
  const oldTK = localStorage.getItem("token");
  if (oldTK) {
    try {
      const data = await axios.post(
        `${server_url}/tag/update`,
        { tag, tagId },
        { headers: { Authorization: `Bearer ${oldTK}` } }
      );
      localStorage.removeItem("tags");
      return data.data;
    } catch (err) {
      console.log(err);
    }
  } else {
    return { code: "09", msg: "no token" };
  }
};

const getTag = async () => {
  try {
    const cache = localStorage.getItem("tags");
    if (cache) return JSON.parse(cache);
    const oldTK = localStorage.getItem("token");
    const data = await axios.get(`${server_url}/tag/`, {
      headers: { Authorization: `Bearer ${oldTK}` },
    });
    if (data.data.code === "00") {
      const res = data.data.msg;
      localStorage.setItem("tags", JSON.stringify(res));
      return res;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

const changeNoteAction = async (noteId, action, oldAction) => {
  const oldTK = localStorage.getItem("token");
  if (oldTK) {
    try {
      const data = await axios.post(
        `${server_url}/note/action`,
        { noteId, action, oldAction },
        { headers: { Authorization: `Bearer ${oldTK}` } }
      );
      localStorage.removeItem("ACTS");
      return data.data;
    } catch (err) {
      console.log(err);
    }
  } else {
    return { code: "09", msg: "no token" };
  }
};

const getNoteAction = async (act = 1) => {
  try {
    const cache = localStorage.getItem("ACTS");
    if (cache) return JSON.parse(cache);
    const oldTK = localStorage.getItem("token");
    const data = await axios.get(`${server_url}/note/action/${act}`, {
      headers: { Authorization: `Bearer ${oldTK}` },
    });
    if (data.data.code === "00") {
      const res = data.data.msg;
      localStorage.setItem("ACTS", JSON.stringify(res));
      return res;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

const getComments = async (noteId) => {
  try {
    const oldTK = localStorage.getItem("token");
    const data = await axios.get(`${server_url}/cmt/${noteId}`, {
      headers: { Authorization: `Bearer ${oldTK}` },
    });
    if (data.data.code === "00") {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

window.onscroll = function () {
  scrollFunction();
};

const scrollFunction = () => {
  const topBtn = document.getElementById("top-btn");
  const downBtn = document.getElementById("down-btn");

  if (topBtn && downBtn) {
    if (window.innerWidth < 1000) {
      topBtn.style.display = "none";
      downBtn.style.display = "none";
    } else {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        topBtn.style.display = "block";
        downBtn.style.display = "none";
      } else {
        topBtn.style.display = "none";
        downBtn.style.display = "block";
      }
    }
  }
};

const goToTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

const goToDown = () => {
  window.scrollTo(0, document.body.scrollHeight);
};

const createComment = async (comment) => {
  const oldTK = localStorage.getItem("token");
  if (oldTK) {
    try {
      const data = await axios.post(
        `${server_url}/cmt/`,
        { ...comment },
        { headers: { Authorization: `Bearer ${oldTK}` } }
      );
      return data.data;
    } catch (err) {
      console.log(err);
    }
  } else {
    return { code: "09", msg: "no token" };
  }
};

const uploadAudio = async (id) => {
  const formData = new FormData();
  const files = document.getElementById("txt-audio");
  formData.append("audio", files.files[0]);
  const oldTK = localStorage.getItem("token");
  axios.post(`${server_url}/note/upload/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${oldTK}`,
    },
  });
};

const redirect = (uri) => {
  window.location.href = uri ? uri : "/";
};

const NOT_FOUND = "404 NOT FOUND";

const addMangerNav = (username) => {
  const nav = document.getElementById("nav");
  nav.innerHTML =
    nav.innerHTML + `<li><a href="/note.manager.html">${username}</a></li>`;
};

const getPageInfo = (countNote, currentPage) =>
  `<p>All: ${countNote} - Page: ${currentPage}/${Math.ceil(
    countNote / perPage
  )}</p>`;

const getAdminRandomNote = async () => {
  try {
    const oldTK = localStorage.getItem("token");
    const uri = `${server_url}/note/random-ad`;
    const data = await axios.get(uri, {
      headers: { Authorization: `Bearer ${oldTK}` },
    });
    if (data.data.code === "00") {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

const getRandomNote = async () => {
  try {
    const uri = `${server_url}/note/random`;
    const data = await axios.get(uri);
    if (data.data.code === "00") {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};