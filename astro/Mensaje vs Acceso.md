# Lo que se tiene hasta ahora

Astro es basado en objetos (todo es un objeto), en paso de mensajes (el comportamiento por defecto de un objeto es responder mensajes, y es el principal modo de interacción), y tabular (los objetos son diccionarios).

El operador de mensaje es '.' Cuando se usa, el operador busca el campo '_get' en el objeto que lo contiene y lo ejecuta. Por defecto todos los objetos tienen un '_get' que busca el nombre del mensaje en los campos y los prototipos, y si es una función, la ejecuta con los argumentos del mensaje.

El operador de acceso es ':', y busca en el objeto directamente un campo con el nombre que se busca.

El nombrar una variable del scope actual exhibe un comportamiento de mensaje, no de acceso, es decir, si la variable es una función, se ejecuta automáticamente.

# Problemas

El primer problema es que el acceso a variables es un mensaje por defecto, quiere decir que si una variable es una función, automáticamente se ejecuta. Eso normalmente es lo esperado, pero hay situaciones en que se quiere usar una función como un objeto común, y guardarse en un argumento, pero el uso automático no lo permite.

Otro problema tiene que ver con lo mismo. Las funciones reciben argumentos y los guardan en variables, y si una función recibe una función como argumento, el estar guardada en una variable hace que sea muy difícil usarla como objeto. Esto no es problema en las funciones que esperan que algunos de sus argumentos sean funciones, pero en todas las demás sí, e incluso en ese tipo de funciones si alguno de los argumentos que no se espera que sea una función termina siéndolo.

# Ideas posibles

Una posible solución, es permitir el acceso de variables con un operador ':', pero el primer problema obvio es que hace conflicto con los símbolos. Obviando eso, el otro problema es que por defecto la función se ejecuta, y dentro de las funciones eso no es lo que se desea, pues una función nunca sabe qué argumentos puede recibir, y si no espera una función, no estará preparada.

## Operador Caja

La solución que estaba desarrollando era un operador de cajas '&', que cuando se usa con una variable, mete su valor en una caja, y cuando se usa para ser asignado, saca lo que sea que esté dentro de la caja, además, el lenguaje automáticamente metería los argumentos de una función en una caja.
El primer problema es que genera ambiguedad con el operador and, pero no es muy importante, se puede resolver. Es un mecanismo un pelo complicado. Había otro problema medio grave pero no lo recuerdo... AARGH!

## Operador Acceso

Otra solución es usar un operador '$' para acceso. De este modo se puede acceder a un campo de un objeto o a una variable sin usarla: `fun = $pow` para variable o `run = car$run` para campos.

Esto soluciona el uso de funciones como objetos para evitar ejecutarlas, pero no soluciona aún el paso de funciones como argumento.

## Dejarlo así

Una opción es dejarlo así, el programador debe ser cuidadoso de no enviar funciones donde se esperan objetos porque serán ejecutadas automáticamente. Para tratar funciones como objetos se usa la función 'box', que las guarda en una caja que no se ejecutan solas, y el método 'unbox' para sacarlas de la caja.

## Cajas automáticas

Al pasar una función como argumento, el lenguaje automáticamente la guarda en una caja, y si el programador espera una función como argumento, debe extraerla de la caja al inicio del código, o usarla directamente con el método 'call'.

