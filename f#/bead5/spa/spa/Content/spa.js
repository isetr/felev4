// $begin{copyright}
//
// This file is part of WebSharper
//
// Copyright (c) 2008-2016 IntelliFactory
//
// Licensed under the Apache License, Version 2.0 (the "License"); you
// may not use this file except in compliance with the License.  You may
// obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied.  See the License for the specific language governing
// permissions and limitations under the License.
//
// $end{copyright}

IntelliFactory = {
    Runtime: {
        Ctor: function (ctor, typeFunction) {
            ctor.prototype = typeFunction.prototype;
            return ctor;
        },

        Cctor: function (cctor) {
            var init = true;
            return function () {
                if (init) {
                    init = false;
                    cctor();
                }
            };
        },

        Class: function (members, base, statics) {
            var proto = base ? new base() : {};
            var typeFunction = function (copyFrom) {
                if (copyFrom) {
                    for (var f in copyFrom) { this[f] = copyFrom[f] }
                }
            }
            for (var m in members) { proto[m] = members[m] }
            typeFunction.prototype = proto;
            if (statics) {
                for (var f in statics) { typeFunction[f] = statics[f] }
            }
            return typeFunction;
        },

        NewObject:
            function (kv) {
                var o = {};
                for (var i = 0; i < kv.length; i++) {
                    o[kv[i][0]] = kv[i][1];
                }
                return o;
            },

        DeleteEmptyFields:
            function (obj, fields) {
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    if (obj[f] === void (0)) { delete obj[f]; }
                }
                return obj;
            },

        GetOptional:
            function (value) {
                return (value === void (0)) ? null : { $: 1, $0: value };
            },

        SetOptional:
            function (obj, field, value) {
                if (value) {
                    obj[field] = value.$0;
                } else {
                    delete obj[field];
                }
            },

        SetOrDelete:
            function (obj, field, value) {
                if (value === void (0)) {
                    delete obj[field];
                } else {
                    obj[field] = value;
                }
            },

        Bind: function (f, obj) {
            return function () { return f.apply(this, arguments) };
        },

        CreateFuncWithArgs: function (f) {
            return function () { return f(Array.prototype.slice.call(arguments)) };
        },

        CreateFuncWithOnlyThis: function (f) {
            return function () { return f(this) };
        },

        CreateFuncWithThis: function (f) {
            return function () { return f(this).apply(null, arguments) };
        },

        CreateFuncWithThisArgs: function (f) {
            return function () { return f(this)(Array.prototype.slice.call(arguments)) };
        },

        CreateFuncWithRest: function (length, f) {
            return function () { return f(Array.prototype.slice.call(arguments, 0, length).concat([Array.prototype.slice.call(arguments, length)])) };
        },

        CreateFuncWithArgsRest: function (length, f) {
            return function () { return f([Array.prototype.slice.call(arguments, 0, length), Array.prototype.slice.call(arguments, length)]) };
        },

        BindDelegate: function (func, obj) {
            var res = func.bind(obj);
            res.$Func = func;
            res.$Target = obj;
            return res;
        },

        CreateDelegate: function (invokes) {
            if (invokes.length == 0) return null;
            if (invokes.length == 1) return invokes[0];
            var del = function () {
                var res;
                for (var i = 0; i < invokes.length; i++) {
                    res = invokes[i].apply(null, arguments);
                }
                return res;
            };
            del.$Invokes = invokes;
            return del;
        },

        CombineDelegates: function (dels) {
            var invokes = [];
            for (var i = 0; i < dels.length; i++) {
                var del = dels[i];
                if (del) {
                    if ("$Invokes" in del)
                        invokes = invokes.concat(del.$Invokes);
                    else
                        invokes.push(del);
                }
            }
            return IntelliFactory.Runtime.CreateDelegate(invokes);
        },

        DelegateEqual: function (d1, d2) {
            if (d1 === d2) return true;
            if (d1 == null || d2 == null) return false;
            var i1 = d1.$Invokes || [d1];
            var i2 = d2.$Invokes || [d2];
            if (i1.length != i2.length) return false;
            for (var i = 0; i < i1.length; i++) {
                var e1 = i1[i];
                var e2 = i2[i];
                if (!(e1 === e2 || ("$Func" in e1 && "$Func" in e2 && e1.$Func === e2.$Func && e1.$Target == e2.$Target)))
                    return false;
            }
            return true;
        },

        ThisFunc: function (d) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);
                return d.apply(null, args);
            };
        },

        ThisFuncOut: function (f) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return f.apply(args.shift(), args);
            };
        },

        ParamsFunc: function (length, d) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return d.apply(null, args.slice(0, length).concat([args.slice(length)]));
            };
        },

        ParamsFuncOut: function (length, f) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return f.apply(null, args.slice(0, length).concat(args[length]));
            };
        },

        ThisParamsFunc: function (length, d) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);
                return d.apply(null, args.slice(0, length + 1).concat([args.slice(length + 1)]));
            };
        },

        ThisParamsFuncOut: function (length, f) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return f.apply(args.shift(), args.slice(0, length).concat(args[length]));
            };
        },

        Curried: function (f, n, args) {
            args = args || [];
            return function (a) {
                var allArgs = args.concat([a === void (0) ? null : a]);
                if (n == 1)
                    return f.apply(null, allArgs);
                if (n == 2)
                    return function (a) { return f.apply(null, allArgs.concat([a === void (0) ? null : a])); }
                return IntelliFactory.Runtime.Curried(f, n - 1, allArgs);
            }
        },

        Curried2: function (f) {
            return function (a) { return function (b) { return f(a, b); } }
        },

        Curried3: function (f) {
            return function (a) { return function (b) { return function (c) { return f(a, b, c); } } }
        },

        UnionByType: function (types, value, optional) {
            var vt = typeof value;
            for (var i = 0; i < types.length; i++) {
                var t = types[i];
                if (typeof t == "number") {
                    if (Array.isArray(value) && (t == 0 || value.length == t)) {
                        return { $: i, $0: value };
                    }
                } else {
                    if (t == vt) {
                        return { $: i, $0: value };
                    }
                }
            }
            if (!optional) {
                throw new Error("Type not expected for creating Choice value.");
            }
        },

        OnLoad:
            function (f) {
                if (!("load" in this)) {
                    this.load = [];
                }
                this.load.push(f);
            },

        Start:
            function () {
                function run(c) {
                    for (var i = 0; i < c.length; i++) {
                        c[i]();
                    }
                }
                if ("init" in this) {
                    run(this.init);
                    this.init = [];
                }
                if ("load" in this) {
                    run(this.load);
                    this.load = [];
                }
            },
    }
}

IntelliFactory.Runtime.OnLoad(function () {
    if (window.WebSharper && WebSharper.Activator && WebSharper.Activator.Activate)
        WebSharper.Activator.Activate()
});

// Polyfill

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

if (!Math.trunc) {
    Math.trunc = function (x) {
        return x < 0 ? Math.ceil(x) : Math.floor(x);
    }
}

function ignore() { };
function id(x) { return x };
function fst(x) { return x[0] };
function snd(x) { return x[1] };
function trd(x) { return x[2] };

