// Load app style
import '@Styles/app.scss';

// JS npm scripts
import './libs';

// JS assets scripts
import imgToSvg from '@Scripts/imgToSvg';
import toggleTabs from '@Scripts/toggleTabs';
import formValidate from '@Scripts/formValidate';

// JS template components
import carousel from '@Blocks/carousel/carousel';
import hamburger from '@Blocks/hamburger/hamburger';

import svg4everybody from 'svg4everybody';
import noUiSlider from 'nouislider';

// Пример разбиения файлов на отдельные чанки
const Chunks = {
	styles: () => importName('@Styles/dynamic/dynamic.scss', 'chunk.dynamic-scss'), // путь к файлу или массив, название чанка
	script: () => importName('@Scripts/dynamic.js', 'chunk.dynamic-js')
};

const app = {
	load: () => {
		app.bindEvents();
	},
	bindEvents: () => {
		// Динамическая подрузка чанков
		$('#d-js').one('click', () => Chunks.script().then((data) => data.default()));
		$('#d-css').one('click', () => Chunks.styles());

		let initData = {
			mfpOpt: {
				type: 'inline',
				fixedContentPos: false,
				fixedBgPos: true,
				overflowY: 'auto',
				closeBtnInside: true,
				preloader: false,
				midClick: true,
				removalDelay: 300,
				mainClass: 'my-mfp-slide-bottom'
			},
			masks: {
				tel: '+7 (999) 999-99-99',
				date: '99.99.9999',
				email: 'email',
				card: [ '9{4} 9{4} 9{4} 9{4}', { placeholder: '∗' } ]
			},
			isMobile: function() {
				return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
			},
			isIE: function() {
				return (
					navigator.userAgent.indexOf('MSIE ') > -1 || navigator.userAgent.indexOf('Trident/') > -1
				);
			},
			initMasks: function() {
				Object.keys(this.masks).map((maskName, index) => {
					let maskPlaceholder = this.masks[maskName];

					if (typeof maskPlaceholder == 'object') {
						$(`input.${maskName}-input`).inputmask(...maskPlaceholder);
					} else {
						$(`input.${maskName}-input`).inputmask(maskPlaceholder);
					}
				});
			},
			initLibs: function() {
				$('select').niceSelect();
				$('input[type="number"]').niceNumber();
				$('.js-popup').magnificPopup(this.mfpOpt);
				$('.js-popup-close').click(function() { $.magnificPopup.close(); });
				$('.scrollbar-outer').overlayScrollbars({});
				this.initMasks();

				document.querySelector('.range-slider') && noUiSlider.create(document.querySelector('.range-slider'), {
					start: [ 20, 80 ],
					connect: true,
					behaviour: 'tap',
					step: 10,
					range: {
						min: 0,
						max: 100
					}
				});
			}
		};

		initData.initLibs();
		imgToSvg();
		carousel();
		svg4everybody();
		toggleTabs();
		formValidate();
		hamburger();

		if (initData.isIE()) $('body').addClass('ie');
		if (initData.isMobile()) $('body').addClass('touch');
	}
};

$(document).ready(app.load);

const requireAll = (r) => {
	r.keys().forEach(r);
};

requireAll(require.context('./assets/images/svg-icons/', true, /\.svg$/));
requireAll(require.context('./templates/pages/', true, /\.pug$/));
