import os
import sys
import requests
import traceback
from glob import glob
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
            stats['p2.get_new: not supported'] += 1
        else:
            # old_url = old_url.replace('https://', 'http://').replace('dbs.bh.org.il', 'localhost:5000')
            res = session.head(old_url, timeout=30)
            new_url = res.headers['Location']
            stats['p2.get_new: valid'] += 1
    except Exception as e:
        traceback.print_exc()
        exception = str(e)
        stats['p2.get_new: exception'] += 1
    stats['p2.get_new: processed'] += 1
    if stats['p2.get_new: processed'] % 10 == 0:
        print(dict(stats))
    return new_url, exception


def main(part_1_out_dir, part_2_in_dir):
    part_1_data = {}

    def process_part_1_out_row(row):
        part_1_data[row['Final URL']] = {'new_url': row['new_url'], 'exception': row['exception']}
        stats['p1.processed'] += 1

    Flow(
        *(load(filename, infer_strategy=load.INFER_STRINGS) for filename in glob(os.path.join(part_1_out_dir, "*.csv"))),
        process_part_1_out_row
    ).process()
    print(dict(stats))

    def process_part_2_in_row(rows):
        for row in rows:
            old_url = row['Final URL']
            new_url = part_1_data.get(old_url)
            if new_url:
                row['New URL'] = new_url['new_url']
            else:
                stats['p2.not in data'] += 1
                new_url, _ = get_new_url(old_url)
                row['New URL'] = new_url
            yield row
            stats['p2.processed'] += 1
            if stats['p2.processed'] % 100 == 0:
                print(dict(stats))

    for filename in glob(os.path.join(part_2_in_dir, "*.xlsx")):
        Flow(
            load(filename, infer_strategy=load.INFER_STRINGS),
            process_part_2_in_row,
            dump_to_path(filename + '.out')
        ).process()
    print(dict(stats))


if __name__ == "__main__":
    main(*sys.argv[1:])
