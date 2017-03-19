module Bead where

import Prelude hiding ((<$>), (<*>), (<*), (*>), pure)
import Data.Char
import Data.List

type Parser a = String -> [(a, String)]

matches :: (Char -> Bool) -> Parser Char
matches p (x:xs) | p x = [(x,xs)]
matches _ _            = []

char :: Char -> Parser Char
char c = matches (== c)

runParser :: Parser a -> String -> Maybe a
runParser p s =
  case [ x | (x, "") <- p s ] of
    (x:_) -> Just x
    _     -> Nothing

infixl 4 <$>, <*>, <*, *>
infixl 3 <|>

(<$>) :: (a -> b) -> Parser a -> Parser b
f <$> p = \s -> [ (f x, s') | (x, s') <- p s ]

(<*>) :: Parser (a -> b) -> Parser a -> Parser b
p <*> q = \s -> [ (f x, s'') | (f, s') <- p s, (x, s'') <- q s' ]

(<*) :: Parser a -> Parser b -> Parser a
p <* q = (\x _ -> x) <$> p <*> q

(*>) :: Parser a -> Parser b -> Parser b
p *> q = (\_ x -> x) <$> p <*> q

pure :: a -> Parser a
pure x = \s -> [ (x,s) ]

token :: String -> Parser String
token (x:xs) = (:) <$> char x <*> token xs
token []     = pure ""

(<|>) :: Parser a -> Parser a -> Parser a
p <|> q = \s -> p s ++ q s

some :: Parser a -> Parser [a]
some p = (:) <$> p <*> many p

many :: Parser a -> Parser [a]
many p = some p <|> pure []

------------------------------------------------

oneDigit base = (toInteger . digitToInt) <$> (matches base)

parseWithBase base baseFv = (foldl' (\n x -> (base * n) + x) 0) <$> (some (oneDigit baseFv))

nat :: Parser Integer
nat = parseWithBase 10 isDigit
    
octal :: Parser Integer
octal = ((token "0o") <|> (token "0O")) *> parseWithBase 8 isOctDigit

hexa :: Parser Integer
hexa = ((token "0x") <|> (token "0X")) *> parseWithBase 16 isHexDigit

integer :: Parser Integer
integer = nat <|> octal <|> hexa