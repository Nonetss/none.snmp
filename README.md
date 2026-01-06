# None-SNMP Docker Deployment

Este directorio contiene la configuración de Docker Compose para desplegar la solución de monitorización SNMP.

## Vista Previa

| Dashboard | Dispositivos | Grafo de Red |
| :---: | :---: | :---: |
| <img src="./img/dashboard.png" width="250"> | <img src="./img/device-dashboard.png" width="250"> | <img src="./img/grafo.png" width="250"> |

| Ajustes | Detalles del Dispositivo |
| :---: | :---: |
| <img src="./img/settings.png" width="250"> | <img src="./img/device-app.png" width="250"> |


## Configuración de Red (Networking)

Durante el despliegue, hemos tenido que realizar ajustes específicos en la arquitectura de red para permitir que el backend pueda comunicarse con dispositivos críticos gestores de red (como routers OPNsense).

### 1. Backend en `network_mode: host`
El servicio `backend` está configurado para usar la red del host directamente.

**¿Por qué?**
* **Firewalls de Red**: Los routers (gateways) suelen tener protecciones SNMP que solo permiten peticiones desde subredes conocidas. Las peticiones desde la red bridge interna de Docker (`172.x.x.x`) son a menudo descartadas por el router al no tener una ruta de retorno o por reglas de firewall.
* **Visibilidad de SNMP**: Al usar el modo host, el backend se presenta ante el router con la IP física de la máquina, permitiendo que el tráfico SNMP fluya sin necesidad de configurar rutas estáticas complejas en el router.

### 2. Comunicación interna con `host.docker.internal`
Debido a que el backend está en la red del host y el resto de servicios (DB, Frontend, Gateway) están en la red bridge de Docker:
* El **Gateway (Nginx)** utiliza `host.docker.internal:3000` para redirigir las peticiones a la API.
* El **Backend** conecta a la base de datos usando `localhost:5432` (aprovechando que el puerto de PostgreSQL está mapeado al host).

### 3. Logs y Healthchecks
Se ha eliminado el `healthcheck` del backend en el archivo `compose.yml`.
* **Razón**: Una vez verificado que el servicio arranca correctamente, las peticiones constantes de `curl` cada 10 segundos saturaban innecesariamente los logs del sistema sin aportar valor crítico en este entorno de desarrollo/producción controlada.

## Despliegue

```bash
docker compose up -d
```
