(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{xG8Z:function(l,n,u){"use strict";u.r(n);var t=u("8Y7J");class o{}var e=u("pMnS"),r=u("SVse"),c=u("mrSG"),b=u("gKry"),a=u("e1JD");let i=(()=>{let l=class extends b.a{addTodo(l){l&&this.ctx.setState(n=>n.concat(l))}removeTodo(l){this.ctx.setState(n=>n.filter((n,u)=>u!==l))}};return Object(c.a)([Object(b.d)(),Object(c.b)("design:type",Function),Object(c.b)("design:paramtypes",[String]),Object(c.b)("design:returntype",void 0)],l.prototype,"addTodo",null),Object(c.a)([Object(b.d)(),Object(c.b)("design:type",Function),Object(c.b)("design:paramtypes",[Number]),Object(c.b)("design:returntype",void 0)],l.prototype,"removeTodo",null),l=Object(c.a)([Object(b.b)(),Object(b.c)(),Object(a.e)({name:"todo",defaults:[]})],l),l})();class d{constructor(l){this.todo=l}}var s=t.pb({encapsulation:2,styles:[],data:{}});function p(l){return t.Ib(0,[(l()(),t.rb(0,0,null,null,3,"li",[["class","todo"]],null,null,null,null,null)),(l()(),t.Gb(1,null,[" "," "])),(l()(),t.rb(2,0,null,null,1,"button",[],null,[[null,"click"]],(function(l,n,u){var t=!0;return"click"===n&&(t=!1!==l.component.todo.removeTodo(l.context.index)&&t),t}),null,null)),(l()(),t.Gb(-1,null,["\u{1f5d1}"]))],null,(function(l,n){l(n,1,0,n.context.$implicit)}))}function f(l){return t.Ib(2,[(l()(),t.rb(0,0,null,null,1,"a",[["href","#"],["target","_blank"]],null,null,null,null,null)),(l()(),t.rb(1,0,null,null,0,"img",[["alt","stackblitz"],["class","stackblitz"],["src","./assets/img/stackblitz.png"]],null,null,null,null,null)),(l()(),t.rb(2,0,null,null,1,"h3",[],null,null,null,null,null)),(l()(),t.Gb(-1,null,["TodoState"])),(l()(),t.Gb(-1,null,[" PS: TodoState will be persistence in localStorage "])),(l()(),t.rb(5,0,null,null,5,"div",[["class","add-todo"]],null,null,null,null,null)),(l()(),t.rb(6,0,[["text",1]],null,0,"input",[["placeholder","New Todo"]],null,null,null,null,null)),(l()(),t.rb(7,0,null,null,1,"button",[],null,[[null,"click"]],(function(l,n,u){var o=!0;return"click"===n&&(o=!1!==l.component.todo.addTodo(t.Bb(l,6).value)&&o),o}),null,null)),(l()(),t.Gb(-1,null,["Add"])),(l()(),t.rb(9,0,null,null,1,"button",[],null,[[null,"click"]],(function(l,n,u){var t=!0;return"click"===n&&(t=!1!==l.component.todo.reset()&&t),t}),null,null)),(l()(),t.Gb(-1,null,["Reset"])),(l()(),t.rb(11,0,null,null,3,"ul",[],null,null,null,null,null)),(l()(),t.gb(16777216,null,null,2,null,p)),t.qb(13,278528,null,0,r.j,[t.N,t.K,t.r],{ngForOf:[0,"ngForOf"]},null),t.Db(131072,r.b,[t.i])],(function(l,n){var u=n.component;l(n,13,0,t.Hb(n,13,0,t.Bb(n,14).transform(u.todo.state$)))}),null)}function m(l){return t.Ib(0,[(l()(),t.rb(0,0,null,null,1,"todo",[],null,null,null,f,s)),t.qb(1,49152,null,0,d,[i],null,null)],null,null)}var g=t.nb("todo",d,m,{},{},[]),k=u("Mrqg"),v=u("iInd");u.d(n,"TodoModuleNgFactory",(function(){return O}));var O=t.ob(o,[],(function(l){return t.zb([t.Ab(512,t.k,t.Z,[[8,[e.a,g]],[3,t.k],t.w]),t.Ab(4608,r.l,r.k,[t.t,[2,r.r]]),t.Ab(4608,a.B,a.B,[[3,a.B],[2,a.c]]),t.Ab(4608,i,i,[]),t.Ab(1073742336,r.c,r.c,[]),t.Ab(512,a.w,a.w,[t.q,a.t,[3,a.w],a.o,a.x,a.z,[2,k.a]]),t.Ab(1024,a.q,(function(){return[[i]]}),[]),t.Ab(1073742336,a.H,a.H,[a.h,a.A,a.w,[2,a.q],a.G]),t.Ab(1073742336,v.m,v.m,[[2,v.r],[2,v.k]]),t.Ab(1073742336,o,o,[]),t.Ab(1024,v.i,(function(){return[[{path:"",component:d}]]}),[])])}))}}]);