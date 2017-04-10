type Expression<'T> = 
  | Number of 'T 
  | Add of Expression<'T> * Expression<'T> // + 
  | Sub of Expression<'T> * Expression<'T> // - 
  | Mul of Expression<'T> * Expression<'T> // *
  | Div of Expression<'T> * Expression<'T> // / 
  | Pow of Expression<'T> * Expression<'T> // 2^3 = 8 
  | Rem of Expression<'T> * Expression<'T> // 16%5 = 1

type Ops<'T> = { 
    Add : 'T ->'T -> 'T;
    Substract: 'T ->'T -> 'T;
    Divide : 'T ->'T -> 'T;
    Multiply: 'T ->'T -> 'T;
    Remainder: 'T ->'T -> 'T;
    Pow: 'T ->'T -> 'T;
  }

let rec eval (e: Expression<'T>) (ops: Ops<'T>) = 
    match e with
    | Number d -> d
    | Add (l, r) -> ops.Add (eval l ops) (eval r ops)
    | Sub (l, r) -> ops.Substract (eval l ops) (eval r ops)
    | Mul (l, r) -> ops.Divide (eval l ops) (eval r ops)
    | Div (l, r) -> ops.Multiply (eval l ops) (eval r ops)
    | Pow (l, r) -> ops.Pow (eval l ops) (eval r ops)
    | Rem (l, r) -> ops.Remainder (eval l ops) (eval r ops)