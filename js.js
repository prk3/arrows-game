var steps;

$(document).ready( function() {

	var Arrow = function(type, id) {
		this.type = type;
		this.id = id;
		this.element = $('<div>', {class: 'arrow', 'data-type': this.type, 'data-id': this.id}).appendTo($('#container'));
		this.possibleMove = 0;

		this.setId = function(id) {
			this.id = id;
			this.element.attr('data-id', id.toString());
		};

		this.setPossibleMove = function(move) {
			this.possibleMove = move;
			this.element.attr('data-possiblemove', move.toString());
		};
	};

	var Step = function(index1, index2) {
		this.from = index1;
		this.to = index2;
	}

	var arrowsNumber;
	var array;
	var arraySize;
	// var steps;


	var initialize = function(arrowsNum) {
		$('#container').empty();

		arrowsNumber = arrowsNum;
		arraySize = arrowsNum * 2 + 1;
		array = new Array(arraySize);
		steps = new Array();

		for (var i = 0; i < arrowsNumber; i++) {
			array[i] = new Arrow('R', i);
		}

		array[arrowsNumber] = new Arrow('E', arrowsNumber);

		for (var i = arrowsNumber + 1; i < arraySize; i++) {
			array[i] = new Arrow('L', i);
		}

		$('.arrow').css('width', (100/arraySize) + '%');

		generatePattern();
		update();
	};

	var update = function() {
		setPossibleMoves();

		for (var i = 0; i < arraySize; i++) {
			array[i].element.off('click');

			if (array[i].possibleMove != 0) {
				array[i].element.on('click', function(event) {

					var i = parseInt( $(event.delegateTarget).attr('data-id') );
					var newPosition = i + parseInt( $(event.delegateTarget).attr('data-possiblemove') );

					steps.push(new Step(i, newPosition));

					swapArrows(i, newPosition);
					rerender();
					update();
				});
			}
		}
	};

	var swapArrows = function(index1, index2) {
		// swap ids and sort array by ids
		// result -> swaped elements :)

		var tempId = array[index1].id;

		array[index1].setId(array[index2].id);
		array[index2].setId(tempId);

		array.sort(function(a, b) {
			return a.id - b.id;
		});
	}

	var setPossibleMoves = function() {
		for (var i = 0; i < arraySize; i++) {
			if ( array[i].type == 'L' ) {
				if (i-1 >= 0 && array[i-1].type == 'E') {
					array[i].setPossibleMove(-1);
				} else if (i-2 >= 0 && array[i-2].type == 'E') {
					array[i].setPossibleMove(-2);
				} else {
					array[i].setPossibleMove(0);
				}
			} else if ( array[i].type == 'R' ) {
				if (i+1 < arraySize && array[i+1].type == 'E') {
					array[i].setPossibleMove(1);
				} else if (i+2 < arraySize && array[i+2].type == 'E') {
					array[i].setPossibleMove(2);
				} else {
					array[i].setPossibleMove(0);
				}
			} else {
				array[i].setPossibleMove(0);
			}
		}
	};

	var rerender = function() {
		for (var i = 0; i < arraySize; i++) {
			array[i].element.appendTo($('#container'));
		}
	};


	var undo = function() {
		if (steps.length > 0) {

			var step = steps[steps.length-1];

			swapArrows(step.from, step.to);
			rerender();
			update();

			steps.splice(steps.length-1, 1);
		}
	}

	var generatePattern = function() {

		$('#pattern').empty();

		var arrowTypes = {
			L : $('<div>', {class: "<", text: '<'}),
			R : $('<div>', {class: ">", text: '>'})
		};

		var arrowMoves = {
			M : $('<div>', {class: "m", text: 'm'}),
			J : $('<div>', {class: "j", text: 'j'})
		};

		var swapArrowType = function() {
			currentArrowType == "L" ? currentArrowType = "R" : currentArrowType = "L";
		};

		var currentArrowMove = "M";
		var currentArrowType = "L";

		for (var iteration = 0, repetition = 0; repetition < arrowsNumber;) {

			if (iteration == 0) {
				currentArrowMove = "M";
			} else {
				currentArrowMove = "J";
			}

			if (iteration == 1) {
				swapArrowType();
			}

			$('<div>', {class: 'step'})
				.append( arrowMoves[currentArrowMove].clone() )
				.append( arrowTypes[currentArrowType].clone() )
				.appendTo( $('#pattern') );

			if (iteration > repetition) {
				iteration = 0;
				repetition++;
			} else {
				iteration++;
			}
		}

		for (var iteration = 0, repetition = 0; repetition < arrowsNumber;) {

			if (iteration == 0) {
				currentArrowMove = "M";
				swapArrowType();
			} else {
				currentArrowMove = "J";
			}

			$('<div>', {class: 'step'})
				.append( arrowMoves[currentArrowMove].clone() )
				.append( arrowTypes[currentArrowType].clone() )
				.appendTo( $('#pattern') );

			if (iteration > arrowsNumber - repetition - 2) {
				iteration = 0;
				repetition++;
			} else {
				iteration++;
			}
		}
	}


	$('#arrows-number').change( function() {
		initialize( parseInt( $(this).val() ) );
	});

	$('#reset').click(function() {
		initialize( parseInt( $('#arrows-number').val() ) );
	});

	$('#undo').click( undo );

	$('#show-pattern').click(function() {
		$('#pattern').toggleClass('visible');
	});

	initialize( parseInt( $('#arrows-number').val() ) );






});