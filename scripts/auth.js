const isLogin = async () => {
  const isLogin = await checkIsLogin();
  if (!isLogin) {
    redirect();
    console.log("isLogin false");
  }
  console.log("isLogin true");
  addMangerNav(isLogin);
  return isLogin;
};
