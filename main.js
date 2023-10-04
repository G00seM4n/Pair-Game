class HelpersPairGame {
	// Создаёт массив типа [1, 1, 2, 2, 3, 3, ...]
	createNumbersArray(count) {
		const arr = [];

		for (let i = 1; i <= count; i++) {
			arr.push(i, i);
		}

		return arr;
	}
	// Перемешивает массив по алгоритму Фишера
	shuffle(arr) {
		return arr.sort(() => Math.random() - 0.5);
	}
	// Проверка на заполненность ячеек (если есть хотя бы один пустой элемент, то функция вернёт false)
	isEndGame(parentItems, classItems) {
		const allItems = parentItems.querySelectorAll(classItems);

		for (let i = 0; i < allItems.length; i++) {
			if (allItems[i].textContent === '') return false;
			continue;
		}

		return true;
	}
};

class PairGame extends HelpersPairGame {
	constructor(selector) {
		super(HelpersPairGame);

		this.selector = document.querySelector(selector);

		this.init();
	}
	// Создаёт элемент кнопки
	createCardElement() {
		const card = document.createElement('div');
		card.classList.add('item');

		return card;
	}
	// Модальное окно с настройками игры
	createGameOptions() {
		const modal = document.createElement('div');
		const modalTitle = document.createElement('h1');
		const label = document.createElement('label');
		const select = document.createElement('select');
		const startBtn = document.createElement('button');

		modal.classList.add('modal');
		modalTitle.textContent = 'Игра в пары';
		label.textContent = 'Выберите количествово ячеек';
		startBtn.textContent = 'Начать игру';
		startBtn.classList.add('modal__btn');

		for (let i = 2; i <= 6; i += 2) {
			if (!Number.isInteger(i * i / 2)) continue;

			const option = document.createElement('option');
			option.value = i * i;
			option.textContent = i * i;

			select.append(option);
		}

		label.append(select);
		modal.append(modalTitle, label, startBtn);

		return {
			modal,
			select,
			startBtn
		};
	}
	// Рендер карточек
	renderCards(cardCount) {
		const cardsWrap = document.createElement('div');
		const timerWrap = document.createElement('div');

		const nums = super.shuffle(super.createNumbersArray(cardCount));
		let currentArr = [];

		cardsWrap.classList.add('wrap');
		cardsWrap.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(nums.length))}, 1fr)`;
		timerWrap.classList.add('timer');

		let seconds = 60;
		timerWrap.textContent = `Осталось ${seconds} секунд`;
		const timerInterval = setInterval(() => {
			timerWrap.textContent = `Осталось ${seconds -= 1} секунд`;

			if (seconds === 0) {
				clearInterval(timerInterval);
				this.selector.removeChild(cardsWrap);
				this.selector.append(this.createElementResult(false));
			};
		}, 1000);

		nums.forEach((num, id) => {
			const item = this.createCardElement(num);
			item.setAttribute('id', id);

			item.addEventListener('click', () => {
				if (item.textContent) return;

				currentArr.push({ id, num });

				item.textContent = nums[item.id];

				if (currentArr.length > 2) {
					const fisrtNum = currentArr[currentArr.length - 3].num;
					const secondNum = currentArr[currentArr.length - 2].num;

					const firstEl = document.querySelector(`.item[id="${currentArr[currentArr.length - 3].id}"]`);
					const secondEl = document.querySelector(`.item[id="${currentArr[currentArr.length - 2].id}"]`);

					if (fisrtNum !== secondNum) {
						firstEl.textContent = '';
						secondEl.textContent = '';

						currentArr.splice(currentArr.length - 3, currentArr.length - 1);
					}

					if (fisrtNum === secondNum) {
						currentArr = [];
						currentArr.push({ id, num });
					}
				}

				if (this.isEndGame(cardsWrap, '.item')) {
					this.selector.removeChild(cardsWrap);
					this.selector.append(this.createElementResult(true));
				}
			});

			cardsWrap.append(timerWrap);
			cardsWrap.append(item);
		});

		return cardsWrap;
	}
	// Модальное окно с результатом
	createElementResult(bool) {
		const modal = document.createElement('div');
		const modalTitle = document.createElement('h1');
		const restart = document.createElement('button');

		restart.textContent = 'Начать заново';

		bool ? modalTitle.textContent = 'Вы победили! (´• ω •`)' : modalTitle.textContent = 'Вы проиграли. (｡•́︿•̀｡)'

		restart.onclick = () => {
			this.selector.removeChild(modal);
			this.init();
		};

		modal.append(modalTitle, restart);

		return modal;
	}
	// Инициализация
	init() {
		const gameOption = this.createGameOptions();

		gameOption.startBtn.onclick = () => {
			const cardCount = gameOption.select.value / 2;
			this.selector.removeChild(gameOption.modal);

			this.selector.append(this.renderCards(cardCount));
		};

		this.selector.append(gameOption.modal);
	}
};

new PairGame('#app')
