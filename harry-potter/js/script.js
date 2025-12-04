// script.js - С ССЫЛКОЙ НА КИНОПОИСК
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен!');
    
    // 1. Табы для магии
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            console.log('Нажата кнопка:', tabId);
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
            });
            
            const activePane = document.getElementById(tabId);
            if (activePane) {
                activePane.classList.add('active');
            }
        });
    });
    
    // 2. Фильтры для фильмов
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Фильтрация фильмов
            const filter = this.textContent;
            const movieCards = document.querySelectorAll('.movie-card');
            
            movieCards.forEach(card => {
                const year = parseInt(card.getAttribute('data-year'));
                
                if (filter === 'Все') {
                    card.style.display = 'block';
                } else if (filter === 'Основная серия') {
                    card.style.display = year <= 2011 ? 'block' : 'none';
                } else if (filter === 'Фантастические твари') {
                    card.style.display = year >= 2016 ? 'block' : 'none';
                }
            });
        });
    });
    
    // 3. Сортировка персонажей
    const sortBtns = document.querySelectorAll('.sort-btn');
    sortBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            sortBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 4. Слайдер персонажей
    const sliderContainer = document.querySelector('.slider-container');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    if (sliderContainer && prevBtn && nextBtn) {
        const cardWidth = 280 + 32;
        
        prevBtn.addEventListener('click', () => {
            sliderContainer.scrollLeft -= cardWidth;
        });
        
        nextBtn.addEventListener('click', () => {
            sliderContainer.scrollLeft += cardWidth;
        });
        
        // Обновление видимости кнопок
        const updateSliderButtons = () => {
            prevBtn.style.opacity = sliderContainer.scrollLeft <= 0 ? '0.5' : '1';
            nextBtn.style.opacity = 
                sliderContainer.scrollLeft + sliderContainer.offsetWidth >= sliderContainer.scrollWidth ? '0.5' : '1';
        };
        
        sliderContainer.addEventListener('scroll', updateSliderButtons);
        updateSliderButtons();
    }
    
    // 5. Кнопка "Показать все фильмы"
    const showMoreBtn = document.querySelector('.btn-show-more');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            const hiddenMovies = document.querySelectorAll('.movie-card:nth-child(n+9)');
            hiddenMovies.forEach(movie => {
                movie.style.display = 'block';
            });
            this.style.display = 'none';
        });
    }
    
    // 6. КНОПКА "СМОТРЕТЬ ТРЕЙЛЕР" - ОТКРЫВАЕТ КИНОПОИСК
    const playBtn = document.querySelector('.btn-play');
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            createKinopoiskModal();
        });
    }
    
    // 7. Кнопка "Подробнее"
    const infoBtn = document.querySelector('.btn-info');
    if (infoBtn) {
        infoBtn.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // 8. Поиск
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Поиск фильмов, персонажей...';
            searchInput.className = 'search-input';
            searchInput.style.cssText = `
                padding: 8px 15px;
                border: 1px solid var(--border-color);
                border-radius: 20px;
                background: var(--bg-card);
                color: var(--text-primary);
                font-size: 14px;
                width: 250px;
                outline: none;
                transition: all 0.3s ease;
            `;
            
            this.replaceWith(searchInput);
            searchInput.focus();
            
            searchInput.addEventListener('blur', function() {
                setTimeout(() => {
                    this.replaceWith(searchBtn);
                }, 200);
            });
            
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchContent(this.value);
                    this.replaceWith(searchBtn);
                }
            });
        });
    }
    
    // 9. Функция поиска
    function searchContent(query) {
        if (!query.trim()) return;
        
        const allContent = document.querySelectorAll('.movie-card, .character-card, .spell-card, .potion-card, .artifact-card, .creature-card');
        const results = [];
        
        allContent.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                results.push(item);
                item.style.boxShadow = '0 0 0 3px var(--accent-gold)';
                item.style.transition = 'box-shadow 0.3s ease';
                
                // Прокрутка к первому результату
                if (results.length === 1) {
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                item.style.boxShadow = 'none';
            }
        });
        
        // Показать уведомление
        showNotification(results.length > 0 ? 
            `Найдено результатов: ${results.length}` : 
            'Ничего не найдено');
    }
    
    // 10. Создание модального окна с Кинопоиском
    function createKinopoiskModal() {
        // Создаем overlay
        const overlay = document.createElement('div');
        overlay.className = 'kinopoisk-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
            padding: 20px;
        `;
        
        // Контент модального окна
        const modalContent = `
            <div style="background: var(--bg-card); border-radius: 15px; overflow: hidden; max-width: 500px; width: 100%; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                <!-- Кнопка закрытия -->
                <button class="modal-close" style="position: absolute; top: 15px; right: 15px; background: rgba(20,20,20,0.9); color: white; border: 2px solid var(--accent-gold); width: 40px; height: 40px; border-radius: 50%; font-size: 24px; cursor: pointer; z-index: 10000; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">
                    ×
                </button>
                
                <!-- Заголовок -->
                <div style="background: linear-gradient(135deg, var(--accent-gold), #f7ef8a); padding: 25px; text-align: center;">
                    <i class="fas fa-film" style="font-size: 48px; color: #000; margin-bottom: 15px;"></i>
                    <h2 style="margin: 0; color: #000; font-size: 24px; font-weight: bold;">Гарри Поттер на Кинопоиске</h2>
                </div>
                
                <!-- Контент -->
                <div style="padding: 30px; text-align: center;">
                    <div style="margin-bottom: 25px;">
                        <i class="fas fa-external-link-alt" style="font-size: 60px; color: var(--accent-gold); margin-bottom: 20px;"></i>
                        <h3 style="margin: 0 0 10px 0; color: var(--text-primary); font-size: 20px;">Открыть страницу фильма</h3>
                        <p style="margin: 0; color: var(--text-secondary); line-height: 1.5;">
                            Вы будете перенаправлены на официальную страницу фильма 
                            "Гарри Поттер и философский камень" на Кинопоиске
                        </p>
                    </div>
                    
                    <!-- Информация о фильме -->
                    <div style="background: rgba(212, 175, 55, 0.1); border-radius: 10px; padding: 20px; margin-bottom: 25px; text-align: left;">
                        <h4 style="margin: 0 0 10px 0; color: var(--accent-gold); font-size: 16px;">
                            <i class="fas fa-info-circle"></i> Информация о фильме:
                        </h4>
                        <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary);">
                            <li>Год: 2001</li>
                            <li>Рейтинг Кинопоиска: 7.6/10</li>
                            <li>Длительность: 152 мин</li>
                            <li>Жанр: Фэнтези, Приключения</li>
                        </ul>
                    </div>
                    
                    <!-- Кнопки -->
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button class="modal-action-btn" style="flex: 1; padding: 15px; background: var(--accent-gold); color: #000; border: none; border-radius: 10px; font-weight: bold; font-size: 16px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 10px;">
                            <i class="fas fa-external-link-alt"></i>
                            Открыть Кинопоиск
                        </button>
                        <button class="modal-cancel-btn" style="flex: 1; padding: 15px; background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 10px; font-size: 16px; cursor: pointer; transition: all 0.3s ease;">
                            Отмена
                        </button>
                    </div>
                    
                    <!-- Примечание -->
                    <p style="margin-top: 20px; font-size: 12px; color: var(--text-muted);">
                        <i class="fas fa-shield-alt"></i> Безопасное соединение • Официальный источник
                    </p>
                </div>
            </div>
        `;
        
        overlay.innerHTML = modalContent;
        document.body.appendChild(overlay);
        
        // Получаем элементы после добавления в DOM
        const closeBtn = overlay.querySelector('.modal-close');
        const actionBtn = overlay.querySelector('.modal-action-btn');
        const cancelBtn = overlay.querySelector('.modal-cancel-btn');
        
        // Обработчики событий для кнопок
        closeBtn.onmouseover = function() {
            this.style.background = 'var(--accent-gold)';
            this.style.color = '#000';
        };
        
        closeBtn.onmouseout = function() {
            this.style.background = 'rgba(20, 20, 20, 0.9)';
            this.style.color = 'white';
        };
        
        closeBtn.onclick = function() {
            document.body.removeChild(overlay);
        };
        
        actionBtn.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(212, 175, 55, 0.4)';
        };
        
        actionBtn.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };
        
        actionBtn.onclick = function() {
            // Открываем Кинопоиск в новой вкладке
            window.open('https://www.kinopoisk.ru/film/689/', '_blank');
            document.body.removeChild(overlay);
        };
        
        cancelBtn.onmouseover = function() {
            this.style.background = 'var(--border-color)';
        };
        
        cancelBtn.onmouseout = function() {
            this.style.background = 'var(--bg-secondary)';
        };
        
        cancelBtn.onclick = function() {
            document.body.removeChild(overlay);
        };
        
        // Закрытие по клику на overlay
        overlay.onclick = function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        };
        
        // Закрытие по Escape
        document.addEventListener('keydown', function closeOnEsc(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', closeOnEsc);
            }
        });
    }
    
    // 11. Функция уведомлений
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--accent-gold);
            color: var(--bg-primary);
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // 12. Добавляем стили для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
            from { 
                transform: translateX(100%); 
                opacity: 0; 
            }
            to { 
                transform: translateX(0); 
                opacity: 1; 
            }
        }
        
        @keyframes slideOut {
            from { 
                transform: translateX(0); 
                opacity: 1; 
            }
            to { 
                transform: translateX(100%); 
                opacity: 0; 
            }
        }
        
        .kinopoisk-overlay {
            animation: fadeIn 0.3s ease;
        }
        
        .modal-action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
        }
        
        .modal-cancel-btn:hover {
            background: var(--border-color) !important;
        }
        
        /* Стили для поиска */
        .search-input:focus {
            border-color: var(--accent-gold) !important;
            box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.3);
        }
        
        /* Адаптивность */
        @media (max-width: 768px) {
            .kinopoisk-overlay > div {
                max-width: 90% !important;
            }
            
            .modal-action-btn,
            .modal-cancel-btn {
                font-size: 14px !important;
                padding: 12px !important;
            }
        }
        
        @media (max-width: 480px) {
            .kinopoisk-overlay > div {
                max-width: 95% !important;
            }
            
            .modal-action-btn,
            .modal-cancel-btn {
                flex-direction: column;
                gap: 5px;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Сайт Harry Potter Archive загружен!');
    console.log('🎬 Кнопка "Смотреть трейлер" открывает Кинопоиск');
    console.log('🔗 Ссылка: https://www.kinopoisk.ru/film/689/');
});