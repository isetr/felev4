let add1 a b = a + b
let add2 (a,b) = a + b

let a = seq{
    for i in 1..100 do
        yield i ** 2
}

let l = [| 5;6; |]
let l' = [|
    5
    6
|]

type A = int
type Person = 
    {
        Name:string
        Age:int
    }

let Pista = 
    {
        Name="Pista"
        Age=20
    }

type Fruit =
    | Apple of int
    | Peach of string
    | Melon of int
    | X of int
    | F of int

let BigApple = Fruit.Apple 50

let pF = fun a ->
    match a with
    | Apple d -> "alma atmero: " + string d
    | Peach s -> "stuff: " + s
    | Melon _ -> "a"
    | X d
    | F d -> "X or F with " + string d
    | _ -> "lulz token"


let pF' = function
    | x,(_:int),(b:int) -> "x + 2 int case"
    | x,_,_ -> "lulz token" // will never be matched atm

type X =
    {
        a:int
    }
    member c() = 5
    static member k() = 
        {
            a * 5
        }

(*
= egyenloseg vizsgalat
<> elbaszott !=
*)