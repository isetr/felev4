(function()
{
 "use strict";
 var Global,GuessTheNumber,Client,WebSharper,Remoting,AjaxRemotingProvider,UI,Next,Var,Concurrency,View,Doc,AttrProxy;
 Global=window;
 GuessTheNumber=Global.GuessTheNumber=Global.GuessTheNumber||{};
 Client=GuessTheNumber.Client=GuessTheNumber.Client||{};
 WebSharper=Global.WebSharper;
 Remoting=WebSharper&&WebSharper.Remoting;
 AjaxRemotingProvider=Remoting&&Remoting.AjaxRemotingProvider;
 UI=WebSharper&&WebSharper.UI;
 Next=UI&&UI.Next;
 Var=Next&&Next.Var;
 Concurrency=WebSharper&&WebSharper.Concurrency;
 View=Next&&Next.View;
 Doc=Next&&Next.Doc;
 AttrProxy=Next&&Next.AttrProxy;
 Client.Game=function()
 {
  var user,rvGuess,guess,a,a$1,a$2;
  user=Global.String((new AjaxRemotingProvider.New()).Async("GuessTheNumber:GuessTheNumber.Server.GetUser:2119146695",[]));
  rvGuess=Var.Create$1("");
  guess=function(numString)
  {
   var a$3;
   a$3=Concurrency.Delay(function()
   {
    var x;
    x=View.GetAsync(numString.RView());
    return Concurrency.Bind(x,function(a$4)
    {
     var o,$1,num,o$1,$2,x$1;
     return!(o=0,[($1=Global.parseInt(a$4),Global.isNaN($1)?false:(o=$1,true)),o])[0]?(Global.alert("Please be so kind and give me an actual number this time."),Concurrency.Return(null)):(num=(o$1=0,[($2=Global.parseInt(a$4),Global.isNaN($2)?false:(o$1=$2,true)),o$1])[1],(x$1=(new AjaxRemotingProvider.New()).Async("GuessTheNumber:GuessTheNumber.Server.CompareTheGuess:-1276410449",[user,num]),Concurrency.Bind(x$1,function(a$5)
     {
      var x$2;
      return a$5<0?(Global.alert("Your guess is lower than the number."),Concurrency.Return(null)):a$5>0?(Global.alert("Your guess is greater than the number"),Concurrency.Return(null)):(Global.alert("You have found your number... Let's do it again!"),(x$2=(new AjaxRemotingProvider.New()).Async("GuessTheNumber:GuessTheNumber.Server.GenerateNewNum:-1276324058",[user]),Concurrency.Bind(x$2,function()
      {
       return Concurrency.Return(null);
      })));
     })));
    });
   });
   return Concurrency.Start(a$3,null);
  };
  a=[Doc.Input([],rvGuess),(a$1=[AttrProxy.Create("class","btn")],Doc.Button("Guess",a$1,function($1)
  {
   return guess(rvGuess,$1);
  })),(a$2=[AttrProxy.Create("class","btn")],Doc.Button("Logout",a$2,function()
  {
   var a$3;
   a$3=Concurrency.Delay(function()
   {
    var x;
    x=(new AjaxRemotingProvider.New()).Async("GuessTheNumber:GuessTheNumber.Server.Logout:-829366048",[]);
    return Concurrency.Bind(x,function()
    {
     Global.window.location.replace("/");
     return Concurrency.Return(null);
    });
   });
   Concurrency.Start(a$3,null);
  }))];
  return Doc.Element("div",[],a);
 };
 Client.Login=function()
 {
  var rvUname,login,a,a$1;
  rvUname=Var.Create$1("");
  login=function(uname)
  {
   var a$2;
   a$2=Concurrency.Delay(function()
   {
    var x;
    x=View.GetAsync(uname.RView());
    return Concurrency.Bind(x,function(a$3)
    {
     var x$1;
     x$1=(new AjaxRemotingProvider.New()).Async("GuessTheNumber:GuessTheNumber.Server.Login:-1276324058",[a$3]);
     return Concurrency.Bind(x$1,function()
     {
      Global.window.location.replace("game");
      return Concurrency.Return(null);
     });
    });
   });
   return Concurrency.Start(a$2,null);
  };
  a=[Doc.Input([],rvUname),(a$1=[AttrProxy.Create("class","btn")],Doc.Button("Login",a$1,function($1)
  {
   return login(rvUname,$1);
  }))];
  return Doc.Element("div",[],a);
 };
}());
