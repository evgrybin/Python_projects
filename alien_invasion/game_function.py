import sys
import pygame
from bullet import Bullet
from alien import Alien
from time import sleep

def check_high_score(stats, sb):
    """Проверяет появился ли новый рекорд"""
    if stats.score > stats.high_score:
        stats.high_score = stats.score
        sb.prep_high_score()


def check_aliens_bottom(ai_settings, stats, screen, sb, ship, aliens, bullets):
    """Проверка добрались ли пришельцы до нижнего края экрана"""
    screen_rect = screen.get_rect()
    for alien in aliens.sprites():
        if alien.rect.bottom >= screen_rect.bottom:
            #Минус жизнь
            ship_hit(ai_settings, stats, screen, sb, ship, aliens, bullets)
            break


def ship_hit(ai_settings, stats, screen, sb, ship, aliens, bullets):
    """Обрабатывает столкновение корабля с пришельцами"""
    if stats.ship_left > 0:
        # Уменьшает ship_left
        stats.ship_left -= 1

        # Обновление игровой информации
        sb.prep_ships()

        #Очистка списков пришельцев и пуль
        aliens.empty()
        bullets.empty()

        #Создание нового флота и размещение корабля в центр
        create_fleet(ai_settings, screen, ship, aliens)
        ship.center_ship()

        #пауза
        sleep(0.5)
    else:
        stats.game_active = False
        pygame.mouse.set_visible(True)


def get_number_aliens_x(ai_settings, alien_width):
    """Вычисляет количество пришельцев в ряду"""
    available_space_x = (ai_settings.screen_width - 2 * alien_width)
    number_aliens_x = int(available_space_x / (2 * alien_width))
    return number_aliens_x

def get_number_rows(ai_settings, ship_height, alien_height):
    """Определяет количество рядов помещающихся на экран"""
    available_space_y = (ai_settings.screen_height - (3 * alien_height) - ship_height)
    number_rows = int(available_space_y / (2 * alien_height))
    return  number_rows

def create_alien(ai_settings, screen, aliens, alien_number, row_number):
    """Создает пришельца и размещает его в ряду"""
    alien = Alien(ai_settings, screen)
    alien_width = alien.rect.width
    alien.x = alien_width + 2 * alien_width * alien_number
    alien.rect.x = alien.x
    alien.rect.y = alien.rect.height + 2 * alien.rect.height * row_number
    aliens.add(alien)

def create_fleet(ai_settings, screen, ship, aliens):
    """СОздает флот пришельцев"""
    # Создание пришельца и вычисление количества пришельцев в ряду
    alien = Alien(ai_settings, screen)
    number_aliens_x = get_number_aliens_x(ai_settings, alien.rect.width)
    number_rows = get_number_rows(ai_settings, ship.rect.height, alien.rect.height)

    #Создание пришельцев
    for row_number in range(number_rows):
        for alien_number in range(number_aliens_x):
            create_alien(ai_settings, screen, aliens, alien_number,row_number)


def check_keydown_events(event, ai_settings, screen, ship, bullets):
    if event.key == pygame.K_q:
        sys.exit()
    if event.key == pygame.K_RIGHT:
        # Переместить корабль в право
        ship.moving_right = True
    if event.key == pygame.K_LEFT:
        # Переместить корабль в лево
        ship.moving_left = True
    if event.key == pygame.K_UP:
        # Переместить корабль в верх
        ship.moving_up = True
    if event.key == pygame.K_DOWN:
        # Переместить корабль в низ
        ship.moving_down = True
    if event.key == pygame.K_SPACE:
        fire_bullet(ai_settings, screen, ship, bullets)



def check_keyup_event(event, ship):
    if event.key == pygame.K_RIGHT:
        ship.moving_right = False
    if event.key == pygame.K_LEFT:
        ship.moving_left = False
    if event.key == pygame.K_UP:
        ship.moving_up = False
    if event.key == pygame.K_DOWN:
        ship.moving_down = False

def check_events(ai_settings, screen, stats, sb, ship, aliens, bullets, play_button):
    # Отслеживание событий клавиатуры и мыши
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            sys.exit()
        elif event.type == pygame.KEYDOWN:
            check_keydown_events(event, ai_settings, screen, ship, bullets)
        elif event.type == pygame.KEYUP:
            check_keyup_event(event, ship)
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mouse_x, mouse_y = pygame.mouse.get_pos()
            check_play_button(ai_settings, screen, stats, play_button, sb, ship, aliens, bullets, mouse_x, mouse_y)


