namespace HelloWorld

module File1 =

    let private f x = x + 1

    let F (x: int) = x + 1 

module TP =
    
    open FSharp.Data

    type wbd = FSharp.Data.WorldBankDataProvider

    let x = wbd.GetDataContext()
    x.Countries.Albania.CapitalCity



    [<Literal>]
    let samplepath = __SOURCE_DIRECTORY__ + "\\test.csv"

    [<Literal>]
    let path = __SOURCE_DIRECTORY__ + "\\load.csv"

    type CSV = CsvProvider<samplepath>

    let ReadFiles (path': string) =
        let load = CSV.Load(path)
        let rows = load.Rows
        [
            for i in rows ->
                i.Name + "'s age:" + string i.Age
        ]
        |> String.concat "\n"
