# Traits y Vtables

Los Traits son los métodos nativos a los que un objeto puede responder.
Un objeto está asociado a un Vtable. Un vtable tiene un array interno de
traits y un índice, y luego un array interno de métodos virtuales, algo así:

    Vtable:
      [{
        int traitid
        int index
      }] traits
      [Metodo*] metodos

Cuando se llama un método, se pasa el id del trait y un offset. Se hace una
búsqueda en el array de traits y si se consigue, se agarra el index, y luego
se trae el método en `metodos[index + offset]`.

Si por ejemplo, existen estos Traits
    
    Numero:
      traitid: 1
      offsets:
        add:0
        sub:1
        mult:2
        div:3

    Container:
      traitid: 2
      offsets:
        length:0
        get:1
        set:2

Y unos tipos (Vtable)

    Float:
      traits:
        {traitid: 1(Number)), index: 0}
      metodos:
        addfloat()  [0]
        subfloat()  [1]
        multfloat() [2]
        divfloat()  [3]

    Array:
      traits:
        {traitid: 2(Container), index: 0}
      metodos:
        arrlength() [0]
        arrget()    [1]
        arrset()    [2]

    Decimal: # Número guardado en dígitos decimales
      traits:
        {traitid:1(Number),    index: 0}
        {traitid:2(Container), index: 4}
        # Esto es básicamente un array de dígitos
      metodos:
        [0]adddec(), [1]subdec(), [2]multdec(), [3]divdec()
        [4]declen(), [5]decget(), [6]decset()

Y se envía a objeto de tipo Float un mensaje Number.mult, que se traduce a
`traitid: 1, offset: 2`, se hace el siguiente procedimiento:

Se busca traitid:1 en Float.traits, y se consigue, y se ve que está asociado
a index:0, entonces se suma index con offset (0+2 = 2), y se busca
Float.metodos[2] y al final, se consigue la funcion multfloat(), que es
la que se buscaba.

El mismo procedimiento se puede hacer con array para los mensajes de Container,
y para decimal, por ejemplo con el mensaje Container.get:

Se traduce a `traitid: 2, offset: 1`, en Decimal se consigue Container con
index: 4, index+offset = 4+1 = 5, y Decimal.metodos[5] = decget().

Para hacerlo más rápido, traits debe estar ordenado en modo ascendente, los
traitids más bajos deben estar al principio, y los más grandes al final. De
este modo, si se tiene un Tipo para números complejos:

    Complex.traits:
      {traitid:1(Number), index:0}
      {traitid:3(Otra cosa), index:4}
      {traitid:4(Otra cosa), index:7}

Y a una instancia de Complex se le envía el mensaje Container.length, que se
traduce a `traitid: 2,offset: 1`, se empieza a buscar en el primer traitid:1,
como no es se busca el siguiente traitid:3, y podría seguir así hasta llegar
al final y no conseguirlo. Pero como Container es traitid:2 y ya vamos por 3,
y solo va en ascendente, ya sabemos que no está en la lista, así que podemos
detenernos y decir que no se encontró Container.

Aprovechando esto, los Traits que requieran operar con más velocidad tienen
que tener los traitids más bajos.

Otra cosa es que los offsets de los métodos virtuales de un trait no pueden
resolverse al vuelo, tiene que ser ya predefinidos, porque las instrucciones
de la plataforma para enviar mensajes no son de tipo `sendmsg("Number.add")`
sino de tipo `sendmsg(1,0)`, y la máquina virtual no tiene manera de traducir
esos mensajes porque los traits no son objetos en el Heap, el compilador
tiene toda la responsabilidad de saber cómo está definido cada Trait y sus
métodos virtuales, siguiendo una especificación estándar. Y este mecanismo
está diseñado de ese modo a propósito, porque los traits son para computaciones
de alto rendimiento, si se quiere late binding se puede usar un Trait especial
como Dynamic, que tiene un mensaje `sendmessage(message_name)`

# Supertraits o Dependencias

Ademas de los Traits básicos de un programa como Número o Array, creo que
sería muy útil usar este sistema para implementar interfaces tipo Java, o
typeclasses tipo Haskell, y algo de lo que se pueden beneficiar mucho estos
sistemas es con traits que son hijos de otros traits, o algo por el estilo,
así las interfaces java pueden en sí, extender de otras interfaces, o los
typeclasses de haskell pueden depender de otros typeclasses, por ejemplo,
un Trait que permita restar primero debe permitir sumar, o cosas así.

Tienen que ser dependencias, no extensiones, es decir, en este sistema un
trait "Resta" debería poder depender del trait "Suma", y así cualquier
objeto que implemente Resta está obligado a primero implementar Suma,
tipo haskell, porque tipo java, que un trait Resta incluye también los
métodos de Suma hace complicado si un objeto primero implementa Resta
y luego Suma, porque el metodo "sumar" ya los agarró Resta, y aunque obvio
se puede solucionar, me parece más limpio y simple el método Haskell.

