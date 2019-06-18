import requests
from bs4 import BeautifulSoup
import os
import zipfile


url = input("Введите адрес сайта: ")
buff = url.find('.')
name_dir = url[buff+1:]
buff = name_dir.find('.')

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
    head_html = soup.find('html')
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
            print(script)
            a = script.rfind('/')
            script = name_dir[:buff] + '/' + script[a + 1:]
            with open(script, 'wb') as output_js:
                output_js.write(req.text.encode('utf-8'))


data = r.text

parse_user_datafile_bs(data)
#*************************************************
z = zipfile.ZipFile(name_dir[:buff] + '.zip', 'w')
for root, dirs, files in os.walk(name_dir[:buff]):
    for file in files:
        z.write(os.path.join(root, file))
z.close()