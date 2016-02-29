# Notas

## [2016-02-26 00:53] Comunicación entre máquinas

Quiero que haya un protocolo para que las máquinas puedan comunicarse directamente. Con eso se pueden implementar cosas como un Juego en línea con el servidor hablándole directamente al cliente, un navegador Web usando la misma tecnología de ambos lados (en vez de javascript/php), un Renderizador que distribuye el trabajo entre varios nodos de la red, y otras cosas.

No quiero que para comunicar varios nodos haya que estar serializando datos, enviando código de scripting, ni nada así. Internamente, obviamente, esa es la clase de cosas que la máquina estará haciendo. Pero quiero que haya una interfaz limpia, que pueda enviar cualquier tipo de objeto a traves de la red de máquinas sin que el programador tenga que echarle demasiada cabeza. Y ya que la máquina está haciendo todo el trabajo, debería hacerlo bien: serializar en binario, lo más compacto posible, y con buen rendimiento.

## [2016-02-26 01:06] Green Threads, Soft Real Time, y algunas utilidades

Quiero Threads eficientes, super baratos, al nivel de Go.

Quiero rendimiento de tiempo real, es decir, debe poder usarse para aplicaciones que requieren tiempos de respuesta muy estrictos, como videojuegos, síntesis de audio, etc, en donde el programa no puede repentinamente dejar de responder.

Se me ocurrió la idea de Threads encajados, que se puedan usar como objetos. Con esto se puede guardar el estado de ejecución de un programa, y así se pueden simular corutinas, continuaciones, etc. Esto funcionaría mucho mejor si los threads son baratos.

Todo esto, en realidad, es dependiente de la implementación, pero debería ser asegurado que una buena implementación ofrece estas características.