namespace GuessTheNumber

open WebSharper

module Server =

    [<Rpc>]
    let Login user =
        let users = Data.users
        let ctx = Web.Remoting.GetContext()
        let rand = new System.Random()
        let randNum = rand.Next(100)
        async {
            if not <| users.ContainsKey(user)
                then users.Add (user, randNum)
            do! ctx.UserSession.LoginUser (user, true)
        }

    [<Rpc>]
    let CompareTheGuess user (guess : int) =
        let users = Data.users
        let num = snd <| users.TryGetValue user
        async {
            return guess.CompareTo num
        }

    [<Rpc>]
    let GenerateNewNum user =
        let users = Data.users
        let rand = new System.Random()
        let randNum = rand.Next(100)
        async {
            users.[user] <- randNum
        }

    [<Rpc>]
    let GetUser =
        let ctx = Web.Remoting.GetContext()
        async {
            return ctx.UserSession.GetLoggedInUser
        }
        
