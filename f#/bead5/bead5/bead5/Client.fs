namespace bead5

open WebSharper
open WebSharper.JavaScript

[<JavaScript>]
module Client =

    [<SPAEntryPoint>]
    let Main () =
        Console.Log("Running JavaScript Entry Point..")
