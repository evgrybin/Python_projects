import pygame

class Ship():
    """Иницилизирует корабль и задает его начальную позицию"""
    def __init__(self, ai_settings, screen):
        self.screen = screen
        self.ai_settings = ai_settings
        # Загрузка корабля и получение прямоугольника
        self.image = pygame.image.load('images/Ship.bmp')
        self.rect = self.image.get_rect()
        self.screen_rect = screen.get_rect()
        # Каждый новый корабль появляется у нижнего края экрана
        self.rect.centerx = self.screen_rect.centerx
        self.rect.bottom = self.screen_rect.bottom
        # Сохранение вещественной координаты центра корабля
        self.center = float(self.rect.centerx)
        self.bottom = float(self.rect.bottom)
        self.moving_right = False
        self.moving_left = False
        self.moving_up = False
        self.moving_down = False


    def center_ship(self):
        """Размещает корабль в исходную позицию"""
        self.center = self.screen_rect.centerx
        self.bottom = self.screen_rect.bottom

    def update(self):
        """Обновить позицию корабля с учетом флага"""
        # Обнавляется center, а не реакт
        if self.moving_right:       #and self.rect.right < self.screen_rect.right
            self.center += self.ai_settings.ship_speed
            if self.rect.right > self.screen_rect.right:
                self.center = 0
        if self.moving_left:        #and self.rect.left > 0
            self.center -= self.ai_settings.ship_speed
            if self.rect.left < 0:
                self.center = self.screen_rect.right
        if self.moving_up and self.rect.top > 0:
            self.bottom -= self.ai_settings.ship_speed
        if self.moving_down and self.rect.bottom < self.screen_rect.bottom:
            self.bottom += self.ai_settings.ship_speed

        # Обновляем react
        self.rect.centerx = self.center
        self.rect.bottom = self.bottom


    def blitme(self):
        """Отрисовка корабля в этой позиции"""
        self.screen.blit(self.image, self.rect)
