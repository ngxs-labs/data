(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{0:function(n,t,e){n.exports=e("Ea2l")},Ea2l:function(n,t,e){"use strict";e.r(t);var l=e("8Y7J");class r{}var o=e("e1JD");class s{constructor(n){this.store=n,this.snapshot=this.store.select(n=>n)}ngOnInit(){console.log("[isDevMode]",Object(l.S)())}}var u=e("pMnS"),a=e("SVse"),i=e("iInd"),c=l.lb({encapsulation:2,styles:[],data:{}});function b(n){return l.Db(2,[(n()(),l.nb(0,0,null,null,8,"div",[["class","panel"]],null,null,null,null,null)),(n()(),l.nb(1,0,null,null,0,"img",[["class","logo"],["src","https://habrastorage.org/webt/k7/ih/pc/k7ihpcg6w-jz-rzksmiyuip5_so.png"]],null,null,null,null,null)),(n()(),l.nb(2,0,null,null,6,"div",[["class","panel-content"]],null,null,null,null,null)),(n()(),l.nb(3,0,null,null,1,"h2",[],null,null,null,null,null)),(n()(),l.Bb(-1,null,["Store:"])),(n()(),l.nb(5,0,null,null,3,"pre",[],null,null,null,null,null)),(n()(),l.Bb(6,null,["",""])),l.zb(131072,a.b,[l.i]),l.zb(0,a.f,[]),(n()(),l.nb(9,0,null,null,17,"div",[["class","menu"]],null,null,null,null,null)),(n()(),l.Bb(-1,null,[" Examples: "])),(n()(),l.nb(11,0,null,null,3,"span",[],null,null,null,null,null)),(n()(),l.Bb(-1,null,["\u{1f680} "])),(n()(),l.nb(13,0,null,null,1,"a",[["class","link"],["href","https://stackblitz.io/github/ngxs-labs/data"],["target","_blank"]],null,null,null,null,null)),(n()(),l.Bb(-1,null,["Stackblitz"])),(n()(),l.nb(15,0,null,null,5,"span",[],null,null,null,null,null)),(n()(),l.Bb(-1,null,["\u{1f3c0} "])),(n()(),l.nb(17,0,null,null,3,"a",[["class","link"]],[[1,"target",0],[8,"href",4]],[[null,"click"]],(function(n,t,e){var r=!0;return"click"===t&&(r=!1!==l.xb(n,18).onClick(e.button,e.ctrlKey,e.metaKey,e.shiftKey)&&r),r}),null,null)),l.mb(18,671744,null,0,i.l,[i.k,i.a,a.i],{routerLink:[0,"routerLink"]},null),l.yb(19,1),(n()(),l.Bb(-1,null,["CountState"])),(n()(),l.nb(21,0,null,null,5,"span",[],null,null,null,null,null)),(n()(),l.Bb(-1,null,["\u{1f9ed} "])),(n()(),l.nb(23,0,null,null,3,"a",[["class","link"]],[[1,"target",0],[8,"href",4]],[[null,"click"]],(function(n,t,e){var r=!0;return"click"===t&&(r=!1!==l.xb(n,24).onClick(e.button,e.ctrlKey,e.metaKey,e.shiftKey)&&r),r}),null,null)),l.mb(24,671744,null,0,i.l,[i.k,i.a,a.i],{routerLink:[0,"routerLink"]},null),l.yb(25,1),(n()(),l.Bb(-1,null,["TodoState"])),(n()(),l.nb(27,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),l.nb(28,0,null,null,3,"div",[["class","container"]],null,null,null,null,null)),(n()(),l.nb(29,0,null,null,2,"div",[["class","content"]],null,null,null,null,null)),(n()(),l.nb(30,16777216,null,null,1,"router-outlet",[],null,null,null,null,null)),l.mb(31,212992,null,0,i.n,[i.b,l.K,l.k,[8,null],l.i],null,null)],(function(n,t){var e=n(t,19,0,"count");n(t,18,0,e);var l=n(t,25,0,"todo");n(t,24,0,l),n(t,31,0)}),(function(n,t){var e=t.component;n(t,6,0,l.Cb(t,6,0,l.xb(t,8).transform(l.Cb(t,6,0,l.xb(t,7).transform(e.snapshot))))),n(t,17,0,l.xb(t,18).target,l.xb(t,18).href),n(t,23,0,l.xb(t,24).target,l.xb(t,24).href)}))}function d(n){return l.Db(0,[(n()(),l.nb(0,0,null,null,1,"app-root",[],null,null,null,b,c)),l.mb(1,114688,null,0,s,[o.f],null,null)],(function(n,t){n(t,1,0)}),null)}var w=l.jb("app-root",s,d,{},{},[]),h=e("cUpR"),f=e("s7LF"),p=e("Mrqg");const S=new l.o("NGXS_DATA_STORAGE_CONTAINER_TOKEN");class E{constructor(){this.providers=new Set,this.keys=new Map}getProvidedKeys(){return Array.from(this.keys.keys())}}const g=()=>new E;var y=e("YenP"),N=e("ZArt");function _(n){return"undefined"!==n&&null!=n}var A=function(n){return n.NGXS_PERSISTENCE_STATE="@Persistence should be add before decorator @State and @StateRepository",n.NGXS_DATA_STATE="@StateRepository should be add before decorator @State",n.NGXS_DATA_STATE_NAME_NOT_FOUND="State name not provided in class",n.NGXS_DATA_MODULE_EXCEPTION="Metadata not created \n Maybe you forgot to import the NgxsDataPluginModule\n Also, you cannot use this.ctx.* until the application is fully rendered \n (use by default ngxsOnInit(ctx: StateContext), or ngxsAfterBootstrap(ctx: StateContext) !!!",n.NGXS_DATA_STATE_DECORATOR="You forgot add decorator @StateRepository or initialize state!\n Example: NgxsModule.forRoot([ .. ]), or NgxsModule.forFeature([ .. ])",n.NGXS_DATA_STATIC_ACTION="Cannot support static methods with @action",n.NGXS_DATA_ACTION="@action can only decorate a method implementation",n.NGXS_DATA_ACTION_RETURN_TYPE="RECOMMENDATION: If you use asynchronous actions `@action({ async: true })`, the return result type should only be Observable or void instead",n.NGXS_PERSISTENCE_CONTAINER="You forgot provide NGXS_DATA_STORAGE_CONTAINER or NGXS_DATA_STORAGE_EXTENSION!!! Example: \n\n@NgModule({\n imports: [ \n   NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN]) \n ]\n})\nexport class AppModule {} \n\n",n.NGXS_PERSISTENCE_ENGINE="Not found storage engine from `existingEngine` or not found instance after injecting by `useClass`.",n.NGXS_PERSISTENCE_SERIALIZE="Error occurred while serializing value",n.NGXS_PERSISTENCE_DESERIALIZE="Error occurred while deserializing value",n.NGXS_DATA_CHILDREN_CONVERT="Child states can only be added to an object",n}({});Error;let T=(()=>{class n{constructor(t,e,r){n.store=t.get(o.f),n.ngZone=t.get(l.x),n.factory=e,n.context=r}}return n.store=null,n.context=null,n.factory=null,n.ngZone=null,n})(),m=(()=>{class n{constructor(){n.statesCachedMeta.clear()}static createStateContext(n){return T.context.createStateContext(n)}static ensureMappedState(t){if(!T.factory||!t)throw new Error(A.NGXS_DATA_MODULE_EXCEPTION);return(t.name?n.statesCachedMeta.get(t.name):null)||n.ensureMeta(t)}static getRepositoryByInstance(n){const t=function(n){return n.NGXS_DATA_META}((n||{}).constructor)||null;if(!t)throw new Error(A.NGXS_DATA_STATE_DECORATOR);return t}static createPayload(n,t){const e={},l=Array.from(n);return t.argumentsNames.forEach((n,t)=>{e[n]=l[t]}),e}static ensureMeta(t){const e=t.name?T.factory.states.find(n=>n.name===t.name):null;return e&&t.name&&n.statesCachedMeta.set(t.name,e),e}}return n.statesCachedMeta=new Map,n})();e("lJxs"),e("UXun");var v=e("xgIS"),x=e("vkgz");class k extends Error{constructor(){super("missing key 'data' or it's value not serializable.")}}class O extends Error{constructor(n){super(`lastChanged key not found in object ${n}.`)}}class I extends Error{constructor(n){super(`${n}. \nIncorrect structure for deserialization!!! Your structure should be like this: \n${JSON.stringify({lastChanged:"2020-01-01T12:00:00.000Z",data:"{}",version:1},null,4)}`)}}class C extends Error{constructor(n){super(`It's not possible to determine version (${n}), since it must be a integer type and must equal or more than 1.`)}}function D(n){return`${n.prefixKey}${n.path}`}class R extends Error{constructor(n){super(`${A.NGXS_PERSISTENCE_ENGINE} \nMetadata { key: '${n}' }`)}}class z extends Error{constructor(){super("StorageEngine instance should be implemented by DataStorageEngine interface")}}function j(n){const t=n.existingEngine||M.injector.get(n.useClass,null);if(!t)throw new R(D(n));if(!("getItem"in t))throw new z;return t}function G(n,t){console.warn(`${A.NGXS_PERSISTENCE_SERIALIZE} from metadata { key: '${n}' }. \nError serialize: ${t}`)}let M=(()=>{class n{constructor(t,e){this._platformId=t,n.injector=e,this.listenWindowEvents()}get store(){return n.injector.get(o.f,null)}get size(){return this.providers.size}get container(){return n.injector.get(S)}get providers(){return this.container.providers}get keys(){return this.container.keys}get entries(){return this.providers.entries()}get skipStorageInterceptions(){return 0===this.size||Object(a.o)(this._platformId)}handle(n,t,e){if(this.skipStorageInterceptions)return e(n,t);const l=function(n){const t=Object(o.h)(n);return t(o.b)||t(o.g)}(t);return e(n=this.firstSynchronizationWithStorage(n,t,l),t).pipe(Object(x.a)(t=>this.nextSynchronizationWithStorage(n,t,l)))}serialize(n,t){return JSON.stringify({lastChanged:(new Date).toISOString(),version:t.version,data:_(n)?n:null})}deserialize(n){return function(n,t){if("object"==typeof(e=n)&&!Array.isArray(e)&&null!==e){if(function(n){return!("lastChanged"in n&&n.lastChanged)}(n))throw new O(t);if(function(n){const t=parseFloat(n.version);return isNaN(t)||t<1||parseInt(n.version)!==t}(n))throw new C(n.version);if(function(n){return!("data"in n)}(n))throw new k;return n.data}var e;throw new I(`"${t}" not an object`)}(function(n){try{return JSON.parse(n)}catch(t){throw new I(t.message)}}(n),n)}nextSynchronizationWithStorage(n,t,e){for(const[r]of this.entries){const s=Object(o.j)(n,r.path),u=Object(o.j)(t,r.path);if(s!==u||e){const n=j(r),t=D(r);try{const e=this.serialize(u,r);n.setItem(t,e),this.keys.set(t)}catch(l){G(t,l.message)}}}}firstSynchronizationWithStorage(n,t,e){if(this.canBeSyncStoreWithStorage(t,e))for(const[l]of this.entries)n=this.whenValueExistDeserializeIt(n,l);return n}canBeSyncStoreWithStorage(n,t){return this.size>0&&(t||"NGXS_DATA_STORAGE_EVENT_TYPE"===n.type)}whenValueExistDeserializeIt(n,t){const e=D(t),l=j(t),r=l.getItem(e);if(_(r))try{const s=this.deserialize(r);_(s)||t.nullable?(this.keys.set(e),n=Object(o.k)(n,t.path,s)):(l.removeItem(e),this.keys.delete(e))}catch(s){!function(n,t,e){console.warn(`${A.NGXS_PERSISTENCE_DESERIALIZE} from metadata { key: '${n}', value: '${t}' }. \nError deserialize: ${e}`)}(e,r,s.message)}return n}listenWindowEvents(){var t;Object(a.o)(this._platformId)||(null===(t=n.eventsSubscriptions)||void 0===t||t.unsubscribe(),n.eventsSubscriptions=Object(v.a)(window,"storage").subscribe(n=>{n.key&&this.keys.has(n.key)&&this.store.dispatch({type:"NGXS_DATA_STORAGE_EVENT_TYPE"})}))}}return n.injector=null,n.eventsSubscriptions=null,n})();class X{constructor(n,t){this.accessor=n,this.injector=t}static forRoot(n=[]){return{ngModule:X,providers:[m,T,...n]}}}class P{}var B=l.kb(r,[s],(function(n){return l.vb([l.wb(512,l.k,l.W,[[8,[u.a,w]],[3,l.k],l.v]),l.wb(5120,l.s,l.hb,[[3,l.s]]),l.wb(4608,a.k,a.j,[l.s,[2,a.q]]),l.wb(5120,l.db,l.ib,[l.x]),l.wb(5120,l.c,l.eb,[]),l.wb(5120,l.q,l.fb,[]),l.wb(5120,l.r,l.gb,[]),l.wb(4608,h.b,h.k,[a.d]),l.wb(6144,l.D,null,[h.b]),l.wb(4608,h.e,h.g,[]),l.wb(5120,h.c,(function(n,t,e,l,r,o,s,u){return[new h.i(n,t,e),new h.n(l),new h.m(r,o,s,u)]}),[a.d,l.x,l.z,a.d,a.d,h.e,l.X,[2,h.f]]),l.wb(4608,h.d,h.d,[h.c,l.x]),l.wb(135680,h.l,h.l,[a.d]),l.wb(4608,h.j,h.j,[h.d,h.l,l.c]),l.wb(6144,l.B,null,[h.j]),l.wb(6144,h.o,null,[h.l]),l.wb(4608,l.I,l.I,[l.x]),l.wb(4608,f.c,f.c,[]),l.wb(5120,i.a,i.x,[i.k]),l.wb(4608,i.d,i.d,[]),l.wb(6144,i.f,null,[i.d]),l.wb(135680,i.o,i.o,[i.k,l.u,l.j,l.p,i.f]),l.wb(4608,i.e,i.e,[]),l.wb(5120,i.C,i.t,[i.k,a.n,i.g]),l.wb(5120,i.h,i.A,[i.y]),l.wb(5120,l.b,(function(n,t){return[n,o.d.appBootstrapListenerFactory(t)]}),[i.h,p.e]),l.wb(4608,o.a,o.a,[o.l,o.A]),l.wb(5120,S,g,[]),l.wb(1073742336,a.c,a.c,[]),l.wb(1024,l.l,h.p,[]),l.wb(1024,l.w,(function(){return[i.s()]}),[]),l.wb(512,i.y,i.y,[l.p]),l.wb(1024,l.d,(function(n,t){return[h.q(n),i.z(t)]}),[[2,l.w],i.y]),l.wb(512,l.e,l.e,[[2,l.d]]),l.wb(131584,l.g,l.g,[l.x,l.X,l.p,l.l,l.k,l.e]),l.wb(1073742336,l.f,l.f,[l.g]),l.wb(1073742336,h.a,h.a,[[3,h.a]]),l.wb(1073742336,f.b,f.b,[]),l.wb(1073742336,f.a,f.a,[]),l.wb(1024,i.r,i.v,[[3,i.k]]),l.wb(512,i.q,i.c,[]),l.wb(512,i.b,i.b,[]),l.wb(256,i.g,{useHash:!0},[]),l.wb(1024,a.i,i.u,[a.m,[2,a.a],i.g]),l.wb(512,a.h,a.h,[a.i,a.m]),l.wb(512,l.j,l.j,[]),l.wb(512,l.u,l.G,[l.j,[2,l.H]]),l.wb(1024,i.i,(function(){return[[{path:"",redirectTo:"count",pathMatch:"full"},{path:"count",loadChildren:y.b},{path:"todo",loadChildren:y.c}]]}),[]),l.wb(1024,i.k,i.w,[l.g,i.q,i.b,a.h,l.p,l.u,l.j,i.i,i.g,[2,i.p],[2,i.j]]),l.wb(1073742336,i.m,i.m,[[2,i.r],[2,i.k]]),l.wb(1073742336,y.a,y.a,[]),l.wb(256,o.d.ROOT_OPTIONS,{developmentMode:!1},[]),l.wb(1024,o.r,o.d.ngxsConfigFactory,[o.d.ROOT_OPTIONS]),l.wb(512,o.l,o.l,[]),l.wb(512,o.v,o.v,[]),l.wb(512,o.e,o.e,[]),l.wb(256,N.d,void 0,[]),l.wb(1024,N.a,N.e,[N.d]),l.wb(1024,o.c,(function(n,t,e,l){return[new N.b(n,t),new M(e,l)]}),[N.a,l.p,l.z,[4,l.p]]),l.wb(512,o.z,o.z,[[3,o.z],[2,o.c]]),l.wb(512,o.s,o.n,[l.x,l.z]),l.wb(512,o.A,o.A,[o.s]),l.wb(512,o.w,o.w,[l.l,o.l,o.v,o.z,o.e,o.A]),l.wb(256,o.q,l.S,[]),l.wb(256,o.p,p.f,[]),l.wb(512,o.C,o.C,[o.q,o.p]),l.wb(512,o.B,o.B,[o.C,o.r]),l.wb(512,o.y,o.y,[o.e,o.w,o.r,o.B]),l.wb(512,o.x,o.x,[o.y]),l.wb(1024,p.a,o.d.getInitialState,[]),l.wb(512,o.u,o.u,[l.p,o.r,[3,o.u],o.l,o.v,o.x,[2,p.a]]),l.wb(512,o.f,o.f,[o.e,o.y,o.r,o.A,o.u,[2,p.a]]),l.wb(512,o.D,o.D,[o.f,o.r]),l.wb(256,o.o,[],[]),l.wb(512,p.e,p.e,[]),l.wb(512,o.m,o.m,[o.y,o.x,p.e]),l.wb(1073742336,o.t,o.t,[o.u,o.y,o.f,o.D,[2,o.o],o.m]),l.wb(1073742336,N.c,N.c,[]),l.wb(512,m,m,[]),l.wb(2048,p.d,null,[o.u]),l.wb(2048,p.c,null,[o.x]),l.wb(512,T,T,[l.p,p.d,p.c]),l.wb(1073742336,X,X,[[4,m],[4,T]]),l.wb(1073742336,P,P,[]),l.wb(1073742336,r,r,[]),l.wb(256,l.V,!0,[])])}));Object(l.O)(),h.h().bootstrapModuleFactory(B).catch(n=>console.error(n))},"U+rF":function(n,t){function e(n){return Promise.resolve().then((function(){var t=new Error("Cannot find module '"+n+"'");throw t.code="MODULE_NOT_FOUND",t}))}e.keys=function(){return[]},e.resolve=e,n.exports=e,e.id="U+rF"},YenP:function(n,t,e){"use strict";e.d(t,"a",(function(){return o})),e.d(t,"b",(function(){return l})),e.d(t,"c",(function(){return r}));const l=()=>e.e(1).then(e.bind(null,"NZOc")).then(n=>n.CountModuleNgFactory),r=()=>e.e(1).then(e.bind(null,"NZOc")).then(n=>n.TodoModuleNgFactory);class o{}}},[[0,0,6]]]);