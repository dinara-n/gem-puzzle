(()=>{"use strict";var e={};e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),(()=>{var t;e.g.importScripts&&(t=e.g.location+"");var n=e.g.document;if(!t&&n&&(n.currentScript&&(t=n.currentScript.src),!t)){var o=n.getElementsByTagName("script");o.length&&(t=o[o.length-1].src)}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),e.p=t})();class t{constructor(e,n,o){this.gameBoard=e,this.rowLength=n,this.boardLength=this.rowLength**2,this.boardSize=this.getBoardSize(),this.gapSize=o,this.tileSize=this.getTileSize(),this.aimArray=t.getAimArray(this.boardLength),this.array=t.getShuffledArray(this.aimArray),this.tilesCoords=this.getTilesCoords(),this.zeroIndex=this.getZeroIndex(),this.movesNumber=0,this.areTilesSwapping=!1,this.tileToSwapIndex=null,this.tileTargetIndex=null,this.movingTilePrevCoords=null,this.movingTileNewCoords=null,this.tileMovingIndex=null}static getAimArray(e){const t=[];for(let n=0;n<e-1;n+=1)t.push(n+1);return t.push(0),t}static getShuffledArray(e){const n=Array.from(e);do{for(let e=n.length-1;e>0;e-=1){const t=Math.floor(Math.random()*(e+1));[n[e],n[t]]=[n[t],n[e]]}}while(!t.isSolvable(n));return n}static isSolvable(e){const t=Math.sqrt(e.length);let n=0;for(let t=0;t<e.length-1;t+=1)for(let o=t+1;o<e.length;o+=1)0!==e[t]&&0!==e[o]&&e[t]>e[o]&&(n+=1);return t%2?n%2==0:(n+=Math.trunc(e.indexOf(0)/t),n%2!=0)}getZeroIndex(){let e=null;return this.array.forEach(((t,n)=>{0===t&&(e=n)})),e}getBoardSize(){return parseInt(window.getComputedStyle(this.gameBoard).getPropertyValue("width"),10)}getTileSize(){return Math.floor((this.boardSize-this.gapSize*(this.rowLength+1))/this.rowLength)}getTilesCoords(){const e=[];return this.array.forEach(((t,n)=>{const o=n%this.rowLength,a=this.gapSize+o*(this.tileSize+this.gapSize),i=a+this.tileSize,r=Math.trunc(n/this.rowLength),s=this.gapSize+r*(this.tileSize+this.gapSize),l=s+this.tileSize;e.push({xStart:a,xEnd:i,yStart:s,yEnd:l})})),e}swapTiles(e){const t=[e-1,e+1,e-this.rowLength,e+this.rowLength];void 0!==this.array[e]&&t.forEach((t=>{const n=Math.trunc(e/this.rowLength)===Math.trunc(t/this.rowLength),o=e%this.rowLength==t%this.rowLength;(n||o)&&void 0!==this.array[t]&&0===this.array[t]&&(this.areTilesSwapping=!0,this.tileToSwapIndex=e,this.tileTargetIndex=t,this.movingTilePrevCoords={...this.tilesCoords[e]},this.movingTileNewCoords={...this.tilesCoords[t]},[this.array[e],this.array[t]]=[this.array[t],this.array[e]],this.movesNumber+=1)}))}canTileMove(e){const t=[e-1,e+1,e-this.rowLength,e+this.rowLength];for(let n of t){const t=Math.trunc(e/this.rowLength)===Math.trunc(n/this.rowLength),o=e%this.rowLength==n%this.rowLength;if((t||o)&&void 0!==this.array[n]&&0===this.array[n])return!0}return!1}recalculateStats(){this.boardSize=this.getBoardSize(),this.tileSize=this.getTileSize(),this.tilesCoords=this.getTilesCoords()}isSolved(){for(let e=0;e<this.boardLength;e+=1)if(this.array[e]!==this.aimArray[e])return!1;return!0}}const n=t,o=(e.p,e.p,e.p,new Audio("./assets/click.mp3"));o.volume=.2,o.muted=!0;const a="rgb(255, 255, 255)",i="rgb(247, 205, 9)";document.addEventListener("DOMContentLoaded",(()=>{function e(e){const t=document.createElement(e.tag);return Object.keys(e).forEach((n=>{switch(n){case"tag":case"parent":break;case"classList":e[n].forEach((e=>t.classList.add(e)));break;default:t[n]=e[n]}})),e.parent.append(t),t}const t=e({tag:"main",parent:document.body,classList:["main-container"]}),r=e({tag:"section",parent:t,classList:["game-controls"]}),s=e({tag:"select",parent:r,classList:["game-controls__size"],name:"board-size"});for(let t=3;t<=8;t+=1)e({tag:"option",parent:s,classList:["game-controls__size-select"],textContent:`${t} x ${t}`,value:t});s.value=4;const l=e({tag:"button",parent:r,classList:["game-controls__btn","game-controls__btn--new"],textContent:"New Game"}),d=e({tag:"button",parent:r,classList:["game-controls__btn","game-controls__btn--save"],textContent:"Save"}),c=e({tag:"button",parent:r,classList:["game-controls__btn","game-controls__btn--saved"],textContent:"Saved Game"}),g=e({tag:"button",parent:r,classList:["game-controls__btn","game-controls__btn--records"],textContent:"Records"}),m=e({tag:"button",parent:r,ariaLabel:"Turn sound on or off",classList:["game-controls__btn","game-controls__btn--sound"]}),h=e({tag:"section",parent:t,classList:["game-info"]}),u=e({tag:"p",parent:h,classList:["game-info__time"]}),v=e({tag:"span",parent:u,classList:["game-info__timer"],textContent:"0:0"}),w=e({tag:"p",parent:h,classList:["game-info__moves"],textContent:"Moves: "}),p=e({tag:"span",parent:w,classList:["game-info__moves-number"],textContent:"0"}),x=e({tag:"section",parent:t,classList:["gameboard-wrapper"]}),S=e({tag:"canvas",parent:x,classList:["gameboard"],textContent:"Sorry! It seems your browser does not support HTML Canvas. Please try another browser."}),y=S.getContext("2d");y.canvas.width=500,y.canvas.height=500,window.matchMedia("(max-width: 519px)").matches&&(y.canvas.width=300,y.canvas.height=300);const L=e({tag:"canvas",parent:document.body,classList:["page-background"],height:window.innerHeight,width:window.innerWidth});window.addEventListener("resize",(()=>{y.canvas.width=window.innerWidth<520?300:500,y.canvas.height=window.innerWidth<520?300:500,N.recalculateStats(),F()}));let C=null,T=Math.trunc(Date.now()/1e3),b=0,f=!1;function z(){const e=Math.trunc(Date.now()/1e3)-T;let t=Math.trunc(e/60);t=t>9?t:`0${t}`;let n=e%60;n=n>9?n:`0${n}`,v.textContent=`${t} : ${n}`}function E(){T=Math.trunc(Date.now()/1e3),C=setInterval(z,100),f=!1}function _(){clearInterval(C),f=!0}function M(e=null){if(e)return T=Math.trunc(Date.now()/1e3)-e,C=setInterval(z,100),void(f=!1);f||(T=Math.trunc(Date.now()/1e3)-b,C=setInterval(z,100))}E();const I=JSON.parse(localStorage.getItem("gemPuzzleByDinaraN_gameSettings"))||{};I.sound&&(o.muted=!1,m.classList.add("sound-on"));let N=new n(S,+s.value,8);const P=(N.tileSize+N.gapSize)/50;let k=0,B=0,D=null,A=null,$=!1,O=!1,R=0,q=0,W=0,H=0,J=!0;function Y(e,t,n){let o=t,{xStart:a,xEnd:r,yStart:s,yEnd:l}={...N.tilesCoords[n]};N.areTilesSwapping&&(e.clearRect(N.movingTilePrevCoords.xStart-2,N.movingTilePrevCoords.yStart-2,N.tileSize+4,N.tileSize+4),o=N.array[N.tileTargetIndex],"right"===D&&N.movingTilePrevCoords.xStart+k>=N.movingTileNewCoords.xStart||"left"===D&&N.movingTilePrevCoords.xStart+k<=N.movingTileNewCoords.xStart?(k=0,D=null,a=N.movingTileNewCoords.xStart,r=N.movingTileNewCoords.xEnd,N.movingTilePrevCoords=null,N.movingTileNewCoords=null,$=!0,N.areTilesSwapping=!1,N.tileToSwapIndex=null,N.tileTargetIndex=null):(k="right"===D?k+P:"left"===D?k-P:k,"right"!==D&&"left"!==D||(N.movingTilePrevCoords.xStart+=k,N.movingTilePrevCoords.xEnd+=k,a=N.movingTilePrevCoords.xStart,r=N.movingTilePrevCoords.xEnd)),"down"===A&&N.movingTilePrevCoords.yStart+B>=N.movingTileNewCoords.yStart||"up"===A&&N.movingTilePrevCoords.yStart+B<=N.movingTileNewCoords.yStart?(B=0,A=null,s=N.movingTileNewCoords.yStart,l=N.movingTileNewCoords.yEnd,N.movingTilePrevCoords=null,N.movingTileNewCoords=null,$=!0,N.areTilesSwapping=!1,N.tileToSwapIndex=null,N.tileTargetIndex=null):(B="down"===A?B+P:"up"===A?B-P:B,"down"!==A&&"up"!==A||(N.movingTilePrevCoords.yStart+=B,N.movingTilePrevCoords.yEnd+=B,s=N.movingTilePrevCoords.yStart,l=N.movingTilePrevCoords.yEnd))),O&&J&&(o=N.array[N.tileMovingIndex],a=R-W,r=a+N.tileSize,s=q-H,l=s+N.tileSize);const d=new Path2D;e.beginPath(),function(e,t,n,o,a,i){e.moveTo(t,o+5),e.quadraticCurveTo(t,o,t+5,o),e.lineTo(n-5,o),e.quadraticCurveTo(n,o,n,o+5),e.lineTo(n,a-5),e.quadraticCurveTo(n,a,n-5,a),e.lineTo(t+5,a),e.quadraticCurveTo(t,a,t,a-5),e.lineTo(t,o+5)}(d,a,r,s,l),e.lineWidth="2",e.strokeStyle=i,e.stroke(d),e.fillStyle=i,e.font=.5*N.tileSize+'px "Audiowide", "Arial", sans-serif',e.textBaseline="middle",e.fillText(o,a+.5*(N.tileSize-e.measureText(o).width),s+.5*N.tileSize),N.areTilesSwapping&&!$&&window.requestAnimationFrame((()=>{Y(e,N.array[N.tileToSwapIndex],N.tileToSwapIndex)})),O&&J&&(J=!1)}function F(){y.clearRect(0,0,S.width,S.height),N.array.forEach(((e,t)=>{e&&t!==N.tileMovingIndex&&Y(y,e,t)})),J=!0}F(),setTimeout((()=>{J=!1,F()}),500),s.addEventListener("change",(()=>{N=new n(S,+s.value,8),F(),N.movesNumber=0,p.textContent=N.movesNumber,_(),E(),d.disabled=!1,S.addEventListener("mousedown",Z)})),l.addEventListener("click",(()=>{N=new n(S,+s.value,8),F(),N.movesNumber=0,p.textContent=N.movesNumber,_(),E(),d.disabled=!1,S.addEventListener("mousedown",Z)})),d.addEventListener("click",(()=>{const e={};e.size=s.value,e.timer=Math.trunc(Date.now()/1e3)-T,e.moves=p.textContent,e.array=N.array.slice(),e.zIndex=N.zIndex,localStorage.setItem("gemPuzzleByDinaraN_gameStats",JSON.stringify(e)),c.disabled=!1})),localStorage.getItem("gemPuzzleByDinaraN_gameStats")||(c.disabled=!0),c.addEventListener("click",(()=>{const e=JSON.parse(localStorage.getItem("gemPuzzleByDinaraN_gameStats"));s.value=e.size,_(),M(e.timer),N=new n(S,+s.value,8),N.array=e.array.slice(),N.zeroIndex=N.getZeroIndex(),N.movesNumber=+e.moves,p.textContent=N.movesNumber,F(),d.disabled=!1,S.addEventListener("mousedown",Z)})),m.addEventListener("click",(()=>{m.classList.contains("sound-on")?(o.muted=!0,m.classList.remove("sound-on")):(o.muted=!1,m.classList.add("sound-on")),I.sound=m.classList.contains("sound-on"),localStorage.setItem("gemPuzzleByDinaraN_gameSettings",JSON.stringify(I))}));const j=JSON.parse(localStorage.getItem("gemPuzzleByDinaraN_gameRecords"))||[];function X(){S.removeEventListener("mousedown",Z),_(),d.disabled=!0,function(){const t=e({tag:"div",parent:document.body,classList:["game-solved-popup"]});e({tag:"h2",parent:t,classList:["game-solved-popup__message"],textContent:`Hooray! You solved the puzzle in ${v.textContent} and ${N.movesNumber} moves!`}),t.addEventListener("click",(()=>{t.remove()})),window.addEventListener("keydown",(e=>{t.remove()}))}(),(j.at(-1)&&N.movesNumber<+j.at(-1).moves||j.length<10)&&function(){const e=v.textContent,t=N.movesNumber;j.push({time:e,moves:t}),j.sort(((e,t)=>e.moves-t.moves)),j.length=j.length>10?10:j.length,localStorage.setItem("gemPuzzleByDinaraN_gameRecords",JSON.stringify(j))}()}function Z(e){console.log("mouse down");const t=S.getBoundingClientRect();R=e.clientX-t.left,q=e.clientY-t.top,S.addEventListener("mousemove",G),S.addEventListener("mouseup",K)}function G(e){if(console.log("mouse move"),e.preventDefault(),S.removeEventListener("mouseup",K),document.body.addEventListener("mouseup",V),O){const t=S.getBoundingClientRect();R=e.clientX-t.left,q=e.clientY-t.top,F(),Y(y,N.array[N.tileMovingIndex],N.tileMovingIndex)}if(!O)for(let e=0;e<N.boardLength;e+=1){const t=N.tilesCoords[e];if(R>=t.xStart&&R<=t.xEnd&&q>=t.yStart&&q<=t.yEnd&&N.canTileMove(e)){W=R-t.xStart,H=q-t.yStart,O=!0,N.tileMovingIndex=e;break}}}function V(){console.log("stop mouse move"),S.removeEventListener("mousemove",G),document.body.removeEventListener("mouseup",V);const e=N.tilesCoords[N.zeroIndex];O&&R>=e.xStart&&R<=e.xEnd&&q>=e.yStart&&q<=e.yEnd&&([N.array[N.tileMovingIndex],N.array[N.zeroIndex]]=[N.array[N.zeroIndex],N.array[N.tileMovingIndex]],N.zeroIndex=N.tileMovingIndex,N.movesNumber+=1,p.textContent=N.movesNumber,o.play(),N.isSolved()&&X()),O=!1,N.tileMovingIndex=null,R=0,q=0,W=0,H=0,J=!1,F()}function K(e){console.log("mouse click"),S.removeEventListener("mousemove",G),S.removeEventListener("mouseup",K),S.removeEventListener("mousedown",Z);const t=S.getBoundingClientRect(),n=e.clientX-t.left,a=e.clientY-t.top;for(let e=0;e<N.boardLength;e+=1){const t=N.tilesCoords[e];if(n>=t.xStart&&n<=t.xEnd&&a>=t.yStart&&a<=t.yEnd){N.swapTiles(e),N.areTilesSwapping&&(o.play(),D=N.movingTileNewCoords.xStart>N.movingTilePrevCoords.xStart?"right":N.movingTileNewCoords.xStart<N.movingTilePrevCoords.xStart?"left":null,A=N.movingTileNewCoords.yStart>N.movingTilePrevCoords.yStart?"down":N.movingTileNewCoords.yStart<N.movingTilePrevCoords.yStart?"up":null,$=!1,window.requestAnimationFrame((()=>{Y(y,N.array[N.tileToSwapIndex],N.tileToSwapIndex)})),N.zeroIndex=e,p.textContent=N.movesNumber);break}}S.addEventListener("mousedown",Z),N.isSolved()&&X()}function Q(){const e=L.getContext("2d");e.clearRect(0,0,window.innerWidth,window.innerHeight),function(){const e=Math.trunc(window.innerWidth*window.innerHeight*.001)+Math.trunc(200*Math.random()),t=[];for(let n=0;n<e;n+=1){const e=Math.trunc(Math.random()*window.innerWidth+1),n=Math.trunc(Math.random()*window.innerHeight+1),o=Number((1.8*Math.random()).toFixed(2));t.push({x:e,y:n,radius:o})}return t}().forEach((t=>{!function(e,t,n,o){e.beginPath(),e.arc(t,n,o,0,2*Math.PI,!0),e.fillStyle=a,e.shadowColor=a,e.shadowBlur=10,e.fill()}(e,t.x,t.y,t.radius)}))}g.addEventListener("click",(()=>{f||(b=Math.trunc(Date.now()/1e3)-T,clearInterval(C));const t=e({tag:"div",parent:document.body,classList:["game-records-popup"]});if(0===j.length)e({tag:"h2",parent:t,classList:["game-records-message"],textContent:"You have not won any games yet!"});else{const n=e({tag:"table",parent:t,classList:["game-records-table"]}),o=e({tag:"tr",parent:n,classList:["game-records-table__header"]});e({tag:"th",parent:o,classList:["game-records-table__header-cell"],textContent:"Place"}),e({tag:"th",parent:o,classList:["game-records-table__header-cell"],textContent:"Time"}),e({tag:"th",parent:o,classList:["game-records-table__header-cell"],textContent:"Moves"}),j.forEach(((t,o)=>{const a=e({tag:"tr",parent:n,classList:["game-records-table__row"]});e({tag:"td",parent:a,classList:["game-records-table__row-cell"],textContent:o+1}),e({tag:"td",parent:a,classList:["game-records-table__row-cell"],textContent:t.time}),e({tag:"td",parent:a,classList:["game-records-table__row-cell"],textContent:t.moves})}))}t.addEventListener("click",(()=>{t.remove(),M()})),window.addEventListener("keydown",(e=>{t.remove(),M()}))})),S.addEventListener("mousedown",Z),Q(),window.matchMedia("(max-width: 469px)").addEventListener("change",(()=>{Q()})),window.matchMedia("(min-width: 470px) and (max-width: 767px)").addEventListener("change",(()=>{Q()})),window.matchMedia("(min-width: 768px) and (max-width: 979px)").addEventListener("change",(()=>{Q()})),window.matchMedia("(min-width: 980px) and (max-width: 1199px)").addEventListener("change",(()=>{Q()})),window.matchMedia("(min-width: 1200px) and (max-width: 1399px)").addEventListener("change",(()=>{Q()})),window.matchMedia("(min-width: 1400px) and (max-width: 1599px)").addEventListener("change",(()=>{Q()})),window.matchMedia("(min-width: 1600px)").addEventListener("change",(()=>{Q()}))}))})();