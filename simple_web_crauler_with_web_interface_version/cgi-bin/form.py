#!/usr/bin/env python3
import cgi
import requests
from bs4 import BeautifulSoup
import os
import zipfile

form = cgi.FieldStorage()
url = form.getfirst("URL", "не задано")
buff = url.find('.')
name_dir = url[buff+1:]
buff = name_dir.find('.')
print(name_dir)
print(buff)
if os.path.exists(name_dir[:buff]):
    pass
else:
    os.makedirs(name_dir[:buff])
buff2 = name_dir[:buff] + '/' + name_dir[:buff] + '.html'
r = requests.get(url)
with open(buff2, 'wb') as output_html:
    output_html.write(r.text.encode('utf-8'))


def parse_user_datafile_bs(data_html):
    soup = BeautifulSoup(data_html, 'lxml')
    head_html = soup.find('head')
    scripts_html = head_html.find_all('script')
    for script_html in scripts_html:
        script = script_html.get('src')
        if script is not None:
            del_incorrect_simbol = script.find('?')
            if del_incorrect_simbol is not -1:
                script = script[:del_incorrect_simbol]
            if script[0] == '/':
                script = url + script
            req = requests.get(script)
            a = script.rfind('/')
            script = name_dir[:buff] + '/' + script[a + 1:]
            with open(script, 'wb') as output_js:
                output_js.write(req.text.encode('utf-8'))


data = r.text
parse_user_datafile_bs(data)
z = zipfile.ZipFile(name_dir[:buff] + '.zip', 'w')
for root, dirs, files in os.walk(name_dir[:buff]):
    for file in files:
        z.write(os.path.join(root, file))
z.close()

print("Content-type: text/html\n")
print("""<!DOCTYPE HTML>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Скачанные файлы</title>
            <link rel="stylesheet" type="text/css" href="../../style/style.css">
        </head>
        <body>""")
print("<h1>Please download your archive</h1>")
print("<div align=center>")
print("<a href={} download>Download</a><br><br>".format("../../" + name_dir[:buff] +".zip"))
print("<a href={}>back</a>".format("../../index.html"))
print("</div>")
print("""</body>
        </html>""")
