# Function Traits

Los Traits que tenía pensados eran para las clases. Los traits son interfaces, declaran un número de funciones, y cada una de ellas tiene un nombre, argumentos que necesita, y valores que devuelve. Una clase puede implementar varios traits, definiendo la implementación de las funciones que el trait define.

Tengo una nueva idea para los traits. Estos traits son solo funciones, no interfaces. Las funciones traits exigen los argumentos, los valores devueltos, y un número de variables, que los argumentos y retornos pueden usar. La mayoría de las veces, solo hay una variable de tipo, para simular interfaces, pero pueden haber más y hacerse dispatch.