# NONE.SNMP

Este directorio contiene la configuración de Docker Compose para desplegar la solución de monitorización SNMP.

## Vista Previa

| Dashboard | Dispositivos | Grafo de Red |
| :---: | :---: | :---: |
| <img src="./img/dashboard.png" width="250"> | <img src="./img/device-dashboard.png" width="250"> | <img src="./img/grafo.png" width="250"> |

| Ajustes | Detalles del Dispositivo |
| :---: | :---: |
| <img src="./img/settings.png" width="250"> | <img src="./img/device-app.png" width="250"> |

## Opciones de Despliegue

Hemos preparado dos tipos de despliegue según tus necesidades de red:

### 1. Host Network (Recomendado para entornos con Firewalls/Gateways)
Ubicación: `./host-network/`

Esta configuración pone el backend en la red del host directamente. Es ideal si tu router (ej. OPNsense) bloquea el tráfico proveniente de redes internas de Docker.

*   **Ventaja**: Evita problemas de firewall y rutas con SNMP.
*   **Despliegue**:
    ```bash
    cd host-network
    docker compose up -d
    ```

### 2. Bridge Network (Modo Estándar de Docker)
Ubicación: `./bridge-network/`

Esta es la configuración estándar y aislada de Docker. Úsala si tu entorno de red permite el tráfico desde subredes bridge o si has configurado rutas estáticas en tu router.

*   **Ventaja**: Mayor aislamiento y seguridad entre contenedores.
*   **Despliegue**:
    ```bash
    cd bridge-network
    docker compose up -d
    ```

---

## Detalles Técnicos (Modo Host)

Si usas el modo **Host Network**, ten en cuenta:
*   El **Gateway (Nginx)** utiliza `host.docker.internal:3000` para hablar con el backend.
*   El **Backend** conecta a la base de datos vía `localhost:5432`.
*   Se han eliminado los healthchecks pesados para mantener los logs limpios.
