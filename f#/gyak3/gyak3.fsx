
//*** MUTABLE ***//
type A =
    {
        mutable B: int
    }

let tryA = { B = 5 }
tryA.B <- 6

//*** ARRAY ***//
let arr = [| 5; 6 |]
arr.[0] <- 7

//*** RESIZEARRAY ***//
let resarr = new ResizeArray<int>()
resarr.Add(5)
resarr.Add(6)
resarr.Remove(5) // .RemoveAll
resarr.RemoveAt(0)

//*** DICTIONARY ***//
open System.Collections.Generic

let dict = new Dictionary<string, string>()

let mutable value = ""
dict.TryGetValue("USA", &value)
dict.["USA"] <- "Washington"
dict.TryGetValue("USA", &value)

let find key =
    match dict.TryGetValue(key) with
    | true, city -> city
    | false, _ -> "Key not found"

let present = find "USA"
let notpresent = find "Hungary"

dict.["USA"] <- "New York"
dict.Add("Hungary", "Budapest")


type Dictionary<'t, 'u> with
    member this.TryGetValueOption (key: 't) =
        if this.ContainsKey(key)
            then Some (this.[key])
            else None

dict.TryGetValueOption("USA")
dict.TryGetValueOption("France")

//*** STUFF /shrug ***//
let powcache = new Dictionary<(int * int), int>()


let (^*^) i1 i2 =
    let sw = System.Diagnostics.Stopwatch()
    sw.Start()
    match powcache.TryGetValueOption (i1, i2) with
    | Some res -> 
        sw.Stop()
        (sw.ElapsedTicks, res)
    | None ->
        let res =
            List.replicate i2 i1
            |> List.fold (fun s t -> s * t) 1
        powcache.[(i1, i2)] <- res
        sw.Stop()
        (sw.ElapsedTicks, res)
(*
//*** EXCEPTION ***//
exception NotFound of string

let TryGetValueOption (dict: Dictionary<'t, 'u>) (key: 't) =
    if dict.ContainsKey(key)
        then (dict.[key])
        else raise (NotFound ("Key not found"))

TryGetValueOption dict "USA"
TryGetValueOption dict "France"
*)