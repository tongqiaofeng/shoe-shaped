exports.install = function (Vue) {
  // 日期转换
  Vue.prototype.shellDateTwo = function (dates) {
    // console.log(dates);
    if (dates !== '' && dates !== undefined) {
      let date = new Date(dates);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      m = m < 10 ? ('0' + m) : m;
      d = d < 10 ? ('0' + d) : d;
      return y + '-' + m + '-' + d;
    } else {
      return "\"\"";
    }
  };
  Vue.prototype.shellDate = function (date) {
    // console.log(date);

    function add0(m) {
      return m < 10 ? '0' + m : m
    }
    if (date !== '' && date !== undefined) {

      let time = new Date(date);
      console.log(time);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      let h = time.getHours();
      let mm = time.getMinutes();
      let s = time.getSeconds();
      return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    } else {
      return "";
    }
  };
  // 千分价格
  Vue.prototype.formatNumberRgx = function (num) {
    // console.log(num);
    if (num !== null && num !== undefined) {
      let parts = num.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    } else {
      return 0;
    }
  };
  Vue.prototype.formatStringRgx = function (param) {
    // console.log(param);
    let str = param.substring(0, param.length - 9);
    // console.log(str);
    return str;
  };
};