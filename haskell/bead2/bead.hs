module Bead where

data Heap a
  = E
  | T Int a (Heap a) (Heap a)
  deriving (Show, Eq)
  
rank :: Heap a -> Int
rank E           = 0
rank (T r _ _ _) = r

mkT :: Ord a => a -> Heap a -> Heap a -> Heap a
mkT a E E  = T 1 a E E
mkT a h1 E = T 1 a h1 E
mkT a E h2 = T 1 a h2 E
mkT a h1@(T r1 _ _ _) h2@(T r2 _ _ _) 
  | r1 == r2  = T (r1 + 1) a h1 h2
  | r1 > r2   = T r1 a h1 h2
  | otherwise = T r2 a h2 h1

empty :: Heap a
empty = E
  
singleton :: Ord a => a -> Heap a
singleton a = T 1 a E E

isEmpty :: Heap a -> Bool
isEmpty h =
  case h of
    T r _ _ _   -> r == 0
    empty       -> True
    
findMin :: Heap a -> Maybe a
findMin h =
  case h of
    T _ a _ _   -> Just a
    empty       -> Nothing
  
merge :: Ord a => Heap a -> Heap a -> Heap a
merge E E = E
merge h E = h
merge E h = h
merge h1@(T _ n1 h11 h12) h2@(T _ n2 _ _)
  | n1 > n2   = merge h2 h1
  | otherwise = mkT n1 h11 (merge h12 h2)
  
insert :: Ord a => a -> Heap a -> Heap a
insert a h = merge (singleton a) h

deleteMin :: Ord a => Heap a -> Heap a
deleteMin h@(T _ _ h1 h2) = merge h1 h2
deleteMin empty = empty
