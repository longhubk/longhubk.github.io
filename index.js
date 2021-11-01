// console.log('index.js start');
const server_url = "https://dblogit.herokuapp.com";
//const server_url = "http://localhost:3000";

const checkIsLogin = async () => {
  const oldTK = localStorage.getItem('token');
  if (oldTK) {
    try {
      const data = await axios.get(`${server_url}/user/profile`, { headers: { Authorization: `Bearer ${oldTK}` } });
      // console.log('profile', data);
      if (data.data.code === '00') {
        console.log('is login');
        return data.data.msg.user.username;
      } else {
        console.log('is not login');
        return false;
      }
    } catch (err) { console.log('not login') };
  } else {
    console.log('return now');
    return false;
  }
}

const taoxinmay = () => {
  console.log('abc', 1000);
}

const logout = () => {
  const oldTK = localStorage.getItem('token');
  console.log('logout', oldTK);
  localStorage.removeItem('token');
  location.reload();
}

const login = (us, pw) => {
  // console.log('login by', us, pw);
  axios.post(`${server_url}/user/login`, { username: us, password: pw }).then((data) => {
    // console.log('data', JSON.stringify(data));
    const { msg, code } = data.data;
    // console.log('msg:', JSON.stringify(msg), 'code: ', code);
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
  // console.log('signup by', us, pw, pwa);
  axios.post(`${server_url}/user/signup`, { username: us, password: pw, passwordAgain: pwa }).then((data) => {
    // console.log('data', JSON.stringify(data));
    const { msg, code } = data.data;
    // console.log('msg:', JSON.stringify(msg), 'code: ', code);
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
const getAdminListNote = async (page = 1) => {
  try {
    const oldTK = localStorage.getItem('token') 
    let data = await axios.get(`${server_url}/note/page-ad/${page}`, { headers: { Authorization: `Bearer ${oldTK}` }} );
    if (data.data.code === '00') {
      const res = data.data.msg;
      // console.log('res note', data.data.msg.content);
      return res;
    } else {
      console.log('not note');
      return false;
    }
  } catch (err) { console.log(err) };
}


const getListNote = async (page = 1) => {
  // console.log('getListNote');
  try {
    const data = await axios.get(`${server_url}/note/page/${page}`);
    // console.log('data', data);
    if (data.data.code === '00') {
      const res = data.data.msg;
      // console.log('res note', data.data.msg.content);
      return res;
    } else {
      console.log('not note');
      return false;
    }
  } catch (err) { console.log(err) };
}

const getAdminNote = async (noteId) => {
  // console.log('getNote', noteId);
  try {
    const oldTK = localStorage.getItem('token') 
    const data = await axios.get(`${server_url}/note/one-ad/${noteId}`, { headers: { Authorization: `Bearer ${oldTK}` }});
    if (data.data.code === '00') {
      const res = data.data.msg;
      return res;
    } else {
      console.log('not note');
      return false;
    }
  } catch (err) { console.log(err) };
}

const getNote = async (noteId) => {
  // console.log('getNote', noteId);
  try {
    const data = await axios.get(`${server_url}/note/one/${noteId}`);
    if (data.data.code === '00') {
      const res = data.data.msg;
      return res;
    } else {
      console.log('not note');
      return false;
    }
  } catch (err) { console.log(err) };
}

const getCountNote = async () => {
  // console.log('getNote', noteId);
  try {
    const data = await axios.get(`${server_url}/note/count`);
    if (data.data.code === '00') {
      const res = data.data.msg;
      return res;
    } else {
      console.log('not note');
      return false;
    }
  } catch (err) { console.log(err) };
}

const getAdminCountNote = async () => {
  // console.log('getNote', noteId);
  try {
    const oldTK = localStorage.getItem('token') 
    const data = await axios.get(`${server_url}/note/count-ad`, { headers: { Authorization: `Bearer ${oldTK}` } });
    if (data.data.code === '00') {
      const res = data.data.msg;
      return res;
    } else {
      console.log('not note');
      return false;
    }
  } catch (err) { console.log(err) };
}



const updateNote = async (updateData, oldData) => {
  const oldTK = localStorage.getItem('token') 
  if (oldTK) {
    try {
      const data = await axios.post(`${server_url}/note/update`, {updateData, oldData}, { headers: { Authorization: `Bearer ${oldTK}` } });
      // console.log('update res', data);
      if (data.data.code === '00') {
        console.log('update ok', JSON.stringify(data.data.msg));
        return data.data;
      } else {
        console.log('update fail', JSON.stringify(data.data));
        return data.data;
      }
    } catch (err) { console.log(err) };
  } else {
    console.log('no token');
    return { code: '09', msg: 'no token' };
  }
}

const createNote = async (title, content) => {
  const oldTK = localStorage.getItem('token');
  if (oldTK) {
    try {
      const data = await axios.post(`${server_url}/note/`, { title, content }, { headers: { Authorization: `Bearer ${oldTK}` } });
      // console.log('create res', data);
      if (data.data.code === '00') {
        console.log('create ok', JSON.stringify(data.data.msg));
        return data.data;
      } else {
        console.log('create fail');
        return data.data;
      }
    } catch (err) { console.log(err) };
  } else {
    console.log('no token');
    return { code: '09', msg: 'no token' };
  }
}
