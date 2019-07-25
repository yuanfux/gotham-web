import { encode, decode } from 'zero-width-lib';
import g from 'gotham-encoder';
import 'whatwg-fetch';
import css from './style.css';
import './image/down-arrow.png';
import './image/upper-arrow.png';

const encoded = document.getElementById('encoded');
const decoded = document.getElementById('decoded');
const encodeBtn = document.getElementById('encode');
const decodeBtn = document.getElementById('decode');
const decodeV1Btn = document.getElementById('decode-v1');
const checkbox = document.getElementById('activateSelectDecode');

const copyBtn = document.getElementById('copy');
const popup = document.getElementById('popup');

const tipBtn = document.getElementById('tip');
const tipContent = document.getElementById('tip-content');

const recentBtn = document.getElementById('recent');
const modal = document.getElementById('modal');
const modalCloseBtn = document.getElementsByClassName('close')[0];

const getPos = (el) => {
	return {
		top: el.offsetTop,
		left: el.offsetLeft,
		width: el.offsetWidth
	}
}

const showPopup = (top, left, width, text) => {
	popup.innerHTML = text;
	popup.style.top = `${top}px`;
	// center 
	popup.style.left = `${left + width / 2 - popup.offsetWidth / 2}px`;
	// animation
	popup.classList.remove('hide');
	// reset animation
	popup.classList.remove('fade');
	setTimeout(() => {
		popup.classList.add('fade');
	}, 0);
}

const truncateText = (text) => {
	return text.length > 3 ? `${text.slice(0, 3)}...` : text;
}

const HOST = 'https://tdbozsuq93.execute-api.us-west-2.amazonaws.com/production/';

const record = (content) => {
	return fetch(HOST + 'api/record', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        	content
        }),
    }).then(response => response.json());
}

const getTopList = () => {
	return fetch(HOST + 'api/getPopularItems')
	  .then(response => response.json());
}

const encodePos = getPos(encodeBtn);
const decodePos = getPos(decodeBtn);
const decodeV1Pos = getPos(decodeV1Btn);
const copyPos = getPos(copyBtn);

encodeBtn.addEventListener('click', e => {
	const shortDecodedText = truncateText(decoded.value);
	const newEncodedVal = decoded.value.length > 0 ? encode('峯哥NB！fgnb!', decoded.value) : '';
	encoded.value = newEncodedVal;
	showPopup(
		encodePos.top,
		encodePos.left,
		encodePos.width,
		`已加密 ${shortDecodedText}`
	);
});

decodeBtn.addEventListener('click', e => {
	try {
		const newDecodedVal = decode(encoded.value);
		decoded.value = newDecodedVal;
		showPopup(
			decodePos.top,
			decodePos.left,
			decodePos.width,
			'已解密'
		);
		record(newDecodedVal).then(result => {
		}).catch(err => {
		});
	} catch (e) {
		showPopup(
			decodePos.top,
			decodePos.left,
			decodePos.width,
			'无法解密'
		);
	}
});

decodeV1Btn.addEventListener('click', e => {
	try {
		const newDecodedVal = g.decode(encoded.value);
		decoded.value = newDecodedVal;
		showPopup(
			decodeV1Pos.top,
			decodeV1Pos.left,
			decodeV1Pos.width,
			'已解密'
		);
	} catch (e) {
		showPopup(
			decodeV1Pos.top,
			decodeV1Pos.left,
			decodeV1Pos.width,
			'无法解密'
		);
	}
});

copyBtn.addEventListener('click', e => {
	encoded.select();
	document.execCommand('copy');
	showPopup(
		copyPos.top,
		copyPos.left,
		copyPos.width,
		'已复制'
	);
});

popup.addEventListener('animationend', () => {
	popup.classList.remove('fade');
	popup.classList.add('hide');
});

tipBtn.addEventListener('click', e => {
	if (tipContent.classList.contains('expand')) {
		tipBtn.innerHTML = '查看如何使用?';
		tipContent.classList.remove('expand');
		tipContent.classList.add('collapse');
	} else {
		tipBtn.innerHTML = '收起如何使用';
		tipContent.classList.remove('collapse');
		tipContent.classList.add('expand');
	}
});

const padLeft = (str) => {
	if (`${str}`.length < 2) {
		return '0' + str;
	} else {
		return str;
	}
}

const ts2Date = (ts) => {
	const d = new Date(ts);
	return [d.getFullYear(), padLeft(d.getMonth()+1), padLeft(d.getDate())].join('/')+' '+
        [padLeft(d.getHours()), padLeft(d.getMinutes()), padLeft(d.getSeconds())].join(':');
}

const showLoader = () => {
	const table = document.getElementById('table');
	if (table) {
		table.innerHTML = `
			<div class='loader-container'>
				<div class='loader'></div>
			</div>
		`;
	}
}

const TOP_LIST_LIMIT = 10;

const fire = (index) => {
	const numFire = Math.ceil((TOP_LIST_LIMIT - index) / 3);
	let rt = '';
	for (let i = 0 ; i < numFire ; i++) {
		rt += '🔥';
	}
	return rt;
}

recentBtn.addEventListener('click', e => {
	modal.style.display = 'block';
	showLoader();
	getTopList().then(result => {
		const table = document.getElementById('table');
		if (table) {
			const rows = result.map((item, index) => `
				<tr>
					<td>${fire(index)}</td>
					<td>${item.content}</td>
					<td>${ts2Date(item.createdAt)}</td>
				</tr>
			`);
			table.innerHTML = `
				<tr>
					<th>热门度</th>
					<th>密文</th>
					<th>时间</th>
				</tr>
				${rows.join('')}
			`;
		}
	}).catch(error => {
		const table = document.getElementById('table');
		if (table) {
			table.innerHTML = `
				<div class='error-container'>
					获取数据失败，请重试
				</div>
			`;
		}
	});
});

modalCloseBtn.addEventListener('click', e => {
	modal.style.display = 'none';
});

window.addEventListener('click', e => {
	if (e.target == modal) {
		modal.style.display = 'none';
	}
});
