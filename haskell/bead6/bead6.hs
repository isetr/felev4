module Bead where

import Prelude hiding ((<$>), (<*>), (<*), (*>), pure)
import Data.Char
import Data.List

type Parser a = String -> [(a, String)]

runParser :: Parser a -> String -> Maybe a
runParser p s =
  case [ x | (x, "") <- p s ] of
    (x:_) -> Just x
    _     -> Nothing

matches :: (Char -> Bool) -> Parser Char
matches p (x:xs) | p x = [(x,xs)]
matches _ _            = []

char :: Char -> Parser Char
char c = matches (== c)

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

chainl :: Parser a -> Parser (a -> a -> a) -> a -> Parser a
chainl p q x = (p `chainl1` q) <|> pure x

chainl1 :: Parser a -> Parser (a -> a -> a) -> Parser a
chainl1 p q = foldl (\x f -> f x) <$> p <*> many ((\f x y -> f y x) <$> q <*> p)

---------------------------------------

--DATA
data Expr
  = ALit Integer
  | BLit Bool
  | Variable String
  deriving (Show, Eq)
  
data Stm
  = Assignment String Expr
  | Skip
  | Seq Stm Stm
  | If Expr Stm Stm
  | While Expr Stm
  deriving (Show, Eq)

--PARSERS
digit :: Parser Char
digit = matches isDigit

letter :: Parser Char
letter = matches isAlpha

number :: Parser Integer
number = (foldl' (\n x -> (10 * n) + x) 0) <$> (some ((toInteger . digitToInt) <$> digit))

boolean :: Parser Bool
boolean = (token "tt" *> pure True) <|> (token "ff" *> pure False)

variable :: Parser String
variable = (:) <$> letter <*> many (letter <|> digit)

whitespace :: Parser ()
whitespace = many (matches isSpace) *> pure ()

whitespaceAround :: Parser a -> Parser a
whitespaceAround p = whitespace *> p <* whitespace

bexp :: Parser Expr
bexp = 
    BLit <$> whitespaceAround boolean <|>
    Variable <$> whitespaceAround variable
    
expression :: Parser Expr
expression =
    ALit <$> whitespaceAround number <|>
    BLit <$> whitespaceAround boolean <|>
    Variable <$> whitespaceAround variable
    
statement :: Parser Stm
statement = 
    Assignment <$> (whitespaceAround variable <* whitespaceAround (token ":=")) <*> expression <|>
    whitespaceAround (token "skip") *> pure Skip <|>
    If <$> (whitespaceAround (token "if") *> whitespaceAround bexp) <*>
           (whitespaceAround (token "then") *> whitespaceAround stm) <*>
           (whitespaceAround (token "else") *> whitespaceAround stm <*
           whitespaceAround (token "fi")) <|>
    While <$> (whitespaceAround (token "while") *> whitespaceAround bexp) <*>
              (whitespaceAround (token "do") *> whitespaceAround stm <*
              whitespaceAround (token "od"))

stm :: Parser Stm
stm = whitespaceAround (statement `chainl1` ((\_ x y -> Seq x y) <$> token ";"))