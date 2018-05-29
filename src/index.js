import positive from 'positive-energy-encoder';
import css from './style.css';

const encoded = document.getElementById('encoded');
const decoded = document.getElementById('decoded');
const encodeBtn = document.getElementById('encode');
const decodeBtn = document.getElementById('decode');
const checkbox = document.getElementById('activateSelectDecode');

encodeBtn.addEventListener('click', e => {
	const newEncodedVal = positive.encode(decoded.value);
	encoded.value = newEncodedVal;
});

decodeBtn.addEventListener('click', e => {
	const newDecodedVal = positive.decode(encoded.value);
	decoded.value = newDecodedVal;
});
