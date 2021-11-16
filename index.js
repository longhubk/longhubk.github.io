const server_url = "https://dblogit.herokuapp.com";
//const server_url = "http://localhost:3000";

const perPage = 10;
const deltaPage = 2;

const getQueryParam = (param) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params[param];
}

const createPageItem = async (countNote, page = 1, resUrl) => {
  let itemPages = "";
  const templateBtn = (numPage, display, isHidden = false) => `<a ${Number(numPage) === Number(page) ? 'id="current-page"' : ''} ${isHidden ? 'class="hidden-page"' : ''} href="${resUrl}?page=${numPage}">${display}</a>`
  let maxPage = 1;
  for (let i = 0; i < countNote; i += perPage) {
    const numPage = +(i > 0 ? (i / perPage) : i) + 1;
    const isHidden = (Number(numPage) > Number(page + deltaPage)) || (Number(numPage) < Number(page - deltaPage));
    itemPages += templateBtn(numPage, numPage, isHidden);
    maxPage = numPage;
  }
  if (page > 1) {
    itemPages = templateBtn(+page - 1, '<') + itemPages;
  }
  if (page < maxPage) {
    itemPages = itemPages + templateBtn(+page + 1, '>') + templateBtn(maxPage, '>>');
  }
  if (page > deltaPage) {
    itemPages = templateBtn(1, '<<') + itemPages;
  }
  return itemPages;
}

const checkIsLogin = async () => {
  const oldTK = localStorage.getItem('token');
  if (oldTK) {
    try {
      const data = await axios.get(`${server_url}/user/profile`, { headers: { Authorization: `Bearer ${oldTK}` } });
      if (data.data.code === '00') {
        return data.data.msg.user.username;
      } else {
        return false;
      }
    } catch (err) { console.log(err) };
  } else {
    return false;
  }
}

const logout = () => {
  const oldTK = localStorage.getItem('token');
  localStorage.removeItem('token');
  location.reload();
}

const login = (us, pw) => {
  axios.post(`${server_url}/user/login`, { username: us, password: pw }).then((data) => {
    const { msg, code } = data.data;
    if (code === '00') {
      window.alert('login success');
      localStorage.setItem('token', msg.token);
      location.reload();
    } else {
      window.alert('login fail', msg);
    }
  }).catch((err) => {
    window.alert('login fail', err.msg);
  });
}

const signup = (us, pw, pwa) => {
  axios.post(`${server_url}/user/signup`, { username: us, password: pw, passwordAgain: pwa }).then((data) => {
    const { msg, code } = data.data;
    if (code === '00') {
      window.alert('Sign up success');
      location.reload();
    } else {
      window.alert('Sign up fail', msg);
    }
  }).catch((err) => {
    window.alert('Sign up fail', err.msg);
  });
}

const renderNote = (rawMD) => {
  let md = new Remarkable({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (err) { }
      }
      try {
        return hljs.highlightAuto(str).value;
      } catch (err) { }
      return ''; // use external default escaping
    }
  });
  const res = md.render(rawMD);
  return res;
}
const getAdminListNote = async (page = 1, keyword = '') => {
  try {
    const oldTK = localStorage.getItem('token')
    let data = await axios.get(`${server_url}/note/page-ad/${page}/${keyword}`, { headers: { Authorization: `Bearer ${oldTK}` } });
    if (data.data.code === '00') {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) { console.log(err) };
}


const getListNote = async (page = 1, keyword = '') => {
  try {
    const data = await axios.get(`${server_url}/note/page/${page}/${keyword}`);
    if (data.data.code === '00') {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) { console.log(err) };
}

const getAdminNote = async (noteId) => {
  try {
    const oldTK = localStorage.getItem('token')
    const data = await axios.get(`${server_url}/note/one-ad/${noteId}`, { headers: { Authorization: `Bearer ${oldTK}` } });
    if (data.data.code === '00') {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) { console.log(err) };
}

const getNote = async (noteId) => {
  try {
    const data = await axios.get(`${server_url}/note/one/${noteId}`);
    if (data.data.code === '00') {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) { console.log(err) };
}

const getCountNote = async (keyword = '') => {
  try {
    const data = await axios.get(`${server_url}/note/count/${keyword}`);
    if (data.data.code === '00') {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) { console.log(err) };
}

const getAdminCountNote = async (keyword = '') => {
  try {
    const oldTK = localStorage.getItem('token')
    const data = await axios.get(`${server_url}/note/count-ad/${keyword}`, { headers: { Authorization: `Bearer ${oldTK}` } });
    if (data.data.code === '00') {
      const res = data.data.msg;
      return res;
    } else {
      return false;
    }
  } catch (err) { console.log(err) };
}



const updateNote = async (updateData, oldData) => {
  const oldTK = localStorage.getItem('token')
  if (oldTK) {
    try {
      const data = await axios.post(`${server_url}/note/update`, { updateData, oldData }, { headers: { Authorization: `Bearer ${oldTK}` } });
      // if (data.data.code === '00') {
        return data.data;
      // } else {
        // return data.data;
      // }
    } catch (err) { console.log(err) };
  } else {
    return { code: '09', msg: 'no token' };
  }
}

const createNote = async (title, content, state = 0) => {
  const oldTK = localStorage.getItem('token');
  if (oldTK) {
    try {
      const data = await axios.post(`${server_url}/note/`, { title, content, state }, { headers: { Authorization: `Bearer ${oldTK}` } });
      // if (data.data.code === '00') {
      //   return data.data;
      // } else {
      return data.data;
      // }
    } catch (err) { console.log(err) };
  } else {
    return { code: '09', msg: 'no token' };
  }
}
