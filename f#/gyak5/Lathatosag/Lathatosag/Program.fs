#nowarn "40" // 

namespace Ora5

module Main =

    // open ModuleA, vagy ModuleA.*

    let p = ModuleA.Increment 3 4
    let q = X.StrFunc "Valami" 2

    let ping = PingPong.Ping // kell a PingPong.*

    // open ModuleD <- nem lehet
    let k = ModuleD.x

    [<EntryPoint>]
    let main argv = 
        printfn "%d" ASD
        0
