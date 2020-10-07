FROM ubuntu:18.04
RUN apt-get update && \
    apt-get install -y python3 python3-pip &&\
    pip3 install -U setuptools wheel && pip3 install --upgrade pip
WORKDIR /srv
COPY requirements.txt ./
RUN pip3 install -r requirements.txt
COPY redirector ./redirector
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
ENV FLASK_APP=redirector.web
ENV PYTHONUNBUFFERED=1
#ENV DEBUG=1
#ENTRYPOINT ["flask", "run", "--host", "0.0.0.0"]
ENTRYPOINT ["gunicorn", "-b", "0.0.0.0:5000", "-w", "4", "-t", "30", "redirector.web:app"]
