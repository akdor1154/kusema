'use strict';

export function removeFromArray(item, array) {
	var index = array.indexOf(item);
	if (index != -1) {
		array.splice(index, 1);
	}
}