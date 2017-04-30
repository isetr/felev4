class Functor f where
  fmap :: (a -> b) -> f a -> f b
  fmap f x = pure f <*> x

class Functor f => Applicative f where
  pure :: a -> f a
  pure = return
  
  (<*>) :: f (a -> b) -> f a -> f b
  fs <*> xs = do { f <- fs; x <- xs; pure (f x) }

class Applicative m => Monad m where
  return :: a -> m a
  return = pure
  
  (>>=) :: m a -> (a -> m b) -> m b
  (>>) :: m a -> m b -> m b
  m >> k = m >>= (\_ -> k)
  
  fail :: String -> m a
  fail = error