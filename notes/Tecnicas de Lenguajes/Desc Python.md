# Descripcion Python

En Python, prácticamente todo es un diccionario. Los módulos son diccionarios
que se resuelven estáticamente, y se puede acceder a ellos con un nombre
específico que siempre va a llevar al mismo diccionario, por ejemplo, el
modulo _Math_ es simplemente un objeto con un montón de funciones que se pueden
usar. Por el hecho de que es un diccionario, se puede modificar. Por ejemplo,
no estoy seguro si es legal, pero por la implementación, es válido cambiar
`Math.log` por otro objeto, y de ahí en adelante, siempre que alguien use
`Math.log`, usará el nuevo objeto.

Del mismo modo, los objetos son diccionarios, y tienen varios valores
asociados. Cuando tienes un objeto `carro`, y usas `carro.ruedas = 4`,
simplemente estás asociando un valor arbitrario, a un nombre arbitrario, en
el objeto al que llamas _carro_.

Las clases son objetos también, lo que significa que también son simplemente
diccionarios, pero ellas tienen varios azúcares sintácticos. Primero hay que
aclarar que, aunque las clases pueden tener cualquier valor en cualquier
atributo, los más importantes son las funciones (las funciones son objetos
especiales así que se pueden usar como tal y asignarse a un atributo). Un
objeto siempre tiene un atributo especial _class_, que mapea a la clase a la
que ese objeto pertenece. El primer azucar sintáctico es la instanciación.
Si se tiene una clase _Carro_, para crear una nueva instancia de esa clase
se usa la expresión `Carro()`. Básicamente se usa la clase como si fuese una
función, pero por detrás, lo único que Python hace es crear un objeto nuevo
vacío, asigna el atributo especial _class_ al objeto _Carro_ (la clase), y
ejecuta la función `Carro.init` pasando el nuevo objeto como primer parámetro.
Así instancia Python una clase. El segundo azucar sintáctico es invocar un
método de una instancia. Un método es una función definida en la clase, por
ejemplo, `Carro.correr` es una función, pero como es una función de una clase,
la convierte en un método de esa clase porque todas las instancias de carro
tendrán acceso a esa función. Para invocar un método, se usa la sintaxis
`carro.correr()` (suponiendo que tenemos un objeto _carro_ que es instancia
de _Carro_). De nuevo, es un azúcar sintáctico, lo que en realidad hace Python
es traducirlo a `carro.class.correr(carro)`, es decir, agarra la clase de
_carro_, y luego el atributo _correr_ de esa clase, y luego la ejecuta, pasando
_carro_ como primer argumento.

La herencia en Python también es simple. Una clase puede heredar de otra,
declarando de qué clases hereda. Al heredar de otras clases, la definición de
métodos no cambia mucho, lo que cambia es la instanciación y la invocación de
métodos de instancia. Si se tiene una clase _Carro_ y una clase _Vehiculo_ de
la que hereda _Carro_, al instanciar `carro = Carro()`, Python traduce a esto:
`carro = Carro.init(Vehiculo.init(new_object)); carro.class = Carro`, o sea,
igual que con la clase normal, Python crea un objeto nuevo asigna la clase
_Carro_ al atributo _clase_ del objeto, luego llama la función _init_ de esa
clase para que modifique más los atributos del objeto, pero aquí está la
diferencia. Con la clase normal solo hace falta llamar un _init_, pero ahora
que hay más clases, primero invoca el _init_ de la clase más superior posible
en la herencia (En este caso Vehículo), y luego va haciendo lo mismo con el
mismo objeto con las siguientes clases, hasta llegar a la clase del objeto
(En este caso Carro).

En el caso de resolución de métodos de instancia. Asumamos que existen los
métodos `Vehiculo.mover` y `Carro.rodar`. Si llamamos `carro.rodar()`, python
traduce a `Carro.rodar(carro)`, pero si usamos `carro.mover()` debe traducir
a `Vehiculo.mover(carro)`, y para hacer eso ya no se puede simplemente usar
`carro.class.mover(carro)` porque eso traduce a _Carro.mover_. Python lo que
hace en este caso es buscar el método subiendo por la herencia, con una función
especial algo así:

    Class.invoque(method, attrs):
      if Class.method:
        Class.method(attrs)
      else:
        Class.parent.invoque(method, attrs)

Obvio no es eso exactamente, ni siquiera es python legal, peo entienden la
idea. De ese modo se puede ir buscando el método en todas las clases de las
que se hereda hasta conseguirlo y ejecutarlo, pero siempre empezando por la
clase directa del objeto y terminando con el ancestro más alto.

Para la herencia múltiple.

Algo que rueda no necesariamente es un vehículo, y un vehículo no
necesariamente rueda, por lo tanto asumamos

    Class Vehículo:
      def andar
    Class Rodable:
      def rodar
    Class Carro(Vehículo, Rodable):
      def frenar # No pensé nada mejor
    carro = Carro()

Python 2 resuelve esto de un modo muy sencillo (pero no muy versátil, véase
más abajo con python 3). Para instanciar Carro, se usa primero los inits de
_Vehículo_ y luego los inits de _Rodable_ (Cuando digo "los inits" me refiero
a que primero busca en todos los ancestros de estas clases, del mismo modo
que estamos buscando en los ancestros de _Carro_). ¿Por qué en este orden?
simplemente porque primero se escribió "Vehículo" y luego "Rodable".

Del mismo modo cuando se invoca un método de _carro_, se busca primero toda
la decendencia del primer padre (incluyéndolo), y luego la del segundo.
Pero hay que tomar en cuenta que a diferencia de los constructores, que se usa
primero el ancestro más antiguo, para búsqueda de método se usa primero el
ascendente más reciente, o sea el padre. Del mismo modo, me imagino, se
invierte el orden de los padres, es decir, se busca la acendencia de _Rodable_
antes de la de _Vehículo_, para mantener la jerarquía invertida.

Este sistema es muy simple de implementar, pero tiene algunos problemas,
solucionados en Python 3. La base es la misma, en que se busca el método
y el constructor dinámicamente en la ascendencia de la clase, pero el orden
en que se hace ya no es simplemente el orden en que se escribió, sino algo
más sofisticado. Una mejor explicación del sistema está aquí:
https://www.python.org/download/releases/2.3/mro/