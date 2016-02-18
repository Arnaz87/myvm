# Covariance

Resulta que los sistemas de tipo con genéricos tienen un problema que es la covariancia y contravariancia de tipo genéricos. 

Este astrículo de wikipedia lo explica: https://en.wikipedia.org/wiki/Covariance_and_contravariance_%28computer_science%29

## [2016-02-19 10:37] Resumen

Un pequeño resumen y muestra de este problema está en este código:

```java
List<Gato> gatos = new List<Gato>();
gatos.add(new Gato("bruno"));
gatos.add(new Gato("houdini"));
// No compila, Raton es animal pero no es gato
gatos.add(new Raton("Perez"));
// Esto no compila, pero asumiendo que sí...
List<Animal> animales = gatos;
// Sale un gato, y gato es un animal, así que sí sirve
Animal animalito = animales.last();
// ...
animales.add(new Raton("Perez"));
// ratón es animal y lo están metiendo en una lista de animales,
// pero todos sabemos que en realidad, animales es una lista de gatos.
// Por eso, la última línea compila, pero da error al ejecutarla.
```

El problema es que aunque Gato es un Animal, `List<Gato>` no es `List<Animal>` porque da problemas en casos como estos. La covariancia y contravariancia indica en qué circunstancias un objeto genérico puede tener subtipos basándose en el tipo original del genérico.

En resumen, si `B extends A`, un genérico `G<A>` es covariante cuando puede tener un subtipo `G<B>`, y `G<B>` es contravariante cuando puede tener un subtipo `G<A>`. Si ambos son ciertos, ambos son bivariantes, y si ninguno es cierto, ambos son invariantes.

Como regla de oro, si un contenedor es de solo lectura, es covariante, y si es solo escritura, es contravariante.