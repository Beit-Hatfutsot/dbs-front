import os
import sys
import psycopg2
from glob import glob
from dataflows import Flow, load


def get_filenames(dirnames):
    for dirname in dirnames:
        for filename in glob(os.path.join(dirname, '*.csv')):
            yield filename


def insert_data(cur, conn):
    stats = {'i': 0}

    def _iterator(row):
        stats['i'] += 1
        old_url = row.get('Final URL')
        if old_url == '':
            return None
        if old_url and 'dbs.bh.org.il' not in old_url:
            return None
        new_url = row.get('new_url', row.get('New URL'))
        if not old_url or not new_url:
            raise Exception("Invalid row: {}".format(row))
        path = old_url.replace('http://', 'https://').replace('https://dbs.bh.org.il', '').strip().strip('/')
        url = new_url
        cur.execute('INSERT INTO cache (url, path) '
                    'VALUES (%(url)s, %(path)s)',
                    {"url": url, "path": path})
        if stats['i'] % 1000 == 0:
            conn.commit()
            print("processed {} lines".format(stats['i']))
        return {'old_url': old_url, 'new_url': new_url}

    return _iterator


def main(db_conn_str, *dirnames):
    conn = psycopg2.connect(db_conn_str)
    try:
        cur = conn.cursor()
        try:
            try:
                cur.execute('DROP TABLE cache')
            except Exception:
                conn.rollback()
                pass
            cur.execute('CREATE TABLE cache ('
                        'url text, '
                        'path text)')
            cur.execute('CREATE INDEX path ON cache (path)')
            conn.commit()
            Flow(
                *[load(filename, infer_strategy=load.INFER_STRINGS) for filename in get_filenames(dirnames)],
                insert_data(cur, conn)
            ).process()
            conn.commit()
            print("Great Success!")
        except Exception:
            cur.close()
            raise
    except Exception:
        conn.close()
        raise


if __name__ == "__main__":
    main(*sys.argv[1:])
