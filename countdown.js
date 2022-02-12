var cd;
const setCountdown = (countDownDate, elm) => {
  cd = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    var dt = new Date(countDownDate);

    // Output the result in an element with id="demo"
    elm.innerHTML =
      `<p>Premiere on <b>${dt.toLocaleDateString('vi-VN')}</b> at <b>${dt.toLocaleTimeString('vi-VN')}</b></p><p>Ráng Chờ thêm <b>${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây</b> nữa nhé!<p> Bất ngờ sẽ đến he he... <b><3</b></p>`;

    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(cd);
      // elm.innerHTML = "";
      console.log('EXPIRED');
      window.location.reload();
    }
  }, 1000);
};