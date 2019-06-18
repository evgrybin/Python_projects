Drupal.locale = { 'pluralFormula': function($n) { return Number((((($n%10)==1)&&(($n%100)!=11))?(0):((((($n%10)>=2)&&(($n%10)<=4))&&((($n%100)<10)||(($n%100)>=20)))?(1):2))); }, 'strings': { "Cancel": "Отменить", "Remove": "Удалить", "Size": "Размер", "Search": "Найти", "Reset": "Сбросить", "Upload": "Закачать", "file": "файл", "Allowed HTML tags": "Допускаются только следующие теги HTML", "Select all rows in this table": "Отметить все строки таблицы", "Deselect all rows in this table": "Снять отметку со всех колонок таблицы", "Only files with the following extensions are allowed: %files-allowed.": "Прикреплять можно только файлы с расширениями: %files-allowed.", "Join summary": "Объединить", "Split summary at cursor": "Ввести краткое содержание", "Drag to re-order": "Изменить порядок можно перетащив пункт мышкой.", "Changes made in this table will not be saved until the form is submitted.": "Изменения вступят в силу после отправки формы.", "Your server has been successfully tested to support this feature.": "Ваш сервер был успешно протестирован и может использовать эту функцию", "Your system configuration does not currently support this feature. The \x3ca href=\"http://drupal.org/node/15365\"\x3ehandbook page on Clean URLs\x3c/a\x3e has additional troubleshooting information.": "Конфигурация вашей системы сейчас не поддерживает этой функции. Дополнительная информация доступна в \x3ca href=\"http://drupal.org/node/15365\"\x3eдокументации о чистых ссылках\x3c/a\x3e.", "Testing clean URLs...": "Проверка чистых ссылок...", "Unspecified error": "Неизвестная ошибка", "The changes to these blocks will not be saved until the \x3cem\x3eSave blocks\x3c/em\x3e button is clicked.": "Изменения вступят в силу после сохранения формы.", "language": "язык.", "Inserting image into FCKeditor is allowed only in WYSIWYG mode": "Вставка изображения в FCKeditor разрешена лишь в режиме WYSIWYG", "Rename": "Переименовать", "Automatic alias": "Автоматические синонимы", "Insert this token into your form": "Вставить этот маркер в вашу форму", "First click a text field to insert your tokens into.": "Сначала кликните в текстовое поле, чтобы вставить в него ваши маркеры.", "link": "Ссылка", "Close": "Закрыть", "unlimited": "unlimited", "Resize": "Изменение размера", "Log messages": "Сообщения в лог", "Please select a file.": "Выберите файл.", "You are not allowed to operate on more than %num files.": "Вам не разрешено управлять больше чем с %num файлами.", "Upload failed.": "Невозможно загрузить файл.", "Please specify dimensions within the allowed range that is from 1x1 to @dimensions.": "Пожалуйста укажите размер внутри разрешённого диапозона от 1x1 до @dimensions.", "%filename is not an image.": "Файл %filename не является изображением.", "File browsing is disabled in directory %dir.": "Просмотр файлов запрещен для папки %dir.", "Do you want to refresh the current directory?": "Вы хотите обновить текущую папку?", "Delete selected files?": "Удалить выбранные файлы?", "Please select a thumbnail.": "Выберите миниатюру.", "You must select at least %num files.": "Необходимо выбрать не менее %num файлов.", "You can not perform this operation.": "Вы не можете выполнить эту операцию.", "description": "описание", "title": "название", "Internal server error. Please see server or PHP logs for error information.": "Внутренняя серверная ошибка. Пожалуйста, посмотрите лог ошибок сервера или PHP.", "Insert": "Вставить", "Owner": "Владелец", "Uploading...": "Загружается....", "Add image": "Добавить изображение", "Click here to add images": "Нажмите, чтобы добавить изображения", "Directory": "Каталог", "download file": "скачать файл", "directory": "каталог", "name": "имя", "Delete File": "Удалить файл", "Modified": "Изменено", "Metadata": "Метаданные", "width": "ширина", "height": "высота", "uid": "uid", "Show layout designer": "Перейти в редактор макета", "This will discard all unsaved changes. Are you sure?": "Все несохранённые изменения будут утеряны. Вы уверены?" } };