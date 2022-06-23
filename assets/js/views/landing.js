
// eslint-disable-next-line no-unused-vars
function updateNumber() {
	$.ajax({
		type: "POST",
		url: "/random.json",
		data: {foo: "bar"},
		success: function(result) {
			$("#randomStatVal").html(result.number);
		},
		dataType: "json",
	});
}
