var selectedpiece;
var selected;
var selected_attack;
var possiblemoves;
var possible_attacks;
var possible_castle;
var check_path;

selected = new Array();
selected_attack = new Array();
selected_castle = new Array();
possiblemoves = new Array();
possible_attacks = new Array();
possible_castle = new Array();
check_path = new Array();


$(document).ready(function() {
	if(in_check == true){
		get_check_path(cur_color, piece_checking);
	}
	
	//refresh window
	var interval = setTimeout ( "window.location.href = window.location.href", 12000 );
	
	var pusher = new Pusher('d05f0eeb1099d3be9cba');
	var channel = pusher.subscribe('chess_channel');
	channel.bind('click',
	  function(data) {
		clearInterval(interval)
		activate_square(data['data']);
	  }
	);
	channel.bind('move',
	  function(data) {
		console.log(data);
		square = data['data'].split("|");
		from_square = square[0];
		to_square = square [1];
		
		thepiece = $("#"+from_square).html();
		
		if($("#"+from_square).html() !== "&nbsp;"){
			$("#"+from_square).html("&nbsp;");
			$("#"+to_square).html(thepiece);
			clear_selected();
		}
		
		window.location.href = window.location.href;
	  }
	);
});
function query_draw(){
	var r = confirm("Draw?");
	if (r == true){
		$.post("/games/new", {  
			complete: "true"
		},
		function(data){
			window.location.href=window.location.href;
		});
	}
}
function add_position_opposite(thecolumn, therow){
	if(in_check == true){
		check_id = piece_checking;
		checkpiece = check_id.split("");
		checktype = checkpiece[0];
		if(checktype == "K"){
			if(is_on_board(thecolumn, therow)){
				if(is_empty(thecolumn, therow)){
					possiblemoves.push(thecolumn + therow);
				}else{
					if(is_current_color(thecolumn, therow)){
						possible_attacks.push(thecolumn + therow);
					}
				}
			}
		}
		if(thecolumn+therow in oc(check_path) ){
			if(is_on_board(thecolumn, therow)){
				if(is_empty(thecolumn, therow)){
					possiblemoves.push(thecolumn + therow);
				}else{
					
					if(is_current_color(thecolumn, therow) && type != 'p'){
						if(checktype != 'K'){
							possible_attacks.push(thecolumn + therow);
						}else{
							if(!is_square_attacked(therow, thecolumn, color)){
								possible_attacks.push(thecolumn + therow);
							}
						}
					}else{
						return false;
					}
					return false;
				}
			}
		}	
	}else{
		if(is_on_board(thecolumn, therow)){
			if(is_empty(thecolumn, therow)){
				possiblemoves.push(thecolumn + therow);
			}else{
				if(is_current_color(thecolumn, therow) && type != 'p'){
					possible_attacks.push(thecolumn + therow);
				}else{
					return false;
				}
				return false;
			}
		}
	}	
}
function add_position(thecolumn, therow){
	if(in_check == true){
		console.log('check_path:' +check_path)
		check_id = $("#"+piece_checking).children().first().attr('id');;
		checkpiece = check_id.split("");
		checktype = checkpiece[0];
		if(type == "K"){
			if(is_on_board(thecolumn, therow)){
				if(is_empty(thecolumn, therow)){
					possiblemoves.push(thecolumn + therow);
				}else{
					if(is_opposite_color(thecolumn, therow)){
						possible_attacks.push(thecolumn + therow);
					}
				}
			}
		}
		if(thecolumn+therow in oc(check_path) ){
			if(is_on_board(thecolumn, therow)){
				if(is_empty(thecolumn, therow)){
					possiblemoves.push(thecolumn + therow);
				}else{
					if(is_opposite_color(thecolumn, therow) && type != 'p'){
						if(checktype != 'K'){
							possible_attacks.push(thecolumn + therow);
						}else{
							if(!is_square_attacked(therow, thecolumn, opposite_color)){
								possible_attacks.push(thecolumn + therow);
							}
						}
					}else{
						return false;
					}
					return false;
				}
			}
		}	
	}else{
		if(is_on_board(thecolumn, therow)){
			if(is_empty(thecolumn, therow)){
				possiblemoves.push(thecolumn + therow);
			}else{
				if(is_opposite_color(thecolumn, therow) && type != 'p'){
					if(type != 'K'){
						possible_attacks.push(thecolumn + therow);
					}else{
						if(!is_square_attacked(therow, thecolumn, opposite_color)){
							possible_attacks.push(thecolumn + therow);
						}
					}
				}else{
					return false;
				}
				return false;
			}
		}
	}
	
}
function is_on_board(thecolumn, therow){
	if(thecolumn.charCodeAt(0) > 96 && thecolumn.charCodeAt(0) < 105 && therow > 0 && therow < 9 ){
		return true;
	}else{
		return false;
	}
}
function is_current_color(thecolumn, therow){
	if($("#" + thecolumn + therow).children().attr("data-color") == cur_color){
		return true;
	}else{
		return false;
	}
}
function is_opposite_color(thecolumn, therow){
	if($("#" + thecolumn + therow).children().attr("data-color") == opposite_color){
		return true;
	}else{
		return false;
	}
}
function is_empty(thecolumn, therow){
	if($("#" + thecolumn + therow).html() == "&nbsp;"){
		return true;
	}else{
		return false;
	}
}
function horizontal_check(thecolumn, therow, hozcolor){
	if($('#'+thecolumn+therow).children().hasClass(hozcolor+'_rook') || $('#'+thecolumn+therow).children().hasClass(hozcolor+'_queen')){
		return true;
	}else{
		return false;
	}
}
function diagonal_check(thecolumn, therow, diacolor){
	if($('#'+thecolumn+therow).children().hasClass(diacolor+'_bishop') || $('#'+thecolumn+therow).children().hasClass(diacolor+'_queen')){
		return true;
	}else{
		return false;
	}
}
function clear_selected(){
	$.each(selected, function(index, value) {
		$("#" + value).removeClass("available");
	});
	$.each(selected_attack, function(index, value) {
		$("#" + value).removeClass("available_attack");
	});
	$.each(selected_castle, function(index, value) {
		$("#" + value).removeClass("available_castle");
	});
}
function reset_arrays(){
	possiblemoves = new Array();
	possible_attacks = new Array();
	possible_castle = new Array();
}
function get_check_path(king_color, checking_piece){
	cking_id = $('.' + king_color + '_king').attr('id');
	ckingpiece = cking_id.split("");
	ckingcolumn = ckingpiece[1];
	ckingrow = ckingpiece[2];
	check_id = $("#"+checking_piece).children().first().attr('id');
	if(!check_id){
		check_id = checking_piece;
	}
	console.log('checking_id:'+check_id)
	console.log('checking_piece:'+checking_piece)
	checkpiece = check_id.split("");
	checktype = checkpiece[0];
	checkcolumn = checkpiece[1];
	checkrow = checkpiece[2];

	check_path.push(checkcolumn + checkrow)
	
	if(checktype != 'N'){
		//from king to checking piece
		for(i = 1; i <= 8; i++){
			if(ckingcolumn.charCodeAt(0) < checkcolumn.charCodeAt(0)){
				pathcolumn = String.fromCharCode(ckingcolumn.charCodeAt(0) + i);
			}else if(ckingcolumn.charCodeAt(0) > checkcolumn.charCodeAt(0)){
				pathcolumn = String.fromCharCode(ckingcolumn.charCodeAt(0) - i);
			}else{
				pathcolumn = ckingcolumn;
			}
			if(ckingrow < checkrow){
				pathrow = parseInt(ckingrow) + i;
			}else if(ckingrow > checkrow){
				pathrow = parseInt(ckingrow) - i;
			}else{
				pathrow = ckingrow;
			}
			if(is_on_board(pathcolumn, pathrow)){
				if(is_empty(pathcolumn, pathrow)){
					check_path.push(pathcolumn + pathrow);
				}else{
					return;
				}
			}else{
				return;
			}
			
			//alert(check_path);
		}
	}
}
function check_checked(checkedcolor){
	king_id = $('.' + checkedcolor + '_king').attr('id');
	kingpiece = king_id.split("");
	kingcolumn = kingpiece[1];
	kingrow = kingpiece[2];
	
	if(checkedcolor == 'w'){
		oppcheckedcolor = 'b';
	}else{
		oppcheckedcolor = 'w';
	}
	
	return is_square_attacked(kingrow, kingcolumn, oppcheckedcolor);
}
function check_mate(piece_checking){
	king_id = $('.' + opposite_color + '_king').attr('id');
	kingpiece = king_id.split("");
	type = kingpiece[0];
	kingcolumn = kingpiece[1];
	kingrow = kingpiece[2];
	possiblemoves = new Array();
	reset_arrays();
	get_possible_moves(kingrow, kingcolumn, type, opposite_color);
	
	if(possiblemoves.length < 1 && possible_attacks.length < 1){
		reset_arrays();
		checkpiece = piece_checking.split("");
		checktype = piece[0];
		checkcolumn = piece[1];
		checkrow = piece[2];
		console.log(piece_checking);
		get_check_path(opposite_color, piece_checking);
		check_path.push(checkcolumn + checkrow);
		
		var checkmate = $.each(possiblemoves, function(index, value) {
			piece = value.split("");
			possiblecolumn = piece[0];
			possiblerow = piece[1];
			console.log('is_square_attacked:'+is_square_attacked(possiblerow, possiblecolumn, opposite_color))
			if(is_square_attacked(possiblerow, possiblecolumn, opposite_color) != false){
				return false;
			}
		});
		if(!checkmate){
			return false;
		}else{
			return true;	
		}
	}else{
		return false;
	}
}

