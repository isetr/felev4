module Main

open HelloWorld

[<EntryPoint>]
let main argv =
    
    // File2.F

    printfn "%s" (TP.ReadFiles "")
    0
