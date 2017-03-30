namespace CSA

open WebSharper
open WebSharper.UI.Next

module Model =

    type LoginInfo = 
        {
            Username: string
            Password: string
        }

   // [<JavaScript>]
   // let LoggedIn = Var<LoginInfo option>.Create None
