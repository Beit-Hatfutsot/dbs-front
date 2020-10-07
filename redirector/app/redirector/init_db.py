import sys
import psycopg2


def parse_line(line):
    return line.strip().split('~~')


def main(filename, db_conn_str):
    conn = psycopg2.connect(db_conn_str)
    try:
        cur = conn.cursor()
        try:
            try:
                cur.execute('DROP TABLE data')
            except Exception:
                conn.rollback()
                pass
            cur.execute('CREATE TABLE data ('
                        'entity_id integer, '
                        'bhp_unit integer, '
                        'old_num text, '
                        'name_he text, '
                        'name_en text, '
                        'url_he text, '
                        'url_en text)')
            cur.execute('CREATE INDEX data_entity_id ON data (entity_id)')
            cur.execute('CREATE INDEX bhp_unit ON data (bhp_unit)')
            cur.execute('CREATE INDEX old_num ON data (old_num)')
            cur.execute('CREATE INDEX name_he ON data (name_he)')
            cur.execute('CREATE INDEX name_en ON data (name_en)')
            conn.commit()
            with open(filename) as f:
                for i, line in enumerate(f):
                    if i == 0:
                        headers = parse_line(line)
                        continue
                    line = dict(zip(headers, parse_line(line)))
                    if not line['entity_id'] and str(line['entity_id']) != '0':
                        line['entity_id'] = None
                    if not line['bhp_unit'] and str(line['bhp_unit']) != '0':
                        line['bhp_unit'] = None
                    cur.execute('INSERT INTO data (entity_id, bhp_unit, old_num, name_he, name_en, url_he, url_en) '
                                'VALUES (%(entity_id)s, %(bhp_unit)s, %(old_num)s, %(name_he)s, %(name_en)s, %(url_he)s, %(url_en)s)',
                                line)
                    if i % 10000 == 0:
                        conn.commit()
                        print("processed {} lines".format(i))
        except Exception:
            cur.close()
            raise
    except Exception:
        conn.close()
        raise



if __name__ == "__main__":
    main(*sys.argv[1:])
