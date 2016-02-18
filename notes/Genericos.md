# Genéricos

Quiero soportar genéricos, pero no hallo qué mecanismo usar para ellos.

## [2016-02-17 23:18] Lo que tengo

Tengo tipos, que tienen una estructura de datos para las instancias, y pueden tener variables. También pueden implementar traits.

Tengo traits, son un grupo de funciones que un tipo puede implementar, y si lo hace, se puede hacer pasar por el trait.

Las funciones tienen variables. Las variables son registros en la máquina virtual, y la mayoría tienen tipos. El tipo de un registro es constante, y el programa no puede acceder o cambiar el tipo de un registro (pero sí puede ver el tipo del valor en ese registro). Un registro puede tener de tipo un Trait (un valor no, ellos solo pueden tener tipos).

Los objetos tienen campos. Funcionan exactamente igual, es como si un objeto simplemente fuera un espacio de registros, igual que el stack.

Supongamos que tenemos la variable a=1 y b="hola". El tipo de 1 es un Entero, y el de "hola" es un String. Suponer que se quieren incrementar. La función de incrementar recibe un Enumerable, que es un Trait. Si se incrementa b, la máquina averigua que String no es Enumerable, y da error.
Esto puede ocurrir de dos formas: Si el registro no tiene tipo, la máquina debe hacer esto justo al invocar "incrementar". Pero si el registro tiene tipo String, la máquina puede hacer esto antes de ejecutar el código y ahorrarse un esfuerzo.
Si se trata de incrementar 'a' sí funciona, porque Entero sí es Enumerable, pero igual, si el registro no tiene tipo tiene que averiguarlo, y si sí lo tiene puede ahorrarse el esfuerzo.
Un detalle es que a siempre será entero, pero solo se necesita que sea enumerable, por eso, si intentamos que 'a' sea 1.5, no funcionará porque 1.5 no es Entero, es Racional. Si la máquina supiera que solo se necesita Enumerable pero no necesariamente Entero, esto funcionaría. Por eso un registro puede tener un Trait como Tipo, y hacer que 'a' sea Enumerable.
Ahora si funcionará porque 1.5 es Enumerable y la máquina nos deja. Solo que la máquina ahora no sabrá que 1 es un Entero, pero como no lo necesita no importa.

## [2016-02-18 00:10] Lo que tengo, tipos y variables

Los Objetos y Valores siempre tienen tipo, pero solo saben su tipo directo, no saben de sus traits, hay que preguntarle a los tipos (sin visaje) porque ellos sí saben de sus Traits.





