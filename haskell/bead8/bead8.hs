module Submission where

-- DiffList :: * -> *
newtype DiffList a = DFL ([a] -> [a])

fromList :: [a] -> DiffList a
fromList xs = DFL $ (++) xs

toList :: DiffList a -> [a]
toList (DFL f) = f $ []

empty :: DiffList a
empty = DFL $ (++) []

singleton :: a -> DiffList a
singleton x = DFL $ (:) x

infixr 5 `cons`
cons :: a -> DiffList a -> DiffList a
cons x (DFL f) = DFL $ (x :) . f

append :: DiffList a -> DiffList a -> DiffList a
append (DFL fl) (DFL rl) = DFL $ fl . rl

concat :: [DiffList a] -> DiffList a
concat [x] = x
concat (x:xs) = x `append` Submission.concat xs

foldr :: (a -> b -> b) -> b -> DiffList a -> b
foldr f x dfl = Prelude.foldr f x (toList dfl)

map :: (a -> b) -> DiffList a -> DiffList b
map mf dfl = Submission.foldr (cons . mf) empty dfl
