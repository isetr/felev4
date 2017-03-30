(function()
{
 "use strict";
 var Global,WebSharper,Json,Provider,Web,Control,FSharpInlineControl,InlineControl,IntelliFactory,Runtime,Collections,Dictionary,JavaScript,JSModule,FSharpMap,Unchecked,Arrays,Operators,FSharpSet,BalancedTree,List,Enumerator,Map,Seq;
 Global=window;
 WebSharper=Global.WebSharper=Global.WebSharper||{};
 Json=WebSharper.Json=WebSharper.Json||{};
 Provider=Json.Provider=Json.Provider||{};
 Web=WebSharper.Web=WebSharper.Web||{};
 Control=Web.Control=Web.Control||{};
 FSharpInlineControl=Web.FSharpInlineControl=Web.FSharpInlineControl||{};
 InlineControl=Web.InlineControl=Web.InlineControl||{};
 IntelliFactory=Global.IntelliFactory;
 Runtime=IntelliFactory&&IntelliFactory.Runtime;
 Collections=WebSharper&&WebSharper.Collections;
 Dictionary=Collections&&Collections.Dictionary;
 JavaScript=WebSharper&&WebSharper.JavaScript;
 JSModule=JavaScript&&JavaScript.JSModule;
 FSharpMap=Collections&&Collections.FSharpMap;
 Unchecked=WebSharper&&WebSharper.Unchecked;
 Arrays=WebSharper&&WebSharper.Arrays;
 Operators=WebSharper&&WebSharper.Operators;
 FSharpSet=Collections&&Collections.FSharpSet;
 BalancedTree=Collections&&Collections.BalancedTree;
 List=WebSharper&&WebSharper.List;
 Enumerator=WebSharper&&WebSharper.Enumerator;
 Map=Collections&&Collections.Map;
 Seq=WebSharper&&WebSharper.Seq;
 Provider.DecodeStringDictionary=function(decEl)
 {
  return Runtime.Curried2(function($1,o)
  {
   var d,decEl$1;
   d=new Dictionary.New$5();
   decEl$1=decEl();
   JSModule.ForEach(o,function(k)
   {
    d.Add(k,decEl$1(o[k]));
    return false;
   });
   return d;
  });
 };
 Provider.DecodeStringMap=function(decEl)
 {
  return Runtime.Curried2(function($1,o)
  {
   var m,decEl$1;
   m=[new FSharpMap.New([])];
   decEl$1=decEl();
   JSModule.ForEach(o,function(k)
   {
    m[0]=m[0].Add(k,decEl$1(o[k]));
    return false;
   });
   return m[0];
  });
 };
 Provider.DecodeArray=function(decEl)
 {
  return Provider.EncodeArray(decEl);
 };
 Provider.DecodeUnion=function(t,discr,cases)
 {
  return Runtime.Curried2(function($1,x)
  {
   var o,tag,tagName,p,r,a;
   return(typeof x==="object"?x!=null:false)?(o=t===void 0?{}:new t(),(tag=Unchecked.Equals(typeof discr,"string")?(tagName=x[discr],(p=function(name)
   {
    return name===tagName;
   },function(a$1)
   {
    return Arrays.findIndex(function($2)
    {
     return p($2[0],$2[1]);
    },a$1);
   }(cases))):(r=[void 0],(JSModule.ForEach(discr,function(k)
   {
    return x.hasOwnProperty(k)?(r[0]=discr[k],true):false;
   }),r[0])),(o.$=tag,(a=function(from,to,dec,kind)
   {
    if(from===null)
     o.$0=(dec(null))(x);
    else
     if(Unchecked.Equals(kind,0))
      o[from]=(dec(null))(x[to]);
     else
      if(Unchecked.Equals(kind,1))
       o[from]=x.hasOwnProperty(to)?{
        $:1,
        $0:(dec(null))(x[to])
       }:null;
      else
       Operators.FailWith("Invalid field option kind");
   },function(a$1)
   {
    Arrays.iter(function($2)
    {
     return a($2[0],$2[1],$2[2],$2[3]);
    },a$1);
   }((Arrays.get(cases,tag))[1])),o))):x;
  });
 };
 Provider.DecodeRecord=function(t,fields)
 {
  return Runtime.Curried2(function($1,x)
  {
   var o,a;
   o=t===void 0?{}:new t();
   a=function(name,dec,kind)
   {
    if(Unchecked.Equals(kind,0))
    {
     if(x.hasOwnProperty(name))
      o[name]=(dec(null))(x[name]);
     else
      Operators.FailWith("Missing mandatory field: "+name);
    }
    else
     if(Unchecked.Equals(kind,1))
      o[name]=x.hasOwnProperty(name)?{
       $:1,
       $0:(dec(null))(x[name])
      }:null;
     else
      if(Unchecked.Equals(kind,2))
      {
       if(x.hasOwnProperty(name))
        o[name]=(dec(null))(x[name]);
      }
      else
       Operators.FailWith("Invalid field option kind");
   };
   (function(a$1)
   {
    Arrays.iter(function($2)
    {
     return a($2[0],$2[1],$2[2]);
    },a$1);
   }(fields));
   return o;
  });
 };
 Provider.DecodeSet=function(decEl)
 {
  return Runtime.Curried2(function($1,a)
  {
   var e;
   e=decEl();
   return new FSharpSet.New$1(BalancedTree.OfSeq(Arrays.map(e,a)));
  });
 };
 Provider.DecodeList=function(decEl)
 {
  return Runtime.Curried2(function($1,a)
  {
   var e;
   e=decEl();
   return List.init(Arrays.length(a),function(i)
   {
    return e(Arrays.get(a,i));
   });
  });
 };
 Provider.DecodeDateTime=function()
 {
  return Runtime.Curried2(function($1,x)
  {
   return(new Global.Date(x)).getTime();
  });
 };
 Provider.DecodeTuple=function(decs)
 {
  return Provider.EncodeTuple(decs);
 };
 Provider.EncodeStringDictionary=function(encEl)
 {
  return Runtime.Curried2(function($1,d)
  {
   var o,e,e$1,f,a;
   o={};
   e=encEl();
   e$1=Enumerator.Get(d);
   try
   {
    while(e$1.MoveNext())
     {
      f=e$1.Current();
      a=Operators.KeyValue(f);
      o[a[0]]=e(a[1]);
     }
   }
   finally
   {
    if("Dispose"in e$1)
     e$1.Dispose();
   }
   return o;
  });
 };
 Provider.EncodeStringMap=function(encEl)
 {
  return Runtime.Curried2(function($1,m)
  {
   var o,e,a;
   o={};
   e=encEl();
   a=function(k,v)
   {
    o[k]=e(v);
   };
   (function(t)
   {
    Map.Iterate(a,t);
   }(m));
   return o;
  });
 };
 Provider.EncodeSet=function(encEl)
 {
  return Runtime.Curried2(function($1,s)
  {
   var a,e,a$1;
   a=[];
   e=encEl();
   a$1=function(x)
   {
    var v;
    v=a.push(e(x));
   };
   (function(s$1)
   {
    Seq.iter(a$1,s$1);
   }(s));
   return a;
  });
 };
 Provider.EncodeArray=function(encEl)
 {
  return Runtime.Curried2(function($1,a)
  {
   var e;
   e=encEl();
   return Arrays.map(e,a);
  });
 };
 Provider.EncodeUnion=function(a,discr,cases)
 {
  return Runtime.Curried2(function($1,x)
  {
   var o,tag,p,a$1;
   return(typeof x==="object"?x!=null:false)?(o={},(tag=x.$,(p=Arrays.get(cases,tag),(Unchecked.Equals(typeof discr,"string")?void(o[discr]=p[0]):null,(a$1=function(from,to,enc,kind)
   {
    var record,m;
    if(from===null)
     {
      record=(enc(null))(x.$0);
      JSModule.ForEach(record,function(f)
      {
       o[f]=record[f];
       return false;
      });
     }
    else
     if(Unchecked.Equals(kind,0))
      o[to]=(enc(null))(x[from]);
     else
      if(Unchecked.Equals(kind,1))
       {
        m=x[from];
        m==null?null:void(o[to]=(enc(null))(m.$0));
       }
      else
       Operators.FailWith("Invalid field option kind");
   },function(a$2)
   {
    Arrays.iter(function($2)
    {
     return a$1($2[0],$2[1],$2[2],$2[3]);
    },a$2);
   }(p[1])),o)))):x;
  });
 };
 Provider.EncodeRecord=function(a,fields)
 {
  return Runtime.Curried2(function($1,x)
  {
   var o,a$1;
   o={};
   a$1=function(name,enc,kind)
   {
    var m;
    if(Unchecked.Equals(kind,0))
     o[name]=(enc(null))(x[name]);
    else
     if(Unchecked.Equals(kind,1))
      {
       m=x[name];
       m==null?null:void(o[name]=(enc(null))(m.$0));
      }
     else
      if(Unchecked.Equals(kind,2))
      {
       if(x.hasOwnProperty(name))
        o[name]=(enc(null))(x[name]);
      }
      else
       Operators.FailWith("Invalid field option kind");
   };
   (function(a$2)
   {
    Arrays.iter(function($2)
    {
     return a$1($2[0],$2[1],$2[2]);
    },a$2);
   }(fields));
   return o;
  });
 };
 Provider.EncodeList=function(encEl)
 {
  return Runtime.Curried2(function($1,l)
  {
   var a,e,a$1;
   a=[];
   e=encEl();
   a$1=function(x)
   {
    var v;
    v=a.push(e(x));
   };
   (function(l$1)
   {
    List.iter(a$1,l$1);
   }(l));
   return a;
  });
 };
 Provider.EncodeDateTime=function()
 {
  return Runtime.Curried2(function($1,x)
  {
   return(new Global.Date(x)).toISOString();
  });
 };
 Provider.EncodeTuple=function(encs)
 {
  return Runtime.Curried2(function($1,args)
  {
   return Arrays.map2(function($2,$3)
   {
    return($2(null))($3);
   },encs,args);
  });
 };
 Provider.Id=function()
 {
  return Runtime.Curried2(function($1,x)
  {
   return x;
  });
 };
 Control=Web.Control=Runtime.Class({
  Body:function()
  {
   return this.get_Body();
  }
 },null,Control);
 FSharpInlineControl=Web.FSharpInlineControl=Runtime.Class({
  get_Body:function()
  {
   return Arrays.fold(function($1,$2)
   {
    return $1[$2];
   },Global.window,this.funcName).apply(null,this.args);
  }
 },Control,FSharpInlineControl);
 InlineControl=Web.InlineControl=Runtime.Class({
  get_Body:function()
  {
   return Arrays.fold(function($1,$2)
   {
    return $1[$2];
   },Global.window,this.funcName).apply(null,this.args);
  }
 },Control,InlineControl);
}());
