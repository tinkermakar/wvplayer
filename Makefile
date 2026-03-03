include .env.prod

ifndef WVPLAYER_CI_HOST
$(error WVPLAYER_CI_HOST is not set)
endif

ifndef WVPLAYER_ROOT_DIR
$(error WVPLAYER_ROOT_DIR is not set)
endif

host_flag = --host ssh://${WVPLAYER_CI_HOST}


.PHONY: default

default: up-build copy

up-build:
	docker $(host_flag) compose --env-file .env.prod up --build -d

logs:
	docker $(host_flag) compose logs -f

copy:
	scp -r .env.prod .env $(WVPLAYER_CI_HOST):$(WVPLAYER_ROOT_DIR)
	scp docker-compose.yml $(WVPLAYER_CI_HOST):$(WVPLAYER_ROOT_DIR)