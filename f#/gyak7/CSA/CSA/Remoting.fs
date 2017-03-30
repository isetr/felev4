namespace CSA

open WebSharper

module Server =

    let username = "Admin"
    let password = "Admin"

    [<Rpc>]
    let Login (logindata: Model.LoginInfo) =
        let ctx = Web.Remoting.GetContext()
        async {
            if logindata.Username = username && logindata.Password = password then
                do! ctx.UserSession.LoginUser (username, true)
                return Some username
            else
                return None
        }