function is_square_attacked(row, column, bycolor){

	//horizontals and verticals
	
	for (i = 1; i <= 8; i++){
		thisherecolumn = String.fromCharCode(column.charCodeAt(0));
		thishererowrow = parseInt(row) + i;
		boardcheck = is_on_board(thisherecolumn, thishererowrow);
		if(boardcheck === true){
			if(!is_empty(thisherecolumn, thishererowrow)){
				if(horizontal_check(thisherecolumn, thishererowrow, bycolor) || ($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_king') && i==1)){
					return $("#" + thisherecolumn + thishererowrow).children().attr("id");
				}else{
					break;
				}
			}
		}else{
			break;
		}
	}

	for (i = 1; i <= 8; i++){	
		thishererowrow = parseInt(row) - i;
		boardcheck = is_on_board(thisherecolumn, thishererowrow);
		if(boardcheck === true){
			if(!is_empty(thisherecolumn, thishererowrow)){
				if(horizontal_check(thisherecolumn, thishererowrow, bycolor) || ($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_king') && i==1)){
					return $("#" + thisherecolumn + thishererowrow).children().attr("id");
				}else{
					break;
				}
			}
		}else{
			break;
		}
	}

	for (i = 1; i <= 8; i++){	
		thisherecolumn =  String.fromCharCode(column.charCodeAt(0) - i);
		thishererowrow = row;
		boardcheck = is_on_board(thisherecolumn, thishererowrow);
		if(boardcheck === true){
			if(!is_empty(thisherecolumn, thishererowrow)){
				if(horizontal_check(thisherecolumn, thishererowrow, bycolor) || ($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_king') && i==1)){
					return $("#" + thisherecolumn + thishererowrow).children().attr("id");
				}else{
					break;
				}
			}
		}else{
			break;
		}
	}

	for (i = 1; i <= 8; i++){	
		thisherecolumn =  String.fromCharCode(column.charCodeAt(0) + i);
		thishererowrow = row;
		boardcheck = is_on_board(thisherecolumn, thishererowrow);
		if(boardcheck === true){
			if(!is_empty(thisherecolumn, thishererowrow)){
				if(horizontal_check(thisherecolumn, thishererowrow, bycolor) || ($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_king') && i==1)){
					return $("#" + thisherecolumn + thishererowrow).children().attr("id");
				}else{
					break;
				}
			}
		}else{
			break;
		}
	}

	for (i = 1; i <= 8; i++){
		//up and right
		thisherecolumn = String.fromCharCode(column.charCodeAt(0) + i);
		thishererowrow = parseInt(row) + i;
		boardcheck = is_on_board(thisherecolumn, thishererowrow);
		if(boardcheck === true){
			if(!is_empty(thisherecolumn, thishererowrow)){
				if(diagonal_check(thisherecolumn, thishererowrow, bycolor) || ($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_king') && i==1)){
					return $("#" + thisherecolumn + thishererowrow).children().attr("id");
				}else if(bycolor == 'b' && ($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_pawn') && i==1)){
					return $("#" + thisherecolumn + thishererowrow).children().attr("id");
				}else{
					break;
				}
			}
		}else{
			break;
		}
	}

	for (i = 1; i <= 8; i++){
		//down and right
		thisherecolumn = String.fromCharCode(column.charCodeAt(0) + i);
		thishererowrow = parseInt(row) - i;		
		boardcheck = is_on_board(thisherecolumn, thishererowrow);
		if(boardcheck === true){
			if(!is_empty(thisherecolumn, thishererowrow)){
				if(diagonal_check(thisherecolumn, thishererowrow, bycolor) || ($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_king') && i==1)){
					return $("#" + thisherecolumn + thishererowrow).children().attr("id");
				}else if(bycolor == 'w' && ($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_pawn') && i==1)){
					return $("#" + thisherecolumn + thishererowrow).children().attr("id");
				}else{
					break;
				}
			}
		}else{
			break;
		}
	}

	for (i = 1; i <= 8; i++){
		//up and left
		thisherecolumn = String.fromCharCode(column.charCodeAt(0) - i);
		thishererowrow = parseInt(row) + i;
		boardcheck = is_on_board(thisherecolumn, thishererowrow);
		if(boardcheck === true){
			if(!is_empty(thisherecolumn, thishererowrow)){
				if(diagonal_check(thisherecolumn, thishererowrow, bycolor) || ($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_king') && i==1)){
					return $("#" + thisherecolumn + thishererowrow).children().attr("id");
				}else if(bycolor == 'b' && ($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_pawn') && i==1)){
					return $("#" + thisherecolumn + thishererowrow).children().attr("id");
				}else{
					break;
				}
			}
		}else{
			break;
		}
	}	

	for (i = 1; i <= 8; i++){
		//down and left
		thisherecolumn = String.fromCharCode(column.charCodeAt(0) - i);
		thishererowrow = parseInt(row) - i;
		boardcheck = is_on_board(thisherecolumn, thishererowrow);
		if(boardcheck === true){
			if(!is_empty(thisherecolumn, thishererowrow)){
				if(diagonal_check(thisherecolumn, thishererowrow, bycolor) || ($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_king') && i==1)){
					return $("#" + thisherecolumn + thishererowrow).children().attr("id");
				}else if(bycolor == 'w' && ($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_pawn') && i==1)){
					return $("#" + thisherecolumn + thishererowrow).children().attr("id");
				}else{
					break;
				}
			}
		}else{
			break;
		}
	}

	thisherecolumn = String.fromCharCode(column.charCodeAt(0) - 1);
	thishererowrow = parseInt(row) + 2;

	boardcheck = is_on_board(thisherecolumn, thishererowrow);
	if(boardcheck === true){
		if(!is_empty(thisherecolumn, thishererowrow)){
			if($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_knight')){
				return $("#" + thisherecolumn + thishererowrow).children().attr("id");
			}
		}
	}

	thishererowrow = parseInt(row) - 2;

	boardcheck = is_on_board(thisherecolumn, thishererowrow);
	if(boardcheck === true){
		if(!is_empty(thisherecolumn, thishererowrow)){
			if($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_knight')){
				return $("#" + thisherecolumn + thishererowrow).children().attr("id");
			}
		}
	}

	thisherecolumn = String.fromCharCode(column.charCodeAt(0) + 1);
	thishererowrow = parseInt(row) + 2;

	boardcheck = is_on_board(thisherecolumn, thishererowrow);
	if(boardcheck === true){
		if(!is_empty(thisherecolumn, thishererowrow)){
			if($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_knight')){
				return $("#" + thisherecolumn + thishererowrow).children().attr("id");
			}
		}
	}

	thishererowrow = parseInt(row) - 2;

	boardcheck = is_on_board(thisherecolumn, thishererowrow);
	if(boardcheck === true){
		if(!is_empty(thisherecolumn, thishererowrow)){
			if($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_knight')){
				return $("#" + thisherecolumn + thishererowrow).children().attr("id");
			}
		}
	}

	thisherecolumn = String.fromCharCode(column.charCodeAt(0) - 2);
	thishererowrow = parseInt(row) + 1;

	boardcheck = is_on_board(thisherecolumn, thishererowrow);
	if(boardcheck === true){
		if(!is_empty(thisherecolumn, thishererowrow)){
			if($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_knight')){
				return $("#" + thisherecolumn + thishererowrow).children().attr("id");
			}
		}
	}

	thishererowrow = parseInt(row) - 1;

	boardcheck = is_on_board(thisherecolumn, thishererowrow);
	if(boardcheck === true){
		if(!is_empty(thisherecolumn, thishererowrow)){
			if($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_knight')){
				return $("#" + thisherecolumn + thishererowrow).children().attr("id");
			}
		}
	}

	thisherecolumn = String.fromCharCode(column.charCodeAt(0) + 2);
	thishererowrow = parseInt(row) + 1;

	boardcheck = is_on_board(thisherecolumn, thishererowrow);
	if(boardcheck === true){
		if(!is_empty(thisherecolumn, thishererowrow)){
			if($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_knight')){
				return $("#" + thisherecolumn + thishererowrow).children().attr("id");
			}
		}
	}

	thishererowrow = parseInt(row) - 1;

	boardcheck = is_on_board(thisherecolumn, thishererowrow);
	if(boardcheck === true){
		if(!is_empty(thisherecolumn, thishererowrow)){
			if($('#'+thisherecolumn+thishererowrow).children().hasClass(bycolor+'_knight')){
				return $("#" + thisherecolumn + thishererowrow).children().attr("id");
			}
		}
	}

	return false;
}
function get_possible_moves(row, column, type, color){
	
	if(type == 'p'){

		if(color == 'w'){
			thecolumn = column;
			therow = (parseInt(row) + 1);
			
			add_position(column, (parseInt(row) + 1));
			if(row == 2 && is_empty(thecolumn, therow)){
				add_position(column, (parseInt(row) + 2));
			}
			
			thecolumn =  String.fromCharCode(column.charCodeAt(0) - 1);
			therow = parseInt(row) + 1;
			if(is_on_board(thecolumn, therow) && is_opposite_color(thecolumn, therow)){
				if(in_check == 'true'){
					if((thecolumn+therow) in oc(check_path)){
						possible_attacks.push(thecolumn + therow);
					}
				}else{
					possible_attacks.push(thecolumn + therow);
				}
				
			}
			
			thecolumn =  String.fromCharCode(column.charCodeAt(0) + 1);
			if(is_on_board(thecolumn, therow) && is_opposite_color(thecolumn, therow)){
				if(in_check == 'true'){
					if((thecolumn+therow) in oc(check_path)){
						possible_attacks.push(thecolumn + therow);
					}
				}else{
					possible_attacks.push(thecolumn + therow);
				}
				
			}
		}
		if(color == 'b'){
			thecolumn = column;
			therow = (parseInt(row) - 1);
			
			add_position(column, (parseInt(row) - 1));
			
			if(row == 7 && is_empty(thecolumn, therow)){
				add_position(column, (parseInt(row) - 2));
			}
			
			thecolumn =  String.fromCharCode(column.charCodeAt(0) - 1);
			therow = parseInt(row) - 1;
			if(is_on_board(thecolumn, therow) && is_opposite_color(thecolumn, therow)){
				if(in_check == 'true'){
					if((thecolumn+therow) in oc(check_path)){
						possible_attacks.push(thecolumn + therow);
					}
				}else{
					possible_attacks.push(thecolumn + therow);
				}
				
			}
			thecolumn =  String.fromCharCode(column.charCodeAt(0) + 1);
			if(is_on_board(thecolumn, therow) && is_opposite_color(thecolumn, therow)){
				if(in_check == 'true'){
					if((thecolumn+therow) in oc(check_path)){
						possible_attacks.push(thecolumn + therow);
					}
				}else{
					possible_attacks.push(thecolumn + therow);
				}
				
			}
		}
	}
	
	if(type == 'B'){
		
		for (i = 1; i <= 8; i++){
			thecolumn = String.fromCharCode(column.charCodeAt(0) + i);
			therow = parseInt(row) + i;
			check = add_position(thecolumn, therow);
			if(check===false){
				break;
			}
		}
		
		for (i = 1; i <= 8; i++){
			thecolumn = String.fromCharCode(column.charCodeAt(0) + i);
			therow = parseInt(row) - i;		
			check = add_position(thecolumn, therow);
			if(check===false){
				break;
			}
		}
		
		for (i = 1; i <= 8; i++){
			thecolumn = String.fromCharCode(column.charCodeAt(0) - i);
			therow = parseInt(row) + i;
			check = add_position(thecolumn, therow);
			if(check===false){
				break;
			}
		}	
		
		for (i = 1; i <= 8; i++){
			thecolumn = String.fromCharCode(column.charCodeAt(0) - i);
			therow = parseInt(row) - i;
			check = add_position(thecolumn, therow);
			if(check===false){
				break;
			}
		}
		
	}
	
	if(type == 'N'){
		
		thecolumn = String.fromCharCode(column.charCodeAt(0) - 1);
		therow = parseInt(row) + 2;
		
		add_position(thecolumn, therow);
		
		therow = parseInt(row) - 2;
		
		add_position(thecolumn, therow);
		
		thecolumn = String.fromCharCode(column.charCodeAt(0) + 1);
		therow = parseInt(row) + 2;
		
		add_position(thecolumn, therow);
		
		therow = parseInt(row) - 2;
		
		add_position(thecolumn, therow);
		
		thecolumn = String.fromCharCode(column.charCodeAt(0) - 2);
		therow = parseInt(row) + 1;
		
		add_position(thecolumn, therow);
		
		therow = parseInt(row) - 1;
		
		add_position(thecolumn, therow);
		
		thecolumn = String.fromCharCode(column.charCodeAt(0) + 2);
		therow = parseInt(row) + 1;
		
		add_position(thecolumn, therow);
		
		therow = parseInt(row) - 1;
		
		add_position(thecolumn, therow);
			
	}
	
	if(type == 'R'){
		
		for (i = 1; i <= 8; i++){
			thecolumn = String.fromCharCode(column.charCodeAt(0));
			therow = parseInt(row) + i;
			check = add_position(thecolumn, therow);
			if(check==false){
				break;
			}
		}
		
		for (i = 1; i <= 8; i++){	
			therow = parseInt(row) - i;
			check = add_position(thecolumn, therow);
			if(check==false){
				break;
			}
		}
		
		for (i = 1; i <= 8; i++){	
			thecolumn =  String.fromCharCode(column.charCodeAt(0) - i);
			therow = row;
			check = add_position(thecolumn, therow);
			if(check==false){
				break;
			}
		}
		
		for (i = 1; i <= 8; i++){	
			thecolumn =  String.fromCharCode(column.charCodeAt(0) + i);
			therow = row;
			check = add_position(thecolumn, therow);
			if(check==false){
				break;
			}
		}		
	}
	
	if(type == 'Q'){
		
		for (i = 1; i <= 8; i++){
			thecolumn = String.fromCharCode(column.charCodeAt(0) + i);
			therow = parseInt(row) + i;
			check = add_position(thecolumn, therow);
			if(check==false){
				break;
			}
		}

		for (i = 1; i <= 8; i++){
			thecolumn = String.fromCharCode(column.charCodeAt(0) + i);
			therow = parseInt(row) - i;		
			check = add_position(thecolumn, therow);
			if(check==false){
				break;
			}
		}

		for (i = 1; i <= 8; i++){
			thecolumn = String.fromCharCode(column.charCodeAt(0) - i);
			therow = parseInt(row) + i;
			check = add_position(thecolumn, therow);
			if(check==false){
				break;
			}
		}	

		for (i = 1; i <= 8; i++){
			thecolumn = String.fromCharCode(column.charCodeAt(0) - i);
			therow = parseInt(row) - i;
			check = add_position(thecolumn, therow);
			if(check==false){
				break;
			}
		}
		for (i = 1; i <= 8; i++){
			thecolumn = String.fromCharCode(column.charCodeAt(0));
			therow = parseInt(row) + i;
			check = add_position(thecolumn, therow);
			if(check==false){
				break;
			}
		}
		
		for (i = 1; i <= 8; i++){	
			therow = parseInt(row) - i;
			check = add_position(thecolumn, therow);
			if(check==false){
				break;
			}
		}
		
		for (i = 1; i <= 8; i++){	
			thecolumn =  String.fromCharCode(column.charCodeAt(0) - i);
			therow = row;
			check = add_position(thecolumn, therow);
			if(check==false){
				break;
			}
		}
		
		for (i = 1; i <= 8; i++){	
			thecolumn =  String.fromCharCode(column.charCodeAt(0) + i);
			therow = row;
			check = add_position(thecolumn, therow);
			if(check==false){
				break;
			}
		}	
	}
	
	if(type == 'K'){
		
		if(color == 'w'){
			theoppositecolor = 'b';
		}else{
			theoppositecolor = 'w';
		}
		
		console.log('color: '+color + ", cur_color: "+cur_color)
		
		thecolumn = String.fromCharCode(column.charCodeAt(0));
		therow = parseInt(row) + 1;
		
		if(!is_square_attacked(therow, thecolumn, theoppositecolor)){
			console.log("square attacked:"+is_square_attacked(therow, thecolumn, theoppositecolor)+"for "+thecolumn+therow)
			if(color == cur_color){
				add_position(thecolumn, therow);
			}else{
				add_position_opposite(thecolumn, therow);
			}
		}
		
		therow = parseInt(row) - 1;
		if(!is_square_attacked(therow, thecolumn, theoppositecolor)){
			console.log("square attacked:"+is_square_attacked(therow, thecolumn, theoppositecolor)+"for "+thecolumn+therow)
			if(color == cur_color){
				add_position(thecolumn, therow);
			}else{
				add_position_opposite(thecolumn, therow);
			}
		}
		
		thecolumn =  String.fromCharCode(column.charCodeAt(0) - 1);
		therow = row;
				
		if(!is_square_attacked(therow, thecolumn, theoppositecolor)){
			console.log("square attacked:"+is_square_attacked(therow, thecolumn, theoppositecolor)+"for "+thecolumn+therow)
			if(color == cur_color){
				add_position(thecolumn, therow);
			}else{
				add_position_opposite(thecolumn, therow);
			}
		}
		
		thecolumn =  String.fromCharCode(column.charCodeAt(0) + 1);
		therow = row;
		
		
		if(!is_square_attacked(therow, thecolumn, theoppositecolor)){
			console.log("square attacked:"+is_square_attacked(therow, thecolumn, theoppositecolor)+"for "+thecolumn+therow)
			if(color == cur_color){
				add_position(thecolumn, therow);
			}else{
				add_position_opposite(thecolumn, therow);
			}
		}
		
		thecolumn = String.fromCharCode(column.charCodeAt(0) + 1);
		therow = parseInt(row) + 1;
		
		
		if(!is_square_attacked(therow, thecolumn, theoppositecolor)){
			console.log("square attacked:"+is_square_attacked(therow, thecolumn, theoppositecolor)+"for "+thecolumn+therow)
			if(color == cur_color){
				add_position(thecolumn, therow);
			}else{
				add_position_opposite(thecolumn, therow);
			}
		}

		therow = parseInt(row) - 1;
		
		if(!is_square_attacked(therow, thecolumn, theoppositecolor)){
			console.log("square attacked:"+is_square_attacked(therow, thecolumn, theoppositecolor)+"for "+thecolumn+therow)
			if(color == cur_color){
				add_position(thecolumn, therow);
			}else{
				add_position_opposite(thecolumn, therow);
			}
		}
		
		thecolumn = String.fromCharCode(column.charCodeAt(0) - 1);
		therow = parseInt(row) + 1;
		
		if(!is_square_attacked(therow, thecolumn, theoppositecolor)){
			console.log("square attacked:"+is_square_attacked(therow, thecolumn, theoppositecolor)+"for "+thecolumn+therow)
			if(color == cur_color){
				add_position(thecolumn, therow);
			}else{
				add_position_opposite(thecolumn, therow);
			}
		}
		
		therow = parseInt(row) - 1;
				
		if(!is_square_attacked(therow, thecolumn, theoppositecolor)){
			console.log("square attacked:"+is_square_attacked(therow, thecolumn, theoppositecolor)+"for "+thecolumn+therow)
			if(color == cur_color){
				add_position(thecolumn, therow);
			}else{
				add_position_opposite(thecolumn, therow);
			}
		}
		
		//castling
		left1 = String.fromCharCode(column.charCodeAt(0) - 1);
		left2 = String.fromCharCode(column.charCodeAt(0) - 2);
		left3 = String.fromCharCode(column.charCodeAt(0) - 3);
		left4 = String.fromCharCode(column.charCodeAt(0) - 4);
		right1 = String.fromCharCode(column.charCodeAt(0) + 1);
		right2 = String.fromCharCode(column.charCodeAt(0) + 2);
		right3 = String.fromCharCode(column.charCodeAt(0) + 3);
		
		if(color == 'w'){
			if(row == 1 && column == 'e' && $("#" + left1 + row).html() == "&nbsp;" && $("#" + left2 + row).html() == "&nbsp;" && $("#" + left3 + row).html() == "&nbsp;" && $("#" + left4 + row).children().hasClass(color+'_rook')){
				possible_castle.push(left2 + row);
			}
			if(row == 1 && column == 'e' && $("#" + right1 + row).html() == "&nbsp;" && $("#" + right2 + row).html() == "&nbsp;" && $("#" + right3 + row).children().hasClass(color+'_rook')){
				possible_castle.push(right2 + row);
			}
		}
		if(color == 'b'){
			if(row == 8 && column == 'e' && $("#" + left1 + row).html() == "&nbsp;" && $("#" + left2 + row).html() == "&nbsp;" && $("#" + left3 + row).html() == "&nbsp;" && $("#" + left4 + row).children().hasClass(color+'_rook')){
				possible_castle.push(left2 + row);
			}
			if(row == 8 && column == 'e' && $("#" + right1 + row).html() == "&nbsp;" && $("#" + right2 + row).html() == "&nbsp;" && $("#" + right3 + row).children().hasClass(color+'_rook')){
				possible_castle.push(right2 + row);
			}
		}
		
	}
}
function oc(a)
{
  var o = {};
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
}