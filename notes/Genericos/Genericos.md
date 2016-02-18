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

Los Objetos y Valores siempre tienen tipo, y siempre lo conocen, pero solo saben su tipo directo, no saben de sus traits, hay que preguntarle a los tipos, que sí saben de sus Traits. Los registros pueden o no saber el tipo de su valor. En caso de saberlo, son capaces de averiguar qué traits implementa el tipo. También pueden saber que sus variables implementan algún Trait, pero si saben de que Trait son, no saben de qué tipo son las variables. También pueden no saber nada del tipo de la variable, en este caso, la máquina es capaz de averiguar todo lo que necesite saber sobre el tipo y Traits de la variable.

    Lo que sabe     Deducido en     Deducido en
    el registro:    compilación:    ejecución:
    -Tipo           -Traits         -Implementación
    -Trait          -Implementación -Nada
    -Nada           -Nada           -Tipo, Traits, Implementación
                                        (Puede fallar)

## [2016-02-18 09:00] Genéricos usando objetos

La manera más fácil de usar genéricos es simplemente usando tipos variables para el contenedor. Ej:

    class Box {
      var value;
      func init (var nval) {
        this.value = nval;
      }
      func get () (var) {
        return this.value;
      }
    }

Con esto, Box es genérico, no necesita saber el tipo exacto de la variable. El problema es que si se quiere usar esto en código tipado, puede ser lento e incluso puede fallar a veces, porque el Genérico no tiene tipo. Esto es lo que hace java, y revisa los tipos al compilar.

Una solución al problema de tipo es hacer algo así

    class Box {
      var value;
      Class cls;
      func init (Class cls, var nval) {
        this.cls = cls;
        this.set(nval);
      }
      func set (var nval) {
        if (nval.class != this.cls) {raise Error;}
        this.val = nval;
      }
    }

De este modo la clase puede revisar tipos, pero es dinámico, y el código tipado aún no puede aprovechar esto.

## [2016-02-18 09:20] Genéricos con generación de código

    class IntBox {
      int val;
    }
    class FloatBox {
      float val;
    }
    class ArrayBox {
      Array val;
    }

Primero, es imposible generar código para todos los tipos posibles, y aún si se pudiera, gastaría Demasiado espacio!. También es imposible predecir con qué tipos se usará la Clase en todo el programa. El Mayor problema con esto es que si una función recibe Box, no puede recibir IntBox porque es un tipo diferente (Esto se soluciona con supertipos, o con un Trait). Esto es lo que hace C++. C# hace algo parecido a esto, pero va creando instancias a medida que se va usando el genérico con diferentes clases, o sea en ejecución, no crea todas las infinitas instancias que podría necesitar. Lo que hace C# es lo que había pensado. El mayor problema es que esto genera código en medio de la ejecución. Aunque no necesariamente tiene que ser en ejecución, puede ser en Carga, de hecho mi idea era especializar la clase al cargar el módulo que lo use. Se hace un poco más complicado cuando se incluyen "Tipos Superiores" (Higher Kinded Types), pero creo que no mucho.

## [2016-02-18 16:52] Idea de genéricos

Para un módulo poder usar un tipo, debe declararlo como constante. La máquina virtual carga las constantes al cargar el módulo, y permanecen fijas.
La idea es que, como la máquina virtual siempre carga las constantes, podrían hacerse computaciones al cargar el módulo, y puedo aprovechar esto para los genéricos.

Un módulo puede definir clases genéricas, que no son clases normales, pero son iguales, solo que también definen argumentos.

## [2016-02-19 11:22] Busqueda de alternativas

Creo que no debería implementar genéricos directamente. Debería usar generadores de código, a la Templates, pero bien pensado o no sé.

Los genéricos son geniales, y muchos lenguajes populares los usan así que sería útil implementarlos, pero son complicados, y hay muchos otros conceptos raros que otros lenguajes usan que también son complicados.
Haskell por ejemplo, usa tipos paramétricos, que son más complejos que los genéricos, particularmente los tipos superiores, pero también todo el concepto.
Implementaba los genéricos porque Frege fue capaz de implementar tipos paramétricos sobre el sistema de tipos de la JVM, pero ahora que veo los sistemas de tipo tan extraños que hay por ahí, y creo que no es la mejor idea echarle tanta cabeza a solo un sistema complicado.
En vez de eso, tengo que echarle cabeza a un sistema que pueda representar todos esos otros sistemas complicados.

## [2016-02-19 11:27] Computación de Constantes

Una solución que se me ocurrió es la capacidad de computar constantes. Eso es, un módulo puede declarar constantes que dependen de otras constantes de otros módulos, así, en el momento de cargar el módulo, la máquina genera las constantes.

Los módulos también pueden implementar algoritmos para constantes, es decir, funciones que se usan para computar algunas constantes.

Un genérico podría implementarse como una de estas funciones, e invocarlas  es equivalente a instanciar el genérico.

Tengo que pensarlo más porque... está raro y complicado todo esto :P

## [2016-02-19 11:33] Modulos plantillas

Otra idea. Los módulos plantilla pueden definir algunas constantes como parámetros, de modo que modulos externos creen versiones especializadas de estos módulos, pasándoles constantes como argumentos.