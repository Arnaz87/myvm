# Cobre

Cobre es el lenguaje de bajo nivel que refleja la estructura de mi máquina virtual. No está diseñado para ser extremadamente usable para los programadores, sino para mostrar conceptos, explorar otros nuevos, y probar la máquina con relativa facilidad.

Nótese que la máquina está hecha principalmente para Interpretes y Compiladores (ambos, los que compilan _a_ la máquina y los que compilan _de_ la máquina), no para humanos.

El lenguaje trata de crear una gramática textual con la que poder trabajar, con algunas abstracciones del tipo que ofrece C, pero no abstrae ningún concepto base.

El lenguaje termina estando en un nivel de abstracción parecido a C++ o a Go, con una sintaxis más limpia, como la de Go (espero), aunque conceptualmente, la mayor inspiración entre los lenguajes de sistemas es Rust.

El nombre viene de un extraño juego de palabras con "Close to the Metal", que es como se le dice a los lenguajes que no alejan demasiado al programador de la manera en que funciona la plataforma en la que se programa. Quería usar "Close" como nombre, pero después quise usar algo metálico, vi que "Rust" de hecho es metálico. Se me ocurrió "Metal" pero es medio feo, luego "Iron" pero esa palabra ya está asociada con algunos lenguajes de .Net. Luego pensé en usar una palabra en español y salió "Hierro", pero después vino "Cobre" que es una manera en que se le dice al dinero en Venezuela, y el nombre en sí me gusta más. Luego se me ocurrió "Palo" que es otra, pero volví a Cobre para no alejarme del metal. Creo que a la máquina virtual le voy a poner Palo, en vez de Pana que es demasiado nacional.

(El lenguaje es "Close to the Metal"->Cercano al Metal->Metálico->Cobre!)

Otra cosa, esto no es como Java. La JVM fue creada para las computadoras, reflejando el leguaje Java, que es creado para los humanos. Cobre es creado para los humanos, reflejando Palo, creado para las computadoras.