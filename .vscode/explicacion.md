🔍 ¿Qué está pasando?
Chrome y Brave están basados en Chromium y, si no se indica lo contrario, usan el mismo puerto de depuración (9222) o el mismo perfil de usuario. Esto provoca conflictos al abrir más de una sesión de depuración simultánea.

✅ Solución: forzar perfiles y puertos distintos
Puedes forzar que cada navegador:

Use un perfil de usuario diferente.

Use un puerto distinto para la depuración.
 ¿Qué hace esto?
--remote-debugging-port=9222 (para Chrome) y 9223 (para Brave): evita que compitan por el mismo puerto.

--user-data-dir: crea perfiles aislados para que no se mezclen ventanas ni sesiones.

Guarda los perfiles en .vscode para mantener limpio el proyecto.