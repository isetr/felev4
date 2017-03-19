open System.Collections.Generic

type Dictionary<'t, 'u> with
    member this.TryGetValueOption (key: 't) =
        if this.ContainsKey(key)
            then Some (this.[key])
            else None

// FIB //
let fibcache = new Dictionary<int, int>()

let fib n =
    match fibcache.TryGetValueOption n with
    | Some res -> res
    | None ->
        let res =
            let rec fib x =
                match x with
                | 1 -> 1
                | 2 -> 1
                | d -> fib (d - 1) + fib (d - 2)
            fib n
        fibcache.Add(n, res)
        res


// FAKT // 
let factcache = new Dictionary<int, int>()

let fact n =
    match factcache.TryGetValueOption n with
    | Some res -> res
    | None ->
        let res =
            let rec fact x =
                match x with
                | 0 -> 1
                | d -> d * fact (d - 1)
            fact n
        factcache.Add(n, res)
        res