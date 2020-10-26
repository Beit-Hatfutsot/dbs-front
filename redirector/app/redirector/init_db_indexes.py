import sys
import psycopg2


def main(db_conn_str):
    conn = psycopg2.connect(db_conn_str)
    try:
        cur = conn.cursor()
        try:
            cur.execute('CREATE INDEX name_he_lc ON data (lower(name_he))')
            cur.execute('CREATE INDEX name_en_lc ON data (lower(name_en))')
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
