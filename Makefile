# Makefile that is used mostly for devlopment work.
DOCKER_FILE := docker-compose.yml
CUSTOMER_PANEL_SERVICE_NAME := customer_panel

web-run:
	docker compose -f ${DOCKER_FILE} up ${CUSTOMER_PANEL_SERVICE_NAME}
web-build:
	docker compose -f ${DOCKER_FILE} run ${CUSTOMER_PANEL_SERVICE_NAME} sh -c "npm run build"
	sudo chown -R ${USER}:${USER} ./build
	echo "Build created in ./build directory"
dkr-bash:
	docker compose -f ${DOCKER_FILE} run ${CUSTOMER_PANEL_SERVICE_NAME} sh
dkr-build:
	docker compose -f ${DOCKER_FILE} build ${CUSTOMER_PANEL_SERVICE_NAME}
web-change-perm:
	sudo chown -R ${USER}:${USER} ./build