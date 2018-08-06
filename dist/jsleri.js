module.exports=function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o=function(){},i=/^\s+/,s=/^\w+/,a=/\s+/,c=function(t){return"function"==typeof t},p=function(t){return"string"==typeof t&&0!==t.indexOf("^",0)&&(t="^"+t),new RegExp(t)},l=function(t,e){return t.length<e.length},u=function(t,e,n,r){var o=new T,s=function(t,n,r){r>o.pos&&o.empty(),n.end=r,n.str=e.substring(n.start,n.end),t.push(n)},a=function t(n,a,c,p,l){var u,b,w,x,k,V,S,T,M;if(u=e.substring(a).replace(i,""),T=new q(n,e.length-u.length),o.setModeRequired(T.start,l),n instanceof f){for(M=new R(!1,T.start),x=0,k=n.elements.length;x<k;x++)S=[],(w=t(n.elements[x],T.start,S,p,!0)).isValid&&w.pos>M.pos&&(T.children=S,M=w);return M.isValid&&s(c,T,M.pos),M}if(n instanceof h)return V=u.match(r),(b=n.ignCase?Boolean(V&&V[0].toLowerCase()===n.keyword.toLowerCase()):Boolean(V&&V[0]===n.keyword))?s(c,T,T.start+n.keyword.length):o.update(n,T.start),new R(b,T.end||T.start);if(n instanceof d){for(a=T.start,x=0,k=0;(w=t(n.element,a,T.children,p,x<n.min)).isValid&&(a=w.pos,x++,(w=t(n.delimiter,a,T.children,p,x<n.min)).isValid);)a=w.pos,k++;return(b=!(x<n.min||n.max&&x>n.max||!n.opt&&x&&x==k))&&s(c,T,a),new R(b,a)}if(n instanceof y)return(w=t(n.element,T.start,T.children,p,!1)).isValid&&s(c,T,w.pos),new R(!0,T.end||T.start);if(n instanceof g){for(void 0===p._tested[T.start]&&(p._tested[T.start]=new R(!1,T.start)),x=0,k=n.elements.length;x<k;x++)S=[],(w=t(n.elements[x],T.start,S,p,!0)).isValid&&w.pos>p._tested[T.start].pos&&(T.children=S,p._tested[T.start]=w,p._tree[T.start]=S);return p._tested[T.start].isValid&&s(c,T,p._tested[T.start].pos),p._tested[T.start]}if(n instanceof m)return V=u.match(n._re),(b=Boolean(V))?s(c,T,T.start+V[0].length):o.update(n,T.start),new R(b,T.end||T.start);if(n instanceof v){for(a=T.start,x=0;(!n.max||x<n.max)&&(w=t(n.element,a,T.children,p,x<n.min)).isValid;x++)a=w.pos;return(b=x>=n.min)&&s(c,T,a),new R(b,a)}if(n instanceof O)return n._tested={},n._tree={},(w=t(n.element,T.start,T.children,n,!0)).isValid&&s(c,T,w.pos),w;if(n instanceof _){for(a=T.start,x=0,k=n.elements.length;x<k;x++){if(!(w=t(n.elements[x],a,T.children,p,!0)).isValid)return w;a=w.pos}return s(c,T,w.pos),w}if(n instanceof E)return(b=Boolean(0===u.indexOf(n.token)))?s(c,T,T.start+n.token.length):o.update(n,T.start),new R(b,T.end||T.start);if(n instanceof J){for(x=0,k=n.tokens.length;x<k;x++)if(0===u.indexOf(n.tokens[x]))return s(c,T,T.start+n.tokens[x].length),new R(!0,T.end);return o.update(n,T.start),new R(!1,T.start)}return n instanceof j?(void 0===p._tested[T.start]?(p._tested[T.start]=t(p.element,T.start,T.children,p,!0),p._tree[T.start]=T.children):T.children=p._tree[T.start],p._tested[T.start].isValid&&s(c,T,p._tested[T.start].pos),p._tested[T.start]):void 0}(t,0,n,t,!0),c=e.substring(a.pos).replace(i,"");return a.isValid&&c&&(a.isValid=!1),!o.required.length&&c&&(o.setModeRequired(a.pos,!0),o.update(S,a.pos)),a.expecting=o.getExpecting(),a.isValid||(a.pos=o.pos),a};function f(){var t=M.call(this,f,arguments);if(t)return t;this.elements=this.checkElements(this.args)}function h(t,e){var n=M.call(this,h,arguments);if(n)return n;t=this.args[0],e=this.args[1],this.keyword=t,this.ignCase=Boolean(e)}f.prototype=Object.create(M.prototype),f.prototype.constzructor=f,h.prototype=Object.create(M.prototype),h.prototype.constructor=h;var d=function t(e,n,o,i,s){var a=M.call(this,t,arguments);if(a)return a;if(e=this.args[0],n=void 0===this.args[1]?new E(","):this.args[1],o=this.args[2],i=this.args[3],s=this.args[4],!(e instanceof M))throw"(Jsleri--\x3eList) first argument must be an instance of Jsleri; got "+(void 0===e?"undefined":r(e));if("string"!=typeof n&&!(n instanceof M))throw"(Jsleri--\x3eList) second argument must be a string or instance of Jsleri; got "+(void 0===n?"undefined":r(n));this.element=e,this.delimiter=n instanceof M?n:new E(n),this.min=void 0===o||null===o?0:o,this.max=void 0===i||null===i?null:i,this.opt=Boolean(s)};function y(t){var e=M.call(this,y,arguments);if(e)return e;if(!((t=this.args[0])instanceof M))throw"(Jsleri--\x3eOptional) first argument must be an instance of Jsleri; got "+(void 0===t?"undefined":r(t));this.element=t}function g(){var t=M.call(this,g,arguments);return t||(this.elements=this.checkElements(this.args),new O(this))}function m(t,e){var n=M.call(this,m,arguments);if(n)return n;t=this.args[0],e=this.args[1],this.re=t,this._re=new RegExp("^"+t,Boolean(e)?"i":void 0)}function v(t,e,n){var o=M.call(this,v,arguments);if(o)return o;if(t=this.args[0],e=this.args[1],n=this.args[2],!(t instanceof M))throw"(Jsleri--\x3eRepeat) first argument must be an instance of Jsleri; got "+(void 0===t?"undefined":r(t));this.element=t,this.min=void 0===e||null===e?0:e,this.max=void 0===n||null===n?null:n}d.prototype=Object.create(M.prototype),d.prototype.constructor=d,y.prototype=Object.create(M.prototype),y.prototype.constructor=y,g.prototype=Object.create(M.prototype),g.prototype.constructor=g,m.prototype=Object.create(M.prototype),m.prototype.constructor=m,v.prototype=Object.create(M.prototype),v.prototype.constructor=v;var b=function(t){if(!(t instanceof M))throw"(Jsleri--\x3eRef--\x3eset) first argument must be an instance of Jsleri; got "+(void 0===t?"undefined":r(t));Object.assign(this,t)};function w(t){var e=function(){};e.prototype=t.prototype;var n=M.call(this,e,arguments);if(n)return n.set=b,n}function x(t,e){var n=M.call(this,x,arguments);if(n)return n;if(t=this.args[0],e=this.args[1],!((t=void 0===t?this.constructor.START:t)instanceof M))throw"(Jsleri--\x3eOptional) first argument must be an instance of Jsleri; got "+(void 0===t?"undefined":r(t));this.reKeywords=void 0===e?s:p(e),this.element=t,this.parse=function(e){var n=new q(this,0,e.length,e),r=u(t,e,n.children,this.reKeywords);return r.tree=n,r}}function O(t){var e=M.call(this,O,arguments);if(e)return e;if(!((t=this.args[0])instanceof M))throw"(Jsleri--\x3eRule) first argument must be an instance of Jsleri; got "+(void 0===t?"undefined":r(t));this.element=t}function _(){var t=M.call(this,_,arguments);if(t)return t;this.elements=this.checkElements(this.args)}w.prototype=Object.create(M.prototype),w.prototype.constructor=w,x.prototype=Object.create(M.prototype),x.prototype.constructor=x,O.prototype=Object.create(M.prototype),O.prototype.constructor=O,_.prototype=Object.create(M.prototype),_.prototype.constructor=_;var j=function t(){if(!(this instanceof t))return new t};j.prototype=Object.create(M.prototype),j.prototype.constructor=j;var k=new j;function E(t){var e=M.call(this,E,arguments);if(e)return e;if("string"!=typeof(t=this.args[0]))throw"(Jsleri--\x3eToken) first argument must be a string; got "+(void 0===t?"undefined":r(t));this.token=t}function J(t){var e=M.call(this,J,arguments);if(e)return e;if("string"!=typeof(t=this.args[0]))throw"(Jsleri--\x3eTokens) first argument must be a string; got "+(void 0===t?"undefined":r(t));this.tokens=t.split(a).sort(l)}function V(){this.e="End of statement"}E.prototype=Object.create(M.prototype),E.prototype.constructor=E,J.prototype=Object.create(M.prototype),J.prototype.constructor=J,V.prototype=Object.create(M.prototype),V.prototype.constructor=V;var S=new V;function R(t,e){this.isValid=t,this.pos=e,this.expecting=null}function q(t,e,n,r){this.element=t,this.start=e,this.end=n,this.str=r,this.children=[]}function T(){this.required=[],this.optional=[],this.pos=0,this._modes=[this.required]}function M(t,e){if(e=Array.prototype.slice.call(e),!(this instanceof t))return new(t.bind.apply(t,[t].concat(e)));this.setCallbacks(e),this.args=e}q.prototype.walk=function(){this.element.onEnter(this);for(var t=0,e=this.children.length;t<e;t++)this.children[t].walk();this.element.onExit(this)},T.prototype.setModeRequired=function(t,e){this._modes[t]!==this.optional&&(this._modes[t]=!1===e?this.optional:this.required)},T.prototype.empty=function(){this.required.length=0,this.optional.length=0},T.prototype.update=function(t,e){e>this.pos&&(this.empty(),this.pos=e),e===this.pos&&-1===this._modes[e].indexOf(t)&&this._modes[e].push(t)},T.prototype.getExpecting=function(){return this.required.concat(this.optional)},M.prototype.setCallbacks=function(t){var e=t[0];void 0===e||null===e||"string"==typeof e||e instanceof M||(c(e.onEnter)&&(this.onEnter=e.onEnter),c(e.onExit)&&(this.onExit=e.onExit),t.splice(0,1))},M.prototype.onEnter=o,M.prototype.onExit=o,M.prototype.checkElements=function(t){var e=0,n=t.length;if(0===n)throw"(Jsleri--\x3e"+this.constructor.name+") Need at least one Jsleri argument";for(;e<n;e++)t[e]instanceof M||(t[e]=new E(t[e]));return t},M.prototype.checkElement=function(t){return t instanceof M||(t=new E(t)),t},e.version="1.1.3",e.noop=o,e.Keyword=h,e.Regex=m,e.Token=E,e.Tokens=J,e.Sequence=_,e.Choice=f,e.Repeat=v,e.List=d,e.Optional=y,e.Ref=w,e.Prio=g,e.THIS=k,e.Grammar=x,e.EOS=S}]);