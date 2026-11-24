# Mi Control de Gastos

Aplicativo web responsive para registrar ingresos y gastos personales. Los datos se guardan localmente en el navegador mediante `localStorage`; no utiliza cuentas, nube ni backend.

## Requisitos
- Visual Studio Code
- Google Chrome o Microsoft Edge
- Extensión **Live Server** de VS Code (recomendada para probar e instalar la PWA)

## Ejecutar en tu computadora
1. Descomprime `mi-control-gastos.zip`.
2. Abre la carpeta `mi-control-gastos` desde Visual Studio Code.
3. Instala la extensión **Live Server**.
4. Haz clic derecho en `index.html` y selecciona **Open with Live Server**.
5. Se abrirá el aplicativo en el navegador.

## Abrirlo en Android
Para que el teléfono y la computadora vean el mismo sitio, ambos deben acceder a la misma dirección web servida por tu computadora y estar conectados a la misma red Wi-Fi.

1. Averigua la dirección IPv4 de tu computadora (en Windows abre CMD y ejecuta `ipconfig`).
2. En Live Server configura el puerto 5500 y asegúrate de que el servidor escuche en la red local (host `0.0.0.0`, si tu extensión ofrece esa opción).
3. Permite el acceso de Live Server en el Firewall de Windows para redes privadas.
4. En Chrome Android escribe `http://IP-DE-TU-PC:5500`.
5. Para instalarla, abre el menú de Chrome y elige **Agregar a pantalla principal** o **Instalar aplicación**, si aparece.

> Nota: la instalación PWA y el modo sin conexión requieren HTTPS o localhost. Para probar desde otro dispositivo en una red local, el navegador puede limitar algunas funciones de instalación. Para instalarla de forma fiable, publícala en un hosting estático con HTTPS. No hace falta backend y los datos seguirán siendo locales en cada navegador/dispositivo.

## Funciones
- Resumen mensual de ingresos, gastos y balance.
- Registro de ingresos y gastos con fecha, categoría y descripción.
- Gráfico de distribución de gastos por categoría.
- Búsqueda y filtros por tipo.
- Eliminación de movimientos.
- Exportación CSV y copia de seguridad JSON.
- Diseño adaptable a Android y escritorio.

## Importante sobre tus datos
Los movimientos quedan guardados en el navegador y dispositivo donde los registras. **No se sincronizan automáticamente** entre la computadora y el Android. Si borras los datos del navegador o cambias de dispositivo, puedes perder el historial. Usa “Descargar copia de seguridad” periódicamente.
