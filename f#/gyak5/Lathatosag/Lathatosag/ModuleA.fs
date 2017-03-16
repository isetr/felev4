namespace Ora5

module ModuleA = 

    let private inc x y = x + y // private

    let internal inc2 x y = x + y // project szintu

    let Increment x y = inc x y // public

    let inner x =
        let mutable c = x
        c, (fun y -> c + y)

    type private Counter() =
        let mutable c = 0

        member this.Next() =
            c <- c + 1
            c

        member this.Value = c

        member this.Reset() =
            c <- 0

    let private c = new Counter() // private a type

    let Next() =
        c.Next()    

module ModuleB =

    let s x = ModuleA.Increment x 5

module private ModuleC =
    let x = 5

[<RequireQualifiedAccess>]
module internal ModuleD =
    let x = 5

[<AutoOpen>]
module Auto =
    let ASD = 5
    
    [<RequireQualifiedAccess>]
    type PingPong =
        | Ping
        | Pong