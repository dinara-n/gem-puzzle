(()=>{"use strict";var e={};e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),(()=>{var t;e.g.importScripts&&(t=e.g.location+"");var o=e.g.document;if(!t&&o&&(o.currentScript&&(t=o.currentScript.src),!t)){var n=o.getElementsByTagName("script");n.length&&(t=n[n.length-1].src)}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),e.p=t})();class t{constructor(e,o,n){this.gameBoard=e,this.rowLength=o,this.boardLength=this.rowLength**2,this.boardSize=this.getBoardSize(),this.gapSize=n,this.tileSize=this.getTileSize(),this.aimArray=[];for(let e=0;e<this.boardLength;e+=1)e!==this.boardLength-1?this.aimArray.push(e+1):this.aimArray.push(0);do{this.array=t.getShuffledArray(this.aimArray)}while(!t.isSolvable(this.array));this.tilesCoords=this.getTilesCoords(),this.zeroIndex=this.getZeroIndex(),this.movesNumber=0,this.areTilesSwapping=!1,this.tileToSwap=null,this.tileTarget=null,this.movingTilePrevCoords=null,this.movingTileNewCoords=null,this.tileMovingIndex=null}static getShuffledArray(e){const t=Array.from(e);for(let e=t.length-1;e>0;e-=1){const o=Math.floor(Math.random()*(e+1));[t[e],t[o]]=[t[o],t[e]]}return t}static isSolvable(e){const t=Math.sqrt(e.length);let o=0;for(let t=0;t<e.length-1;t+=1)for(let n=t+1;n<e.length;n+=1)0!==e[t]&&0!==e[n]&&e[t]>e[n]&&(o+=1);return t%2?o%2==0:(o+=Math.trunc(e.indexOf(0)/t),o%2!=0)}getZeroIndex(){let e=null;return this.array.forEach(((t,o)=>{0===t&&(e=o)})),e}getBoardSize(){return parseInt(window.getComputedStyle(this.gameBoard).getPropertyValue("width"),10)}getTileSize(){return Math.floor((this.boardSize-this.gapSize*(this.rowLength+1))/this.rowLength)}getTilesCoords(){const e=[];return this.array.forEach(((t,o)=>{const n=o%this.rowLength,r=this.gapSize+n*(this.tileSize+this.gapSize),i=r+this.tileSize,a=Math.trunc(o/this.rowLength),s=this.gapSize+a*(this.tileSize+this.gapSize),l=s+this.tileSize;e.push({xStart:r,xEnd:i,yStart:s,yEnd:l})})),e}swapTiles(e){const t=[e-1,e+1,e-this.rowLength,e+this.rowLength];void 0!==this.array[e]&&t.forEach((t=>{const o=Math.trunc(e/this.rowLength)===Math.trunc(t/this.rowLength),n=e%this.rowLength==t%this.rowLength;(o||n)&&void 0!==this.array[t]&&0===this.array[t]&&(console.log("!!!!!!!"),this.areTilesSwapping=!0,this.tileToSwap=e,this.tileTarget=t,this.movingTilePrevCoords={...this.tilesCoords[e]},this.movingTileNewCoords={...this.tilesCoords[t]},console.log(this.movingTilePrevCoords,this.movingTileNewCoords),[this.array[e],this.array[t]]=[this.array[t],this.array[e]],this.movesNumber+=1)}))}checkTileCanMove(e){const t=[e-1,e+1,e-this.rowLength,e+this.rowLength];for(let o of t){const t=Math.trunc(e/this.rowLength)===Math.trunc(o/this.rowLength),n=e%this.rowLength==o%this.rowLength;if((t||n)&&void 0!==this.array[o]&&0===this.array[o])return!0}return!1}recalculateStats(){this.boardSize=this.getBoardSize(),this.tileSize=this.getTileSize(),this.tilesCoords=this.getTilesCoords()}isSolved(){for(let e=0;e<this.boardLength;e+=1)if(this.array[e]!==this.aimArray[e])return!1;return!0}}const o=t,n=(e.p,e.p,e.p,new Audio("./assets/tile-move-short.mp3"));n.volume=.3,n.muted=!0,document.addEventListener("DOMContentLoaded",(()=>{function e(e,t="",o=document.body,n=""){const r=document.createElement(e);return r.textContent=t,r.classList.add(n),o.append(r),r}const t=e("main",null,document.body,"main-container"),r=e("section",null,t,"game-controls"),i=e("select",null,r,"game-controls__size");i.name="board-size";for(let t=3;t<=8;t+=1)e("option",`${t} x ${t}`,i,"game-controls__size-select").value=t;i.value=4;const a=e("button","New Game",r,"game-controls__btn");a.classList.add("game-controls__btn--new");const s=e("button","Save",r,"game-controls__btn");s.classList.add("game-controls__btn--save");const l=e("button","Saved Game",r,"game-controls__btn");l.classList.add("game-controls__btn--saved");const d=e("button","Records",r,"game-controls__btn");d.classList.add("game-controls__btn--records");const c=e("button","",r,"game-controls__btn");c.classList.add("game-controls__btn--sound"),c.ariaLabel="Sound";const g=e("section",null,t,"game-info"),m=e("p","",g,"game-info__time"),h=e("span","0:0",m,"game-info__timer"),v=e("p","Moves: ",g,"game-info__moves"),u=e("span","0",v,"game-info__moves-number"),w=e("section",null,t,"gameboard-wrapper"),S=e("canvas","Sorry! It seems your browser does not support HTML Canvas. Please try another browser.",w,"gameboard");S.width=300,S.height=300;const p=e("canvas","",document.body,"page-background");p.width=window.innerWidth,p.height=window.innerHeight;const y=JSON.parse(localStorage.getItem("gemPuzzleByDinaraN_gameSettings"))||{};y.sound&&(n.muted=!1,c.classList.add("sound-on"));const x=JSON.parse(localStorage.getItem("gemPuzzleByDinaraN_gameRecords"))||[];console.log(x);let T=Math.trunc(Date.now()/1e3);function b(){const e=Math.trunc(Date.now()/1e3)-T;let t=Math.trunc(e/60);t=t>9?t:`0${t}`;let o=e%60;o=o>9?o:`0${o}`,h.textContent=`${t} : ${o}`}setInterval(b,100);let C=new o(S,+i.value,8);console.log(C);const f=S.getContext("2d"),L=(C.tileSize+C.gapSize)/50;let z=0,E=0,_=null,M=null,N=!1,I=!1,P=0,k=0,B=0,D=0,A=!0;function $(e,t,o){let n=t,{xStart:r,xEnd:i,yStart:a,yEnd:s}={...C.tilesCoords[o]};C.areTilesSwapping&&(e.clearRect(C.movingTilePrevCoords.xStart-2,C.movingTilePrevCoords.yStart-2,C.tileSize+4,C.tileSize+4),n=C.array[C.tileTarget],"right"===_&&C.movingTilePrevCoords.xStart+z>=C.movingTileNewCoords.xStart||"left"===_&&C.movingTilePrevCoords.xStart+z<=C.movingTileNewCoords.xStart?(z=0,_=null,r=C.movingTileNewCoords.xStart,i=C.movingTileNewCoords.xEnd,C.movingTilePrevCoords=null,C.movingTileNewCoords=null,N=!0,C.areTilesSwapping=!1,C.tileToSwap=null,C.tileTarget=null):(z="right"===_?z+L:"left"===_?z-L:z,"right"!==_&&"left"!==_||(C.movingTilePrevCoords.xStart+=z,C.movingTilePrevCoords.xEnd=C.movingTilePrevCoords.xStart+C.tileSize,r=C.movingTilePrevCoords.xStart,i=r+C.tileSize,a=C.movingTilePrevCoords.yStart,s=C.movingTilePrevCoords.yEnd)),"down"===M&&C.movingTilePrevCoords.yStart+E>=C.movingTileNewCoords.yStart||"up"===M&&C.movingTilePrevCoords.yStart+E<=C.movingTileNewCoords.yStart?(E=0,M=null,a=C.movingTileNewCoords.yStart,s=C.movingTileNewCoords.yEnd,C.movingTilePrevCoords=null,C.movingTileNewCoords=null,N=!0,C.areTilesSwapping=!1,C.tileToSwap=null,C.tileTarget=null):(E="down"===M?E+L:"up"===M?E-L:E,"down"!==M&&"up"!==M||(C.movingTilePrevCoords.yStart+=E,C.movingTilePrevCoords.yEnd=C.movingTilePrevCoords.yStart+C.tileSize,a=C.movingTilePrevCoords.yStart,s=a+C.tileSize,r=C.movingTilePrevCoords.xStart,i=C.movingTilePrevCoords.xEnd))),I&&A&&(n=C.array[C.tileMovingIndex],r=P-B,i=r+C.tileSize,a=k-D,s=a+C.tileSize);const l=new Path2D;e.beginPath(),function(e,t,o,n,r,i){e.moveTo(t,n+5),e.quadraticCurveTo(t,n,t+5,n),e.lineTo(o-5,n),e.quadraticCurveTo(o,n,o,n+5),e.lineTo(o,r-5),e.quadraticCurveTo(o,r,o-5,r),e.lineTo(t+5,r),e.quadraticCurveTo(t,r,t,r-5),e.lineTo(t,n+5)}(l,r,i,a,s),e.lineWidth="2",e.strokeStyle="rgb(247, 205, 9)",e.stroke(l),e.fillStyle="rgb(247, 205, 9)",e.font=.5*C.tileSize+"px Arial",e.textBaseline="middle",e.fillText(n,r+.5*(C.tileSize-e.measureText(n).width),a+.5*C.tileSize),C.areTilesSwapping&&!N&&A&&window.requestAnimationFrame((function(){$(e,C.array[C.tileToSwap],C.tileToSwap)})),I&&A&&(A=!1)}function R(){S.getContext&&(f.clearRect(0,0,S.width,S.height),C.array.forEach(((e,t)=>{e&&t!==C.tileMovingIndex&&$(f,e,t)})),A=!0)}function O(){console.log("Solved!"),clearInterval(b),m.style.color="black",v.style.color="black";const t=e("div",null,document.body,"game-solved-popup");e("h2",`Hooray! You solved the puzzle in ${h.textContent} and ${C.movesNumber} moves!`,t,"game-solved-popup__message"),t.addEventListener("click",(()=>{t.remove()})),window.addEventListener("keydown",(e=>{"Escape"===e.key&&t.remove()}))}function q(){const e=h.textContent,t=C.movesNumber;x.push({time:e,moves:t}),x.sort(((e,t)=>e.moves-t.moves)),x.length=x.length>10?10:x.length,console.log(x),localStorage.setItem("gemPuzzleByDinaraN_gameRecords",JSON.stringify(x))}function H(e){if(console.log("boardDrag"),e.preventDefault(),S.removeEventListener("mouseup",Y),document.body.addEventListener("mouseup",J),I){const t=S.getBoundingClientRect();P=e.clientX-t.left,k=e.clientY-t.top,R(),$(f,C.array[C.tileMovingIndex],C.tileMovingIndex)}if(!I)for(let e=0;e<C.boardLength;e+=1){const t=C.tilesCoords[e];if(P>=t.xStart&&P<=t.xEnd&&k>=t.yStart&&k<=t.yEnd&&C.checkTileCanMove(e)){B=P-t.xStart,D=k-t.yStart,I=!0,console.log(`board.tileMovingIndex: ${C.tileMovingIndex}`),C.tileMovingIndex=e;break}}}function J(){console.log("boardStopDrag"),S.removeEventListener("mousemove",H),document.body.removeEventListener("mouseup",J);const e=C.tilesCoords[C.zeroIndex];I&&P>=e.xStart&&P<=e.xEnd&&k>=e.yStart&&k<=e.yEnd&&(C.tilesCoords,[C.array[C.tileMovingIndex],C.array[C.zeroIndex]]=[C.array[C.zeroIndex],C.array[C.tileMovingIndex]],C.zeroIndex=C.tileMovingIndex,C.movesNumber+=1,u.textContent=C.movesNumber,C.isSolved()&&(S.removeEventListener("mousedown",W),O(),(x.at(-1)&&C.movesNumber<+x.at(-1).moves||x.length<10)&&q())),console.log(C.array),I=!1,C.tileMovingIndex=null,P=0,k=0,B=0,D=0,A=!1,R()}function W(e){console.log("boardMouseDown");const t=S.getBoundingClientRect();P=e.clientX-t.left,k=e.clientY-t.top,S.addEventListener("mousemove",H),S.addEventListener("mouseup",Y)}function Y(e){console.log("boardMouseClick"),S.removeEventListener("mousemove",H),S.removeEventListener("mouseup",Y);const t=S.getBoundingClientRect(),o=e.clientX-t.left,r=e.clientY-t.top;for(let e=0;e<C.boardLength;e+=1){const t=C.tilesCoords[e];if(o>=t.xStart&&o<=t.xEnd&&r>=t.yStart&&r<=t.yEnd){C.swapTiles(e),C.areTilesSwapping&&(n.play(),_=C.movingTileNewCoords.xStart>C.movingTilePrevCoords.xStart?"right":C.movingTileNewCoords.xStart<C.movingTilePrevCoords.xStart?"left":null,M=C.movingTileNewCoords.yStart>C.movingTilePrevCoords.yStart?"down":C.movingTileNewCoords.yStart<C.movingTilePrevCoords.yStart?"up":null,N=!1,window.requestAnimationFrame((function(){$(f,C.array[C.tileToSwap],C.tileToSwap)})),C.zeroIndex=e,u.textContent=C.movesNumber);break}}C.isSolved()&&(S.removeEventListener("mousedown",W),O(),(x.at(-1)&&C.movesNumber<+x.at(-1).moves||x.length<10)&&q())}function F(){const e=Math.trunc(Math.random()*window.innerWidth*window.innerHeight*.001)+30;console.log(`Stars number: ${e}`);const t=[];for(let o=0;o<e;o+=1){const e=Math.trunc(Math.random()*window.innerWidth+1),o=Math.trunc(Math.random()*window.innerHeight+1),n=Number((1.8*Math.random()).toFixed(2));t.push({x:e,y:o,radius:n})}p.getContext&&(p.getContext("2d").clearRect(0,0,window.innerWidth,window.innerHeight),t.forEach((e=>{!function(e,t,o){const n=p.getContext("2d");n.beginPath(),n.arc(e,t,o,0,2*Math.PI,!0),n.fillStyle="white",n.shadowColor="white",n.shadowBlur=10,n.fill()}(e.x,e.y,e.radius)})))}console.log(f),R(),i.addEventListener("change",(()=>{C=new o(S,+i.value,8),R(),C.movesNumber=0,u.textContent=C.movesNumber,console.log(C),clearInterval(b),T=Math.trunc(Date.now()/1e3),setInterval(b,100),m.style.color="white",v.style.color="white",S.addEventListener("mousedown",W)})),a.addEventListener("click",(()=>{C=new o(S,+i.value,8),R(),C.movesNumber=0,u.textContent=C.movesNumber,clearInterval(b),T=Math.trunc(Date.now()/1e3),setInterval(b,100),m.style.color="white",v.style.color="white",S.addEventListener("mousedown",W)})),s.addEventListener("click",(()=>{const e={};e.size=i.value,e.timer=h.textContent,e.moves=u.textContent,e.array=C.array.slice(),e.zIndex=C.zIndex,localStorage.setItem("gemPuzzleByDinaraN_gameStats",JSON.stringify(e))})),l.addEventListener("click",(()=>{const e=JSON.parse(localStorage.getItem("gemPuzzleByDinaraN_gameStats"));i.value=e.size,clearInterval(b);const t=60*+e.timer.split(":")[0]+ +e.timer.split(":")[1];T=Math.trunc(Date.now()/1e3)-t,setInterval(b,100),C=new o(S,+i.value,8),C.array=e.array.slice(),C.zeroIndex=C.getZeroIndex(),C.movesNumber=+e.moves,u.textContent=C.movesNumber,R(),m.style.color="white",v.style.color="white",S.addEventListener("mousedown",W)})),c.addEventListener("click",(()=>{c.classList.contains("sound-on")?(n.muted=!0,c.classList.remove("sound-on")):(n.muted=!1,c.classList.add("sound-on")),y.sound=c.classList.contains("sound-on"),localStorage.setItem("gemPuzzleByDinaraN_gameSettings",JSON.stringify(y))})),d.addEventListener("click",(()=>{clearInterval(b);const t=e("div",null,document.body,"game-records-popup");if(0===x.length)e("h2","You have not won any games yet!",t,"game-records-message");else{const o=e("table",null,t,"game-records-table"),n=e("tr",null,o,"game-records-table__header");e("th","Place",n,"game-records-table__header-cell"),e("th","Time",n,"game-records-table__header-cell"),e("th","Moves",n,"game-records-table__header-cell"),x.forEach(((t,n)=>{const r=e("tr",null,o,"game-records-table__row");e("td",n+1,r,"game-records-table__row-cell"),e("td",t.time,r,"game-records-table__row-cell"),e("td",t.moves,r,"game-records-table__row-cell")}))}t.addEventListener("click",(()=>{t.remove()})),window.addEventListener("keydown",(e=>{"Escape"===e.key&&t.remove()}))})),S.addEventListener("mousedown",W),F(),window.matchMedia("(max-width: 469px)").addEventListener("change",(()=>{F()})),window.matchMedia("(min-width: 470px) and (max-width: 767px)").addEventListener("change",(()=>{F()})),window.matchMedia("(min-width: 768px) and (max-width: 979px)").addEventListener("change",(()=>{F()})),window.matchMedia("(min-width: 980px) and (max-width: 1199px)").addEventListener("change",(()=>{F()})),window.matchMedia("(min-width: 1200px) and (max-width: 1399px)").addEventListener("change",(()=>{F()})),window.matchMedia("(min-width: 1400px) and (max-width: 1599px)").addEventListener("change",(()=>{F()})),window.matchMedia("(min-width: 1600px)").addEventListener("change",(()=>{F()}))}))})();