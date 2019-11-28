var width = document.documentElement.clientWidth;   // 屏幕的布局视口宽度
var rem = width / 7.5;   
document.getElementsByTagName('html')[0].style.fontSize=rem+'px';

const BASE_URL='http://www.pinda.com'


function goRouter(url) {
    window.location.href=BASE_URL+url
}