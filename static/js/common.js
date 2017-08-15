const Vue = require("vue");

Vue.directive('imgarea', {
	bind: function (el) {
		console.log('bind', el);
		el.style.display = "relative";
		el.style.transformOrigin = "0 0";
		el.style.cursor = 'all-scroll';

		let translateX = 0;
		let translateY = 0;
		let scale = 1;
		const updateTransform = () => {
			const maxWidth = el.offsetWidth;
			const maxHeight = el.offsetHeight;
			const width = el.offsetWidth * scale;
			const height = el.offsetHeight * scale;

			const restWidth = maxWidth - width;
			const restHeight = maxHeight - height;

			if (translateY > 0) {
				translateY = 0;
			} else
			if (translateY < restHeight) {
				translateY = restHeight;
			}

			if (translateX > 0) {
				translateX = 0;
			} else
			if (translateX < restWidth) {
				translateX = restWidth;
			}

			const transform = `translate(${translateX}px, ${translateY}px) scale(${scale}, ${scale})`;
			// console.log('updateTransform', transform);
			el.style.transform = transform;
		};

		let down = null;
		el.addEventListener('mousedown', function (e) {
			const offsetX = e.pageX - el.offsetLeft - translateX;
			const offsetY = e.pageY - el.offsetTop - translateY;
			console.log(offsetX, offsetY);

			down = {
				tX: translateX,
				tY: translateY,
				clientX: e.clientX,
				clientY: e.clientY,
			};
			e.preventDefault();
		});
		el.addEventListener('mousemove', function (e) {
			if (!down) return;
			e.preventDefault();
			requestAnimationFrame( () => {
				if (!down) return; // ensure mouse down
				const moveX = e.clientX - down.clientX;
				const moveY = e.clientY - down.clientY;
				translateX = down.tX + moveX;
				translateY = down.tY + moveY;
				updateTransform();
			});
		});
		window.addEventListener('mouseup', function (e) {
			if (!down) return;
			console.log('up');
			e.preventDefault();
			const moveX = e.clientX - down.clientX;
			const moveY = e.clientY - down.clientY;
			translateX = down.tX + moveX;
			translateY = down.tY + moveY;
			down = null;
			updateTransform();
		});
		el.addEventListener('wheel', function (e) {
			e.preventDefault();
			let newScale = scale - e.deltaY / 100;
			// let newScale = scale * (e.deltaY > 0 ? 0.8 : 1.2);
			if (newScale < 1) newScale = 1;
			if (newScale > 10) newScale = 10;
			// position from left top corner in translated origin
			const offsetX = e.pageX - el.offsetLeft - translateX;
			const offsetY = e.pageY - el.offsetTop - translateY;

			const s = newScale / scale; // current scale to new scale
			const pX = offsetX * -s + offsetX;
			const pY = offsetY * -s + offsetY;
			// console.log('offset', offsetX, offsetY, 'p', pX, pY, 'scale', newScale);
			translateX += pX;
			translateY += pY;
			scale = newScale;
			requestAnimationFrame( () => {
				updateTransform();
			});
		});

		let touch = null;
		el.addEventListener("touchstart", function (e) {
			if (e.touches.length === 1 ||
				e.touches.length === 2) {
				e.preventDefault();
				touch = e;
				touch._state = {
					tX: translateX,
					tY: translateY,
				};
			}
		});
		el.addEventListener("touchmove", function (e) {
			if (touch && e.touches.length === 1) {
				e.preventDefault();
				console.log('move');
				const moveX = e.touches[0].clientX - touch.touches[0].clientX;
				const moveY = e.touches[0].clientY - touch.touches[0].clientY;

				requestAnimationFrame( () => {
					translateX = touch._state.tX + moveX;
					translateY = touch._state.tY + moveY;
					updateTransform();
				});
			} else
			if (touch && e.touches.length === 2) {
				e.preventDefault();
				console.log('scale');
				const distance0 = Math.sqrt(
					(touch.touches[0].pageX-touch.touches[1].pageX) * (touch.touches[0].pageX-touch.touches[1].pageX) +
					(touch.touches[0].pageY-touch.touches[1].pageY) * (touch.touches[0].pageY-touch.touches[1].pageY)
				);
				const distance = Math.sqrt(
					(e.touches[0].pageX-e.touches[1].pageX) * (e.touches[0].pageX-e.touches[1].pageX) +
					(e.touches[0].pageY-e.touches[1].pageY) * (e.touches[0].pageY-e.touches[1].pageY)
				);
				let newScale = scale + (distance - distance0) / 200;
				console.log('distance', distance, newScale, e.touches);
				if (newScale < 1) newScale = 1;
				if (newScale > 10) newScale = 10;

				const centerX = (touch.touches[0].pageX + touch.touches[1].pageX) / 2;
				const centerY = (touch.touches[0].pageY + touch.touches[1].pageY) / 2;
				const offsetX = centerX - el.offsetLeft - translateX;
				const offsetY = centerY - el.offsetTop - translateY;

				const s = newScale / scale; // current scale to new scale
				const pX = offsetX * -s + offsetX;
				const pY = offsetY * -s + offsetY;
				// console.log('offset', offsetX, offsetY, 'p', pX, pY, 'scale', newScale);
				translateX += pX;
				translateY += pY;
				scale = newScale;
				requestAnimationFrame( () => {
					updateTransform();
				});
			}
		});
		el.addEventListener("touchend", function (e) {
			touch = null;
		});
	},
	inserted: function (el) {
		console.log('inserted', el);
	},
	update: function (el) {
		console.log('update', el);
	},
	componentUpdated: function (el) {
		console.log('componentUpdated', el);
	},
	unbind: function (el) {
		console.log('unbind', el);
	}
});

