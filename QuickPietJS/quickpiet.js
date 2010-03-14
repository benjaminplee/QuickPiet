// http://www.agavegroup.com/agWork/prettyForms/

function quickpietjs(commands_id, input_id, output_id, stack_id, log_id) {
	var commands = $(commands_id)
	var input = $(input_id)
	var output = $(output_id)
	var stack = $(stack_id)
	
	var log_window = $(log_id);
	var log = function(text) {
		log_window.val(log_window.val() + text + "\n")
	}
	log.clear = function() {
		log_window.val('')
	}
	
	return function() {
		run(commands, input, output, stack, log)
	};
}

function run(commands, input, output, stack, log) {
	log.clear()
	log("Starting QuickPiet run.")
	
	
	
	
	
	
	
	
	log("Finished QuickPiet run.")
}


$().ready(function(e) {
	$('#run').click(quickpietjs('#commands', '#input', '#output', '#stack', '#log'))
});