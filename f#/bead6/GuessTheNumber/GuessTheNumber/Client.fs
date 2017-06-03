namespace GuessTheNumber

open WebSharper
open WebSharper.JavaScript
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.UI.Next.Html

[<JavaScript>]
module Client =

    let Login () =
        let rvUname = Var.Create ""
        let viewUname = rvUname.View
        let login (uname : IRef<string>) unit = 
            async {
                let! user = View.GetAsync uname.View
                do! Server.Login user
                JS.Window.Location.Replace("game")
            }
            |> Async.Start
        div [
            Doc.Input [] rvUname
            Doc.Button "Login" [attr.``class`` "btn"] (login rvUname)
        ]

    let Game () =
        let user = string Server.GetUser
        let rvGuess = Var.Create ""
        let guess (numString : IRef<string>) unit =
            async {
                let! numView = View.GetAsync numString.View
                if fst <| System.Int32.TryParse numView |> not
                    then JS.Alert "Please be so kind and give me an actual number this time."
                    else
                        let num = snd <| System.Int32.TryParse numView
                        let! comparedGuess = Server.CompareTheGuess user num
                        if comparedGuess < 0
                            then JS.Alert "Your guess is lower than the number."
                            else if comparedGuess > 0
                                then JS.Alert "Your guess is greater than the number"
                                else JS.Alert "You have found your number... Let's do it again!"
                                     do! Server.GenerateNewNum user
            }
            |> Async.Start
        div [
            Doc.Input [] rvGuess
            Doc.Button "Guess" [attr.``class`` "btn"] (guess rvGuess)
        ]
