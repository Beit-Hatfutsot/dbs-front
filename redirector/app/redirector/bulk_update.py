import sys
import requests
import traceback
from collections import defaultdict

from dataflows import Flow, load, printer, add_field, dump_to_path


session = requests.session()
session.cookies.set('REDIRECTOR_TESTING_ENABLED', 'yes')

stats = defaultdict(int)


def get_new_url(old_url):
    new_url, exception = '', ''
    try:
        if 'dbs.bh.org.il' not in old_url:
            exception = 'url not supported'
            stats['not supported'] += 1
        else:
            old_url = old_url.replace('https://', 'http://').replace('dbs.bh.org.il', 'localhost:5000')
            res = session.head(old_url, timeout=30)
            new_url = res.headers['Location']
            stats['valid'] += 1
    except Exception as e:
        traceback.print_exc()
        exception = str(e)
        stats['exception'] += 1
    stats['processed'] += 1
    if stats['processed'] % 100 == 0:
        print(dict(stats))
    return new_url, exception


def process_row(row):
    row['new_url'], row['exception'] = get_new_url(row['Final URL'])


def main(input_filename):
    Flow(
        load(input_filename, headers=3, infer_strategy=load.INFER_STRINGS),
        add_field('new_url', 'string'),
        add_field('exception', 'string'),
        process_row,
        printer(num_rows=2, fields=['Final URL', 'new_url', 'exception']),
        dump_to_path(input_filename + '.out')
    ).process()


if __name__ == "__main__":
    main(*sys.argv[1:])
