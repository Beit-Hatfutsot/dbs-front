import os
import requests
from flask import Flask, make_response, request, redirect
import psycopg2
import psycopg2.extras


app = Flask(__name__)


DEFAULT_HOMEPAGE_HE = 'https://dbs.anumuseum.org.il/skn/he/c6/bh'
DEFAULT_HOMEPAGE_EN = 'https://dbs.anumuseum.org.il/skn/en/c6/BH'

def find_matching_row(rows, OldUnitId, UnitId, Header_He, Header_En, name_lc):
    if UnitId:
        for row in rows:
            if row['bhp_unit'] == UnitId:
                return row
    if OldUnitId:
        for row in rows:
            if row['old_num'] == OldUnitId:
                return row
    if Header_He and Header_En:
        for row in rows:
            if row['name_he'] == Header_He and row['name_en'] == Header_En:
                return row
        for row in rows:
            if row['name_he'].lower() == Header_He.lower() and row['name_en'].lower() == Header_En.lower():
                return row
    if Header_He or Header_En:
        for row in rows:
            if row['name_he'].lower() == Header_He.lower() or row['name_en'].lower() == Header_En.lower():
                return row
    if name_lc:
        for row in rows:
            if row['name_he'].lower() == name_lc.lower() or row['name_en'].lower() == name_lc.lower():
                return row
    return None

def get_redirect_url(path):
    lang, slug, url = None, None, None
    if path.startswith('he/'):
        lang = 'he'
        hepath = path.replace('he/', '', 1)
        if hepath.startswith('חפשו'):
            url = 'https://dbs.anumuseum.org.il/skn/he/c6/bh/search#query=' + (request.args.get('q') or '')
        elif hepath.endswith('/וידאו'):
            slug = 'וידאו_' + '/'.join(hepath.split('/')[:-1])
        elif hepath.endswith('/מקום'):
            slug = 'מקום_' + '/'.join(hepath.split('/')[:-1])
        elif hepath.endswith('/תמונה'):
            slug = 'תמונה_' + '/'.join(hepath.split('/')[:-1])
        elif hepath.endswith('/אישיות'):
            slug = 'אישיות_' + '/'.join(hepath.split('/')[:-1])
        elif hepath.endswith('/שםמשפחה'):
            slug = 'שםמשפחה_' + '/'.join(hepath.split('/')[:-1])
        elif hepath.startswith('person'):
            hepath = hepath.replace('person/', '', 1)
            tmp = hepath.split('/')
            slug = 'person_{};{}.{}'.format(tmp[0], tmp[1], tmp[2])
        else:
            url = DEFAULT_HOMEPAGE_HE
    elif path.startswith('search'):
        url = 'https://dbs.anumuseum.org.il/skn/en/c6/bh/search#query=' + (request.args.get('q') or '')
    elif path.startswith('place/'):
        lang = 'en'
        slug = path.replace('place/', 'place_', 1)
    elif path.startswith('image/'):
        lang = 'en'
        slug = path.replace('image/', 'image_', 1)
    elif path.startswith('luminary/'):
        lang = 'en'
        slug = path.replace('luminary/', 'luminary_', 1)
    elif path.startswith('familyname/'):
        lang = 'en'
        slug = path.replace('familyname/', 'familyname_', 1)
    elif path.startswith('video/'):
        lang = 'en'
        slug = path.replace('video/', 'video_', 1)
    elif path.startswith('person'):
        lang = 'en'
        path = path.replace('person/', '', 1)
        tmp = path.split('/')
        slug = 'person_{};{}.{}'.format(tmp[0], tmp[1], tmp[2])
    else:
        url = DEFAULT_HOMEPAGE_EN
    if lang and slug:
        backend_path = os.path.join('v1', 'item', slug)
        backend_url = 'https://api.dbs.bh.org.il/{}'.format(backend_path)
        res = requests.get(backend_url).json()
        if len(res) > 0:
            item = res[0]
            OldUnitId = item.get('OldUnitId')  # old_num
            UnitId = item.get('UnitId')  # bhp_unit
            Header = item.get('Header', {}) or {}
            Header_He = Header.get('He')  # name_he
            Header_En = Header.get('En')  # name_en
            name_lc = item.get('name_lc')
            if name_lc:
                name_lc = name_lc[-1] + ', ' + ' '.join(name_lc[:-1])
            where_sqls = []
            if OldUnitId:
                where_sqls.append('old_num = %(OldUnitId)s')
            if UnitId:
                where_sqls.append('bhp_unit = %(UnitId)s')
            if Header_He:
                where_sqls.append('name_he = %(Header_He)s')
                where_sqls.append('lower(name_he) = lower(%(Header_He)s)')
            if Header_En:
                where_sqls.append('name_en = %(Header_En)s')
                where_sqls.append('lower(name_en) = lower(%(Header_En)s)')
            if name_lc:
                where_sqls.append('( lower(name_en) = %(name_lc)s or lower(name_he) = %(name_lc)s )')
            if len(where_sqls) > 0:
                conn = psycopg2.connect("dbname=postgres user=postgres host=redirector-db port=5432 password=123456")
                try:
                    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
                    try:
                        cur.execute("SELECT * FROM data WHERE " + ' OR '.join(where_sqls), {
                            'UnitId': UnitId, 'OldUnitId': OldUnitId, 'Header_He': Header_He, 'Header_En': Header_En, 'name_lc': name_lc
                        })
                        row = find_matching_row(list(cur.fetchall()), OldUnitId, UnitId, Header_He, Header_En, name_lc)
                        if row:
                            url = row['url_{}'.format(lang)] or row['url_en'] or row['url_he']
                    finally:
                        cur.close()
                finally:
                    conn.close()
    elif not url:
        if lang == 'he':
            url = DEFAULT_HOMEPAGE_HE
        else:
            url = DEFAULT_HOMEPAGE_EN
    return url


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    if '--set-testing-cookie' in path:
        response = make_response('OK', 200)
        response.set_cookie('REDIRECTOR_TESTING_ENABLED', "yes")
        return response
    elif '--delete-testing-cookie' in path:
        response = make_response('OK', 200)
        response.set_cookie('REDIRECTOR_TESTING_ENABLED', "no")
        return response
    elif os.environ.get('REDIRECTOR_ENABLED') == 'yes' or os.environ.get("DEBUG") == 'yes' or request.cookies.get('REDIRECTOR_TESTING_ENABLED') == "yes":
        try:
            redirect_url = get_redirect_url(path)
        except Exception:
            if os.environ.get("DEBUG") == 'yes':
                raise
            else:
                redirect_url = DEFAULT_HOMEPAGE_EN
        if os.environ.get("DEBUG"):
            return make_response("redirect: {}".format(redirect_url))
        else:
            return redirect(redirect_url, 301)
    else:
        uri = '/internal/{}'.format(path)
        if request.query_string:
            uri += '?' + request.query_string.decode()
        response = make_response("internal: {}".format(uri), 200)
        if not os.environ.get("DEBUG"):
            response.headers['X-Accel-Redirect'] = uri
        return response
