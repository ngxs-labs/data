function _defineProperties(n,l){for(var t=0;t<l.length;t++){var u=l[t];u.enumerable=u.enumerable||!1,u.configurable=!0,"value"in u&&(u.writable=!0),Object.defineProperty(n,u.key,u)}}function _createClass(n,l,t){return l&&_defineProperties(n.prototype,l),t&&_defineProperties(n,t),n}function _possibleConstructorReturn(n,l){return!l||"object"!=typeof l&&"function"!=typeof l?_assertThisInitialized(n):l}function _assertThisInitialized(n){if(void 0===n)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function _getPrototypeOf(n){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(n){return n.__proto__||Object.getPrototypeOf(n)})(n)}function _inherits(n,l){if("function"!=typeof l&&null!==l)throw new TypeError("Super expression must either be null or a function");n.prototype=Object.create(l&&l.prototype,{constructor:{value:n,writable:!0,configurable:!0}}),l&&_setPrototypeOf(n,l)}function _setPrototypeOf(n,l){return(_setPrototypeOf=Object.setPrototypeOf||function(n,l){return n.__proto__=l,n})(n,l)}function _classCallCheck(n,l){if(!(n instanceof l))throw new TypeError("Cannot call a class as a function")}(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{cY3I:function(n,l,t){"use strict";t.r(l);var u,e,r=t("8Y7J"),o=function n(){_classCallCheck(this,n)},c=t("pMnS"),b=t("SVse"),i=t("s7LF"),s=t("mrSG"),a=t("qERi"),p=t("8nyR"),f=t("e1JD"),g=t("lJxs"),d=[{path:"count.countSub.val",existingEngine:sessionStorage}],m=(u=function n(){_classCallCheck(this,n)},u=Object(s.a)([Object(a.a)(d),Object(a.b)(),Object(f.e)({name:"countSub",defaults:{val:100}})],u)),y=new f.g("count"),O=(e=function(n){function l(){var n;return _classCallCheck(this,l),(n=_possibleConstructorReturn(this,_getPrototypeOf(l).apply(this,arguments))).values$=n.state$.pipe(Object(g.a)((function(n){return n.countSub}))),n}return _inherits(l,n),_createClass(l,[{key:"increment",value:function(){this.ctx.setState((function(n){return Object.assign(Object.assign({},n),{val:n.val+1})}))}},{key:"countSubIncrement",value:function(){this.ctx.setState((function(n){return Object.assign(Object.assign({},n),{countSub:{val:n.countSub.val+1}})}))}},{key:"decrement",value:function(){this.setState((function(n){return Object.assign(Object.assign({},n),{val:n.val-1})}))}},{key:"setValueFromInput",value:function(n){this.ctx.setState((function(l){return Object.assign(Object.assign({},l),{val:parseFloat(n)||0})}))}}]),l}(p.a),Object(s.a)([Object(a.c)(),Object(s.b)("design:type",Function),Object(s.b)("design:paramtypes",[]),Object(s.b)("design:returntype",void 0)],e.prototype,"increment",null),Object(s.a)([Object(a.c)(),Object(s.b)("design:type",Function),Object(s.b)("design:paramtypes",[]),Object(s.b)("design:returntype",void 0)],e.prototype,"countSubIncrement",null),Object(s.a)([Object(a.c)(),Object(s.b)("design:type",Function),Object(s.b)("design:paramtypes",[]),Object(s.b)("design:returntype",void 0)],e.prototype,"decrement",null),Object(s.a)([Object(a.c)({async:!0,debounce:300}),Object(s.b)("design:type",Function),Object(s.b)("design:paramtypes",[Object]),Object(s.b)("design:returntype",void 0)],e.prototype,"setValueFromInput",null),e=Object(s.a)([Object(a.b)(),Object(f.e)({name:y,defaults:{val:0},children:[m]})],e)),h=function n(l){_classCallCheck(this,n),this.counter=l},j=r.pb({encapsulation:2,styles:[],data:{}});function v(n){return r.Ib(2,[(n()(),r.rb(0,0,null,null,1,"a",[["href","https://stackblitz.com/github/ngxs-labs/data?file=integration%2Fapp%2Fexamples%2Fcount%2Fcount.state.ts"],["target","_blank"]],null,null,null,null,null)),(n()(),r.rb(1,0,null,null,0,"img",[["alt","stackblitz"],["class","stackblitz"],["src","https://habrastorage.org/webt/ma/me/jm/mamejmzzxqu5pfn6rfieay6oisi.png"]],null,null,null,null,null)),(n()(),r.rb(2,0,null,null,1,"h3",[],null,null,null,null,null)),(n()(),r.Gb(-1,null,["CountState"])),(n()(),r.Gb(-1,null,[" PS: CountSubState will be persistence in sessionStorage "])),(n()(),r.rb(5,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),r.rb(6,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),r.rb(7,0,null,null,1,"b",[["class","title"]],null,null,null,null,null)),(n()(),r.Gb(-1,null,["Selection:"])),(n()(),r.rb(9,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),r.Gb(10,null,[" counter.state$ = ","\n"])),r.Db(131072,b.b,[r.i]),r.Db(0,b.f,[]),(n()(),r.rb(13,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),r.rb(14,0,null,null,3,"span",[],null,null,null,null,null)),(n()(),r.Gb(15,null,[" counter.values$ = "," "])),r.Db(131072,b.b,[r.i]),r.Db(0,b.f,[]),(n()(),r.rb(18,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),r.rb(19,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),r.rb(20,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),r.rb(21,0,null,null,1,"b",[["class","title"]],null,null,null,null,null)),(n()(),r.Gb(-1,null,["Actions:"])),(n()(),r.rb(23,0,null,null,1,"button",[],null,[[null,"click"]],(function(n,l,t){var u=!0;return"click"===l&&(u=!1!==n.component.counter.increment()&&u),u}),null,null)),(n()(),r.Gb(-1,null,[" increment\n"])),(n()(),r.rb(25,0,null,null,1,"button",[],null,[[null,"click"]],(function(n,l,t){var u=!0;return"click"===l&&(u=!1!==n.component.counter.countSubIncrement()&&u),u}),null,null)),(n()(),r.Gb(-1,null,[" countSubIncrement\n"])),(n()(),r.rb(27,0,null,null,1,"button",[],null,[[null,"click"]],(function(n,l,t){var u=!0;return"click"===l&&(u=!1!==n.component.counter.decrement()&&u),u}),null,null)),(n()(),r.Gb(-1,null,["decrement"])),(n()(),r.rb(29,0,null,null,1,"button",[],null,[[null,"click"]],(function(n,l,t){var u=!0;return"click"===l&&(u=!1!==n.component.counter.reset()&&u),u}),null,null)),(n()(),r.Gb(-1,null,["reset"])),(n()(),r.rb(31,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),r.rb(32,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),r.rb(33,0,null,null,1,"b",[["class","title"]],null,null,null,null,null)),(n()(),r.Gb(-1,null,["ngModel:"])),(n()(),r.rb(35,0,null,null,6,"input",[["type","text"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"]],(function(n,l,t){var u=!0,e=n.component;return"input"===l&&(u=!1!==r.Bb(n,36)._handleInput(t.target.value)&&u),"blur"===l&&(u=!1!==r.Bb(n,36).onTouched()&&u),"compositionstart"===l&&(u=!1!==r.Bb(n,36)._compositionStart()&&u),"compositionend"===l&&(u=!1!==r.Bb(n,36)._compositionEnd(t.target.value)&&u),"ngModelChange"===l&&(u=!1!==e.counter.setValueFromInput(t)&&u),u}),null,null)),r.qb(36,16384,null,0,i.b,[r.C,r.l,[2,i.a]],null,null),r.Eb(1024,null,i.d,(function(n){return[n]}),[i.b]),r.qb(38,671744,null,0,i.g,[[8,null],[8,null],[8,null],[6,i.d]],{model:[0,"model"]},{update:"ngModelChange"}),r.Db(131072,b.b,[r.i]),r.Eb(2048,null,i.e,null,[i.g]),r.qb(41,16384,null,0,i.f,[[4,i.e]],null,null),(n()(),r.Gb(-1,null,[" (delay 300ms)\n"]))],(function(n,l){var t=l.component;n(l,38,0,r.Hb(l,38,0,r.Bb(l,39).transform(t.counter.state$)).val)}),(function(n,l){var t=l.component;n(l,10,0,r.Hb(l,10,0,r.Bb(l,12).transform(r.Hb(l,10,0,r.Bb(l,11).transform(t.counter.state$))))),n(l,15,0,r.Hb(l,15,0,r.Bb(l,17).transform(r.Hb(l,15,0,r.Bb(l,16).transform(t.counter.values$))))),n(l,35,0,r.Bb(l,41).ngClassUntouched,r.Bb(l,41).ngClassTouched,r.Bb(l,41).ngClassPristine,r.Bb(l,41).ngClassDirty,r.Bb(l,41).ngClassValid,r.Bb(l,41).ngClassInvalid,r.Bb(l,41).ngClassPending)}))}var _=r.nb("count",h,(function(n){return r.Ib(0,[(n()(),r.rb(0,0,null,null,1,"count",[],null,null,null,v,j)),r.qb(1,49152,null,0,h,[O],null,null)],null,null)}),{},{},[]),C=t("Mrqg"),k=t("lLvT"),S=t("iInd");t.d(l,"CountModuleNgFactory",(function(){return w}));var w=r.ob(o,[],(function(n){return r.zb([r.Ab(512,r.k,r.Z,[[8,[c.a,_]],[3,r.k],r.w]),r.Ab(4608,b.l,b.k,[r.t,[2,b.r]]),r.Ab(4608,i.i,i.i,[]),r.Ab(4608,f.D,f.D,[[3,f.D],[2,f.c]]),r.Ab(4608,O,O,[]),r.Ab(4608,m,m,[]),r.Ab(1073742336,b.c,b.c,[]),r.Ab(1073742336,i.h,i.h,[]),r.Ab(1073742336,i.c,i.c,[]),r.Ab(512,f.y,f.y,[r.q,f.v,[3,f.y],f.n,f.z,f.B,[2,C.a]]),r.Ab(1024,f.s,(function(){return[[O,m]]}),[]),r.Ab(1073742336,f.p,f.p,[f.h,f.C,f.y,[2,f.s],f.o]),r.Ab(1073742336,k.a,k.a,[]),r.Ab(1073742336,S.m,S.m,[[2,S.r],[2,S.k]]),r.Ab(1073742336,o,o,[]),r.Ab(1024,S.i,(function(){return[[{path:"",component:h}]]}),[])])}))}}]);