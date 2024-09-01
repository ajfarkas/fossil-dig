const WIDE_NUM = 10;
const HIGH_NUM = 5;
const FOSSILS_NUM = 20;

const $id = (id, container) => (container || document).getElementById(id);
const $ = (sel, container) => (container || document).querySelector(sel);

const remainDisplay = $id('remain_num');
const resetBtn = $id('reset');
const digBody = $id('dig__body');

class FossilDig {
	constructor(params) {
		this.width = params.width || new Error('no width param supplied');
		this.height = params.height || new Error('no height param supplied');
		this.fossils = params.fossils || new Error('no fossil param supplied');

		this.fossilsPos = {};

		this.setFossilsPos();
		this.makeDig(this.width, this.height);
	}

	makeRow(y) {
		const row = document.createElement('tr');
		row.className = 'dig__row';
		row.dataset.y = y;

		digBody.appendChild(row);
		return row;
	}

	makeCell(x, y) {
		const cell = document.createElement('td');
		cell.className = 'dig__cell';
		cell.dataset.pos = `${x},${y}`;

		$(`[data-y="${y}"]`).appendChild(cell);
		cell.addEventListener('click', this.checkForFossils);
		return cell;
	}

	makeDig(w, h) {
		for (let y = 0; y < h; y++) {
			const row = this.makeRow(y);
			for (let x = 0; x < w; x++) {
				this.makeCell(x, y);
			}
		}
	}

	setFossilsPos() {
		const { fossils, height, width } = this;
		for (let f = fossils; f > 0; f--) {
			const y = Math.floor(Math.random() * height).toString();
			const x = Math.floor(Math.random() * width).toString();

			if (!this.fossilsPos[x]) this.fossilsPos[x] = [];
			// don't allow duplicates
			if (this.fossilsPos[x].includes(y)) {
				f++;
			} else {
				this.fossilsPos[x].push(y.toString());
			}
		}
	}

	checkForFossils = (ev) => {
		const cell = ev.currentTarget;
		const [x,y] = cell.dataset.pos.split(',');
		console.log(`clicked: ${x},${y}`)
		if (this.fossilsPos[x]?.includes(y)) {
			cell.classList.add('has-fossil');
		} else {
			let adjacent = 0;
			const ynum = parseInt(y);
			const xnum = parseInt(x);
			console.log(this.fossilsPos[x], x)
			for (let yTest = ynum - 1; yTest <= ynum + 1; yTest++) {
				for (let xTest = xnum - 1; xTest <= xnum + 1; xTest++) {
					console.log(xTest, yTest, xnum, ynum)
					if (xTest === x && yTest === y) break;
					else if (this.fossilsPos[x]?.includes(yTest.toString())) {
						console.log('adjacent')
						adjacent++;
					}
				}
			}
			cell.innerText = adjacent;
		}

		cell.removeEventListener('click', this.checkForFossils);
	}

	get fossilsPos() {
		return this._fossilsPos;
	}

	set fossilsPos(arr) {
		if (this._fossilsPos) return this._fossilsPos;

		this._fossilsPos = arr;
	}
};

const dig = new FossilDig({
	width: WIDE_NUM,
	height: HIGH_NUM,
	fossils: FOSSILS_NUM
});
