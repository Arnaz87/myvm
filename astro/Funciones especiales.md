# Funciones especiales

Este documento describe algunas formas especiales en que pueden existir las funciones.

Nota: _Desucrar_ viene del prefijo "de" (quitando algo) y "sucro" (relativo al azúcar). La inventé yo. Me pareció la mejor traducción para "desugar", sobre "Desazúcar" (wtf).

# Método

Un método es una función que recibe como primer argumento un objeto principal con el qué trabajar, y que normalmente está sujeta a este objeto. Se dice que un método _pertenece_ a un objeto cuando está sujeta a él. Un método no recibe el primer argumento porque está implícito en el objeto al que pertenece, parecido a una aplicación parcial. El objeto al que el método pertenece se llama 'self' dentro de la función, pero se puede usar el azúcar sintáctico '@'.

Creación de método: `obj.f = (x) => @g x`
Desucrado: `obj.f = Method.new obj, (self, x) -> self.g x`
Equivale a: `obj.f = ((self) -> (x) -> self.g x) self`
Equivale a: `obj.f = (x) -> obj.g x`

# Evaluación parcial

Son funciones que tienen algunos de sus argumentos aplicados, pero otros no. Si una función 'f' de dos argumentos es parcialmente aplicada con 'a', resulta en una función 'g' y cuando se invoca con 'g b', se ejecuta 'f a b'.

`%pt(f a, b)` Desucrado: `(*args) -> (f a, b, *args)`

# Evaluación perezosa

A veces es necesario postponer la evaluación de una función para cuando se necesite su resultado, por ejemplo cuando la función necesita mucho tiempo y recursos. A esto se le dice evaluación perezosa. También puede ser útil para funciones que dependen de otros hilos. Al invocar un proceso perezosamente se crea un objeto evaluador, que está a cargo de decidir y coordinar cuándo se evaluará el proceso para devolver el resultado.

`%lz(f a, b)` Desucrado `lazy.new (-> f a, b)` dependiendo del estilo

## Evaluación al uso

El evaluador actúa como función pura, y devuelve el resultado a su primer uso.

    lazy_use.proto =
      init (fun, args) =>
        @fun = fun
      flag = false
      result = nil
      _use =>
        if not @flag
        then @result = call @fun
        @result

## Evaluación con cola

El evaluador actúa como caja que, cada vez que recibe un mensaje, lo guarda en una cola para aplicarlo al eventual resultado. No se evalúa hasta que se fuerza a hacerlo. Este evaluador es un pelo más complicado de implementar y de usar, pero creo que puede valer la pena.

    lazy_stack.proto =
      init (fun) =>
        @fun = fun
      flag = false
      result = nil
      stack = []
      _send (*args) =>
        if @flag
        then send @result, *args
        else @stack.push args
      force =>
        call @fun

Una versión un poco más creíble, que se va copiando con cada uso (aunque no guarda el resultado)

    lazy_base.proto =
      init (fun) =>
        @fun = fun
      _send (*args) =>
        lazy_list @, args
      force =>
        call @fun, *args
    lazy_list.proto =
      init (base, args) =>
        @base = base
        @args = args
      _send (*args) =>
        lazy_list @, args
      force =>
        send @base.force, @args[0], @args[1..]

# Cajas

Se usan cuando se quiere usar una función como objeto en vez de como función. 

Algunos objetos pueden hacerse pasar por funciones puras.

