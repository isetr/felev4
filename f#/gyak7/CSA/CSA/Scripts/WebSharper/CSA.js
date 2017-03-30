(function()
{
 "use strict";
 var Global,CSA,Client,WebSharper,UI,Next,Var,List,Operators,AttrModule,IntelliFactory,Runtime,Doc,Concurrency,View,Remoting,AjaxRemotingProvider;
 Global=window;
 CSA=Global.CSA=Global.CSA||{};
 Client=CSA.Client=CSA.Client||{};
 WebSharper=Global.WebSharper;
 UI=WebSharper&&WebSharper.UI;
 Next=UI&&UI.Next;
 Var=Next&&Next.Var;
 List=WebSharper&&WebSharper.List;
 Operators=WebSharper&&WebSharper.Operators;
 AttrModule=Next&&Next.AttrModule;
 IntelliFactory=Global.IntelliFactory;
 Runtime=IntelliFactory&&IntelliFactory.Runtime;
 Doc=Next&&Next.Doc;
 Concurrency=WebSharper&&WebSharper.Concurrency;
 View=Next&&Next.View;
 Remoting=WebSharper&&WebSharper.Remoting;
 AjaxRemotingProvider=Remoting&&Remoting.AjaxRemotingProvider;
 Client.Main=function(uname)
 {
  var rvUname,rvPassword,t,t$1,t$2,t$3,t$4,S;
  rvUname=Var.Create$1("");
  rvPassword=Var.Create$1("");
  t=(t$1=(t$2=(t$3=(t$4=new List.T({
   $:0
  }),new List.T({
   $:1,
   $0:{
    $:1,
    $0:"LoggedIn",
    $1:Operators.DefaultArg(uname,"")
   },
   $1:t$4
  })),new List.T({
   $:1,
   $0:{
    $:6,
    $0:"UName",
    $1:rvUname
   },
   $1:t$3
  })),new List.T({
   $:1,
   $0:{
    $:6,
    $0:"Password",
    $1:rvPassword
   },
   $1:t$2
  })),(S=AttrModule.Handler("click",Runtime.Curried(Client.login,2,[rvUname,rvPassword])),new List.T({
   $:1,
   $0:{
    $:3,
    $0:"SignIn",
    $1:S
   },
   $1:t$1
  })));
  return Doc.GetOrLoadTemplate("T7e613330fd12461c9846811bc12c2f1e",{
   $:1,
   $0:"Login"
  },function()
  {
   return Global.jQuery.parseHTML("<div class=\"login-holder\">\r\n    <div>${LoggedIn}</div>\r\n    <div>Username: </div>\r\n    <input type=\"text\" placeholder=\"required\" ws-var=\"UName\">\r\n\r\n    <div>Password: </div>\r\n    <input type=\"password\" placeholder=\"required\" ws-var=\"Password\">\r\n\r\n    <button class=\"login-btn\" ws-attr=\"SignIn\">Sign in!</button>\r\n</div>");
  },t);
 };
 Client.login=function(uname,pw,el,ev)
 {
  var a;
  a=Concurrency.Delay(function()
  {
   var x;
   x=View.GetAsync(uname.RView());
   return Concurrency.Bind(x,function(a$1)
   {
    var x$1;
    x$1=View.GetAsync(pw.RView());
    return Concurrency.Bind(x$1,function(a$2)
    {
     var x$2;
     x$2=(new AjaxRemotingProvider.New()).Async("CSA:CSA.Server.Login:887335735",[{
      Username:a$1,
      Password:a$2
     }]);
     return Concurrency.Bind(x$2,function(a$3)
     {
      return(a$3!=null?a$3.$==1:false)?(Global.window.location.replace("https://google.com"),Concurrency.Return(null)):(Global.alert("Invalid Login"),Concurrency.Return(null));
     });
    });
   });
  });
  Concurrency.Start(a,null);
 };
}());
