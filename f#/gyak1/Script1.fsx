type Fruit =
    | Apple of int
    | Peach of int
    | Melon of int

let FruitFun = fun a ->
    match a with
    | Apple d -> d + 2
    | Peach d -> d + 5
    | Melon d -> d + 7

let FruitList = 
    [
        Apple 5
        Peach 1
        Melon 8
    ]

let NewFruitList = List.map(FruitFun) FruitList