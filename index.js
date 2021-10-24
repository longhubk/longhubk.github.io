console.log('index.js start');
const server_url = "https://dblogit.herokuapp.com";

const checkIsLogin = async () => {
  const oldTK = localStorage.getItem('token');
  if (oldTK) {
    try {
      const data = await axios.get(`${server_url}/user/profile`, { headers: { Authorization: `Bearer ${oldTK}` } });
      console.log('profile', data);
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
  console.log('cho tao xin may bug loi ra di', oldTK);
  localStorage.removeItem('token');
  // location.reload();
}

const login = (us, pw) => {
  console.log('login by', us, pw);
  axios.post(`${server_url}/user/login`, { username: us, password: pw }).then((data) => {
    console.log('data', JSON.stringify(data));
    const { msg, code } = data.data;
    console.log('msg:', JSON.stringify(msg), 'code: ', code);
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
  console.log('signup by', us, pw, pwa);
  axios.post(`${server_url}/user/signup`, { username: us, password: pw, passwordAgain: pwa }).then((data) => {
    console.log('data', JSON.stringify(data));
    const { msg, code } = data.data;
    console.log('msg:', JSON.stringify(msg), 'code: ', code);
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
  const abc = md.render('# long handsome!');
  console.log(abc);
  // => <h1>Remarkable rulezz!</h1>
  console.log(rawMD);
  const res = md.render(rawMD);
  console.log(res);
  console.log('res', res);
  return res;
}

const getListNote = async () => {
  console.log('getListNote');
  try {
    const data = await axios.get(`${server_url}/note`);
    console.log('data', data);
    if (data.data.code === '00') {
      const res = data.data.msg;
      console.log('res note', data.data.msg.content);
      return res;
    } else {
      console.log('not note');
      return false;
    }
  } catch (err) { console.log(err) };
}

const getNote = async (noteId) => {
  console.log('getNote', noteId);
  try {
    const data = await axios.get(`${server_url}/note/${noteId}`);
    // console.log('data', data);
    if (data.data.code === '00') {
      const res = data.data.msg;
      return res;
    } else {
      console.log('not note');
      return false;
    }
  } catch (err) { console.log(err) };
}

const updateNote = async (noteId, title, content) => {
  const oldTK = localStorage.getItem('token');
  if (oldTK) {
    try {
      const data = await axios.post(`${server_url}/note/update`, { noteId, title, content }, { headers: { Authorization: `Bearer ${oldTK}` } });
      console.log('update res', data);
      if (data.data.code === '00') {
        console.log('update ok', JSON.stringify(data.data.msg));
        return data.data;
      } else {
        console.log('is not login');
        return data.data;
      }
    } catch (err) { console.log('not login') };
  } else {
    console.log('no token');
    return { code: '09', msg: 'no token' };
  }
}