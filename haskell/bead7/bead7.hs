module Bead where

-- SVector :: * -> *
data SVector a = SV Int (Int -> a)

svLength :: SVector a -> Int
svLength (SV n _) = n

svIndexF :: SVector a -> (Int -> a)
svIndexF (SV _ f) = f

indexed :: Int -> (Int -> a) -> SVector a
indexed n f = SV (n - 1) f

singleton :: a -> SVector a
singleton n = SV 0 (\_ -> n)

fromList :: [a] -> SVector a
fromList l = SV ((length l) - 1) (\n -> l !! n)

freeze :: SVector a -> [a]
freeze sv = (\n -> svIndexF sv n) <$> [0..svLength sv]

(...) :: Enum a => a -> a -> SVector a
(...) a b = SV ((fromEnum b) - (fromEnum a)) (\n -> toEnum ((fromEnum a) + n))

infixr 5 |++|
(|++|) :: SVector a -> SVector a -> SVector a
(|++|) l r = SV (svLength l + svLength r + 1) gen
  where
    gen n
      | n <= svLength l = svIndexF l n
      | otherwise      = svIndexF r (n - svLength l - 1)
      
svTake :: Int -> SVector a -> SVector a
svTake n sv = SV (n - 1) (svIndexF sv)

svDrop :: Int -> SVector a -> SVector a
svDrop n sv
  | n < 0     = sv
  | otherwise = SV (svLength sv - n) (\x -> svIndexF sv (x + n))
  
svReverse :: SVector a -> SVector a
svReverse sv = SV (svLength sv) (\n -> svIndexF sv (svLength sv - n))

svReplicate :: Int -> a -> SVector a
svReplicate n val = SV (n - 1) (\_ -> val)

svZip :: SVector a -> SVector b -> SVector (a,b)
svZip l r = SV (min (svLength l) (svLength r)) (\n -> (svIndexF l n, svIndexF r n))

svMap :: (a -> b) -> SVector a -> SVector b
svMap f sv = SV (svLength sv) (\n -> f $ svIndexF sv n)