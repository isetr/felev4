// http://exercism.io/exercises/fsharp/poker

let exampleHand = "4S 5S 4H 4D 4C"

type Type =
    | Club of string
    | Heart of string
    | Spade of string
    | Diamond of string

    member this.Value =
        match this with
        | Club d | Heart d | Spade d | Diamond d -> d

let (|Card|) (str: string) =
    let len = str.Length
    str.[len - 1], (str.Substring( 0, (len - 1)))

let (|Club|Heart|Spade|Diamond|) (str: string) =
    let len = str.Length
    match str.[len - 1] with
    | 'C'   -> Club (str.Substring(0, len - 1))
    | 'D'   -> Diamond (str.Substring(0, len - 1))
    | 'H'   -> Heart (str.Substring(0, len - 1))
    | 'S'   -> Spade (str.Substring(0, len - 1))
    | _     -> failwith "RIP cards"

let parseHand (str: string) =
    str.Split ([| ' ' |])
    |> Array.map (fun c ->
        match c with
        | Club d    -> Type.Club d
        | Diamond d -> Type.Diamond d
        | Heart d   -> Type.Heart d
        | Spade d   -> Type.Spade d
    )

let (|PokerOfSomething|_|) (c: string) (cards: Type[]) =
    cards
    |> Array.groupBy (fun c-> c.Value)
    |> Array.tryFind (fun (v, ca) -> 
        Array.length ca = 4 && v = c
    )
    |> Option.map (fun (v, _) -> v)

let (|Poker|_|) (cards: Type[]) =
    cards
    |> Array.groupBy (fun c-> c.Value)
    |> Array.tryFind (fun (_, ca) -> 
        Array.length ca = 4
    )
    |> Option.map (fun (v, _) -> v)

let isPoker (hand: string) =
    parseHand hand
    |> (function 
        | PokerOfSomething "4" d    -> "Something " + d
        | Poker d                   -> "Poker of " + d
        | _                         -> "Not Poker"
    )

