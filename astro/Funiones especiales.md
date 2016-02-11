# Funciones especiales

Este documento describe algunas formas especiales en que pueden existir las funciones.

# Método

Un método es una función que recibe como primer argumento un objeto principal con el qué trabajar, y que normalmente está sujeta a este objeto. Se dice que un método _pertenece_ a un objeto cuando está sujeta a él. Una método no recibe el primer argumento porque está implícito en el objeto al que pertenece, parecido a una aplicación parcial. El objeto al que el método pertenece se llama 'self' dentro de la función.

# Evaluación parcial

Son funciones que tienen algunos de sus argumentos aplicados, pero otros no. Si una función 'f' de dos argumentos es parcialmente aplicada con 'a', resulta en una función 'g' que cuando se invoca con 'b', invoca 'f a b'.

# Evaluación perezosa

A veces es necesario postponer la evaluación de una función para cuando se necesite su resultado, por ejemplo cuando la función necesita mucho tiempo y recursos. A esto se le dice evaluación perezosa. También puede ser útil para funciones que dependen de otros hilos. Al invocar un proceso perezosamente se crea un objeto evaluador, que está a cargo de decidir y coordinar cuándo se evaluará el proceso para devolver el resultado.

## Evaluación al uso

El evaluador actúa como función pura, y devuelve el resultado a su primer uso.

## Evaluación con cola

El evaluador actúa como caja que, cada vez que recibe un mensaje, lo guarda en una cola para aplicarlo al eventual resultado. No se evalúa hasta que se fuerza a hacerlo. Este evaluador es un pelo más complicado de implementar y de usar.

# Cajas

Se usan cuando se quiere usar una función como objeto en vez de como función. 

Algunos objetos pueden hacerse pasar por funciones puras.

