let rec fact x =
  match x with
    | 1 -> 1
    | d -> d * fact (d - 1)

let rec fib x =
  match x with
    | 1 -> 1
    | 2 -> 1
    | d -> fib (d - 1) + fib (d - 2)

let f x = [ for i in 1 .. x do for j in 1 .. i -> i ]

let fact' x = List.fold (fun left right -> left * right) 1 [1 .. x]

let f' x =
  let rec sum list s =
    match list with
      | head :: tail -> sum tail (s + head)
      | []           -> s
  sum x 0

