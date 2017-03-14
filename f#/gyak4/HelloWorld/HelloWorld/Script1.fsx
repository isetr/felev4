// let, let!, yield, yield!

let rep n = 
    [ for i in 1..n do
        yield! List.replicate i i
    ]

let sleep d = Async.Sleep d

let l = [1..5]

let f () = printfn "Hello"

do f()

let str =
    async {
        return "Hello"
    }

let p =
    async {
        let! s = str
        printfn "%s" s
        for i in 1..5 do
            do! sleep (i*1000)
            printfn "%d" i
    }
    |> Async.Start