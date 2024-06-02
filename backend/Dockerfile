FROM nvidia/cuda:11.7.1-runtime-ubuntu20.04

ENV PYTHONUNBUFFERED=1

WORKDIR /src

RUN apt-get update -y && apt install software-properties-common -y && add-apt-repository ppa:deadsnakes/ppa -y

RUN apt-get install -y python3.11 python3.11-distutils python3-pip curl

RUN pip install poetry

COPY pyproject.toml* poetry.lock* ./

RUN poetry config virtualenvs.in-project true

ENV HF_HOME=/HF_Cache

ENTRYPOINT ["/src/start.sh"]