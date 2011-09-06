$(function() {
	
	//select available squares
	$(".piece").click(function() {
		
		//activate_square($(this).attr("id"))
		
		trigger('click', $(this).attr("id"));
		
	});
	
	$(".box").click(function() {
		
		if($(this).hasClass("available_castle")){
			
			thisid = $(this).attr('id');
			thisstuff = thisid.split("");
			thiscolumn = thisstuff[0];
			thisrow = thisstuff[1];
			pieceid = $("#" + selectedpiece).attr("id");
			color = $("#" + selectedpiece).attr("data-color");
			bc = $("#" + selectedpiece).attr("data-bc");
			piece = pieceid.split("");
			type = piece[0];
			column = piece[1];
			row = piece[2];

			longtype = 'king';
			
			if(thiscolumn == 'g'){
				rookcolumn = 'h';
				newrookcolumn = 'f'
			}else{
				rookcolumn = 'a';
				newrookcolumn = 'd'
			}
			
			if(current_color == 'white'){
				next_move = 'black';
			}else{
				next_move = 'white';
			}
			
			j=0;
			for(i=8; i >= 0; i--){
				if(thisrow == i){
					thisarrayrow = j;
				}
				if(row == i){
					arrayrow = j;
				}
				j++;
			}
			
			//first check if move puts king in check
			self_check = check_checked(current_color);
			if(self_check){
				alert("This moves puts you in check and is not allowed. Reseting board.");
				window.location.href=window.location.href;
				return;
			}
			
			//ajax check and submit
			board[''+arrayrow+''][''+column+row+''] = "blank_e_e";
			board[''+thisarrayrow+''][''+thiscolumn+thisrow+''] = longtype+'_'+color+'_'+bc;
			board[''+arrayrow+''][''+rookcolumn+row+''] = "blank_e_e";
			board[''+arrayrow+''][''+newrookcolumn+row+''] = "rook_"+color+"_false";
			
			post_move(cur_color, column+row, thiscolumn+thisrow, type, board, game_id);
			
			thepiece = $("#"+column+row).html();

			$("#"+column+row).html("&nbsp;");
			$(this).html(thepiece);
			
			therook = $("#"+rookcolumn+row).html();

			$("#"+rookcolumn+row).html("&nbsp;");
			$("#"+newrookcolumn+row).html(therook);
			
			$("#" + selectedpiece).attr('id',type+thisid);
			
			clear_selected();
			
			
		}
		
		if($(this).hasClass("available")){
			
			thisid = $(this).attr('id');
			thisstuff = thisid.split("");
			thiscolumn = thisstuff[0];
			thisrow = thisstuff[1];
			pieceid = $("#" + selectedpiece).attr("id");
			color = $("#" + selectedpiece).attr("data-color");
			bc = $("#" + selectedpiece).attr("data-bc");
			piece = pieceid.split("");
			type = piece[0];
			column = piece[1];
			row = piece[2];
			
			if(type == 'p'){
				longtype = 'pawn';
				if(color == 'b'){
					if(parseInt(thisrow) == 1){
						longtype = 'queen';
						$('p'+column+row).removeClass('b_pawn').addClass('b_queen');
						type = 'Q';
					}
				}else{
					if(parseInt(thisrow) == 8){
						longtype = 'queen';
						$('p'+column+row).removeClass('w_pawn').addClass('w_queen');
						type = 'Q';
					}
				}
			}else if(type == 'R'){
				longtype = 'rook';
			}else if(type == 'B'){
				longtype = 'bishop';
			}else if(type == 'N'){
				longtype = 'knight';
			}else if(type == 'K'){
				longtype = 'king';
			}else if(type == 'Q'){
				longtype = 'queen';
			}
			
			if(current_color == 'white'){
				next_move = 'black';
			}else{
				next_move = 'white';
			}
			
			j=0;
			for(i=8; i >= 0; i--){
				if(thisrow == i){
					thisarrayrow = j;
				}
				if(row == i){
					arrayrow = j;
				}
				j++;
			}
			board[''+arrayrow+''][''+column+row+''] = "blank_e_e";
			board[''+thisarrayrow+''][''+thiscolumn+thisrow+''] = longtype+'_'+color+'_'+bc;
			
			thepiece = $("#"+column+row).html();
			
			$("#"+column+row).html("&nbsp;");
			$(this).html(thepiece);
			
			$("#" + selectedpiece).attr('id',type+thisid);
			
			clear_selected();
			
			//first check if move puts king in check
			self_check = check_checked(cur_color);
			if(self_check){
				alert("This moves puts you in check and is not allowed. Reseting board.");
				window.location.href=window.location.href;
				return;
			}

			//ajax check and submit
			piece_checking = check_checked(opposite_color);

			if(piece_checking){
				markincheck = 1;
				mate = check_mate(piece_checking);
				if(mate){
					post_move(cur_color, column+row, thiscolumn+thisrow, type, board, game_id, false, false, true);
				}else{
					post_move(cur_color, column+row, thiscolumn+thisrow, type, board, game_id, false, true);
				}
			}else{
				post_move(cur_color, column+row, thiscolumn+thisrow, type, board, game_id);
			}			
		}
		if($(this).hasClass("available_attack")){
			
			thisid = $(this).attr('id');
			move_attack(selectedpiece, thisid);
			
		}
	});	
});
function activate_square(chesspiece){
	piece = chesspiece.split("");
	
	type = piece[0];
	column = piece[1];
	row = piece[2];
	color = $('#'+chesspiece).attr("data-color");

	if(color == opposite_color){
		if($(chesspiece).parent().hasClass("available_attack")){
			move_attack(selectedpiece, $('#'+chesspiece).parent().attr("id"), chesspiece);
		}
		return false;
	}
	
	selectedpiece = chesspiece;
	
	clear_selected();
	reset_arrays();
	get_possible_moves(row, column, type, color);
	
	console.log(possiblemoves);
	
	selected = new Array();
	selected_attack = new Array();
	selected_castle = new Array();
	
	$.each(possiblemoves, function(index, value) {
		selected.push(value);
		$("#" + value).addClass("available");
	});
	$.each(possible_attacks, function(index, value) {
		selected_attack.push(value);
		$("#" + value).addClass("available_attack");
	});
	$.each(possible_castle, function(index, value) {
		selected_castle.push(value);
		$("#" + value).addClass("available_castle");
	});
}
function post_move(color, from_square, to_square, piece, board, game_id, enpassantable, puts_in_check, checkmates, capture){
	
	enpassantable = enpassantable || false;
	puts_in_check = puts_in_check || false;
	checkmates = checkmates || false;
	capture = capture || false;
	
	in_check = puts_in_check? opposite_color : "";
	winner = checkmates? cur_color : "";
	
	$.ajax({
		url: '/moves/',
		type: "POST",
		data: {
			move:{
				color:color,
				from_square:from_square,
				to_square:to_square,
				game_id: game_id,
				enpassantable: enpassantable,
				puts_in_check: puts_in_check,
				checkmates: checkmates
			},	
		},
		success: function(data){
			$.ajax({
				url: '/games/'+game_id,
				type: "PUT",
				dataType:'json',
				data: {
					game:{
						board:JSON.stringify(board),
						turn:opposite_color,
						in_check: in_check,
						winner:winner
					}	
				},
				complete: function(data){
					trigger('move', from_square + "|" + to_square);
				}
			});
		}
	});
}