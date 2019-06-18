import pygame
from pygame.sprite import Sprite

class Bullet(Sprite):
    """Класс пули выпущенной кораблем"""
    def __init__(self, ai_settings, screen, ship):
        super().__init__()
        self.screen = screen

        # Создание пули в позиции (0, 0) и назначеник правильной позиции
        self.rect = pygame.Rect(0, 0, ai_settings.bullet_width, ai_settings.bullet_height)
        self.rect.centerx = ship.rect.centerx
        self.rect.top = ship.rect.top

        # позиция пули в вещественном формате
        self.y = float(self.rect.y)
        self.color = ai_settings.bullet_color
        self.speed = ai_settings.bullet_speed


    def update(self):
        # обновление позиции пули в вещественной форме
        self.y -= self.speed
        # Обновление позиции прямоугольника
        self.rect.y = self.y


    def draw_bullet(self):
        """Вывод пули на экран"""
        pygame.draw.rect(self.screen, self.color, self.rect)