def check_play_button(ai_settings, screen, stats, play_button, sb, ship, aliens, bullets, mouse_x, mouse_y):
    """Запускает новую игру при нажатии кнопки плей"""
    button_clicked = play_button.rect.collidepoint(mouse_x, mouse_y)
    if button_clicked and not stats.game_active:
        # Сброс игровых настроек
        ai_settings.initialize_dinamic_settings()
        # Скрыть указатель мыши
        pygame.mouse.set_visible(False)
        # Сброс игровой статистики
        stats.reset_stats()
        stats.game_active = True
        # Сброс изображения счетов, уровня, жизней
        sb.prep_score()
        sb.prep_high_score()
        sb.prep_level()
        sb.prep_ships()
        # Очистка списков пришельцев и пуль
        aliens.empty()
        bullets.empty()

        # Создание нового флота и размещение корабля в центр
        create_fleet(ai_settings, screen, ship, aliens)
        ship.center_ship()





def fire_bullet(ai_settings, screen, ship, bullets):
    """Выпускает пулю"""
    new_bullet = Bullet(ai_settings, screen, ship)
    bullets.add(new_bullet)


def update_screen(ai_settings, screen, stats, sb, ship, aliens, bullets, play_button):
    # При каждом проходе цикла перерисовываем экран
    screen.fill(ai_settings.background_color)  # Задаем цвет фона
    #Всу пули выводятся позади изображений корабля и пришельцев
    for bullet in bullets.sprites():
        bullet.draw_bullet()
    ship.blitme()
    aliens.draw(screen)
    #Вывод счета
    sb.show_score()
    # Кнопка плей отображается если игра не активна
    if not stats.game_active:
        play_button.draw_button()
    # Отображение последнего прорисованного экрана
    pygame.display.flip()


def update_bullets(ai_settings, screen, stats, sb, ship, aliens, bullets):
    """Обновляет позиции пуль и удаляет старые пули"""
    bullets.update()
    # Удаление вышедших за край экрана
    for bullet in bullets.copy():
        if bullet.rect.bottom <= 0:
            bullets.remove(bullet)
    check_bullet_alien_collection(ai_settings, screen, stats, sb, ship, aliens, bullets)


def update_aliens(ai_settings, stats, screen, sb, ship, aliens, bullets):
    """Проверяет достиг ли флот края экрана, после чего обновляет позиции всех пришельцев во флоте"""
    check_fleet_adges(ai_settings, aliens)
    aliens.update()
    # Проверка колизий пришелец корабль
    if pygame.sprite.spritecollideany(ship, aliens):
        ship_hit(ai_settings, stats, screen, sb, ship, aliens, bullets)
    #Проверка пришельцев добравшихся до нижней части экрана
        check_aliens_bottom(ai_settings, stats, screen, sb, ship, aliens, bullets)

def check_fleet_adges(ai_settings, aliens):
    """Реагирует на достижение пришельцем края экрана"""
    for alien in aliens.sprites():
        if alien.check_edges():
            change_fleet_direction(ai_settings, aliens)
            break


def change_fleet_direction(ai_settings, aliens):
    """Опускает весь флот и меняет направление флота"""
    for alien in aliens.sprites():
        alien.rect.y += ai_settings.fleet_drop_speed
    ai_settings.fleet_direction *= -1

def check_bullet_alien_collection(ai_settings, screen, stats, sb, ship, aliens, bullets):
    """Обработка коллизий пуль с пришельцами."""
    # Удаление пуль и пришельцев, участвующих в коллизиях.
    collisions = pygame.sprite.groupcollide(bullets, aliens, True, True)
    if collisions:
        for aliens in collisions.values():
            stats.score += ai_settings.alien_points * len(aliens)
        sb.prep_score()
        check_high_score(stats, sb)
    if len(aliens) == 0:
        # Если весь флот уничтожен начинается следующий уровень
        # Уничтожение существующих пуль, повышение скорости и создание нового флота
        bullets.empty()
        ai_settings.increase_speed()
        # увиличение уровня
        stats.level += 1
        sb.prep_level()
        create_fleet(ai_settings, screen, ship, aliens)