if (!console) {
    console = {
        count: ignore,
        dir: ignore,
        error: ignore,
        group: ignore,
        groupEnd: ignore,
        info: ignore,
        log: ignore,
        profile: ignore,
        profileEnd: ignore,
        time: ignore,
        timeEnd: ignore,
        trace: ignore,
        warn: ignore
    }
};
(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());
;
(function()
{
 "use strict";
 var Global,spa,Site,SC$1,WebSharper,Operators,UI,Next,Var,RouteMap,List,T,EndPoint,View,Snap,Abbrev,Fresh,Collections,Map,Arrays,Routing,Seq,Html,attr,Doc,AttrProxy,FormatException,JavaScript,Pervasives,FSharpMap,Unchecked,Route,Enumerator,T$1,Attrs,DomUtility,Docs,Client,DocNode,SC$2,MapUtil,JSModule,Slice,AppendList,T$2,Strings,Async,Array,AttrModule,DocElemNode,SC$3,Mailbox,BalancedTree,Tree,Pair,Elt,Attrs$1,Dyn,InsertPos,Docs$1,RunState,NodeSet,An,HashSet,Concurrency,Anims,SC$4,SC$5,HashSet$1,Scheduler,Easing,DomNodes,OperationCanceledException,SC$6,DynamicAttrNode,HashSetUtil,SC$7,Lazy,CancellationTokenSource,IntelliFactory,Runtime;
 Global=window;
 spa=Global.spa=Global.spa||{};
 Site=spa.Site=spa.Site||{};
 SC$1=Global.StartupCode$spa$Client=Global.StartupCode$spa$Client||{};
 WebSharper=Global.WebSharper=Global.WebSharper||{};
 Operators=WebSharper.Operators=WebSharper.Operators||{};
 UI=WebSharper.UI=WebSharper.UI||{};
 Next=UI.Next=UI.Next||{};
 Var=Next.Var=Next.Var||{};
 RouteMap=Next.RouteMap=Next.RouteMap||{};
 List=WebSharper.List=WebSharper.List||{};
 T=List.T=List.T||{};
 EndPoint=Site.EndPoint=Site.EndPoint||{};
 View=Next.View=Next.View||{};
 Snap=Next.Snap=Next.Snap||{};
 Abbrev=Next.Abbrev=Next.Abbrev||{};
 Fresh=Abbrev.Fresh=Abbrev.Fresh||{};
 Collections=WebSharper.Collections=WebSharper.Collections||{};
 Map=Collections.Map=Collections.Map||{};
 Arrays=WebSharper.Arrays=WebSharper.Arrays||{};
 Routing=Next.Routing=Next.Routing||{};
 Seq=WebSharper.Seq=WebSharper.Seq||{};
 Html=Next.Html=Next.Html||{};
 attr=Html.attr=Html.attr||{};
 Doc=Next.Doc=Next.Doc||{};
 AttrProxy=Next.AttrProxy=Next.AttrProxy||{};
 FormatException=WebSharper.FormatException=WebSharper.FormatException||{};
 JavaScript=WebSharper.JavaScript=WebSharper.JavaScript||{};
 Pervasives=JavaScript.Pervasives=JavaScript.Pervasives||{};
 FSharpMap=Collections.FSharpMap=Collections.FSharpMap||{};
 Unchecked=WebSharper.Unchecked=WebSharper.Unchecked||{};
 Route=Next.Route=Next.Route||{};
 Enumerator=WebSharper.Enumerator=WebSharper.Enumerator||{};
 T$1=Enumerator.T=Enumerator.T||{};
 Attrs=Next.Attrs=Next.Attrs||{};
 DomUtility=Next.DomUtility=Next.DomUtility||{};
 Docs=Next.Docs=Next.Docs||{};
 Client=Next.Client=Next.Client||{};
 DocNode=Client.DocNode=Client.DocNode||{};
 SC$2=Global.StartupCode$WebSharper_UI_Next$Abbrev=Global.StartupCode$WebSharper_UI_Next$Abbrev||{};
 MapUtil=Collections.MapUtil=Collections.MapUtil||{};
 JSModule=JavaScript.JSModule=JavaScript.JSModule||{};
 Slice=WebSharper.Slice=WebSharper.Slice||{};
 AppendList=Next.AppendList=Next.AppendList||{};
 T$2=Route.T=Route.T||{};
 Strings=WebSharper.Strings=WebSharper.Strings||{};
 Async=Abbrev.Async=Abbrev.Async||{};
 Array=Next.Array=Next.Array||{};
 AttrModule=Next.AttrModule=Next.AttrModule||{};
 DocElemNode=Next.DocElemNode=Next.DocElemNode||{};
 SC$3=Global.StartupCode$WebSharper_UI_Next$DomUtility=Global.StartupCode$WebSharper_UI_Next$DomUtility||{};
 Mailbox=Abbrev.Mailbox=Abbrev.Mailbox||{};
 BalancedTree=Collections.BalancedTree=Collections.BalancedTree||{};
 Tree=BalancedTree.Tree=BalancedTree.Tree||{};
 Pair=Collections.Pair=Collections.Pair||{};
 Elt=Next.Elt=Next.Elt||{};
 Attrs$1=Client.Attrs=Client.Attrs||{};
 Dyn=Attrs$1.Dyn=Attrs$1.Dyn||{};
 InsertPos=DomUtility.InsertPos=DomUtility.InsertPos||{};
 Docs$1=Client.Docs=Client.Docs||{};
 RunState=Docs$1.RunState=Docs$1.RunState||{};
 NodeSet=Docs$1.NodeSet=Docs$1.NodeSet||{};
 An=Next.An=Next.An||{};
 HashSet=Collections.HashSet=Collections.HashSet||{};
 Concurrency=WebSharper.Concurrency=WebSharper.Concurrency||{};
 Anims=Next.Anims=Next.Anims||{};
 SC$4=Global.StartupCode$WebSharper_UI_Next$Attr_Client=Global.StartupCode$WebSharper_UI_Next$Attr_Client||{};
 SC$5=Global.StartupCode$WebSharper_UI_Next$Animation=Global.StartupCode$WebSharper_UI_Next$Animation||{};
 HashSet$1=Abbrev.HashSet=Abbrev.HashSet||{};
 Scheduler=Concurrency.Scheduler=Concurrency.Scheduler||{};
 Easing=Next.Easing=Next.Easing||{};
 DomNodes=Docs$1.DomNodes=Docs$1.DomNodes||{};
 OperationCanceledException=WebSharper.OperationCanceledException=WebSharper.OperationCanceledException||{};
 SC$6=Global.StartupCode$WebSharper_Main$Concurrency=Global.StartupCode$WebSharper_Main$Concurrency||{};
 DynamicAttrNode=Next.DynamicAttrNode=Next.DynamicAttrNode||{};
 HashSetUtil=Collections.HashSetUtil=Collections.HashSetUtil||{};
 SC$7=Global.StartupCode$WebSharper_UI_Next$AppendList=Global.StartupCode$WebSharper_UI_Next$AppendList||{};
 Lazy=WebSharper.Lazy=WebSharper.Lazy||{};
 CancellationTokenSource=WebSharper.CancellationTokenSource=WebSharper.CancellationTokenSource||{};
 IntelliFactory=Global.IntelliFactory;
 Runtime=IntelliFactory&&IntelliFactory.Runtime;
 Site.Main=function()
 {
  SC$1.$cctor();
  return SC$1.Main;
 };
 Site.savedNumber=function()
 {
  SC$1.$cctor();
  return SC$1.savedNumber;
 };
 Site.routeMap=function()
 {
  SC$1.$cctor();
  return SC$1.routeMap;
 };
 Site.CalcPage=function(go)
 {
  var viewEven,viewIsPrime,n,viewLogTwo,n$1,x,viewMod100,views,tableRow,a,a$1,a$2,a$3,a$4,a$5,a$6,a$7,a$8,a$9,a$10,a$11;
  viewEven=Site.savedNumber()%2===0;
  viewIsPrime=(n=Site.savedNumber(),!Seq.fold(function($1,$2)
  {
   return $1?true:$2;
  },false,List.ofSeq(Seq.delay(function()
  {
   return Seq.map(function(i)
   {
    return n%i===0;
   },Operators.range(2,n/2>>0));
  }))));
  viewLogTwo=(n$1=(x=Site.savedNumber(),Global.Number(x)),Global.Math.log(n$1)/Global.Math.log(2));
  viewMod100=Site.savedNumber()%100;
  views=List.ofArray([["A szamod",Global.String(Site.savedNumber())],["Paros-e",Global.String(viewEven)],["Prim-e",Global.String(viewIsPrime)],["Log2",Global.String(viewLogTwo)],["mod 100",Global.String(viewMod100)]]);
  tableRow=function(label,view)
  {
   var a$12,a$13,a$14,a$15;
   a$12=[(a$13=[Doc.TextNode(label)],Doc.Element("td",[],a$13)),(a$14=[AttrProxy.Create("style","width:66%")],(a$15=[Doc.TextNode(view)],Doc.Element("td",a$14,a$15)))];
   return Doc.Element("tr",[],a$12);
  };
  a=[Site.cls("panel panel-default")];
  a$1=[(a$2=[Site.cls("panel-heading")],(a$3=[(a$4=[Site.cls("panel-title")],(a$5=[Doc.TextNode("Output")],Doc.Element("h3",a$4,a$5)))],Doc.Element("div",a$2,a$3))),(a$6=[Site.cls("panel-body")],(a$7=[(a$8=[Site.cls("table")],(a$9=[(a$10=[Doc.Concat(List.map(function($1)
  {
   return tableRow($1[0],$1[1]);
  },views))],Doc.Element("tbody",[],a$10))],Doc.Element("table",a$8,a$9))),(a$11=[Site.cls("btn")],Doc.Button("Vissza a szam megadasara",a$11,function()
  {
   go(new EndPoint({
    $:0
   }));
  }))],Doc.Element("div",a$6,a$7)))];
  return Doc.Element("div",a,a$1);
 };
 Site.IndexPage=function(go)
 {
  var a,a$1,a$2,a$3,a$4,a$5,a$6,a$7,a$8,a$9,a$10,a$11,a$12,a$13,a$14,a$15,a$16,a$17,a$18,a$19;
  a=[Site.cls("panel panel-default")];
  a$1=[(a$2=[Site.cls("panel-heading")],(a$3=[(a$4=[Site.cls("panel-title")],(a$5=[Doc.TextNode("Input")],Doc.Element("h3",a$4,a$5)))],Doc.Element("div",a$2,a$3))),(a$6=[Site.cls("panel-body")],(a$7=[(a$8=[Site.cls("form-horizontal"),AttrProxy.Create("role","form")],(a$9=[(a$10=[Site.cls("form-group")],(a$11=[(a$12=[Site.cls("col-sm-4 control-label"),AttrProxy.Create("for","inputBox")],(a$13=[Doc.TextNode("Adj meg egy szamot: ")],Doc.Element("label",a$12,a$13))),(a$14=[Site.cls("col-sm-4")],(a$15=[(a$16=[Site.cls("form-control"),AttrProxy.Create("id","inputBox")],(a$17=Site.rvSavedNumber(),Doc.Input(a$16,a$17)))],Doc.Element("div",a$14,a$15)))],Doc.Element("div",a$10,a$11))),(a$18=[Site.cls("btn")],Doc.Button("Szam mentese",a$18,function()
  {
   var $1;
   try
   {
    Site.set_savedNumber(($1=Global.parseInt(Site.rvSavedNumber().c),Global.isNaN($1)?new FormatException.New("Input string was not in a correct format."):$1));
   }
   catch(m)
   {
    null;
   }
  })),(a$19=[Site.cls("btn")],Doc.Button("Szamolas",a$19,function()
  {
   go(new EndPoint({
    $:1
   }));
  }))],Doc.Element("form",a$8,a$9)))],Doc.Element("div",a$6,a$7)))];
  return Doc.Element("div",a,a$1);
 };
 Site.cls=function(s)
 {
  return AttrProxy.Create("class",s);
 };
 Site.rvSavedNumber=function()
 {
  SC$1.$cctor();
  return SC$1.rvSavedNumber;
 };
 Site.set_savedNumber=function($1)
 {
  SC$1.$cctor();
  SC$1.savedNumber=$1;
 };
 SC$1.$cctor=Runtime.Cctor(function()
 {
  var a,router,a$1,a$2;
  SC$1.savedNumber=0;
  SC$1.rvSavedNumber=Var.Create$1(Global.String(Site.savedNumber()));
  SC$1.routeMap=(a=function(a$3)
  {
   return a$3.$==1?List.ofArray(["calc"]):new T({
    $:0
   });
  },function(a$3)
  {
   return RouteMap.Create(a,a$3);
  }(function(a$3)
  {
   var $1;
   switch(a$3.$==1?a$3.$0==="calc"?a$3.$1.$==0?1:2:2:0)
   {
    case 0:
     return new EndPoint({
      $:0
     });
     break;
    case 1:
     return new EndPoint({
      $:1
     });
     break;
    case 2:
     return Operators.FailWith("404");
     break;
   }
  }));
  SC$1.Main=(router=RouteMap.Install(Site.routeMap()),(a$1=Doc.EmbedView((a$2=function(pty)
  {
   function go(a$3)
   {
    Var.Set(router,a$3);
   }
   return pty.$==1?Site.CalcPage(go):Site.IndexPage(go);
  },function(a$3)
  {
   return View.Map(a$2,a$3);
  }(router.v))),Doc.RunById("main",a$1)));
  SC$1.$cctor=Global.ignore;
 });
 Operators.FailWith=function(msg)
 {
  throw Global.Error(msg);
 };
 Operators.range=function(min,max)
 {
  var count;
  count=1+max-min;
  return count<=0?[]:Seq.init(count,function(x)
  {
   return x+min;
  });
 };
 Operators.KeyValue=function(kvp)
 {
  return[kvp.K,kvp.V];
 };
 Operators.Compare=function(a,b)
 {
  return Unchecked.Compare(a,b);
 };
 Operators.Max=function(a,b)
 {
  return Unchecked.Compare(a,b)===1?a:b;
 };
 Operators.DefaultArg=function(x,d)
 {
  return x==null?d:x.$0;
 };
 Var.Create$1=function(v)
 {
  var _var;
  _var=null;
  _var=Var.New(false,v,Snap.CreateWithValue(v),Fresh.Int(),function()
  {
   return _var.s;
  });
  return _var;
 };
 Var.Set=function(_var,value)
 {
  if(_var.o)
   (function($1)
   {
    return $1("WebSharper UI.Next: invalid attempt to change value of a Var after calling SetFinal");
   }(function(s)
   {
    Global.console.log(s);
   }));
  else
   {
    Snap.MarkObsolete(_var.s);
    _var.c=value;
    _var.s=Snap.CreateWithValue(value);
   }
 };
 RouteMap.Create=function(ser,des)
 {
  var f;
  return{
   Des:(f=function(t)
   {
    return t[0];
   },function(x)
   {
    return des(f(x));
   }),
   Ser:function(x)
   {
    return[ser(x),new FSharpMap.New([])];
   }
  };
 };
 RouteMap.Install=function(map)
 {
  return Routing.InstallMap(map);
 };
 List.ofArray=function(arr)
 {
  var r,i,$1;
  r=new T({
   $:0
  });
  for(i=Arrays.length(arr)-1,$1=0;i>=$1;i--)r=new T({
   $:1,
   $0:Arrays.get(arr,i),
   $1:r
  });
  return r;
 };
 List.map=function(f,x)
 {
  var r,l,res;
  res=new T({
   $:0
  });
  r=res;
  l=x;
  while(l.$==1)
   {
    List.setValue(r,f(l.$0));
    r=List.setTail(r,new T({
     $:0
    }));
    l=l.$1;
   }
  return res;
 };
 List.ofSeq=function(s)
 {
  var last,res,e;
  if(s instanceof T)
   return s;
  else
   if(s instanceof Global.Array)
    return List.ofArray(s);
   else
    {
     res=new T({
      $:0
     });
     last=res;
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        List.setValue(last,e.Current());
        last=List.setTail(last,new T({
         $:0
        }));
       }
      last.$=0;
      return res;
     }
     finally
     {
      if("Dispose"in e)
       e.Dispose();
     }
    }
 };
 List.setValue=function(l,v)
 {
  l.$=1;
  l.$0=v;
 };
 List.setTail=function(l,t)
 {
  l.$1=t;
  return t;
 };
 List.head=function(l)
 {
  return l.$==1?l.$0:List.listEmpty();
 };
 List.tail=function(l)
 {
  return l.$==1?l.$1:List.listEmpty();
 };
 List.listEmpty=function()
 {
  return Operators.FailWith("The input list was empty.");
 };
 T=List.T=Runtime.Class({
  GetEnumerator:function()
  {
   return new T$1.New(this,null,function(e)
   {
    var m;
    m=e.s;
    return m.$==0?false:(e.c=m.$0,e.s=m.$1,true);
   },void 0);
  }
 },null,T);
 EndPoint=Site.EndPoint=Runtime.Class({},null,EndPoint);
 View.Map=function(fn,a)
 {
  return View.CreateLazy(function()
  {
   var a$1;
   a$1=a();
   return Snap.Map(fn,a$1);
  });
 };
 View.CreateLazy=function(observe)
 {
  var lv;
  lv={
   c:null,
   o:observe
  };
  return function()
  {
   var c;
   c=lv.c;
   return c===null?(c=lv.o(),lv.c=c,Snap.IsForever(c)?lv.o=null:Snap.WhenObsolete(c,function()
   {
    lv.c=null;
   }),c):c;
  };
 };
 View.Sink=function(act,a)
 {
  function loop()
  {
   var sn;
   sn=a();
   Snap.When(sn,act,function()
   {
    Async.Schedule(loop);
   });
  }
  Async.Schedule(loop);
 };
 View.Bind=function(fn,view)
 {
  return View.Join(View.Map(fn,view));
 };
 View.Const=function(x)
 {
  var o;
  o=Snap.CreateForever(x);
  return function()
  {
   return o;
  };
 };
 View.Join=function(a)
 {
  return View.CreateLazy(function()
  {
   return Snap.Join(a());
  });
 };
 View.Map2Unit=function(a,a$1)
 {
  return View.CreateLazy(function()
  {
   var s1,s2;
   s1=a();
   s2=a$1();
   return Snap.Map2Unit(s1,s2);
  });
 };
 Var=Next.Var=Runtime.Class({
  RUpdM:function(f)
  {
   var m;
   m=f(this.c);
   (m!=null?m.$==1:false)?Var.Set(this,m.$0):null;
  },
  RView:function()
  {
   return this.v;
  }
 },null,Var);
 Var.New=function(Const,Current,Snap$1,Id,VarView)
 {
  return new Var({
   o:Const,
   c:Current,
   s:Snap$1,
   i:Id,
   v:VarView
  });
 };
 Snap.CreateWithValue=function(v)
 {
  return Snap.Make({
   $:2,
   $0:v,
   $1:[]
  });
 };
 Snap.MarkObsolete=function(sn)
 {
  var m,$1;
  m=sn.s;
  (m.$==1?true:m.$==2?($1=m.$1,false):m.$==3?($1=m.$1,false):true)?null:(sn.s={
   $:1
  },Seq.iter(function(k)
  {
   k();
  },$1));
 };
 Snap.Map=function(fn,sn)
 {
  var m,res,g;
  m=sn.s;
  return m.$==0?Snap.CreateForever(fn(m.$0)):(res=Snap.Create(),(Snap.When(sn,(g=function(v)
  {
   Snap.MarkDone(res,sn,v);
  },function(x)
  {
   return g(fn(x));
  }),Snap.Obs(res)),res));
 };
 Snap.Make=function(st)
 {
  return{
   s:st
  };
 };
 Snap.IsForever=function(snap)
 {
  return snap.s.$==0?true:false;
 };
 Snap.WhenObsolete=function(snap,obsolete)
 {
  var m;
  m=snap.s;
  m.$==1?obsolete():m.$==2?m.$1.push(obsolete):m.$==3?m.$1.push(obsolete):null;
 };
 Snap.CreateForever=function(v)
 {
  return Snap.Make({
   $:0,
   $0:v
  });
 };
 Snap.Create=function()
 {
  return Snap.Make({
   $:3,
   $0:[],
   $1:[]
  });
 };
 Snap.When=function(snap,avail,obsolete)
 {
  var m;
  m=snap.s;
  m.$==1?obsolete():m.$==2?(m.$1.push(obsolete),avail(m.$0)):m.$==3?(m.$0.push(avail),m.$1.push(obsolete)):avail(m.$0);
 };
 Snap.MarkDone=function(res,sn,v)
 {
  if(Snap.IsForever(sn))
   Snap.MarkForever(res,v);
  else
   Snap.MarkReady(res,v);
 };
 Snap.Obs=function(sn)
 {
  return function()
  {
   Snap.MarkObsolete(sn);
  };
 };
 Snap.MarkForever=function(sn,v)
 {
  var m;
  m=sn.s;
  m.$==3?(sn.s={
   $:0,
   $0:v
  },Seq.iter(function(k)
  {
   k(v);
  },m.$0)):null;
 };
 Snap.MarkReady=function(sn,v)
 {
  var m;
  m=sn.s;
  m.$==3?(sn.s={
   $:2,
   $0:v,
   $1:m.$1
  },Seq.iter(function(k)
  {
   k(v);
  },m.$0)):null;
 };
 Snap.Join=function(snap)
 {
  var res,obs;
  res=Snap.Create();
  obs=Snap.Obs(res);
  Snap.When(snap,function(x)
  {
   var y;
   y=x();
   Snap.When(y,function(v)
   {
    if(Snap.IsForever(y)?Snap.IsForever(snap):false)
     Snap.MarkForever(res,v);
    else
     Snap.MarkReady(res,v);
   },obs);
  },obs);
  return res;
 };
 Snap.Map2Unit=function(sn1,sn2)
 {
  var $1,res,obs;
  function cont()
  {
   var $2,$3;
   if(!Snap.IsDone(res))
    {
     $2=Snap.ValueAndForever(sn1);
     $3=Snap.ValueAndForever(sn2);
     ($2!=null?$2.$==1:false)?($3!=null?$3.$==1:false)?($2.$0[1]?$3.$0[1]:false)?Snap.MarkForever(res,null):Snap.MarkReady(res,null):null:null;
    }
  }
  $1=sn2.s;
  return sn1.s.$==0?$1.$==0?Snap.CreateForever():sn2:$1.$==0?sn1:(res=Snap.Create(),(obs=Snap.Obs(res),(Snap.When(sn1,cont,obs),Snap.When(sn2,cont,obs),res)));
 };
 Snap.IsDone=function(snap)
 {
  var m;
  m=snap.s;
  return m.$==0?true:m.$==2?true:false;
 };
 Snap.ValueAndForever=function(snap)
 {
  var m;
  m=snap.s;
  return m.$==0?{
   $:1,
   $0:[m.$0,true]
  }:m.$==2?{
   $:1,
   $0:[m.$0,false]
  }:null;
 };
 Fresh.Int=function()
 {
  Fresh.set_counter(Fresh.counter()+1);
  return Fresh.counter();
 };
 Fresh.set_counter=function($1)
 {
  SC$2.$cctor();
  SC$2.counter=$1;
 };
 Fresh.counter=function()
 {
  SC$2.$cctor();
  return SC$2.counter;
 };
 Map.OfArray=function(a)
 {
  var t;
  t=BalancedTree.OfSeq(Seq.map(function($1)
  {
   return Pair.New($1[0],$1[1]);
  },a));
  return new FSharpMap.New$1(t);
 };
 Arrays.get=function(arr,n)
 {
  Arrays.checkBounds(arr,n);
  return arr[n];
 };
 Arrays.length=function(arr)
 {
  return arr.dims===2?arr.length*arr.length:arr.length;
 };
 Arrays.checkBounds=function(arr,n)
 {
  if(n<0?true:n>=arr.length)
   Operators.FailWith("Index was outside the bounds of the array.");
 };
 Arrays.set=function(arr,n,x)
 {
  Arrays.checkBounds(arr,n);
  arr[n]=x;
 };
 Routing.InstallMap=function(rt)
 {
  var win,same,cur,_var,set,a;
  function onUpdate(evt)
  {
   return set(cur());
  }
  win=Global.window;
  same=function(a$1,b)
  {
   return Unchecked.Equals(rt.Ser(a$1),rt.Ser(b));
  };
  cur=function()
  {
   return rt.Des(Route.ToList(Route.ParseHash(win.location.hash)));
  };
  _var=Var.Create$1(cur());
  set=function(value)
  {
   if(!same(_var.c,value))
    Var.Set(_var,value);
  };
  win.onpopstate=onUpdate;
  win.onhashchange=onUpdate;
  a=function(loc)
  {
   var ha,t;
   ha=Route.MakeHash((t=rt.Ser(loc),Route.FromList(t[0],t[1])));
   !Route.SameHash(win.location.hash,ha)?win.location.replace("#"+ha):null;
  };
  (function(a$1)
  {
   View.Sink(a,a$1);
  }(_var.v));
  return _var;
 };
 Seq.fold=function(f,x,s)
 {
  var r,e;
  r=x;
  e=Enumerator.Get(s);
  try
  {
   while(e.MoveNext())
    r=f(r,e.Current());
   return r;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.delay=function(f)
 {
  return{
   GetEnumerator:function()
   {
    return Enumerator.Get(f());
   }
  };
 };
 Seq.map=function(f,s)
 {
  return{
   GetEnumerator:function()
   {
    var en;
    en=Enumerator.Get(s);
    return new T$1.New(null,null,function(e)
    {
     return en.MoveNext()?(e.c=f(en.Current()),true):false;
    },function()
    {
     en.Dispose();
    });
   }
  };
 };
 Seq.iter=function(p,s)
 {
  var e;
  e=Enumerator.Get(s);
  try
  {
   while(e.MoveNext())
    p(e.Current());
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.init=function(n,f)
 {
  return Seq.take(n,Seq.initInfinite(f));
 };
 Seq.take=function(n,s)
 {
  n<0?Seq.nonNegative():null;
  return{
   GetEnumerator:function()
   {
    var e;
    e=[Enumerator.Get(s)];
    return new T$1.New(0,null,function(o)
    {
     var en;
     o.s=o.s+1;
     return o.s>n?false:(en=e[0],Unchecked.Equals(en,null)?Seq.insufficient():en.MoveNext()?(o.c=en.Current(),o.s===n?(en.Dispose(),void(e[0]=null)):null,true):(en.Dispose(),e[0]=null,Seq.insufficient()));
    },function()
    {
     var x;
     x=e[0];
     !Unchecked.Equals(x,null)?x.Dispose():null;
    });
   }
  };
 };
 Seq.initInfinite=function(f)
 {
  return{
   GetEnumerator:function()
   {
    return new T$1.New(0,null,function(e)
    {
     e.c=f(e.s);
     e.s=e.s+1;
     return true;
    },void 0);
   }
  };
 };
 Seq.append=function(s1,s2)
 {
  return{
   GetEnumerator:function()
   {
    var e1,first;
    e1=Enumerator.Get(s1);
    first=[true];
    return new T$1.New(e1,null,function(x)
    {
     var x$1;
     return x.s.MoveNext()?(x.c=x.s.Current(),true):(x$1=x.s,!Unchecked.Equals(x$1,null)?x$1.Dispose():null,x.s=null,first[0]?(first[0]=false,x.s=Enumerator.Get(s2),x.s.MoveNext()?(x.c=x.s.Current(),true):(x.s.Dispose(),x.s=null,false)):false);
    },function(x)
    {
     var x$1;
     x$1=x.s;
     !Unchecked.Equals(x$1,null)?x$1.Dispose():null;
    });
   }
  };
 };
 Seq.collect=function(f,s)
 {
  return Seq.concat(Seq.map(f,s));
 };
 Seq.distinctBy=function(f,s)
 {
  return{
   GetEnumerator:function()
   {
    var o,seen;
    o=Enumerator.Get(s);
    seen=new HashSet.New$3();
    return new T$1.New(null,null,function(e)
    {
     var cur,has;
     if(o.MoveNext())
      {
       cur=o.Current();
       has=seen.Add(f(cur));
       while(!has?o.MoveNext():false)
        {
         cur=o.Current();
         has=seen.Add(f(cur));
        }
       return has?(e.c=cur,true):false;
      }
     else
      return false;
    },function()
    {
     o.Dispose();
    });
   }
  };
 };
 Seq.forall2=function(p,s1,s2)
 {
  return!Seq.exists2(function($1,$2)
  {
   return!p($1,$2);
  },s1,s2);
 };
 Seq.concat=function(ss)
 {
  return{
   GetEnumerator:function()
   {
    var outerE;
    outerE=Enumerator.Get(ss);
    return new T$1.New(null,null,function(st)
    {
     var m;
     while(true)
      {
       m=st.s;
       if(Unchecked.Equals(m,null))
        {
         if(outerE.MoveNext())
          {
           st.s=Enumerator.Get(outerE.Current());
           st=st;
          }
         else
          {
           outerE.Dispose();
           return false;
          }
        }
       else
        {
         if(m.MoveNext())
          {
           st.c=m.Current();
           return true;
          }
         else
          {
           st.Dispose();
           st.s=null;
           st=st;
          }
        }
      }
    },function(st)
    {
     var x;
     x=st.s;
     !Unchecked.Equals(x,null)?x.Dispose():null;
     !Unchecked.Equals(outerE,null)?outerE.Dispose():null;
    });
   }
  };
 };
 Seq.distinct=function(s)
 {
  return Seq.distinctBy(Global.id,s);
 };
 Seq.exists2=function(p,s1,s2)
 {
  var e1,$1,e2,r;
  e1=Enumerator.Get(s1);
  try
  {
   e2=Enumerator.Get(s2);
   try
   {
    r=false;
    while((!r?e1.MoveNext():false)?e2.MoveNext():false)
     r=p(e1.Current(),e2.Current());
    $1=r;
   }
   finally
   {
    if("Dispose"in e2)
     e2.Dispose();
   }
   return $1;
  }
  finally
  {
   if("Dispose"in e1)
    e1.Dispose();
  }
 };
 Seq.max=function(s)
 {
  return Seq.reduce(function($1,$2)
  {
   return Unchecked.Compare($1,$2)>=0?$1:$2;
  },s);
 };
 Seq.reduce=function(f,source)
 {
  var e,r;
  e=Enumerator.Get(source);
  try
  {
   if(!e.MoveNext())
    Operators.FailWith("The input sequence was empty");
   r=e.Current();
   while(e.MoveNext())
    r=f(r,e.Current());
   return r;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.unfold=function(f,s)
 {
  return{
   GetEnumerator:function()
   {
    return new T$1.New(s,null,function(e)
    {
     var m;
     m=f(e.s);
     return m==null?false:(e.c=m.$0[0],e.s=m.$0[1],true);
    },void 0);
   }
  };
 };
 Seq.compareWith=function(f,s1,s2)
 {
  var e1,$1,e2,r,loop;
  e1=Enumerator.Get(s1);
  try
  {
   e2=Enumerator.Get(s2);
   try
   {
    r=0;
    loop=true;
    while(loop?r===0:false)
     if(e1.MoveNext())
     {
      if(e2.MoveNext())
       r=f(e1.Current(),e2.Current());
      else
       r=1;
     }
     else
      if(e2.MoveNext())
       r=-1;
      else
       loop=false;
    $1=r;
   }
   finally
   {
    if("Dispose"in e2)
     e2.Dispose();
   }
   return $1;
  }
  finally
  {
   if("Dispose"in e1)
    e1.Dispose();
  }
 };
 attr=Html.attr=Runtime.Class({},null,attr);
 Doc=Next.Doc=Runtime.Class({},null,Doc);
 Doc.EmbedView=function(view)
 {
  var node,x,a,a$1,a$2;
  node=Docs.CreateEmbedNode();
  x=(a=function()
  {
  },function(a$3)
  {
   return View.Map(a,a$3);
  }((a$1=function(doc)
  {
   Docs.UpdateEmbedNode(node,doc.docNode);
   return doc.updates;
  },function(a$3)
  {
   return View.Bind(a$1,a$3);
  }(view))));
  a$2=new DocNode({
   $:2,
   $0:node
  });
  return Doc.Mk(a$2,x);
 };
 Doc.RunById=function(id,tr)
 {
  var m;
  m=DomUtility.Doc().getElementById(id);
  Unchecked.Equals(m,null)?Operators.FailWith("invalid id: "+id):Doc.Run(m,tr);
 };
 Doc.Element=function(name,attr$1,children)
 {
  var attr$2,children$1,a;
  attr$2=AttrProxy.Concat(attr$1);
  children$1=Doc.Concat(children);
  a=DomUtility.CreateElement(name);
  return Elt.New(a,attr$2,children$1);
 };
 Doc.Concat=function(xs)
 {
  var x,d;
  x=Array.ofSeqNonCopying(xs);
  d=Doc.Empty();
  return Array.TreeReduce(d,Doc.Append,x);
 };
 Doc.Button=function(caption,attrs,action)
 {
  var attrs$1,el,a;
  attrs$1=AttrProxy.Concat(attrs);
  el=Doc.Clickable("button",action);
  a=Doc.TextNode(caption);
  return Elt.New(el,attrs$1,a);
 };
 Doc.TextNode=function(v)
 {
  var a,a$1;
  a=new DocNode({
   $:5,
   $0:DomUtility.CreateText(v)
  });
  a$1=View.Const();
  return Doc.Mk(a,a$1);
 };
 Doc.Input=function(attr$1,_var)
 {
  return Doc.InputInternal("input",function()
  {
   return Seq.append(attr$1,[AttrModule.Value(_var)]);
  });
 };
 Doc.Mk=function(node,updates)
 {
  return new Doc.New(node,updates);
 };
 Doc.Run=function(parent,doc)
 {
  var d,st,p;
  d=doc.docNode;
  Docs.LinkElement(parent,d);
  st=Docs.CreateRunState(parent,d);
  p=Mailbox.StartProcessor(Docs.PerformAnimatedUpdate(st,d));
  View.Sink(p,doc.updates);
 };
 Doc.Empty=function()
 {
  var a,a$1;
  a=new DocNode({
   $:3
  });
  a$1=View.Const();
  return Doc.Mk(a,a$1);
 };
 Doc.Append=function(a,b)
 {
  var x,a$1;
  x=View.Map2Unit(a.updates,b.updates);
  a$1=new DocNode({
   $:0,
   $0:a.docNode,
   $1:b.docNode
  });
  return Doc.Mk(a$1,x);
 };
 Doc.Clickable=function(elem,action)
 {
  var el;
  el=DomUtility.CreateElement(elem);
  el.addEventListener("click",function(ev)
  {
   ev.preventDefault();
   return action();
  },false);
  return el;
 };
 Doc.InputInternal=function(elemTy,attr$1)
 {
  var el,a,a$1;
  el=DomUtility.CreateElement(elemTy);
  a=AttrProxy.Concat(attr$1(el));
  a$1=Doc.Empty();
  return Elt.New(el,a,a$1);
 };
 Doc.New=Runtime.Ctor(function(docNode,updates)
 {
  this.docNode=docNode;
  this.updates=updates;
  null;
 },Doc);
 AttrProxy=Next.AttrProxy=Runtime.Class({},null,AttrProxy);
 AttrProxy.Create=function(name,value)
 {
  return Attrs.Static(function(el)
  {
   DomUtility.SetAttr(el,name,value);
  });
 };
 AttrProxy.Concat=function(xs)
 {
  var x,d;
  x=Array.ofSeqNonCopying(xs);
  d=Attrs.EmptyAttr();
  return Array.TreeReduce(d,AttrProxy.Append,x);
 };
 AttrProxy.Append=function(a,b)
 {
  return Attrs.AppendTree(a,b);
 };
 FormatException=WebSharper.FormatException=Runtime.Class({},Global.Error,FormatException);
 FormatException.New=Runtime.Ctor(function()
 {
  FormatException.New$1.call(this,"One of the identified items was in an invalid format.");
 },FormatException);
 FormatException.New$1=Runtime.Ctor(function(message)
 {
  this.message=message;
  null;
 },FormatException);
 Pervasives.NewFromSeq=function(fields)
 {
  var r,e,f;
  r={};
  e=Enumerator.Get(fields);
  try
  {
   while(e.MoveNext())
    {
     f=e.Current();
     r[f[0]]=f[1];
    }
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
  return r;
 };
 View=Next.View=Runtime.Class({},null,View);
 FSharpMap=Collections.FSharpMap=Runtime.Class({
  Equals:function(other)
  {
   return this.get_Count()===other.get_Count()?Seq.forall2(Unchecked.Equals,this,other):false;
  },
  get_IsEmpty:function()
  {
   return this.tree==null;
  },
  get_Count:function()
  {
   var tree;
   tree=this.tree;
   return tree==null?0:tree.Count;
  },
  GetEnumerator$1:function()
  {
   var m;
   return Enumerator.Get((m=function(kv)
   {
    return{
     K:kv.Key,
     V:kv.Value
    };
   },function(s)
   {
    return Seq.map(m,s);
   }(BalancedTree.Enumerate(false,this.tree))));
  },
  GetHashCode:function()
  {
   return Unchecked.Hash(Arrays.ofSeq(this));
  },
  GetEnumerator:function()
  {
   return this.GetEnumerator$1();
  },
  CompareTo0:function(other)
  {
   return Seq.compareWith(Operators.Compare,this,other);
  }
 },null,FSharpMap);
 FSharpMap.New=Runtime.Ctor(function(s)
 {
  FSharpMap.New$1.call(this,MapUtil.fromSeq(s));
 },FSharpMap);
 FSharpMap.New$1=Runtime.Ctor(function(tree)
 {
  this.tree=tree;
  null;
 },FSharpMap);
 Unchecked.Equals=function(a,b)
 {
  var m,eqR;
  return a===b?true:(m=typeof a,m=="object"?(((a===null?true:a===void 0)?true:b===null)?true:b===void 0)?false:"Equals"in a?a.Equals(b):(a instanceof Global.Array?b instanceof Global.Array:false)?Unchecked.arrayEquals(a,b):(a instanceof Global.Date?b instanceof Global.Date:false)?Unchecked.dateEquals(a,b):(eqR=[true],(JSModule.ForEach(a,function(k)
  {
   eqR[0]=!a.hasOwnProperty(k)?true:b.hasOwnProperty(k)?Unchecked.Equals(a[k],b[k]):false;
   return!eqR[0];
  }),eqR[0]?JSModule.ForEach(b,function(k)
  {
   eqR[0]=!b.hasOwnProperty(k)?true:a.hasOwnProperty(k);
   return!eqR[0];
  }):null,eqR[0])):m=="function"?"$Func"in a?a.$Func===b.$Func?a.$Target===b.$Target:false:("$Invokes"in a?"$Invokes"in b:false)?Unchecked.arrayEquals(a.$Invokes,b.$Invokes):false:false);
 };
 Unchecked.arrayEquals=function(a,b)
 {
  var eq,i;
  if(Arrays.length(a)===Arrays.length(b))
   {
    eq=true;
    i=0;
    while(eq?i<Arrays.length(a):false)
     {
      !Unchecked.Equals(Arrays.get(a,i),Arrays.get(b,i))?void(eq=false):null;
      i=i+1;
     }
    return eq;
   }
  else
   return false;
 };
 Unchecked.dateEquals=function(a,b)
 {
  return a.getTime()===b.getTime();
 };
 Unchecked.Compare=function(a,b)
 {
  var $1,m,cmp;
  if(a===b)
   return 0;
  else
   {
    m=typeof a;
    switch(m=="function"?1:m=="boolean"?2:m=="number"?2:m=="string"?2:m=="object"?3:0)
    {
     case 0:
      return typeof b=="undefined"?0:-1;
      break;
     case 1:
      return Operators.FailWith("Cannot compare function values.");
      break;
     case 2:
      return a<b?-1:1;
      break;
     case 3:
      return a===null?-1:b===null?1:"CompareTo"in a?a.CompareTo(b):"CompareTo0"in a?a.CompareTo0(b):(a instanceof Global.Array?b instanceof Global.Array:false)?Unchecked.compareArrays(a,b):(a instanceof Global.Date?b instanceof Global.Date:false)?Unchecked.compareDates(a,b):(cmp=[0],JSModule.ForEach(a,function(k)
      {
       return!a.hasOwnProperty(k)?false:!b.hasOwnProperty(k)?(cmp[0]=1,true):(cmp[0]=Unchecked.Compare(a[k],b[k]),cmp[0]!==0);
      }),cmp[0]===0?JSModule.ForEach(b,function(k)
      {
       return!b.hasOwnProperty(k)?false:!a.hasOwnProperty(k)?(cmp[0]=-1,true):false;
      }):null,cmp[0]);
      break;
    }
   }
 };
 Unchecked.Hash=function(o)
 {
  var m;
  m=typeof o;
  return m=="function"?0:m=="boolean"?o?1:0:m=="number"?o:m=="string"?Unchecked.hashString(o):m=="object"?o==null?0:o instanceof Global.Array?Unchecked.hashArray(o):Unchecked.hashObject(o):0;
 };
 Unchecked.compareArrays=function(a,b)
 {
  var cmp,i;
  if(Arrays.length(a)<Arrays.length(b))
   return -1;
  else
   if(Arrays.length(a)>Arrays.length(b))
    return 1;
   else
    {
     cmp=0;
     i=0;
     while(cmp===0?i<Arrays.length(a):false)
      {
       cmp=Unchecked.Compare(Arrays.get(a,i),Arrays.get(b,i));
       i=i+1;
      }
     return cmp;
    }
 };
 Unchecked.compareDates=function(a,b)
 {
  return Operators.Compare(a.getTime(),b.getTime());
 };
 Unchecked.hashString=function(s)
 {
  var hash,i,$1;
  if(s===null)
   return 0;
  else
   {
    hash=5381;
    for(i=0,$1=s.length-1;i<=$1;i++)hash=Unchecked.hashMix(hash,s.charCodeAt(i)<<0);
    return hash;
   }
 };
 Unchecked.hashArray=function(o)
 {
  var h,i,$1;
  h=-34948909;
  for(i=0,$1=Arrays.length(o)-1;i<=$1;i++)h=Unchecked.hashMix(h,Unchecked.Hash(Arrays.get(o,i)));
  return h;
 };
 Unchecked.hashObject=function(o)
 {
  var _,h;
  return"GetHashCode"in o?o.GetHashCode():(_=Unchecked.hashMix,(h=[0],(JSModule.ForEach(o,function(key)
  {
   h[0]=_(_(h[0],Unchecked.hashString(key)),Unchecked.Hash(o[key]));
   return false;
  }),h[0])));
 };
 Unchecked.hashMix=function(x,y)
 {
  return(x<<5)+x+y;
 };
 Route.ParseHash=function(hash)
 {
  var hash$1,p,m,path,path$1,a,query,m$1;
  hash$1=Route.NoHash(hash);
  p=(m=hash$1.indexOf(Global.String.fromCharCode(63)),m===-1?[hash$1,""]:[Slice.string(hash$1,null,{
   $:1,
   $0:m-1
  }),Slice.string(hash$1,{
   $:1,
   $0:m+1
  },null)]);
  path=p[0];
  path$1=AppendList.FromArray(path===""?[]:(a=Strings.SplitChars(path,[47],0),Arrays.map(function(x)
  {
   return Global.decodeURIComponent(x);
  },a)));
  query=Map.OfArray((m$1=function(s)
  {
   var m$2,x,x$1;
   m$2=s.indexOf(Global.String.fromCharCode(61));
   return m$2===-1?[Global.decodeURIComponent(s),""]:[(x=Slice.string(s,null,{
    $:1,
    $0:m$2-1
   }),Global.decodeURIComponent(x)),(x$1=Slice.string(s,{
    $:1,
    $0:m$2+1
   },null),Global.decodeURIComponent(x$1))];
  },function(a$1)
  {
   return Arrays.map(m$1,a$1);
  }(Strings.SplitChars(p[1],[38],0))));
  return new T$2({
   $:0,
   $0:path$1,
   $1:query
  });
 };
 Route.ToList=function(a)
 {
  return[List.ofArray(AppendList.ToArray(a.$0)),a.$1];
 };
 Route.MakeHash=function(a)
 {
  var query,path,s,a$1,s$1,m;
  query=a.$1;
  path=(s=(a$1=AppendList.ToArray(a.$0),Arrays.map(function(x)
  {
   return Global.encodeURIComponent(x);
  },a$1)),Strings.concat("/",s));
  return query.get_IsEmpty()?path:path+"?"+(s$1=(m=function(a$2)
  {
   var a$3;
   a$3=Operators.KeyValue(a$2);
   return Global.encodeURIComponent(a$3[0])+"="+Global.encodeURIComponent(a$3[1]);
  },function(s$2)
  {
   return Seq.map(m,s$2);
  }(query)),Strings.concat("&",s$1));
 };
 Route.FromList=function(xs,q)
 {
  var a;
  a=AppendList.FromArray(Arrays.ofList(xs));
  return new T$2({
   $:0,
   $0:a,
   $1:q
  });
 };
 Route.SameHash=function(a,b)
 {
  return Route.NoHash(a)===Route.NoHash(b);
 };
 Route.NoHash=function(s)
 {
  return Strings.StartsWith(s,"#")?s.substring(1):s;
 };
 Enumerator.Get=function(x)
 {
  return x instanceof Global.Array?Enumerator.ArrayEnumerator(x):Unchecked.Equals(typeof x,"string")?Enumerator.StringEnumerator(x):x.GetEnumerator();
 };
 Enumerator.ArrayEnumerator=function(s)
 {
  return new T$1.New(0,null,function(e)
  {
   var i;
   i=e.s;
   return i<Arrays.length(s)?(e.c=Arrays.get(s,i),e.s=i+1,true):false;
  },void 0);
 };
 Enumerator.StringEnumerator=function(s)
 {
  return new T$1.New(0,null,function(e)
  {
   var i;
   i=e.s;
   return i<s.length?(e.c=s.charCodeAt(i),e.s=i+1,true):false;
  },void 0);
 };
 T$1=Enumerator.T=Runtime.Class({
  MoveNext:function()
  {
   return this.n(this);
  },
  Current:function()
  {
   return this.c;
  },
  Dispose:function()
  {
   if(this.d)
    this.d(this);
  }
 },null,T$1);
 T$1.New=Runtime.Ctor(function(s,c,n,d)
 {
  this.s=s;
  this.c=c;
  this.n=n;
  this.d=d;
  null;
 },T$1);
 Attrs.Static=function(attr$1)
 {
  return new AttrProxy({
   $:3,
   $0:attr$1
  });
 };
 Attrs.EmptyAttr=function()
 {
  SC$4.$cctor();
  return SC$4.EmptyAttr;
 };
 Attrs.AppendTree=function(a,b)
 {
  return a===null?b:b===null?a:new AttrProxy({
   $:2,
   $0:a,
   $1:b
  });
 };
 Attrs.Updates=function(dyn)
 {
  var m,d;
  m=function(x)
  {
   return x.NChanged();
  };
  return(d=View.Const(),function(a)
  {
   return Array.MapTreeReduce(m,d,View.Map2Unit,a);
  })(dyn.DynNodes);
 };
 Attrs.Insert=function(elem,tree)
 {
  var nodes,oar,arr;
  function loop(node)
  {
   if(!(node===null))
    if(node!=null?node.$==1:false)
     nodes.push(node.$0);
    else
     if(node!=null?node.$==2:false)
      {
       loop(node.$0);
       loop(node.$1);
      }
     else
      if(node!=null?node.$==3:false)
       node.$0(elem);
      else
       if(node!=null?node.$==4:false)
        oar.push(node.$0);
  }
  nodes=[];
  oar=[];
  loop(tree);
  arr=nodes.slice(0);
  return Dyn.New(elem,Attrs.Flags(tree),arr,oar.length===0?null:{
   $:1,
   $0:function(el)
   {
    Seq.iter(function(f)
    {
     f(el);
    },oar);
   }
  });
 };
 Attrs.HasChangeAnim=function(attr$1)
 {
  var flag;
  flag=4;
  return(attr$1.DynFlags&flag)===flag;
 };
 Attrs.GetChangeAnim=function(dyn)
 {
  return Attrs.GetAnim(dyn,function($1,$2)
  {
   return $1.NGetChangeAnim($2);
  });
 };
 Attrs.HasEnterAnim=function(attr$1)
 {
  var flag;
  flag=1;
  return(attr$1.DynFlags&flag)===flag;
 };
 Attrs.GetEnterAnim=function(dyn)
 {
  return Attrs.GetAnim(dyn,function($1,$2)
  {
   return $1.NGetEnterAnim($2);
  });
 };
 Attrs.HasExitAnim=function(attr$1)
 {
  var flag;
  flag=2;
  return(attr$1.DynFlags&flag)===flag;
 };
 Attrs.GetExitAnim=function(dyn)
 {
  return Attrs.GetAnim(dyn,function($1,$2)
  {
   return $1.NGetExitAnim($2);
  });
 };
 Attrs.Flags=function(a)
 {
  return(a!==null?a.hasOwnProperty("flags"):false)?a.flags:0;
 };
 Attrs.GetAnim=function(dyn,f)
 {
  var m;
  return An.Concat((m=function(n)
  {
   return f(n,dyn.DynElem);
  },function(a)
  {
   return Arrays.map(m,a);
  }(dyn.DynNodes)));
 };
 Attrs.Sync=function(elem,dyn)
 {
  var a;
  a=function(d)
  {
   d.NSync(elem);
  };
  (function(a$1)
  {
   Arrays.iter(a,a$1);
  }(dyn.DynNodes));
 };
 Attrs.Dynamic=function(view,set)
 {
  return new AttrProxy({
   $:1,
   $0:new DynamicAttrNode.New(view,set)
  });
 };
 DomUtility.SetAttr=function(el,name,value)
 {
  el.setAttribute(name,value);
 };
 DomUtility.Doc=function()
 {
  SC$3.$cctor();
  return SC$3.Doc;
 };
 DomUtility.CreateElement=function(name)
 {
  return DomUtility.Doc().createElement(name);
 };
 DomUtility.CreateText=function(s)
 {
  return DomUtility.Doc().createTextNode(s);
 };
 DomUtility.InsertAt=function(parent,pos,node)
 {
  var p2,m,v,v$1;
  !(node.parentNode===parent?(p2=(m=node.nextSibling,Unchecked.Equals(m,null)?new InsertPos({
   $:0
  }):new InsertPos({
   $:1,
   $0:m
  })),pos.$==1?p2.$==1?pos.$0===p2.$0:false:p2.$==0?true:false):false)?pos.$==1?(v=parent.insertBefore(node,pos.$0),void 0):(v$1=parent.appendChild(node),void 0):null;
 };
 DomUtility.RemoveNode=function(parent,el)
 {
  var v;
  if(el.parentNode===parent)
   {
    v=parent.removeChild(el);
   }
 };
 Docs.CreateEmbedNode=function()
 {
  return{
   Current:new DocNode({
    $:3
   }),
   Dirty:false
  };
 };
 Docs.UpdateEmbedNode=function(node,upd)
 {
  node.Current=upd;
  node.Dirty=true;
 };
 Docs.LinkElement=function(el,children)
 {
  var v;
  v=Docs.InsertDoc(el,children,new InsertPos({
   $:0
  }));
 };
 Docs.CreateRunState=function(parent,doc)
 {
  return RunState.New(NodeSet.get_Empty(),Docs.CreateElemNode(parent,Attrs.EmptyAttr(),doc));
 };
 Docs.PerformAnimatedUpdate=function(st,doc)
 {
  var a;
  return An.get_UseAnimations()?Concurrency.Delay(function()
  {
   var cur,change,enter,exit,x;
   cur=NodeSet.FindAll(doc);
   change=Docs.ComputeChangeAnim(st,cur);
   enter=Docs.ComputeEnterAnim(st,cur);
   exit=Docs.ComputeExitAnim(st,cur);
   x=An.Play(An.Append(change,exit));
   return Concurrency.Bind(x,function()
   {
    var x$1;
    Docs.SyncElemNode(st.Top);
    x$1=An.Play(enter);
    return Concurrency.Bind(x$1,function()
    {
     st.PreviousNodes=cur;
     return Concurrency.Return(null);
    });
   });
  }):(a=function(ok)
  {
   var v;
   v=Global.requestAnimationFrame(function()
   {
    Docs.SyncElemNode(st.Top);
    ok();
   });
  },Concurrency.FromContinuations(function($1,$2,$3)
  {
   return a.apply(null,[$1,$2,$3]);
  }));
 };
 Docs.InsertDoc=function(parent,doc,pos)
 {
  var d;
  return doc.$==1?Docs.InsertNode(parent,doc.$0.El,pos):doc.$==2?(d=doc.$0,(d.Dirty=false,Docs.InsertDoc(parent,d.Current,pos))):doc.$==3?pos:doc.$==4?Docs.InsertNode(parent,doc.$0.Text,pos):doc.$==5?Docs.InsertNode(parent,doc.$0,pos):doc.$==6?Arrays.foldBack(function($1,$2)
  {
   return Docs.InsertNode(parent,$1,$2);
  },doc.$0.Els,pos):Docs.InsertDoc(parent,doc.$0,Docs.InsertDoc(parent,doc.$1,pos));
 };
 Docs.CreateElemNode=function(el,attr$1,children)
 {
  var attr$2;
  Docs.LinkElement(el,children);
  attr$2=Attrs.Insert(el,attr$1);
  return DocElemNode.New(attr$2,children,null,el,Fresh.Int(),Runtime.GetOptional(attr$2.OnAfterRender));
 };
 Docs.ComputeChangeAnim=function(st,cur)
 {
  var relevant,a,m,a$1,a$2;
  relevant=(a=function(n)
  {
   return Attrs.HasChangeAnim(n.Attr);
  },function(a$3)
  {
   return NodeSet.Filter(a,a$3);
  });
  return An.Concat((m=function(n)
  {
   return Attrs.GetChangeAnim(n.Attr);
  },function(a$3)
  {
   return Arrays.map(m,a$3);
  }(NodeSet.ToArray((a$1=relevant(st.PreviousNodes),(a$2=relevant(cur),NodeSet.Intersect(a$1,a$2)))))));
 };
 Docs.ComputeEnterAnim=function(st,cur)
 {
  var m,a,a$1;
  return An.Concat((m=function(n)
  {
   return Attrs.GetEnterAnim(n.Attr);
  },function(a$2)
  {
   return Arrays.map(m,a$2);
  }(NodeSet.ToArray((a=st.PreviousNodes,function(a$2)
  {
   return NodeSet.Except(a,a$2);
  }((a$1=function(n)
  {
   return Attrs.HasEnterAnim(n.Attr);
  },function(a$2)
  {
   return NodeSet.Filter(a$1,a$2);
  }(cur))))))));
 };
 Docs.ComputeExitAnim=function(st,cur)
 {
  var m,a,a$1;
  return An.Concat((m=function(n)
  {
   return Attrs.GetExitAnim(n.Attr);
  },function(a$2)
  {
   return Arrays.map(m,a$2);
  }(NodeSet.ToArray((a=(a$1=function(n)
  {
   return Attrs.HasExitAnim(n.Attr);
  },function(a$2)
  {
   return NodeSet.Filter(a$1,a$2);
  }(st.PreviousNodes)),NodeSet.Except(cur,a))))));
 };
 Docs.SyncElemNode=function(el)
 {
  Docs.SyncElement(el);
  Docs.Sync(el.Children);
  Docs.AfterRender(el);
 };
 Docs.InsertNode=function(parent,node,pos)
 {
  DomUtility.InsertAt(parent,pos,node);
  return new InsertPos({
   $:1,
   $0:node
  });
 };
 Docs.SyncElement=function(el)
 {
  function hasDirtyChildren(el$1)
  {
   function dirty(doc)
   {
    var d;
    return doc.$==0?dirty(doc.$0)?true:dirty(doc.$1):doc.$==2?(d=doc.$0,d.Dirty?true:dirty(d.Current)):doc.$==6?Arrays.exists(hasDirtyChildren,doc.$0.Holes):false;
   }
   return dirty(el$1.Children);
  }
  Attrs.Sync(el.El,el.Attr);
  hasDirtyChildren(el)?Docs.DoSyncElement(el):null;
 };
 Docs.Sync=function(doc)
 {
  var d,t;
  function syncElemNode(el)
  {
   Docs.SyncElement(el);
   Docs.Sync(el.Children);
   Docs.AfterRender(el);
  }
  doc.$==1?syncElemNode(doc.$0):doc.$==2?Docs.Sync(doc.$0.Current):doc.$==3?null:doc.$==5?null:doc.$==4?(d=doc.$0,d.Dirty?(d.Text.nodeValue=d.Value,d.Dirty=false):null):doc.$==6?(t=doc.$0,(Arrays.iter(syncElemNode,t.Holes),Arrays.iter(function(t$1)
  {
   Attrs.Sync(t$1[0],t$1[1]);
  },t.Attrs),Docs.AfterRender(t))):(Docs.Sync(doc.$0),Docs.Sync(doc.$1));
 };
 Docs.AfterRender=function(el)
 {
  var m;
  m=Runtime.GetOptional(el.Render);
  (m!=null?m.$==1:false)?(m.$0(el.El),Runtime.SetOptional(el,"Render",null)):null;
 };
 Docs.DoSyncElement=function(el)
 {
  var parent,ch,a,p,a$1,m,v;
  function ins(doc,pos)
  {
   var d;
   return doc.$==1?new InsertPos({
    $:1,
    $0:doc.$0.El
   }):doc.$==2?(d=doc.$0,d.Dirty?(d.Dirty=false,Docs.InsertDoc(parent,d.Current,pos)):ins(d.Current,pos)):doc.$==3?pos:doc.$==4?new InsertPos({
    $:1,
    $0:doc.$0.Text
   }):doc.$==5?new InsertPos({
    $:1,
    $0:doc.$0
   }):doc.$==6?new InsertPos({
    $:1,
    $0:Arrays.get(doc.$0.Els,0)
   }):ins(doc.$0,ins(doc.$1,pos));
  }
  parent=el.El;
  ch=DomNodes.DocChildren(el);
  a=(p=el.El,function(e)
  {
   DomUtility.RemoveNode(p,e);
  });
  (function(a$2)
  {
   DomNodes.Iter(a,a$2);
  }((a$1=DomNodes.Children(el.El,Runtime.GetOptional(el.Delimiters)),DomNodes.Except(ch,a$1))));
  v=ins(el.Children,(m=Runtime.GetOptional(el.Delimiters),(m!=null?m.$==1:false)?new InsertPos({
   $:1,
   $0:m.$0[1]
  }):new InsertPos({
   $:0
  })));
 };
 DocNode=Client.DocNode=Runtime.Class({},null,DocNode);
 SC$2.$cctor=Runtime.Cctor(function()
 {
  SC$2.counter=0;
  SC$2.$cctor=Global.ignore;
 });
 MapUtil.fromSeq=function(s)
 {
  var a;
  a=Arrays.ofSeq(Seq.delay(function()
  {
   return Seq.collect(function(m)
   {
    return[Pair.New(m[0],m[1])];
   },Seq.distinctBy(function(t)
   {
    return t[0];
   },s));
  }));
  Arrays.sortInPlace(a);
  return BalancedTree.Build(a,0,a.length-1);
 };
 Arrays.map=function(f,arr)
 {
  var a,r,i,$1;
  r=(a=arr.length,new Global.Array(a));
  for(i=0,$1=arr.length-1;i<=$1;i++)r[i]=f(arr[i]);
  return r;
 };
 Arrays.sortInPlace=function(arr)
 {
  var f,_this;
  f=function(t)
  {
   return t[0];
  };
  (function(a)
  {
   Arrays.mapInPlace(f,a);
  }((_this=Arrays.mapiInPlace(function($1,$2)
  {
   return[$2,$1];
  },arr),_this.sort(Operators.Compare))));
 };
 Arrays.iter=function(f,arr)
 {
  var i,$1;
  for(i=0,$1=arr.length-1;i<=$1;i++)f(arr[i]);
 };
 Arrays.ofList=function(xs)
 {
  var l,q;
  q=[];
  l=xs;
  while(!(l.$==0))
   {
    q.push(List.head(l));
    l=List.tail(l);
   }
  return q;
 };
 Arrays.ofSeq=function(xs)
 {
  var q,o;
  if(xs instanceof Global.Array)
   return xs.slice();
  else
   if(xs instanceof T)
    return Arrays.ofList(xs);
   else
    {
     q=[];
     o=Enumerator.Get(xs);
     try
     {
      while(o.MoveNext())
       q.push(o.Current());
      return q;
     }
     finally
     {
      if("Dispose"in o)
       o.Dispose();
     }
    }
 };
 Arrays.foldBack=function(f,arr,zero)
 {
  var acc,$1,len,i,$2;
  acc=zero;
  len=arr.length;
  for(i=1,$2=len;i<=$2;i++)acc=f(arr[len-i],acc);
  return acc;
 };
 Arrays.filter=function(f,arr)
 {
  var r,i,$1;
  r=[];
  for(i=0,$1=arr.length-1;i<=$1;i++)if(f(arr[i]))
   r.push(arr[i]);
  return r;
 };
 Arrays.choose=function(f,arr)
 {
  var q,i,$1,m;
  q=[];
  for(i=0,$1=arr.length-1;i<=$1;i++){
   m=f(arr[i]);
   m==null?null:q.push(m.$0);
  }
  return q;
 };
 Arrays.exists=function(f,x)
 {
  var e,i,$1,l;
  e=false;
  i=0;
  l=Arrays.length(x);
  while(!e?i<l:false)
   if(f(x[i]))
    e=true;
   else
    i=i+1;
  return e;
 };
 Arrays.create=function(size,value)
 {
  var r,i,$1;
  r=new Global.Array(size);
  for(i=0,$1=size-1;i<=$1;i++)r[i]=value;
  return r;
 };
 Arrays.init=function(size,f)
 {
  var r,i,$1;
  size<0?Operators.FailWith("Negative size given."):null;
  r=new Global.Array(size);
  for(i=0,$1=size-1;i<=$1;i++)r[i]=f(i);
  return r;
 };
 Arrays.forall=function(f,x)
 {
  var a,i,$1,l;
  a=true;
  i=0;
  l=Arrays.length(x);
  while(a?i<l:false)
   if(f(x[i]))
    i=i+1;
   else
    a=false;
  return a;
 };
 JSModule.ForEach=function(x,iter)
 {
  var k;
  for(var k$1 in x)if(iter(k$1))
   break;
 };
 Slice.string=function(source,start,finish)
 {
  return start==null?(finish!=null?finish.$==1:false)?source.slice(0,finish.$0+1):"":finish==null?source.slice(start.$0):source.slice(start.$0,finish.$0+1);
 };
 AppendList.FromArray=function(xs)
 {
  var m;
  m=xs.length;
  return m===0?{
   $:0
  }:m===1?{
   $:1,
   $0:Arrays.get(xs,0)
  }:{
   $:3,
   $0:xs.slice()
  };
 };
 AppendList.ToArray=function(xs)
 {
  var out;
  function loop(xs$1)
  {
   if(xs$1.$==1)
    out.push(xs$1.$0);
   else
    if(xs$1.$==2)
     {
      loop(xs$1.$0);
      loop(xs$1.$1);
     }
    else
     if(xs$1.$==3)
      Arrays.iter(function(v)
      {
       out.push(v);
      },xs$1.$0);
  }
  out=[];
  loop(xs);
  return out.slice(0);
 };
 AppendList.Append=function(x,y)
 {
  return x.$==0?y:y.$==0?x:{
   $:2,
   $0:x,
   $1:y
  };
 };
 AppendList.Concat=function(xs)
 {
  var x,d;
  x=Array.ofSeqNonCopying(xs);
  d=AppendList.Empty();
  return Array.TreeReduce(d,AppendList.Append,x);
 };
 AppendList.Empty=function()
 {
  SC$7.$cctor();
  return SC$7.Empty;
 };
 T$2=Route.T=Runtime.Class({},null,T$2);
 Strings.concat=function(separator,strings)
 {
  return Arrays.ofSeq(strings).join(separator);
 };
 Strings.SplitChars=function(s,sep,opts)
 {
  var re;
  re="["+Strings.RegexEscape(Global.String.fromCharCode.apply(void 0,sep))+"]";
  return Strings.Split(s,new Global.RegExp(re),opts);
 };
 Strings.StartsWith=function(t,s)
 {
  return t.substring(0,s.length)==s;
 };
 Strings.RegexEscape=function(s)
 {
  return s.replace(new Global.RegExp("[-\\/\\\\^$*+?.()|[\\]{}]","g"),"\\$&");
 };
 Strings.Split=function(s,pat,opts)
 {
  var res;
  res=Strings.SplitWith(s,pat);
  return opts===1?Arrays.filter(function(x)
  {
   return x!=="";
  },res):res;
 };
 Strings.SplitWith=function(str,pat)
 {
  return str.split(pat);
 };
 Async.Schedule=function(f)
 {
  var a;
  a=Concurrency.Delay(function()
  {
   f();
   return Concurrency.Return(null);
  });
  Concurrency.Start(a,null);
 };
 Array.ofSeqNonCopying=function(xs)
 {
  var q,o,v;
  if(xs instanceof Global.Array)
   return xs;
  else
   if(xs instanceof T)
    return Arrays.ofList(xs);
   else
    if(xs===null)
     return[];
    else
     {
      q=[];
      o=Enumerator.Get(xs);
      try
      {
       while(o.MoveNext())
        {
         v=q.push(o.Current());
        }
       return q;
      }
      finally
      {
       if("Dispose"in o)
        o.Dispose();
      }
     }
 };
 Array.TreeReduce=function(defaultValue,reduction,array)
 {
  var l;
  function loop(off,len)
  {
   var $1,l2;
   return len<=0?defaultValue:(len===1?(off>=0?off<l:false)?true:false:false)?Arrays.get(array,off):(l2=len/2>>0,reduction(loop(off,l2),loop(off+l2,len-l2)));
  }
  l=Arrays.length(array);
  return loop(0,l);
 };
 Array.MapTreeReduce=function(mapping,defaultValue,reduction,array)
 {
  var l;
  function loop(off,len)
  {
   var $1,l2;
   return len<=0?defaultValue:(len===1?(off>=0?off<l:false)?true:false:false)?mapping(Arrays.get(array,off)):(l2=len/2>>0,reduction(loop(off,l2),loop(off+l2,len-l2)));
  }
  l=Arrays.length(array);
  return loop(0,l);
 };
 AttrModule.Value=function(_var)
 {
  var f,g;
  return AttrModule.CustomValue(_var,Global.id,(f=Global.id,(g=function(a)
  {
   return{
    $:1,
    $0:a
   };
  },function(x)
  {
   return g(f(x));
  })));
 };
 AttrModule.CustomValue=function(_var,toString,fromString)
 {
  return AttrModule.CustomVar(_var,function($1,$2)
  {
   $1.value=toString($2);
  },function(e)
  {
   return fromString(e.value);
  });
 };
 AttrModule.CustomVar=function(_var,set,get)
 {
  var onChange,set$1;
  onChange=function(el)
  {
   return _var.RUpdM(function(v)
   {
    var m,$1;
    m=get(el);
    return((m!=null?m.$==1:false)?!Unchecked.Equals(m.$0,v)?($1=[m,m.$0],true):false:false)?$1[0]:null;
   });
  };
  set$1=function(e,v)
  {
   var m,$1;
   m=get(e);
   return((m!=null?m.$==1:false)?Unchecked.Equals(m.$0,v)?($1=m.$0,true):false:false)?null:set(e,v);
  };
  return AttrProxy.Concat([AttrModule.Handler("change",Runtime.Curried2(onChange)),AttrModule.Handler("input",Runtime.Curried2(onChange)),AttrModule.Handler("keypress",Runtime.Curried2(onChange)),AttrModule.DynamicCustom(Runtime.Curried2(set$1),_var.RView())]);
 };
 AttrModule.Handler=function(name,callback)
 {
  return Attrs.Static(function(el)
  {
   el.addEventListener(name,callback(el),false);
  });
 };
 AttrModule.DynamicCustom=function(set,view)
 {
  return Attrs.Dynamic(view,set);
 };
 DocElemNode=Next.DocElemNode=Runtime.Class({
  Equals:function(o)
  {
   return this.ElKey===o.ElKey;
  },
  GetHashCode:function()
  {
   return this.ElKey;
  }
 },null,DocElemNode);
 DocElemNode.New=function(Attr,Children,Delimiters,El,ElKey,Render)
 {
  var $1;
  return new DocElemNode(($1={
   Attr:Attr,
   Children:Children,
   El:El,
   ElKey:ElKey
  },(Runtime.SetOptional($1,"Delimiters",Delimiters),Runtime.SetOptional($1,"Render",Render),$1)));
 };
 SC$3.$cctor=Runtime.Cctor(function()
 {
  SC$3.Doc=Global.document;
  SC$3.$cctor=Global.ignore;
 });
 Mailbox.StartProcessor=function(procAsync)
 {
  var st;
  function work()
  {
   return Concurrency.Delay(function()
   {
    return Concurrency.Bind(procAsync,function()
    {
     var m,x;
     m=st[0];
     return Unchecked.Equals(m,1)?(st[0]=0,Concurrency.Return(null)):Unchecked.Equals(m,2)?(st[0]=1,(x=work(),Concurrency.Bind(x,function()
     {
      return Concurrency.Return(null);
     }))):Concurrency.Return(null);
    });
   });
  }
  st=[0];
  return function()
  {
   var m,computation;
   m=st[0];
   Unchecked.Equals(m,0)?(st[0]=1,(computation=work(),Concurrency.Start(computation,null))):Unchecked.Equals(m,1)?void(st[0]=2):null;
  };
 };
 Tree=BalancedTree.Tree=Runtime.Class({},null,Tree);
 Tree.New=function(Node,Left,Right,Height,Count)
 {
  return new Tree({
   Node:Node,
   Left:Left,
   Right:Right,
   Height:Height,
   Count:Count
  });
 };
 Pair=Collections.Pair=Runtime.Class({
  Equals:function(other)
  {
   return Unchecked.Equals(this.Key,other.Key);
  },
  GetHashCode:function()
  {
   return Unchecked.Hash(this.Key);
  },
  CompareTo0:function(other)
  {
   return Operators.Compare(this.Key,other.Key);
  }
 },null,Pair);
 Pair.New=function(Key,Value)
 {
  return new Pair({
   Key:Key,
   Value:Value
  });
 };
 BalancedTree.OfSeq=function(data)
 {
  var a;
  a=Arrays.ofSeq(Seq.distinct(data));
  Arrays.sortInPlace(a);
  return BalancedTree.Build(a,0,a.length-1);
 };
 BalancedTree.Build=function(data,min,max)
 {
  var center,left,right;
  return max-min+1<=0?null:(center=(min+max)/2>>0,(left=BalancedTree.Build(data,min,center-1),(right=BalancedTree.Build(data,center+1,max),BalancedTree.Branch(Arrays.get(data,center),left,right))));
 };
 BalancedTree.Branch=function(node,left,right)
 {
  return Tree.New(node,left,right,1+Operators.Max(left==null?0:left.Height,right==null?0:right.Height),1+(left==null?0:left.Count)+(right==null?0:right.Count));
 };
 BalancedTree.Enumerate=function(flip,t)
 {
  var gen;
  gen=function(t$1,spine)
  {
   var t$2;
   while(true)
    if(t$1==null)
     return spine.$==1?{
      $:1,
      $0:[spine.$0[0],[spine.$0[1],spine.$1]]
     }:null;
    else
     if(flip)
      {
       t$2=t$1;
       t$1=t$2.Right;
       spine=new T({
        $:1,
        $0:[t$2.Node,t$2.Left],
        $1:spine
       });
      }
     else
      {
       t$2=t$1;
       t$1=t$2.Left;
       spine=new T({
        $:1,
        $0:[t$2.Node,t$2.Right],
        $1:spine
       });
      }
  };
  return Seq.unfold(function($1)
  {
   return gen($1[0],$1[1]);
  },[t,new T({
   $:0
  })]);
 };
 Seq.nonNegative=function()
 {
  return Operators.FailWith("The input must be non-negative.");
 };
 Seq.insufficient=function()
 {
  return Operators.FailWith("The input sequence has an insufficient number of elements.");
 };
 Arrays.mapiInPlace=function(f,arr)
 {
  var i,$1;
  for(i=0,$1=arr.length-1;i<=$1;i++)arr[i]=f(i,arr[i]);
  return arr;
 };
 Arrays.mapInPlace=function(f,arr)
 {
  var i,$1;
  for(i=0,$1=arr.length-1;i<=$1;i++)arr[i]=f(arr[i]);
 };
 Elt=Next.Elt=Runtime.Class({},Doc,Elt);
 Elt.New=function(el,attr$1,children)
 {
  var node,rvUpdates,attrUpdates,updates;
  node=Docs.CreateElemNode(el,attr$1,children.docNode);
  rvUpdates=Var.Create$1(children.updates);
  attrUpdates=Attrs.Updates(node.Attr);
  updates=View.Bind(function(a)
  {
   return View.Map2Unit(attrUpdates,a);
  },rvUpdates.v);
  return new Elt.New$1(new DocNode({
   $:1,
   $0:node
  }),updates,el,rvUpdates);
 };
 Elt.New$1=Runtime.Ctor(function(docNode,updates,elt,rvUpdates)
 {
  Doc.New.call(this,docNode,updates);
  this.docNode$1=docNode;
  this.elt=elt;
  this.rvUpdates=rvUpdates;
  null;
 },Elt);
 Dyn=Attrs$1.Dyn=Runtime.Class({},null,Dyn);
 Dyn.New=function(DynElem,DynFlags,DynNodes,OnAfterRender)
 {
  var $1;
  return new Dyn(($1={
   DynElem:DynElem,
   DynFlags:DynFlags,
   DynNodes:DynNodes
  },(Runtime.SetOptional($1,"OnAfterRender",OnAfterRender),$1)));
 };
 InsertPos=DomUtility.InsertPos=Runtime.Class({},null,InsertPos);
 RunState=Docs$1.RunState=Runtime.Class({},null,RunState);
 RunState.New=function(PreviousNodes,Top)
 {
  return new RunState({
   PreviousNodes:PreviousNodes,
   Top:Top
  });
 };
 NodeSet=Docs$1.NodeSet=Runtime.Class({},null,NodeSet);
 NodeSet.get_Empty=function()
 {
  return new NodeSet({
   $:0,
   $0:new HashSet.New$3()
  });
 };
 NodeSet.FindAll=function(doc)
 {
  var q;
  function loop(node)
  {
   var el,a;
   if(node.$==0)
    {
     loop(node.$0);
     loop(node.$1);
    }
   else
    if(node.$==1)
     {
      el=node.$0;
      q.push(el);
      loop(el.Children);
     }
    else
     if(node.$==2)
      loop(node.$0.Current);
     else
      if(node.$==6)
       {
        a=function(el$1)
        {
         loop(el$1.Children);
        };
        (function(a$1)
        {
         Arrays.iter(a,a$1);
        }(node.$0.Holes));
       }
  }
  q=[];
  loop(doc);
  return new NodeSet({
   $:0,
   $0:new HashSet.New$2(q.slice(0))
  });
 };
 NodeSet.Filter=function(f,a)
 {
  return new NodeSet({
   $:0,
   $0:HashSet$1.Filter(f,a.$0)
  });
 };
 NodeSet.Intersect=function(a,a$1)
 {
  return new NodeSet({
   $:0,
   $0:HashSet$1.Intersect(a.$0,a$1.$0)
  });
 };
 NodeSet.ToArray=function(a)
 {
  return HashSet$1.ToArray(a.$0);
 };
 NodeSet.Except=function(a,a$1)
 {
  return new NodeSet({
   $:0,
   $0:HashSet$1.Except(a.$0,a$1.$0)
  });
 };
 An=Next.An=Runtime.Class({},null,An);
 An.get_UseAnimations=function()
 {
  return Anims.UseAnimations();
 };
 An.Play=function(anim)
 {
  return Concurrency.Delay(function()
  {
   var x,a;
   x=(a=function()
   {
   },function(a$1)
   {
    return An.Run(a,a$1);
   }(Anims.Actions(anim)));
   return Concurrency.Bind(x,function()
   {
    Anims.Finalize(anim);
    return Concurrency.Return(null);
   });
  });
 };
 An.Append=function(a,a$1)
 {
  return new An({
   $:0,
   $0:AppendList.Append(a.$0,a$1.$0)
  });
 };
 An.Concat=function(xs)
 {
  var a;
  a=AppendList.Concat(Seq.map(Anims.List,xs));
  return new An({
   $:0,
   $0:a
  });
 };
 An.Run=function(k,anim)
 {
  var dur,a;
  dur=anim.Duration;
  a=function(ok)
  {
   var v;
   function loop(start,now)
   {
    var t,v$1;
    t=now-start;
    anim.Compute(t);
    k();
    return t<=dur?(v$1=Global.requestAnimationFrame(function(t$1)
    {
     loop(start,t$1);
    }),void 0):ok();
   }
   v=Global.requestAnimationFrame(function(t)
   {
    loop(t,t);
   });
  };
  return Concurrency.FromContinuations(function($1,$2,$3)
  {
   return a.apply(null,[$1,$2,$3]);
  });
 };
 An.get_Empty=function()
 {
  return new An({
   $:0,
   $0:AppendList.Empty()
  });
 };
 HashSet=Collections.HashSet=Runtime.Class({
  Add:function(item)
  {
   return this.add(item);
  },
  add:function(item)
  {
   var h,arr,v;
   h=this.hash(item);
   arr=this.data[h];
   return arr==null?(this.data[h]=[item],this.count=this.count+1,true):this.arrContains(item,arr)?false:(v=arr.push(item),void 0,this.count=this.count+1,true);
  },
  arrContains:function(item,arr)
  {
   var c,i,$1,l;
   c=true;
   i=0;
   l=arr.length;
   while(c?i<l:false)
    if(this.equals.apply(null,[arr[i],item]))
     c=false;
    else
     i=i+1;
   return!c;
  },
  IntersectWith:function(xs)
  {
   var other,all,i,$1,item,v;
   other=new HashSet.New$4(xs,this.equals,this.hash);
   all=HashSetUtil.concat(this.data);
   for(i=0,$1=all.length-1;i<=$1;i++){
    item=all[i];
    !other.Contains(item)?(v=this.Remove(item),void 0):null;
   }
  },
  get_Count:function()
  {
   return this.count;
  },
  CopyTo:function(arr)
  {
   var i,all,i$1,$1;
   i=0;
   all=HashSetUtil.concat(this.data);
   for(i$1=0,$1=all.length-1;i$1<=$1;i$1++)Arrays.set(arr,i$1,all[i$1]);
  },
  ExceptWith:function(xs)
  {
   var e,v;
   e=Enumerator.Get(xs);
   try
   {
    while(e.MoveNext())
     {
      v=this.Remove(e.Current());
     }
   }
   finally
   {
    if("Dispose"in e)
     e.Dispose();
   }
  },
  Contains:function(item)
  {
   var arr;
   arr=this.data[this.hash(item)];
   return arr==null?false:this.arrContains(item,arr);
  },
  Remove:function(item)
  {
   var arr;
   arr=this.data[this.hash(item)];
   return arr==null?false:this.arrRemove(item,arr)?(this.count=this.count-1,true):false;
  },
  arrRemove:function(item,arr)
  {
   var c,i,$1,l,v;
   c=true;
   i=0;
   l=arr.length;
   while(c?i<l:false)
    if(this.equals.apply(null,[arr[i],item]))
     {
      v=arr.splice.apply(arr,[i,1].concat([]));
      c=false;
     }
    else
     i=i+1;
   return!c;
  },
  GetEnumerator:function()
  {
   return Enumerator.Get(HashSetUtil.concat(this.data));
  }
 },null,HashSet);
 HashSet.New$3=Runtime.Ctor(function()
 {
  HashSet.New$4.call(this,[],Unchecked.Equals,Unchecked.Hash);
 },HashSet);
 HashSet.New$2=Runtime.Ctor(function(init)
 {
  HashSet.New$4.call(this,init,Unchecked.Equals,Unchecked.Hash);
 },HashSet);
 HashSet.New$4=Runtime.Ctor(function(init,equals,hash)
 {
  var e,v;
  this.equals=equals;
  this.hash=hash;
  this.data=Global.Array.prototype.constructor.apply(Global.Array,[]);
  this.count=0;
  e=Enumerator.Get(init);
  try
  {
   while(e.MoveNext())
    {
     v=this.add(e.Current());
    }
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 },HashSet);
 Concurrency.Delay=function(mk)
 {
  return Concurrency.checkCancel(function(c)
  {
   try
   {
    (mk(null))(c);
   }
   catch(e)
   {
    c.k({
     $:1,
     $0:e
    });
   }
  });
 };
 Concurrency.Return=function(x)
 {
  return Concurrency.checkCancel(function(c)
  {
   c.k({
    $:0,
    $0:x
   });
  });
 };
 Concurrency.Start=function(c,ctOpt)
 {
  Concurrency.StartWithContinuations(c,function()
  {
  },function(exn)
  {
   Global.console.log.apply(Global.console,["WebSharper: Uncaught asynchronous exception"].concat([exn]));
  },function(v)
  {
  },ctOpt);
 };
 Concurrency.Bind=function(r,f)
 {
  return Concurrency.checkCancel(function(c)
  {
   r({
    k:function(a)
    {
     var x;
     if(a.$==0)
      {
       x=a.$0;
       Concurrency.scheduler().Fork(function()
       {
        try
        {
         (f(x))(c);
        }
        catch(e)
        {
         c.k({
          $:1,
          $0:e
         });
        }
       });
      }
     else
      Concurrency.scheduler().Fork(function()
      {
       c.k(a);
      });
    },
    ct:c.ct
   });
  });
 };
 Concurrency.FromContinuations=function(subscribe)
 {
  return Concurrency.checkCancel(function(c)
  {
   var continued,once;
   continued=[false];
   once=function(cont)
   {
    if(continued[0])
     Operators.FailWith("A continuation provided by Async.FromContinuations was invoked multiple times");
    else
     {
      continued[0]=true;
      Concurrency.scheduler().Fork(cont);
     }
   };
   subscribe(function(a)
   {
    once(function()
    {
     c.k({
      $:0,
      $0:a
     });
    });
   },function(e)
   {
    once(function()
    {
     c.k({
      $:1,
      $0:e
     });
    });
   },function(e)
   {
    once(function()
    {
     c.k({
      $:2,
      $0:e
     });
    });
   });
  });
 };
 Concurrency.checkCancel=function(r)
 {
  return function(c)
  {
   if(c.ct.c)
    Concurrency.cancel(c);
   else
    r(c);
  };
 };
 Concurrency.StartWithContinuations=function(c,s,f,cc,ctOpt)
 {
  var ct;
  ct=Operators.DefaultArg(ctOpt,(Concurrency.defCTS())[0]);
  Concurrency.scheduler().Fork(function()
  {
   c({
    k:function(a)
    {
     if(a.$==1)
      f(a.$0);
     else
      if(a.$==2)
       cc(a.$0);
      else
       s(a.$0);
    },
    ct:ct
   });
  });
 };
 Concurrency.cancel=function(c)
 {
  c.k({
   $:2,
   $0:new OperationCanceledException.New(c.ct)
  });
 };
 Concurrency.defCTS=function()
 {
  SC$6.$cctor();
  return SC$6.defCTS;
 };
 Concurrency.scheduler=function()
 {
  SC$6.$cctor();
  return SC$6.scheduler;
 };
 Anims.UseAnimations=function()
 {
  SC$5.$cctor();
  return SC$5.UseAnimations;
 };
 Anims.Actions=function(a)
 {
  var c;
  return Anims.ConcatActions((c=function(a$1)
  {
   return a$1.$==1?{
    $:1,
    $0:a$1.$0
   }:null;
  },function(a$1)
  {
   return Arrays.choose(c,a$1);
  }(AppendList.ToArray(a.$0))));
 };
 Anims.Finalize=function(a)
 {
  var a$1;
  a$1=function(a$2)
  {
   if(a$2.$==0)
    a$2.$0();
  };
  (function(a$2)
  {
   Arrays.iter(a$1,a$2);
  }(AppendList.ToArray(a.$0)));
 };
 Anims.List=function(a)
 {
  return a.$0;
 };
 Anims.ConcatActions=function(xs)
 {
  var xs$1,m,dur,m$1,xs$2;
  xs$1=Array.ofSeqNonCopying(xs);
  m=Arrays.length(xs$1);
  return m===0?Anims.Const():m===1?Arrays.get(xs$1,0):(dur=Seq.max((m$1=function(anim)
  {
   return anim.Duration;
  },function(s)
  {
   return Seq.map(m$1,s);
  }(xs$1))),(xs$2=Arrays.map(function(a)
  {
   return Anims.Prolong(dur,a);
  },xs$1),Anims.Def(dur,function(t)
  {
   Arrays.iter(function(anim)
   {
    anim.Compute(t);
   },xs$2);
  })));
 };
 Anims.Const=function(v)
 {
  return Anims.Def(0,function()
  {
   return v;
  });
 };
 Anims.Prolong=function(nextDuration,anim)
 {
  var comp,dur,last;
  comp=anim.Compute;
  dur=anim.Duration;
  last=Lazy.Create(function()
  {
   return anim.Compute(anim.Duration);
  });
  return{
   Compute:function(t)
   {
    return t>=dur?last.f():comp(t);
   },
   Duration:nextDuration
  };
 };
 Anims.Def=function(d,f)
 {
  return{
   Compute:f,
   Duration:d
  };
 };
 SC$4.$cctor=Runtime.Cctor(function()
 {
  SC$4.EmptyAttr=null;
  SC$4.$cctor=Global.ignore;
 });
 SC$5.$cctor=Runtime.Cctor(function()
 {
  SC$5.CubicInOut=Easing.Custom(function(t)
  {
   var t2;
   t2=t*t;
   return 3*t2-2*(t2*t);
  });
  SC$5.UseAnimations=true;
  SC$5.$cctor=Global.ignore;
 });
 HashSet$1.Filter=function(ok,set)
 {
  var a;
  return new HashSet.New$2((a=HashSet$1.ToArray(set),Arrays.filter(ok,a)));
 };
 HashSet$1.Intersect=function(a,b)
 {
  var set;
  set=new HashSet.New$2(HashSet$1.ToArray(a));
  set.IntersectWith(HashSet$1.ToArray(b));
  return set;
 };
 HashSet$1.ToArray=function(set)
 {
  var arr;
  arr=Arrays.create(set.get_Count(),void 0);
  set.CopyTo(arr);
  return arr;
 };
 HashSet$1.Except=function(excluded,included)
 {
  var set;
  set=new HashSet.New$2(HashSet$1.ToArray(included));
  set.ExceptWith(HashSet$1.ToArray(excluded));
  return set;
 };
 Scheduler=Concurrency.Scheduler=Runtime.Class({
  Fork:function(action)
  {
   var $this,v;
   $this=this;
   this.robin.push(action);
   this.idle?(this.idle=false,(v=Global.setTimeout(function()
   {
    $this.tick();
   },0),void 0)):null;
  },
  tick:function()
  {
   var loop,$this,t,m,v;
   $this=this;
   t=Global.Date.now();
   loop=true;
   while(loop)
    {
     m=this.robin.length;
     m===0?(this.idle=true,void(loop=false)):((this.robin.shift())(),Global.Date.now()-t>40?(v=Global.setTimeout(function()
     {
      $this.tick();
     },0),void 0,void(loop=false)):null);
    }
  }
 },null,Scheduler);
 Scheduler.New=Runtime.Ctor(function()
 {
  this.idle=true;
  this.robin=[];
  null;
 },Scheduler);
 Easing=Next.Easing=Runtime.Class({},null,Easing);
 Easing.Custom=function(f)
 {
  return new Easing.New(f);
 };
 Easing.New=Runtime.Ctor(function(transformTime)
 {
  this.transformTime=transformTime;
  null;
 },Easing);
 DomNodes=Docs$1.DomNodes=Runtime.Class({},null,DomNodes);
 DomNodes.DocChildren=function(node)
 {
  var q;
  function loop(doc)
  {
   if(doc.$==2)
    loop(doc.$0.Current);
   else
    if(doc.$==1)
     q.push(doc.$0.El);
    else
     if(doc.$==3)
      ;
     else
      if(doc.$==5)
       q.push(doc.$0);
      else
       if(doc.$==4)
        q.push(doc.$0.Text);
       else
        if(doc.$==6)
         Arrays.iter(function(a)
         {
          q.push(a);
         },doc.$0.Els);
        else
         {
          loop(doc.$0);
          loop(doc.$1);
         }
  }
  q=[];
  loop(node.Children);
  return new DomNodes({
   $:0,
   $0:q.slice(0)
  });
 };
 DomNodes.Children=function(elem,delims)
 {
  var n,o,a,v;
  if(delims!=null?delims.$==1:false)
   {
    a=Global.Array.prototype.constructor.apply(Global.Array,[]);
    n=delims.$0[0].nextSibling;
    while(n!==delims.$0[1])
     {
      v=a.push(n);
      n=n.nextSibling;
     }
    return new DomNodes({
     $:0,
     $0:a
    });
   }
  else
   return new DomNodes({
    $:0,
    $0:Arrays.init(elem.childNodes.length,(o=elem.childNodes,function(a$1)
    {
     return o[a$1];
    }))
   });
 };
 DomNodes.Except=function(a,a$1)
 {
  var excluded,a$2,p;
  excluded=a.$0;
  a$2=(p=function(n)
  {
   var p$1;
   p$1=function(k)
   {
    return!(n===k);
   };
   return function(a$3)
   {
    return Arrays.forall(p$1,a$3);
   }(excluded);
  },function(a$3)
  {
   return Arrays.filter(p,a$3);
  }(a$1.$0));
  return new DomNodes({
   $:0,
   $0:a$2
  });
 };
 DomNodes.Iter=function(f,a)
 {
  Arrays.iter(f,a.$0);
 };
 OperationCanceledException=WebSharper.OperationCanceledException=Runtime.Class({},Global.Error,OperationCanceledException);
 OperationCanceledException.New=Runtime.Ctor(function(ct)
 {
  OperationCanceledException.New$1.call(this,"The operation was canceled.",null,ct);
 },OperationCanceledException);
 OperationCanceledException.New$1=Runtime.Ctor(function(message,inner,ct)
 {
  this.message=message;
  this.ct=ct;
  null;
 },OperationCanceledException);
 SC$6.$cctor=Runtime.Cctor(function()
 {
  SC$6.noneCT={
   c:false,
   r:[]
  };
  SC$6.scheduler=new Scheduler.New();
  SC$6.defCTS=[new CancellationTokenSource.New()];
  SC$6.GetCT=Concurrency.checkCancel(function(c)
  {
   c.k({
    $:0,
    $0:c.ct
   });
  });
  SC$6.$cctor=Global.ignore;
 });
 DynamicAttrNode=Next.DynamicAttrNode=Runtime.Class({
  NChanged:function()
  {
   return this.updates;
  },
  NGetChangeAnim:function(parent)
  {
   return An.get_Empty();
  },
  NGetEnterAnim:function(parent)
  {
   return An.get_Empty();
  },
  NGetExitAnim:function(parent)
  {
   return An.get_Empty();
  },
  NSync:function(parent)
  {
   if(this.dirty)
    {
     (this.push(parent))(this.value);
     this.dirty=false;
    }
  }
 },null,DynamicAttrNode);
 DynamicAttrNode.New=Runtime.Ctor(function(view,push)
 {
  var $this,a;
  $this=this;
  this.push=push;
  this.value=void 0;
  this.dirty=false;
  this.updates=(a=function(x)
  {
   $this.value=x;
   $this.dirty=true;
  },function(a$1)
  {
   return View.Map(a,a$1);
  }(view));
  null;
 },DynamicAttrNode);
 HashSetUtil.concat=function(o)
 {
  var r,k;
  r=[];
  for(var k$1 in o)r.push.apply(r,o[k$1]);
  return r;
 };
 SC$7.$cctor=Runtime.Cctor(function()
 {
  SC$7.Empty={
   $:0
  };
  SC$7.$cctor=Global.ignore;
 });
 Lazy.Create=function(f)
 {
  return{
   c:false,
   v:f,
   f:Lazy.forceLazy
  };
 };
 Lazy.forceLazy=function()
 {
  var v;
  v=this.v();
  this.c=true;
  this.v=v;
  this.f=Lazy.cachedLazy;
  return v;
 };
 Lazy.cachedLazy=function()
 {
  return this.v;
 };
 CancellationTokenSource=WebSharper.CancellationTokenSource=Runtime.Class({},null,CancellationTokenSource);
 CancellationTokenSource.New=Runtime.Ctor(function()
 {
  this.c=false;
  this.pending=null;
  this.r=[];
  this.init=1;
  null;
 },CancellationTokenSource);
 Site.Main();
}());


if (typeof IntelliFactory !=='undefined')
  IntelliFactory.Runtime.Start();
