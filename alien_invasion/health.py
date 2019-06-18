import pygame
from pygame.sprite import Sprite

class Health(Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.image.load('images/health.bmp')
        self.rect = self.image.get_rect()