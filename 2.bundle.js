(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{172:function(e,t){},174:function(e,t){},195:function(e,t,a){"use strict";a.r(t),a.d(t,"setupClient",(function(){return o})),a.d(t,"fetchAllPasswordEntities",(function(){return c})),a.d(t,"createPasswordEntity",(function(){return l})),a.d(t,"updatePasswordEntity",(function(){return u})),a.d(t,"deletePasswordEntity",(function(){return y}));var n=a(158),i=a.n(n);const{query:r}=i.a,s=async e=>{const t=await(async e=>(await e.query(r.Paginate(r.Keys()))).data)(e),a=t[1].value.id;t.length>Number("2")&&await(async(e,t)=>{await e.query(r.Delete(r.Ref(r.Keys(),t)))})(e,a)},o=async e=>{const t=new i.a.Client(e),a=await t.query(r.CreateKey({role:"server"})),n=new i.a.Client({secret:a.secret});return await(async e=>{const t=await e.query(r.Paginate(r.Collections()));return Boolean(t.data.length)})(n)||await n.query(r.CreateCollection({name:"entities"})),await(async e=>{const t=await e.query(r.Paginate(r.Indexes()));return Boolean(t.data.length)})(n)||await n.query(r.CreateIndex({name:"allEntities",source:r.Collection("entities")})),s(t),n},c=async e=>(await e.query(r.Map(r.Paginate(r.Match(r.Index("allEntities"))),r.Lambda("placeholderValue",r.Get(r.Var("placeholderValue")))))).data,l=async(e,t)=>{await e.query(r.Create(r.Collection("entities"),{data:t}))},u=async(e,t,a)=>{await e.query(r.Update(r.Ref(r.Collection("entities"),t),{data:a}))},y=async(e,t)=>{await e.query(r.Delete(r.Ref(r.Collection("entities"),t)))}}}]);
//# sourceMappingURL=2.bundle.js.map