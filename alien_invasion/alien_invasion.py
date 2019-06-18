import pygame

from settings import Settings
from ship import Ship
from pygame.sprite import Group
from game_stats import GameStats
from  button import Button
from scoreboard import ScoreBoard
import game_function as gf

def run_game():
    # Инициализирует pygame, settings и объект экрана
    pygame.init()
    ai_settings = Settings()
    screen = pygame.display.set_mode((ai_settings.screen_width, ai_settings.screen_height))
    pygame.display.set_caption("Alien Invasion")

    #Созданик кнопки
    play_button = Button(ai_settings, screen, "Play")

    # Создание экземпляра GameStats и ScoreBoard
    stats = GameStats(ai_settings)
    sb = ScoreBoard(ai_settings, screen, stats)
    # Создаем корабль
    ship = Ship(ai_settings, screen)
    # Создаем группы для хранения пуль
    bullets = Group()
    aliens = Group()
    gf.create_fleet(ai_settings, screen, ship, aliens)
    #Запуск основного цикла игры
    while True:
        gf.check_events(ai_settings, screen, stats, sb, ship, aliens, bullets, play_button)
        if stats.game_active:
            ship.update()
            gf.update_bullets(ai_settings, screen, stats, sb, ship, aliens, bullets)
            gf.update_aliens(ai_settings, stats, screen, sb, ship, aliens, bullets)
        gf.update_screen(ai_settings, screen, stats, sb, ship, aliens, bullets, play_button)


run_game()
