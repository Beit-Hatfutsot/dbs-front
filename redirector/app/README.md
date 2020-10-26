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

Start the DB

```
docker-compose up -d redirector-db
```

Populate the new domain data

```
python3 -m redirector.init_db bh_entities.after_new_domains.txt "dbname=postgres user=postgres host=localhost port=5432 password=123456"
```

Populate with the bulk update cache data

```
python3 -m redirector.init_db_bulk_update_cache "dbname=postgres user=postgres host=localhost port=5432 password=123456" .redirector-data/part1-out .redirector-data/part2-out
```

### Run redirector app locally

```
FLASK_APP=redirector.web FLASK_ENV=development DEBUG=yes LOCALDEV=yes REDIRECTOR_ENABLED=yes flask run --host 0.0.0.0
```

### Run the bulk-updater

Create work directory

```
mkdir .redirector-data
```

Copy input csv files to work directory

Bulk update

```
python3 -m redirector.bulk_update .redirector-data/input_file.csv
```
