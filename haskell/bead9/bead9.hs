module Submission where

import Prelude hiding (gcd)

-- Expr :: * -> *
newtype Expr a = E (Env -> a)
type Env = [(Name, Integer)]
type Name = String

var :: Name -> Expr Integer
var n = E (find n)
  where
    find :: String -> Env -> Integer
    find n [] = error $ "var: couldn't find variable " ++ n
    find n (x:xs) 
      | fst x == n = snd x
      | otherwise  = find n xs

val :: a -> Expr a
val n = E (\_ -> n)

if' :: Expr Bool -> Expr a -> Expr a -> Expr a
if' cond t f = E $ evalif cond t f
  where 
    evalif :: Expr Bool -> Expr a -> Expr a -> Env -> a
    evalif cond (E t) (E f) env
      | eval cond env = t env
      | otherwise     = f env
  
bind :: Name -> Expr Integer -> Expr a -> Expr a
bind n v (E ex) = E $ ex . (\env -> [(n, newVal v env)] ++ env)
  where
    newVal :: Expr Integer  -> Env -> Integer
    newVal v env = eval v env
    
eval :: Expr a -> Env -> a
eval (E f) env = f env

instance Functor Expr where
  fmap f (E ex) = E (f . ex)
  
instance Applicative Expr where
  pure x = val x
  
  (E l) <*> (E r) = E $ comp l r
    where
      comp :: (Env -> (a -> b)) -> (Env -> a) -> Env -> b
      comp l r env = l env $ r env

gcd :: Expr Integer
gcd =
  if' ((==) <$> var a <*> var b)
    (var a)
    (if' ((>) <$> var a <*> var b)
      (bind a ((-) <$> var a <*> var b) gcd)
      (bind b ((-) <$> var b <*> var a) gcd))
  where
    [a,b] = ["a","b"]
