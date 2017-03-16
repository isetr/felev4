module X

    let StrFunc (s: string) i = 
        s.Substring(0, i)

    let StrFunc' (s: string) i = 
        String.replicate i s