import Chrono from 'chrono-node';

function TimeParser(input){
	var parsedText = Chrono.parse(input)[0];
	if(!parsedText){
		return {
			'name': input, 
			'deadline': ''
		};
	}
	var timeText = parsedText.text;
	var parsedTime = Chrono.parseDate(input);
	var name = input.replace(timeText, '').trim();
	return {
		'name': name, 
		'deadline': new Date(parsedTime)
	};
}

export default TimeParser;