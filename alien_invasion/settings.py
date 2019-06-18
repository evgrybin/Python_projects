class Settings():
    """Класс с настройками игры Alien Invasion"""

    def __init__(self):
        """Инициализация статических настроек игры"""
        # Параметры экрана
        self.screen_width = 1200
        self.screen_height = 800
        self.background_color = (230, 230, 230)

        # Настройки корабля
        self.ship_limit = 3

        # Параметры пули
        self.bullet_width = 3
        self.bullet_height = 15
        self.bullet_color = 60, 60, 255

        #Настройка пришельцев
        self.fleet_drop_speed = 10

        # Темп ускорения игры
        self.speedup_scale = 1.1
        # темп роста стоимости пришельцев
        self.score_scale = 1.5
        self.initialize_dinamic_settings()


    def initialize_dinamic_settings(self):
        # Подсчет очков
        self.alien_points = 50
        self.ship_speed = 1.5
        self.bullet_speed = 3
        self.alien_speed = 1
        #fleet_direction = 1 обозначает движение в право, -1 влево
        self.fleet_direction = 1


    def increase_speed(self):
        """Увеличение настроек скорости и стоимости пришельцев"""
        self.ship_speed *= self.speedup_scale
        self.bullet_speed *= self.speedup_scale
        self.alien_speed *= self.speedup_scale
        self.alien_points = int(self.alien_points * self.score_scale)
