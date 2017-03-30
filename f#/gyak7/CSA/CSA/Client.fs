namespace CSA

open WebSharper
open WebSharper.JavaScript
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.UI.Next.Html

[<JavaScript>]
module Client =

    type LoginTemplate = Templating.Template<"./login.html">

    let login (uname: IRef<string>) (pw: IRef<string>) el ev = 
        async {
            let! uname = View.GetAsync uname.View
            let! pw = View.GetAsync pw.View
            let li =
                {
                    Username = uname
                    Password = pw
                } : Model.LoginInfo
            let! login = Server.Login li
            match login with
            | None -> JS.Alert("Invalid Login")
            | Some u -> JS.Window.Location.Replace("https://google.com")
        }
        |> Async.Start

    let Main (uname: string option) =
        let rvUname = Var.Create ""
        let rvPassword = Var.Create ""
        let loggedin = defaultArg uname ""
        LoginTemplate.Login()
            .LoggedIn(loggedin)
            .UName(rvUname)
            .Password(rvPassword)
            .SignIn(on.click(login rvUname rvPassword))
            .Doc()