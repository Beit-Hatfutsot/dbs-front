import sys
import requests
import traceback

from dataflows import Flow, load, printer, add_field, dump_to_path


session = requests.session()
session.cookies.set('REDIRECTOR_TESTING_ENABLED', 'yes')


def get_new_url(old_url):
    new_url, exception = '', ''
    try:
        if 'dbs.bh.org.il' not in old_url:
            exception = 'url not supported'
        else:
            old_url = old_url.replace('https://', 'http://').replace('dbs.bh.org.il', 'localhost:5000')
            res = session.head(old_url)
            new_url = res.headers['Location']
    except Exception as e:
        traceback.print_exc()
        exception = str(e)
    return new_url, exception


def process_row(row):
    row['new_url'], row['exception'] = get_new_url(row['Final URL'])


def main(input_filename):
    Flow(
        load(input_filename, headers=3),
        add_field('new_url', 'string'),
        add_field('exception', 'string'),
        process_row,
        printer(num_rows=2, fields=['Final URL', 'new_url', 'exception']),
        dump_to_path(input_filename + '.out')
    ).process()


if __name__ == "__main__":
    main(*sys.argv[1:])
