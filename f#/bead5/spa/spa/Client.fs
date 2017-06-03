namespace spa

open WebSharper
open WebSharper.JavaScript
open WebSharper.JQuery
open WebSharper.UI.Next
open WebSharper.UI.Next.Html
open WebSharper.UI.Next.Client

[<JavaScript>]
module Site =

    let mutable savedNumber = 0
    let rvSavedNumber = Var.Create <| string savedNumber
    let cls s = attr.``class`` s
    
    type EndPoint =
        | Index
        | Calc

    let IndexPage go =
        let inputField =
            divAttr [cls "panel panel-default"] [
                divAttr [cls "panel-heading"] [
                    h3Attr [cls "panel-title"] [
                        text "Input"
                    ]
                ]
                divAttr [cls "panel-body"] [
                    formAttr [cls "form-horizontal"; Attr.Create "role" "form"] [
                        divAttr [cls "form-group"] [
                            labelAttr [cls "col-sm-4 control-label"; attr.``for`` "inputBox"] [
                                Doc.TextNode "Adj meg egy szamot: "
                            ]
                            divAttr [cls "col-sm-4"] [
                                Doc.Input [cls "form-control"; attr.id "inputBox"] rvSavedNumber
                            ]
                        ]
                        Doc.Button "Szam mentese" [cls "btn"] (fun _ -> try savedNumber <- System.Int32.Parse rvSavedNumber.Value with _ -> ())
                        Doc.Button "Szamolas" [cls "btn"] (fun _ -> go EndPoint.Calc)
                    ]
                ]
            ]
        inputField

    let CalcPage go =
        let isEven n = n % 2 = 0
        let isPrime n = not <| Seq.fold (fun l r -> l || r) false [ for i in 2..(n / 2) -> n % i = 0 ]
        let log2 (n : float) = log n / log 2.0
        let modWith100 n = n % 100 
    
        let viewEven = isEven savedNumber
        let viewIsPrime = isPrime savedNumber
        let viewLogTwo = log2 <| float savedNumber
        let viewMod100 = modWith100 savedNumber

        let views =
            [
                ("A szamod", string savedNumber)
                ("Paros-e", string viewEven)
                ("Prim-e", string viewIsPrime)
                ("Log2", string viewLogTwo)
                ("mod 100", string viewMod100)
            ]

        let tableRow (label, view) =
            tr [
                td [text label]
                tdAttr [attr.style "width:66%"] [
                    text view
                ]
            ] :> Doc

        let table =
            divAttr [cls "panel panel-default"] [
                divAttr [cls "panel-heading"] [
                    h3Attr [cls "panel-title"] [
                        text "Output"
                    ]
                ]
                divAttr [cls "panel-body"] [
                    tableAttr [cls "table"] [
                        tbody [
                            List.map tableRow views |> Doc.Concat
                        ]
                    ]
                    Doc.Button "Vissza a szam megadasara" [cls "btn"] (fun _ -> go EndPoint.Index)
                ]
            ]
        table

    let routeMap =
        RouteMap.Create
        <| function
            | Index -> []
            | Calc -> ["calc"]
        <| function
            | [] -> Index
            | ["calc"] -> Calc
            | _ -> failwith "404"

    [<SPAEntryPoint>]
    let Main =
        let router = RouteMap.Install routeMap
        let renderMain v =
            View.FromVar v
            |> View.Map (fun  pty ->
                let go = Var.Set v
                match pty with
                | Index -> IndexPage go
                | Calc -> CalcPage go
            )
            |> Doc.EmbedView

        Doc.RunById "main" (renderMain router)