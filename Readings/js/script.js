let clueMenuHeight = 98;
let adsSpeed = 1000;
let highlightTime = 100;
let scrollTime = 500;
let highlightWaitTime = 1000;
let clueFlag = -1;
let clueHeightOpen = 124;
let clueHeightClose = 30;
let scroll = 0;
let bodyPadding = 0;

//入力チェック
$('body, #iframe').on('change', '.input-normal, .input-kai', function() {

	if ($(this).hasClass('input-getsu') && $(this).val() == '夜') {
		checkBoard($(this), '.cell-tsu, .cell-ki, .cell-yo');
	}
	else if ($(this).hasClass('input-e') && $(this).val() == '本') {
		checkBoard($(this), '.cell-e, .cell-ho, .cell-n');
	}
	else if ($(this).hasClass('input-kon') && $(this).val() == '朝') {
		checkBoard($(this), '.cell-ke, .cell-sa');
	}
	else if ($(this).hasClass('input-ha') && $(this).val() == '大') {
		checkBoard($(this), '.cell-ta, .cell-i, .cell-ha');
	}
	else if ($(this).hasClass('input-sen') && $(this).val() == '路') {
		checkBoard($(this), '.cell-ro, .cell-se, .cell-n');
	}
	else if ($(this).hasClass('input-gen') && $(this).val() == '野') {
		checkBoard($(this), '.cell-no, .cell-ha, .cell-ra');
	}
	else if ($(this).hasClass('input-kai') && $(this).val() == '設') {
		checkBoard($(this), '.cell-ka, .cell-i, .cell-se, .cell-tsu');
	} else {
		$(this).val('');
	}
})
//盤面へスクロールし、色を塗る
function checkBoard(inputArea, checkClasses) {
	inputArea.prop('disabled', true);
	inputArea.parent().addClass('input-disabled');

	let position;
	if (clueFlag == 1) {
		position = $(".clear-remain-num").offset().top - clueHeightOpen;
	} else {
		position = $(".clear-remain-num").offset().top - clueHeightClose;
	}
	$('html, body').animate({ scrollTop: position }, scrollTime, 'swing');

	setTimeout(function() {
		$(checkClasses).addClass('marked highlight-cell');
		$('.clear-remain-num').addClass('highlight-remain');
		$('.clear-remain-num').text(16 - $('.marked').length);
	}, scrollTime);

	setTimeout(function() {
		$(checkClasses).removeClass('highlight-cell');
		$('.clear-remain-num').removeClass('highlight-remain');
	}, scrollTime + highlightTime);

	setTimeout(function() {
		checkClear();
	}, scrollTime + highlightTime + highlightWaitTime);


}
//クリアチェック
function checkClear() {
	if ($('.marked').length == 16) {
		displayModal();
	}
}
//クリアモーダル表示
function displayModal() {

	var cw = $(window).width() * 80 / 100;
	var ch = $(window).width() * 80 / 100;

	$('.modal-window').css({
		'left': (($(window).width() - cw - 4) / 2) + 'px',
		'top': (($(window).height() - ch - 4) / 2) + 'px',
		'width': cw,
		'height': ch
	});
	$('.modal-bg, .modal-window').fadeIn();
}
//広告開閉
$('body').on('click', '.banner-button', function() {
	if (clueFlag == 1) {//閉じる
		$('.line-left').attr('y1', '12');
		$('.line-left').attr('y2', '18');
		$('.line-right').attr('y1', '18');
		$('.line-right').attr('y2', '12');
		clueFlag = 0;

		if ($(window).scrollTop() > clueHeightOpen && $(window).scrollTop() < clueHeightOpen - clueHeightClose) {

			$('.game-page').css({ 'padding-top': clueHeightClose + 'px' });
			$(window).scrollTop($(window).scrollTop() - (bodyPadding - clueHeightClose));
			bodyPadding = clueHeightClose;

		} else if (bodyPadding < clueHeightClose) {
			$('.game-page').css({ 'padding-top': clueHeightClose + 'px' });
			$(window).scrollTop($(window).scrollTop() + clueHeightClose - bodyPadding);
			bodyPadding = clueHeightClose;
		}
	} else {//開く
		$('.line-left').attr('y1', '18');
		$('.line-left').attr('y2', '12');
		$('.line-right').attr('y1', '12');
		$('.line-right').attr('y2', '18');
		clueFlag = 1;
		if (bodyPadding < clueHeightOpen) {
			$('.game-page').css({ 'padding-top': clueHeightOpen + 'px' });
			$(window).scrollTop($(window).scrollTop() + clueHeightOpen - bodyPadding);
			bodyPadding = clueHeightOpen;
		}
	}
	if ($('.clue').hasClass('active')) {
		$('.clue').stop().animate({ top: '-' + clueMenuHeight + 'px' }, adsSpeed, 'easeInCubic').removeClass('active');
	} else {
		$('.clue').stop().animate({ top: '0' }, adsSpeed, 'easeOutCubic').addClass('active');
	}
})
//広告初回表示
$(window).scroll(function() {
	if (clueFlag == -1 && $(window).scrollTop() >= clueHeightOpen) {
		$('.clue').stop().animate({ top: '0' }, adsSpeed, 'easeOutCubic');
		clueFlag = 1;
	}
});
//スクロールしながらpadding調整
$(window).scroll(function() {

	if (clueFlag == 1 && bodyPadding < clueHeightOpen) {

		if ($(this).scrollTop() < scroll) {
			bodyPadding = bodyPadding + scroll - $(window).scrollTop();
		} else {
			bodyPadding = bodyPadding + ($(window).scrollTop() - scroll) / 2;
		}
		if (bodyPadding > clueHeightOpen) {
			bodyPadding = clueHeightOpen;
		}
		$('.game-page').css({ 'padding-top': bodyPadding + 'px' });

	} else if (clueFlag == 0 && bodyPadding > clueHeightClose) {

		if ($(this).scrollTop() < scroll) {
			bodyPadding = bodyPadding - ((scroll - $(window).scrollTop()) / 2);
		} else {
			bodyPadding = bodyPadding - (($(window).scrollTop() - scroll));
		}
		if (bodyPadding < clueHeightClose) {
			bodyPadding = clueHeightClose;
		}
		$('.game-page').css({ 'padding-top': bodyPadding + 'px' });
	}
	scroll = $(this).scrollTop();
});
$(window).on('load', function() {
	$('.wait-area').hide();
	$('.start-area').show();
	$('.credit').show();
});
$('body').on('click', '.start-button', function() {
	$('.start-area').fadeOut();
	$('.main-area').delay(400).fadeIn();
})
$('body').on('click', '.close-modal', function() {
	$('.modal-bg, .modal-window').fadeOut();
	$('.share-area').show();
	$('.clear-remain').hide();
	$('.clear-remain-cleard').show();
})

