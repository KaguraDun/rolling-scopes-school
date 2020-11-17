(self.webpackChunkwebpack_boilerplate=self.webpackChunkwebpack_boilerplate||[]).push([[179],{259:(e,t,n)=>{"use strict";var r=n(379),o=n.n(r),a=n(900);o()(a.Z,{insert:"head",singleton:!1}),a.Z.locals;var s={properties:{fieldSize:4,timer:0,numberOfMoves:0,enableSound:!1},elements:{gameContainer:null,gameField:null,completeBanner:null,completeMessageTextEl:null,timer:null,timerTextEl:null,numberOfMovesTextEl:null,currentDroppable:null}};function i(e){return+e<10?"0".concat(e):e}function c(e,t,n,r){var o=document.createElement(e);return o.classList.add(t),r&&(o.textContent=r),n.append(o),o}function l(){s.elements.timer=setInterval((function(){s.properties.timer+=1;var e=Math.floor(s.properties.timer/60),t=s.properties.timer-60*e;s.elements.timerTextEl.textContent="".concat(i(e),":").concat(i(t))}),1e3)}function u(){clearInterval(s.elements.timer)}function d(e){for(var t=e.length-1;t>=0;t-=1){var n=Math.floor(Math.random()*t+1),r=e[t];e[t]=e[n],e[n]=r}}function m(e){for(var t=0,n=0;n<e.length;n+=1)for(var r=n;r<e.length;r+=1)e[n]>e[r]&&(t+=1);return!!(t%2)}function f(){for(var e=s.properties.fieldSize*s.properties.fieldSize,t=[],n=!1,r=1;r<e;r+=1)t.push(r);for(;!0!==n;)d(t),m(t)&&(n=!0);return t}function p(e,t,n){var r="3.25em",o=e.dataset.row,a=e.dataset.col,i=t.dataset.row,c=t.dataset.col,l=e.previousSibling,u=t.previousSibling,d=e.dataset.position;if(l.after(t),u.after(e),e.dataset.position=t.dataset.position,t.dataset.position=d,e.dataset.row=i,e.dataset.col=c,t.dataset.row=o,t.dataset.col=a,s.properties.enableSound){var m=new Audio;m.src="assets/audio/swap-sound.mp3",m.play()}switch(n){case"up":e.style.transform="translateY(".concat(r,")");break;case"bottom":e.style.transform="translateY(-".concat(r,")");break;case"left":e.style.transform="translateX(".concat(r,")");break;case"right":e.style.transform="translateX(-".concat(r,")")}setTimeout((function(){requestAnimationFrame((function(){e.style.transform="none",e.style.removeProperty("transform")}))}),10)}function v(){var e=s.properties,t=e.timer,n=e.numberOfMoves,r=e.fieldSize,o=Math.floor(t/60),a=t-60*o,c="".concat(i(o),":").concat(i(a)),l=new Date,d="Ура! Вы решили головоломку ".concat(r,"*").concat(r)+"<br>"+" за ".concat(c," и ").concat(n," ходов");s.elements.completeMessageTextEl.innerHTML=d,u();var m=function(e,t,n,r){return{timestamp:e,gameTime:t,numberOfMoves:n,fieldSize:r}};if(localStorage.getItem("bestResults")){var f=JSON.parse(localStorage.getItem("bestResults"));f.sort((function(e,t){return e.numberOfMoves-t.numberOfMoves})),f.sort((function(e,t){return t.fieldSize-e.fieldSize})),f.length<10||f.pop(),f.unshift(m(l,c,n,r)),f.sort((function(e,t){return e.numberOfMoves-t.numberOfMoves})),f.sort((function(e,t){return t.fieldSize-e.fieldSize})),localStorage.setItem("bestResults",JSON.stringify(f))}else localStorage.setItem("bestResults",JSON.stringify([m(l,c,n,r)]))}function b(e){var t=Number(e.dataset.row),n=Number(e.dataset.col);return{up:document.querySelector('[data-row="'.concat(t-1,'"][data-col="').concat(n,'"]')),bottom:document.querySelector('[data-row="'.concat(t+1,'"][data-col="').concat(n,'"]')),left:document.querySelector('[data-row="'.concat(t,'"][data-col="').concat(n-1,'"]')),right:document.querySelector('[data-row="'.concat(t,'"][data-col="').concat(n+1,'"]'))}}function g(e){var t=b(e.target);Object.keys(t).forEach((function(n){t[n]&&"0"===t[n].id&&(p(e.target,t[n],n),s.properties.numberOfMoves+=1,s.elements.numberOfMovesTextEl.textContent=s.properties.numberOfMoves,function(){for(var e=0,t=1;t<s.elements.gameField.childNodes.length-1;t+=1)s.elements.gameField.childNodes[t].id===t&&(e+=1);return e===s.elements.gameField.childNodes.length-2}()&&v())}))}function h(e,t,n,r){var o=n%r,a=o?-3.25*(o-1):-3.25*(r-1),s=Math.ceil(n/r),i=s?-3.25*(s-1):-3.25*(r-1);e.style.background="url(".concat(t,")"),e.style.backgroundPosition="left ".concat(a,"em top ").concat(i,"em"),e.style.backgroundSize="".concat(3.25*r,"em ").concat(3.25*r,"em")}function y(e){e.preventDefault();var t=document.querySelector(".--selected"),n=e.target,r=document.getElementById("0"),o=b(r),a=!1;Object.keys(o).forEach((function(e){t===o[e]&&(a=t!==n&&"0"===n.id)})),a&&p(t,r)}function S(e){var t=s.properties.fieldSize*s.properties.fieldSize,n=Math.floor(150*Math.random()+1),r="assets/images/box/".concat(n,".jpg");s.elements.gameField.style.fontSize={3:"60px",4:"45px",5:"36px",6:"30px",7:"25.7px",8:"22.5px"}[s.properties.fieldSize],c("div","game__field-item--null",s.elements.gameField);for(var o=0;o<=t-1;o+=1){var a="";o===t-1?(a=c("div","game__field-item",s.elements.gameField,0)).id=0:((a=c("div","game__field-item",s.elements.gameField,e[o])).id=e[o],h(a,r,e[o],s.properties.fieldSize)),a.dataset.row=Math.ceil((o+1)/s.properties.fieldSize);var i=(o+1)%s.properties.fieldSize;a.dataset.col=0===i?s.properties.fieldSize:i,a.dataset.position=o,a.draggable=!0,a.addEventListener("click",g),a.addEventListener("dragstart",(function(e){requestAnimationFrame((function(){e.target.classList.add("--selected")}))})),a.addEventListener("dragend",(function(e){e.srcElement.classList.remove("--selected"),s.properties.numberOfMoves+=1,s.elements.numberOfMovesTextEl.textContent=s.properties.numberOfMoves})),a.addEventListener("dragover",y)}}function _(){s.properties.timer=0,s.properties.numberOfMoves=0,s.elements.timerTextEl.textContent="00 : 00",s.elements.numberOfMovesTextEl.textContent=0,s.elements.gameField.innerHTML="",s.elements.completeBanner.classList.add("--display-none"),s.properties.fieldSize=document.querySelector(".select").value,S(f()),u(),l()}function M(e){var t=c("button","button",e,"Новая игра");return t.addEventListener("click",_),t}var w=c("div","wrapper",document.body);s.elements.gameContainer=c("div","game",w);var x,E=c("div","game__buttons-wrapper",s.elements.gameContainer);c("button","button",x=E,"Лучшие результаты").addEventListener("click",(function(){(function(e){var t=document.querySelector(".best-results__wrapper"),n=document.querySelector(".best-results__content"),r=document.querySelector(".best-results__table");t?r.remove():(t=c("div","best-results__wrapper",e),n=c("div","best-results__content",t),t.classList.add("--display-none"));var o=c("table","best-results__table",n);r=c("tr","best-results__table-row",o),["№","Дата","Время игры","Число ходов","Размер игры"].forEach((function(e){c("th","best-results__table-header",r,e)}));for(var a=JSON.parse(localStorage.getItem("bestResults")),s=0;s<10;s+=1)if(a&&a[s]){r=c("tr","best-results__table-row",o);var i=new Date(a[s].timestamp),l="".concat(i.getDate(),".").concat(i.getMonth()+1,".").concat(i.getFullYear()," ").concat(i.getHours(),":").concat(i.getMinutes());c("td","best-results__table-cell",r,s+1),c("td","best-results__table-cell",r,l),c("td","best-results__table-cell",r,a[s].gameTime),c("td","best-results__table-cell",r,String(a[s].numberOfMoves)),c("td","best-results__table-cell",r,"".concat(a[s].fieldSize," х ").concat(a[s].fieldSize))}return t})(x).classList.toggle("--display-none")})),M(E),function(e){var t=c("select","select",e);[3,4,5,6,7,8].forEach((function(e){c("option","select__option",t,"".concat(e,"x").concat(e)).value=e})),t[1].setAttribute("selected",!0)}(E),function(e){c("button","button",e,"Решить в один клик!").addEventListener("click",(function(){s.elements.completeBanner.classList.toggle("--display-none"),v()}))}(E),function(e){var t=c("button","button",e,"Звук выкл");t.addEventListener("click",(function(){s.properties.enableSound=!s.properties.enableSound,s.properties.enableSound?t.textContent="Звук вкл":t.textContent="Звук выкл"}))}(E);var O=c("div","game__header",s.elements.gameContainer);s.elements.timerTextEl=c("span","game__time",O,"00:00"),s.elements.numberOfMovesTextEl=c("span","game__number-of-moves",O,"0"),s.elements.gameField=c("div","game__field",s.elements.gameContainer),S(f()),function(){s.elements.completeBanner=c("div","game__complete-wrapper",s.elements.gameContainer);var e=c("div","game__complete-banner",s.elements.completeBanner);s.elements.completeMessageTextEl=c("div","game__complete-message",e),M(e).classList.add("button--new-game"),s.elements.completeBanner.classList.add("--display-none")}(),l()},900:(e,t,n)=>{"use strict";n.d(t,{Z:()=>i});var r=n(15),o=n.n(r),a=n(645),s=n.n(a)()(o());s.push([e.id,"","",{version:3,sources:[],names:[],mappings:"",sourceRoot:""}]);const i=s},645:e=>{"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=e(t);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,r){"string"==typeof e&&(e=[[null,e,""]]);var o={};if(r)for(var a=0;a<this.length;a++){var s=this[a][0];null!=s&&(o[s]=!0)}for(var i=0;i<e.length;i++){var c=[].concat(e[i]);r&&o[c[0]]||(n&&(c[2]?c[2]="".concat(n," and ").concat(c[2]):c[2]=n),t.push(c))}},t}},15:e=>{"use strict";function t(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}e.exports=function(e){var n,r,o=(r=4,function(e){if(Array.isArray(e))return e}(n=e)||function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,o=!1,a=void 0;try{for(var s,i=e[Symbol.iterator]();!(r=(s=i.next()).done)&&(n.push(s.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==i.return||i.return()}finally{if(o)throw a}}return n}}(n,r)||function(e,n){if(e){if("string"==typeof e)return t(e,n);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?t(e,n):void 0}}(n,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),a=o[1],s=o[3];if("function"==typeof btoa){var i=btoa(unescape(encodeURIComponent(JSON.stringify(s)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(i),l="/*# ".concat(c," */"),u=s.sources.map((function(e){return"/*# sourceURL=".concat(s.sourceRoot||"").concat(e," */")}));return[a].concat(u).concat([l]).join("\n")}return[a].join("\n")}},379:(e,t,n)=>{"use strict";var r,o=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),a=[];function s(e){for(var t=-1,n=0;n<a.length;n++)if(a[n].identifier===e){t=n;break}return t}function i(e,t){for(var n={},r=[],o=0;o<e.length;o++){var i=e[o],c=t.base?i[0]+t.base:i[0],l=n[c]||0,u="".concat(c," ").concat(l);n[c]=l+1;var d=s(u),m={css:i[1],media:i[2],sourceMap:i[3]};-1!==d?(a[d].references++,a[d].updater(m)):a.push({identifier:u,updater:v(m,t),references:1}),r.push(u)}return r}function c(e){var t=document.createElement("style"),r=e.attributes||{};if(void 0===r.nonce){var a=n.nc;a&&(r.nonce=a)}if(Object.keys(r).forEach((function(e){t.setAttribute(e,r[e])})),"function"==typeof e.insert)e.insert(t);else{var s=o(e.insert||"head");if(!s)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");s.appendChild(t)}return t}var l,u=(l=[],function(e,t){return l[e]=t,l.filter(Boolean).join("\n")});function d(e,t,n,r){var o=n?"":r.media?"@media ".concat(r.media," {").concat(r.css,"}"):r.css;if(e.styleSheet)e.styleSheet.cssText=u(t,o);else{var a=document.createTextNode(o),s=e.childNodes;s[t]&&e.removeChild(s[t]),s.length?e.insertBefore(a,s[t]):e.appendChild(a)}}function m(e,t,n){var r=n.css,o=n.media,a=n.sourceMap;if(o?e.setAttribute("media",o):e.removeAttribute("media"),a&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}var f=null,p=0;function v(e,t){var n,r,o;if(t.singleton){var a=p++;n=f||(f=c(t)),r=d.bind(null,n,a,!1),o=d.bind(null,n,a,!0)}else n=c(t),r=m.bind(null,n,t),o=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r));var n=i(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var r=0;r<n.length;r++){var o=s(n[r]);a[o].references--}for(var c=i(e,t),l=0;l<n.length;l++){var u=s(n[l]);0===a[u].references&&(a[u].updater(),a.splice(u,1))}n=c}}}}},0,[[259,666]]]);