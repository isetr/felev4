module Submission where

import Data.Monoid;

-- Map :: * -> * -> *
data Map k v
  = Empty
  | Node k v (Map k v) (Map k v)
    
empty :: Map k v
empty = Empty

fold :: (k -> v -> a -> a -> a) -> a -> Map k v -> a
fold f z (Node k v m1 m2) = f k v (fold f z m1) (fold f z m2)
fold f z empty = z

toList :: Map k v -> [(k,v)]
toList (Node k v m1 m2) = toList m1 ++ [(k, v)]  ++ toList m2
toList empty = []

keys :: Map k v -> [k]
keys (Node k _ m1 m2) = keys m1 ++ [k] ++ keys m2
keys empty = []

values :: Map k v -> [v]
values (Node _ v m1 m2) = values m1 ++ [v] ++ values m2
values empty = []

instance (Eq k, Eq v) => Eq ((Map k) v) where
  (==) m1 m2 = equals
    where
      m1List = toList m1
      m2List = toList m2
      equals = and [ (x `elem` m2List) && (y `elem` m1List) | x <- m1List, y <- m2List ] 

instance (Show k, Show v) => Show ((Map k) v) where
  show m = fold (\k v m1 m2 -> m1 ++ (show k) ++ " => " ++ (show v) ++ "\n" ++ m2) "" m
  
insert :: (Ord k, Monoid v) => k -> v -> Map k v -> Map k v
insert k v (Node kn vn m1 m2)
  | k < kn    = Node kn vn (insert k v m1) m2
  | k == kn   = Node k (v <> vn) m1 m2
  | otherwise = Node kn vn m1 (insert k v m2)
insert k v mempty = Node k v mempty mempty

fromList :: (Ord k, Monoid v) => [(k, v)] -> Map k v
fromList [] = empty
fromList (x:xs) = insert (fst x) (snd x) (fromList xs)

dictionary :: Ord a => [a] -> Map a (Sum Integer)
dictionary [] = empty
dictionary (x:xs) = insert x 1 (dictionary xs)

instance Functor (Map v) where
  fmap f (Node k v m1 m2) = Node k (f v) (fmap f m1) (fmap f m2)
  fmap _ empty  = Empty
  
distribution :: Ord a => [a] -> Map a Double
distribution [] = empty
distribution xs = fmap (\v -> (fromInteger (getSum v)) / xslen) (dictionary xs)
  where
    xslen = fromIntegral $ length xs














