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
    } catch (err) { console.log('not login')};
  } else {
    console.log('return now');
    return false;
  }
}
const logout = () => {
  const oldTK = localStorage.getItem('token');
  console.log('logout', oldTK);
  localStorage.removeItem('token');
  location.reload();
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
  // axios.post(`${server_url}/user/signup`, { username: us, password: pw , passwordAgain: pwa}).then((data) => {
  //   console.log('data', JSON.stringify(data));
  //   const { msg, code } = data.data;
  //   console.log('msg:', JSON.stringify(msg), 'code: ', code);
  //   if (code === '00') {
  //     window.alert('Sign up success');
  //     location.reload();
  //   } else {
  //     window.alert('Sign up fail', msg);
  //   }
  // }).catch((err) => {
  //   window.alert('Sign up fail', err.msg);
  // });
}