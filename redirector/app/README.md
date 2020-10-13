# Redirector

## Installation

```
python3 -m venv venv
. venv/bin/activate
python3 -m pip install -r redirector/app/requirements.txt
python3 -m pip install -e redirector/app
```

## Usage

### Initialize the redirector DB

```
python3 -m redirector.init_db bh_entities.after_new_domains.txt "dbname=postgres user=postgres host=localhost port=5432 password=123456"
```

### Run redirector app locally

```
FLASK_APP=redirector.web FLASK_ENV=development DEBUG=1 flask run --host 0.0.0.0
```

### Run the bulk-updater

Install requirements

```
python3 -m pip install -r redirector/app/requirements-bulk-update.txt
```

Create work directory

```
mkdir .redirector-data
```

Copy input csv files to work directory

Bulk update

```
python3 -m redirector.bulk_update .redirector-data/input_file.csv
```
