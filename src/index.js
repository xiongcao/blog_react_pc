import { cube } from './math.js';
import './index.css'
import Icon from './icon.png';


function component() {
  let element = document.createElement('div');

  // lodash（目前通过一个 script 引入）对于执行这一行是必需的

  // 将图像添加到我们已经存在的 div 中。
  var myIcon = new Image();
  myIcon.src = Icon;

  element.innerHTML = [
    'Hello webpack!',
    '5 cubed is equal to ' + cube(5)
  ].join('\n\n');

  element.appendChild(myIcon);

  return element;
}

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js').then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   });
// }

document.body.appendChild(component());