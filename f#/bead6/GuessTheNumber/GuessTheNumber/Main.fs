namespace GuessTheNumber

open WebSharper
open WebSharper.Sitelets
open WebSharper.UI.Next
open WebSharper.UI.Next.Server

type EndPoint =
    | [<EndPoint "/">] Login
    | [<EndPoint "/game">] Game

module Templating =
    open WebSharper.UI.Next.Html

    type MainTemplate = Templating.Template<"Main.html">

    let MenuBar (ctx: Context<EndPoint>) endpoint : Doc list =
        let ( => ) txt act =
             liAttr [if endpoint = act then yield attr.``class`` "active"] [
                aAttr [attr.href (ctx.Link act)] [text txt]
             ]
        [
            li ["Login" => EndPoint.Login]
            li ["Game" => EndPoint.Game]
        ]

    let Main ctx action (title: string) (body: Doc list) =
        Content.Page(
            MainTemplate()
                .Title(title)
                .Body(body)
                .Doc()
        )

module Site =
    open WebSharper.UI.Next.Html

    let LoginPage ctx =
        Templating.Main ctx EndPoint.Login "Login" [
            h1 [text "Please log in to play!"]
            div [client <@ Client.Login() @>]
        ]

    let GamePage ctx =
        Templating.Main ctx EndPoint.Game "Game" [
            h1 [text "Guess your number!"]
            div [client <@ Client.Game() @>]
        ]

    [<Website>]
    let Main =
        Application.MultiPage (fun ctx endpoint ->
            match endpoint with
            | EndPoint.Login -> LoginPage ctx
            | EndPoint.Game -> GamePage ctx
        )
