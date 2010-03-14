// http://www.agavegroup.com/agWork/prettyForms/

function quickpietjs(commands_id, input_id, output_id, stack_id, log_id) {
	var commands = $(commands_id);
	var input = $(input_id);
	var output = $(output_id);
	var stack = $(stack_id);
	
	var log_window = $(log_id);
	var log = function(text) {
		log_window.val(log_window.val() + text + "\n");
	}
	log.clear = function() {
		log_window.val('');
	}
	
	return function() {
		run(commands, input, output, stack, log);
	};
}

function run(commands_win, input_win, output_win, stack_win, log) {
	log.clear();
	log("Starting QuickPiet run.");
	
	log("Initializing stack.");
	var the_stack = [];
	
	
	log("Parsing text commands");
	var commands = commands_win.val().split("\n").filter(function(command) {
		var trim = jQuery.trim(command);
		return trim.length > 0 && trim[0] != '#'; 
	}).map(function(command) {
		var parts = command.split(' ');
		
		if(parts.length == 2 && parts[0] == 'push' && !isNaN(parts[1])) {
			return function(stack) {
				stack.push(parts[2]);
			}
		}
		
	});
	log("Found " + commands.length + " text commands.");
	
	
	
	
	
	
	
	
	
	
	
	log("Finished QuickPiet run.");
}


$().ready(function(e) {
	$('#run').click(quickpietjs('#commands', '#input', '#output', '#stack', '#log'));
});