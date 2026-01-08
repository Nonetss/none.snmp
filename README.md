# NONE.SNMP

Este directorio contiene la configuración de Docker Compose para desplegar la solución de monitorización SNMP.

## Repositorios

- [Backend](https://github.com/Nonetss/none.snmp-backend)
- [Frontend](https://github.com/Nonetss/none.snmp-frontend)


## Vista Previa

| Dashboard | Detalle de Dispositivo |
| :---: | :---: |
| <img src="./img/dashboard.png" width="400"> | <img src="./img/device-dashboard.png" width="400"> |

| Explorador de Aplicaciones | Grafo de Red |
| :---: | :---: |
| <img src="./img/search-apps.png" width="400"> | <img src="./img/network-topology.png" width="400"> |

| Búsqueda de Red | Gestión de Subredes |
| :---: | :---: |
| <img src="./img/search-network.png" width="400"> | <img src="./img/settings-subnet.png" width="400"> |

| Tareas Programadas | Autenticación SNMP |
| :---: | :---: |
| <img src="./img/settings-task.png" width="400"> | <img src="./img/snmp-auth.png" width="400"> |

## Opciones de Despliegue

Hemos preparado dos tipos de despliegue. **Se recomienda intentar primero el despliegue en modo Bridge** (estándar). Si tras el despliegue experimentas problemas de conectividad (pings fallidos o timeouts de SNMP) debido al firewall de tu router, utiliza el modo Host.

### 1. Bridge Network (Modo Recomendado)
Ubicación: `./bridge-network/`

Esta es la configuración estándar y aislada de Docker. Úsala para mantener el aislamiento entre contenedores. Si tu router (ej. OPNsense) bloquea el tráfico, deberás añadir una ruta estática para la red de Docker o pasar al modo Host.

*   **Ventaja**: Mayor aislamiento y seguridad.
*   **Despliegue**:
    ```bash
    cd bridge-network
    docker compose up -d
    ```

*   **Configuración (`compose.yml`)**:
    ```yaml
    services:
      backend:
        container_name: none-snmp-backend
        image: ghcr.io/nonetss/none-snmp-backend:v0.4.2
        restart: always
        environment:
          - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@database:5432/${POSTGRES_DB:-postgres}
        depends_on:
          database:
            condition: service_healthy
        command: >
          sh -c "bunx drizzle-kit migrate --config drizzle.config.ts && bun run src/index.ts"

      frontend:
        container_name: none-snmp-frontend
        image: ghcr.io/nonetss/none-snmp-frontend:v0.4.2
        restart: always
        environment:
          - BACKEND_URL=http://backend:3000
        ports:
          - '4321:80'
        depends_on:
          - backend

      database:
        container_name: none-snmp-database
        image: postgres:16
        restart: always
        environment:
          - POSTGRES_USER=${POSTGRES_USER:-postgres}
          - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}
          - POSTGRES_DB=${POSTGRES_DB:-postgres}
        volumes:
          - postgres_data:/var/lib/postgresql/data
        healthcheck:
          test:
            [
              'CMD-SHELL',
              'pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-postgres}',
            ]
          interval: 5s
          timeout: 5s
          retries: 5

    volumes:
      postgres_data:
    ```

### 2. Host Network (Solución para problemas de Firewall)
Ubicación: `./host-network/`

Esta configuración pone el backend en la red del host directamente. Úsala si el modo Bridge no funciona debido a que tu gateway de red bloquea las peticiones SNMP provenientes de Docker.

*   **Ventaja**: Máxima compatibilidad con routers/gateways (el tráfico sale con la IP física de la máquina).
*   **Despliegue**:
    ```bash
    cd host-network
    docker compose up -d
    ```


